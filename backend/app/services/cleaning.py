import pandas as pd

def clean_data(df):
    df = df.copy()  # avoid modifying original
    report = {}

    # Remove duplicates
    before = len(df)
    df = df.drop_duplicates()
    report["duplicates_removed"] = before - len(df)

    # Handle missing values
    missing_info = {}

    for col in df.columns:
        missing = df[col].isnull().sum()

        if missing > 0:
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].mean())

            elif pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].fillna(method="ffill")

            else:
                df[col] = df[col].fillna("Unknown")

        missing_info[col] = int(missing)

    report["missing_values"] = missing_info

    return df, report