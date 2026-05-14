from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd

from app.services.cleaning import clean_data

router = APIRouter()

# Store uploaded dataframe globally
global_df = None

# File name for cleaned dataset
CLEANED_FILE = "cleaned_dataset.csv"


# ---------------- REQUEST MODEL ----------------

class ChartRequest(BaseModel):
    group_col: str
    value_col: str
    agg: str


# ---------------- UPLOAD ROUTE ----------------

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    global global_df

    df = pd.read_csv(file.file)

    cleaned_df, cleaning_report = clean_data(df)

    # Save dataframe globally
    global_df = cleaned_df

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
async def custom_chart(request: ChartRequest):

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

        return {
            "labels": result.index.astype(str).tolist(),
            "values": result.values.tolist(),
            "title": f"{request.agg.upper()} of {request.value_col} by {request.group_col}"
        }

    except Exception as e:
        return {"error": str(e)}