import { useEffect, useState } from "react";

import API_BASE from "../config/api";

function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    fetch(`${API_BASE}/history`)
      .then((res) => res.json())
      .then((data) => setHistory(data));

  }, []);

  return (

    <div className="card">

      <h2>User History</h2>

      {history.length === 0 ? (

        <p>No history found</p>

      ) : (

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>Dataset</th>

                <th>Visualization</th>

                <th>Timestamp</th>

              </tr>

            </thead>

            <tbody>

              {history.map((item, index) => (

                <tr key={index}>

                  <td>{item.dataset_name}</td>

                  <td>
                    {item.chart_type} chart
                    <br />
                    <small>{item.chart_name}</small>
                  </td>

                  <td>{item.timestamp}</td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default History;