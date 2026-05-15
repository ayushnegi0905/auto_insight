import { useState } from "react";

function Register({ API_BASE, setPage }) {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    const res = await fetch(
      `${API_BASE}/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const result = await res.json();

    alert(result.message);

    if (
      result.message ===
      "User registered successfully"
    ) {
      setPage("login");
    }
  };

return (

  <div className="auth-container">

    <div className="auth-card">

      <h2>Register</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <div className="auth-buttons">

        <button onClick={handleRegister}>
          Register
        </button>

        <button
          className="secondary-btn"
          onClick={() => setPage("login")}
        >
          Login
        </button>

      </div>

    </div>

  </div>
);
}

export default Register;