import { useState } from "react";
import { Spinner } from "./index";

function Login({
  API_BASE,
  setPage,
  setCurrentUser,
  }) {

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

    if (!username || !password) {

      alert("Please fill all fields");

      return;
    }

    try {

      setLoading(true);

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

    } catch (error) {

      console.log(error);

      alert("Login failed");

    } finally {

      setLoading(false);
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

        <button
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

          <button
            className="secondary-btn"
            onClick={() => setPage("home")}
          >
            Back
          </button>

        </div>
        
        {loading && <Spinner />}
      </div>

    </div>
  );
}

export default Login;