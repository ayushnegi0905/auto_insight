import pandas as pd


def clean_data(df):

    df = df.copy()

    report = {}

    # -----------------------------
    # Remove duplicates
    # -----------------------------

    before = len(df)

    df = df.drop_duplicates()

    report["duplicates_removed"] = (
        before - len(df)
    )

    # -----------------------------
    # Handle missing values
    # -----------------------------

    missing_info = {}

    strategies_used = {}

    for col in df.columns:

        missing = int(
            df[col].isnull().sum()
        )

        missing_info[col] = missing

        # NUMERIC COLUMNS
        if pd.api.types.is_numeric_dtype(
            df[col]
        ):

            df[col] = df[col].fillna(
                df[col].mean()
            )

            strategies_used[col] = "mean"

        # DATETIME COLUMNS
        elif pd.api.types.is_datetime64_any_dtype(
            df[col]
        ):

            df[col] = df[col].ffill()

            strategies_used[col] = (
                "forward_fill"
            )

        # CATEGORICAL COLUMNS
        else:

            mode_value = (
                df[col].mode()[0]
                if not df[col].mode().empty
                else "Unknown"
            )

            df[col] = df[col].fillna(
                mode_value
            )

            strategies_used[col] = "mode"

    report["missing_values"] = (
        missing_info
    )

    report["strategies_used"] = (
        strategies_used
    )

    report["final_shape"] = df.shape

    return df, report