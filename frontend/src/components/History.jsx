import { useEffect, useState } from "react";

import API_BASE from "../config/api";

function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) return;

  fetch(`${API_BASE}/history/${user.user_id}`)
    .then((res) => res.json())
    .then((data) => {

      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        console.error(data);
        setHistory([]);
      }

    });

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