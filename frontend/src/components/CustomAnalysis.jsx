function CustomAnalysis({
  data,
  setGroupCol,
  setValueCol,
  setAgg,
  setChartType,
  generateChart,
}) {
  return (
    <>
      {/* CUSTOM ANALYSIS */}
      <div className="analysis-controls">
        <h2>Custom Analysis</h2>

        <select onChange={(e) => setGroupCol(e.target.value)}>
          <option>Select Group Column</option>
          {data.columns.map((col) => (
            <option key={col}>{col}</option>
          ))}
        </select>

        <select onChange={(e) => setValueCol(e.target.value)}>
          <option>Select Value Column</option>
          {data.columns.map((col) => (
            <option key={col}>{col}</option>
          ))}
        </select>

        <select onChange={(e) => setAgg(e.target.value)}>
          <option value="sum">Sum</option>
          <option value="avg">Average</option>
          <option value="count">Count</option>
        </select>

        <select onChange={(e) => setChartType(e.target.value)}>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
        </select>

        <button onClick={generateChart}>Generate</button>
        
      </div>
    </>
  );
}

export default CustomAnalysis;