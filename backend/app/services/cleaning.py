import pandas as pd
import numpy as np


def clean_data(
    df,
    remove_duplicates=True,
):

    df = df.copy()

    report = {
        "initial_shape": df.shape,
        "final_shape": None,
        "duplicates_removed": 0,
        "missing_values_before": {},
        "missing_values_after": {},
        "columns_cleaned": [],
        "data_types": {},
        "strategies_used": {}
    }

    # ---------------------------------------------------
    # 1. Remove Duplicates
    # ---------------------------------------------------

    if remove_duplicates:

        before = len(df)

        df = df.drop_duplicates()

        after = len(df)

        report["duplicates_removed"] = (
            before - after
        )

    # ---------------------------------------------------
    # 2. Clean Column Names
    # ---------------------------------------------------

    df.columns = df.columns.str.strip()

    # ---------------------------------------------------
    # 3. Clean String Columns
    # ---------------------------------------------------

    for col in df.select_dtypes(
        include=["object"]
    ).columns:

        df[col] = df[col].apply(
            lambda x: x.strip()
            if isinstance(x, str)
            else x
        )

        df[col] = df[col].replace(
            ["", " ", "NA", "N/A", "null", "None"],
            np.nan
        )

    # ---------------------------------------------------
    # 4. Handle Missing Values
    # ---------------------------------------------------

    for col in df.columns:

        missing_before = int(
            df[col].isnull().sum()
        )

        report["missing_values_before"][col] = (
            missing_before
        )

        # Numeric Columns
        if pd.api.types.is_numeric_dtype(
            df[col]
        ):

            try:

                skewness = df[col].skew()

            except Exception:

                skewness = 0

            missing_percent = (
                df[col].isnull().mean()
            ) * 100

            if missing_percent > 60:

                value = df[col].median()

                strategy_used = (
                    "median_high_missing"
                )

            elif (
                pd.notnull(skewness)
                and abs(skewness) > 1
            ):

                value = df[col].median()

                strategy_used = "median"

            else:

                value = df[col].mean()

                strategy_used = "mean"

            df[col] = df[col].fillna(
                value
            )

        # Categorical Columns
        else:

            mode_value = (
                df[col].mode()[0]
                if not df[col].mode().empty
                else "Unknown"
            )

            df[col] = df[col].fillna(
                mode_value
            )

            strategy_used = "mode"

        report["strategies_used"][col] = (
            strategy_used
        )

        missing_after = int(
            df[col].isnull().sum()
        )

        report["missing_values_after"][col] = (
            missing_after
        )

        report["columns_cleaned"].append(col)

    # ---------------------------------------------------
    # 5. Final Report
    # ---------------------------------------------------

    report["final_shape"] = df.shape

    for col in df.columns:

        report["data_types"][col] = (
            str(df[col].dtype)
        )

    return df, report
