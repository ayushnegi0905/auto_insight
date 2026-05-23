import { useState } from "react";

import { Spinner } from "./index";

function Register({
  API_BASE,
  setPage
}) {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

    if (!username || !password) {

      alert("Please fill all fields");

      return;
    }

    try {

      setLoading(true);

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

    } catch (error) {

      console.log(error);

      alert("Registration failed");

    } finally {

      setLoading(false);
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

          <button
            onClick={handleRegister}
            disabled={loading}
          >

            {loading
              ? "Registering..."
              : "Register"}

          </button>

          <button
            className="secondary-btn"
            onClick={() => setPage("login")}
            disabled={loading}
          >
            Login
          </button>

        </div>

        {loading && <Spinner />}

      </div>

    </div>
  );
}

export default Register;