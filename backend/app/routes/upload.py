from fastapi import APIRouter, UploadFile, File, Depends, Form 
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd

from app.services.cleaning import clean_data

from app.db.models import History
from datetime import datetime

from sqlalchemy.orm import Session

from app.db.database import get_db

router = APIRouter()

# Store uploaded dataframe globally
global_df = None

# File name for cleaned dataset
CLEANED_FILE = "cleaned_dataset.csv"

# ---------------- REQUEST MODEL ----------------

class ChartRequest(BaseModel):
    group_col: str
    user_id: int
    value_col: str
    agg: str
    chart_type: str


# ---------------- UPLOAD ROUTE ----------------

@router.post("/upload")
async def upload_file(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    global global_df

    df = pd.read_csv(file.file)

    cleaned_df, cleaning_report = clean_data(df)

    # Save dataframe globally
    global_df = cleaned_df

    history = History(
        user_id=user_id,
        dataset_name=file.filename,
        chart_name="Dataset Uploaded",
        chart_type="upload",
        timestamp=str(datetime.now())
    )

    db.add(history)

    db.commit()

    # Save cleaned CSV file
    cleaned_df.to_csv(CLEANED_FILE, index=False)

    return {
        "filename": file.filename,
        "original_rows": len(df),
        "cleaned_rows": len(cleaned_df),
        "columns": list(cleaned_df.columns),

        "eda": {
            "head": cleaned_df.head(10).to_dict(orient="records"),

            "describe": cleaned_df.describe()
            .reset_index()
            .to_dict(orient="records"),

            "info": {
                "columns": list(cleaned_df.columns),

                "dtypes": cleaned_df.dtypes.astype(str).to_dict(),

                "non_null": cleaned_df.count().to_dict()
            }
        },

        "charts": {}
    }


# ---------------- DOWNLOAD CLEANED DATASET ----------------

@router.get("/download-cleaned")
async def download_cleaned_dataset():

    return FileResponse(
        path=CLEANED_FILE,
        filename="cleaned_dataset.csv",
        media_type="text/csv"
    )


# ---------------- CUSTOM CHART ROUTE ----------------

@router.post("/custom-chart")
async def custom_chart(request: ChartRequest ,db: Session = Depends(get_db)):

    global global_df

    try:

        if request.agg == "sum":
            result = global_df.groupby(
                request.group_col
            )[request.value_col].sum()

        elif request.agg == "avg":
            result = global_df.groupby(
                request.group_col
            )[request.value_col].mean()

        elif request.agg == "count":
            result = global_df.groupby(
                request.group_col
            )[request.value_col].count()

        else:
            return {"error": "Invalid aggregation"}

        result = result.sort_values(
            ascending=False
        ).head(10)

        history = History(
            user_id=request.user_id,
            dataset_name="Current Dataset",
            chart_name=f"{request.value_col} vs {request.group_col}",
            chart_type=request.chart_type,
            timestamp=str(datetime.now())
        )

        db.add(history)

        db.commit()

        return {
            "labels": result.index.astype(str).tolist(),
            "values": result.values.tolist(),
            "title": f"{request.agg.upper()} of {request.value_col} by {request.group_col}"
        }

    except Exception as e:
        return {"error": str(e)}
    

# ---------------- HISTORY ROUTE ----------------

@router.get("/history/{user_id}")
async def get_history(
    user_id: int,
    db: Session = Depends(get_db)
):

    history = db.query(History).filter(
        History.user_id == user_id
    ).all()

    result = []

    for item in history:

        result.append({

            "dataset_name": item.dataset_name,

            "chart_name": item.chart_name,

            "chart_type": item.chart_type,

            "timestamp": item.timestamp
        })

    return result