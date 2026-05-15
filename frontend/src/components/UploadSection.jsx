function UploadSection({ file, setFile, handleUpload }) {
  return (
    <div className="upload-card">

      <h2 className="upload-title">
        Upload Your Dataset
      </h2>

      <p className="upload-subtitle">
        Upload CSV files for automated data analysis and visualization
      </p>

      <div className="upload-box">

        <input
          type="file"
          id="fileUpload"
          className="file-input"
          accept=".csv,text/csv,application/vnd.ms-excel"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label htmlFor="fileUpload" className="file-label">
          Choose CSV File
        </label>

        {/* Selected File Name */}
        {file && (
          <p className="selected-file">
            Selected File: {file.name}
          </p>
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
        >
          Upload Dataset
        </button>

      </div>
    </div>
  );
}

export default UploadSection;