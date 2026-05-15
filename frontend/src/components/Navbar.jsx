function Navbar({
  data,
  setPage,
  currentUser,
  setCurrentUser,
}) {

  const handleLogout = () => {

    localStorage.removeItem("user");

    setCurrentUser(null);

    setPage("home");
  };

  return (

    <div className="navbar">

      <h2 className="logo">
        AutoInsight
      </h2>

      <div className="nav-links">

        <button onClick={() => setPage("home")}>
          Home
        </button>

        {currentUser && data && (
          <button
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
        )}

        {!currentUser ? (
          <>

            <button
              onClick={() => setPage("login")}
            >
              Login
            </button>

            <button
              onClick={() => setPage("register")}
            >
              Register
            </button>

          </>
        ) : (

          <button onClick={handleLogout}>
            Logout
          </button>

        )}

      </div>

    </div>
  );
}

export default Navbar;