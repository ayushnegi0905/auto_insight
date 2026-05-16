function DatasetOverview({ data }) {

  const numericColumns = Object.values(
    data.eda.info.dtypes
  ).filter(
    (type) => type.includes("int") || type.includes("float")
  ).length;

  const removedRows = data.original_rows - data.cleaned_rows;

  const downloadCleaned = async () => {

  const response = await fetch(
    "https://autoinsight-api-ihum.onrender.com/download-cleaned"
  );

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "cleaned_dataset.csv";

  document.body.appendChild(link);

  link.click();

  link.remove();
  };

  return (
    <div className="overview-grid">

      <div className="overview-card">
        <h3>Dataset Name</h3>
        <p>{data.filename}</p>
      </div>

      <div className="overview-card">
        <h3>Total Rows</h3>
        <p>{data.cleaned_rows}</p>
      </div>

      <div className="overview-card">
        <h3>Total Columns</h3>
        <p>{data.columns.length}</p>
      </div>

      <div className="overview-card">
        <h3>Numeric Columns</h3>
        <p>{numericColumns}</p>
      </div>

      <div className="overview-card">
        <h3>Removed Null Rows</h3>
        <p>{removedRows}</p>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={downloadCleaned}>
          Download Cleaned Dataset
        </button>
      </div>

    </div>
  );
}

export default DatasetOverview;