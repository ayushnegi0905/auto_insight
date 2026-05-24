import pandas as pd
import numpy as np


def clean_data(
    df,
    mode="auto",
    remove_duplicates=True,
    missing_num_strategy="mean",
    missing_cat_strategy="mode",
    outlier_handling=True,
    outlier_method="iqr",
):

    df = df.copy()

    report = {
        "initial_shape": df.shape,
        "final_shape": None,
        "duplicates_removed": 0,
        "missing_values_before": {},
        "missing_values_after": {},
        "columns_cleaned": [],
        "outliers_treated": {},
        "data_types": {},
        "strategies_used": {}
    }

    # ---------------------------------------------------
    # 1. Remove duplicates
    # ---------------------------------------------------

    if remove_duplicates:

        before = len(df)

        df = df.drop_duplicates()

        after = len(df)

        report["duplicates_removed"] = before - after

    # ---------------------------------------------------
    # 2. Clean column names
    # ---------------------------------------------------

    df.columns = df.columns.str.strip()

    # ---------------------------------------------------
    # 3. Clean string columns
    # ---------------------------------------------------

    for col in df.select_dtypes(include=["object"]).columns:

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
    # 4. Handle missing values
    # ---------------------------------------------------

    for col in df.columns:

        missing_before = int(df[col].isnull().sum())

        report["missing_values_before"][col] = missing_before

        # ---------------- NUMERIC ----------------

        if pd.api.types.is_numeric_dtype(df[col]):

            strategy_used = missing_num_strategy

            # AUTO MODE
            if mode == "auto":

                skewness = df[col].skew()

                missing_percent = (
                    df[col].isnull().mean()
                ) * 100

                # too many missing values
                if missing_percent > 60:

                    df = df.drop(columns=[col])

                    report["strategies_used"][col] = (
                        "column_dropped"
                    )

                    continue

                # skewed data -> median
                elif abs(skewness) > 1:

                    value = df[col].median()

                    strategy_used = "median"

                # normal distribution -> mean
                else:

                    value = df[col].mean()

                    strategy_used = "mean"

            # MANUAL MODE
            else:

                if missing_num_strategy == "mean":

                    value = df[col].mean()

                elif missing_num_strategy == "median":

                    value = df[col].median()

                elif missing_num_strategy == "zero":

                    value = 0

                else:

                    value = df[col].mean()

            df[col] = df[col].fillna(value)

            report["strategies_used"][col] = strategy_used

        # ---------------- DATETIME ----------------

        elif pd.api.types.is_datetime64_any_dtype(df[col]):

            df[col] = df[col].ffill()

            report["strategies_used"][col] = "forward_fill"

        # ---------------- CATEGORICAL ----------------

        else:

            if mode == "auto":

                mode_value = (
                    df[col].mode()[0]
                    if not df[col].mode().empty
                    else "Unknown"
                )

                df[col] = df[col].fillna(mode_value)

                report["strategies_used"][col] = "mode"

            else:

                if missing_cat_strategy == "mode":

                    mode_value = (
                        df[col].mode()[0]
                        if not df[col].mode().empty
                        else "Unknown"
                    )

                    df[col] = df[col].fillna(mode_value)

                    report["strategies_used"][col] = "mode"

                else:

                    df[col] = df[col].fillna("Unknown")

                    report["strategies_used"][col] = "unknown"

        missing_after = int(df[col].isnull().sum())

        report["missing_values_after"][col] = missing_after

        report["columns_cleaned"].append(col)

    # ---------------------------------------------------
    # 5. Auto datetime conversion
    # ---------------------------------------------------

    for col in df.columns:

        if df[col].dtype == "object":

            try:

                converted = pd.to_datetime(
                    df[col],
                    errors="coerce"
                )

                valid_dates = converted.notnull().sum()

                if valid_dates > len(df) * 0.7:

                    df[col] = converted

            except Exception:

                pass

    # ---------------------------------------------------
    # 6. Outlier handling
    # ---------------------------------------------------

    if outlier_handling:

        numeric_cols = df.select_dtypes(
            include=np.number
        ).columns

        for col in numeric_cols:

            if outlier_method == "iqr":

                Q1 = df[col].quantile(0.25)

                Q3 = df[col].quantile(0.75)

                IQR = Q3 - Q1

                lower = Q1 - 1.5 * IQR

                upper = Q3 + 1.5 * IQR

                outliers = (
                    (df[col] < lower) |
                    (df[col] > upper)
                ).sum()

                df[col] = np.where(
                    df[col] < lower,
                    lower,
                    np.where(
                        df[col] > upper,
                        upper,
                        df[col]
                    )
                )

                report["outliers_treated"][col] = int(outliers)

            elif outlier_method == "zscore":

                mean = df[col].mean()

                std = df[col].std()

                if std == 0:

                    continue

                z_scores = (
                    (df[col] - mean)
                    / std
                )

                outliers = (
                    np.abs(z_scores) > 3
                ).sum()

                df[col] = np.where(
                    z_scores > 3,
                    mean + 3 * std,

                    np.where(
                        z_scores < -3,
                        mean - 3 * std,
                        df[col]
                    )
                )

                report["outliers_treated"][col] = int(outliers)

    # ---------------------------------------------------
    # 7. Final report
    # ---------------------------------------------------

    report["final_shape"] = df.shape

    for col in df.columns:

        report["data_types"][col] = str(df[col].dtype)

    return df, report