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

    # 1. Remove Duplicates

    if remove_duplicates:

        before = len(df)

        df = df.drop_duplicates()

        after = len(df)

        report["duplicates_removed"] = (
            before - after
        )

    # 2. Clean Column Names

    df.columns = df.columns.str.strip()

    # 3. Clean String Columns

    for col in df.select_dtypes(
        include=["object"]
    ).columns:

        df[col] = df[col].apply(
            lambda x: x.strip()
            if isinstance(x, str)
            else x
        )

        df[col] = df[col].replace(
            [
                "",
                " ",
                "NA",
                "N/A",
                "na",
                "n/a",
                "null",
                "NULL",
                "None",
                "none"
            ],
            np.nan
        )

    # 4. Handle Missing Values

    for col in df.columns:

        missing_before = int(
            df[col].isnull().sum()
        )

        report["missing_values_before"][col] = (
            missing_before
        )

        # Skip columns with no missing values
        if missing_before == 0:

            report["missing_values_after"][col] = 0

            report["strategies_used"][col] = (
                "no_action"
            )

            continue

        # Handle completely empty columns

        if df[col].dropna().empty:

            report["missing_values_after"][col] = (
                missing_before
            )

            report["strategies_used"][col] = (
                "all_values_missing"
            )

            report["columns_cleaned"].append(col)

            continue

        # Numeric Columns

        if pd.api.types.is_numeric_dtype(
            df[col]
        ):

            skewness = df[col].skew()

            if (
                pd.notnull(skewness)
                and abs(skewness) > 1
            ):

                value = df[col].median()

                strategy_used = "median"

            else:

                value = df[col].mean()

                strategy_used = "mean"

        # Categorical Columns

        else:

            mode = df[col].mode()

            if not mode.empty:

                value = mode.iloc[0]

                strategy_used = "mode"

            else:

                value = "Unknown"

                strategy_used = "Unknown"

        # Fill Missing Values
        df[col] = df[col].fillna(
            value
        )

        # Update Report

        missing_after = int(
            df[col].isnull().sum()
        )

        report["missing_values_after"][col] = (
            missing_after
        )

        report["strategies_used"][col] = (
            strategy_used
        )

    # 5. Final Report
    
    report["final_shape"] = df.shape

    for col in df.columns:

        report["data_types"][col] = (
            str(df[col].dtype)
        )
    return df, report
