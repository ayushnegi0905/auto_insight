import { useState } from "react";

function Login({
  API_BASE,
  setPage,
  setCurrentUser,
}) {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    
    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    const res = await fetch(
      `${API_BASE}/login`,
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
      "Login successful"
    ) {

      localStorage.setItem(
        "user",
        JSON.stringify(result)
      );

      setCurrentUser(result);

      setPage("home");
    }
  };

  return (

  <div className="auth-container">

    <div className="auth-card">

      <h2>Login</h2>

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

        <button onClick={handleLogin}>
          Login
        </button>

        <button
          className="secondary-btn"
          onClick={() => setPage("home")}
        >
          Back
        </button>

      </div>

    </div>

  </div>
);
}

export default Login;