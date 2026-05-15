function DataExploration({ data }) {
    console.log(data.eda.describe);
    return (
    <>
      {/* EDA */}
          <div className="card">
                <h2>Data Exploration</h2>

                {/* TABLE FIX */}
                <h4>Preview (Top 10 Rows)</h4>
                <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        {Object.keys(data.eda.head[0] || {}).map((col, i) => (
                        <th key={i}>{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.eda.head.map((row, i) => (
                        <tr key={i}>
                        {Object.values(row).map((val, j) => (
                            <td key={j}>{val}</td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                {/* FIXED FONT CONSISTENCY */}
                <h2>Data Types</h2>
                <div className="datatype-grid">
                    {Object.entries(data.eda.info.dtypes).map(([key, value]) => (
                        <div className="datatype-card" key={key}>
                            <h4>{key}</h4>
                            <p>{value}</p>
                        </div>
                    ))}
                </div>

                <h2>Statistical Summary</h2>

                <div className="stats-container">
                    {Object.keys(data.eda.describe[0]).filter(
                    (key) => key !== "index"
                    ).map((column) => {

                    const count = data.eda.describe.find(
                    (item) => item.index === "count"
                    )?.[column];

                    const mean = data.eda.describe.find(
                    (item) => item.index === "mean"
                    )?.[column];

                    const std = data.eda.describe.find(
                    (item) => item.index === "std"
                    )?.[column];

                    const min = data.eda.describe.find(
                    (item) => item.index === "min"
                    )?.[column];

                    const q25 = data.eda.describe.find(
                    (item) => item.index === "25%"
                    )?.[column];

                    const q50 = data.eda.describe.find(
                    (item) => item.index === "50%"
                    )?.[column];

                    const q75 = data.eda.describe.find(
                    (item) => item.index === "75%"
                    )?.[column];

                    const max = data.eda.describe.find(
                    (item) => item.index === "max"
                    )?.[column];

                    return (
                    <div className="stat-card" key={column}>
                        <h3>{column}</h3>

                        <p><strong>Count:</strong> {count}</p>
                        <p><strong>Mean:</strong> {mean?.toFixed?.(2)}</p>
                        <p><strong>Std Dev:</strong> {std?.toFixed?.(2)}</p>
                        <p><strong>Min:</strong> {min}</p>
                        <p><strong>25%:</strong> {q25}</p>
                        <p><strong>50%:</strong> {q50}</p>
                        <p><strong>75%:</strong> {q75}</p>
                        <p><strong>Max:</strong> {max}</p>
                    </div>
                    );
                    })}
                </div>
          </div>
    </>
  );
}

export default DataExploration;