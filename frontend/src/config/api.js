const API_BASE =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : `http://${window.location.hostname}:8000`;

export default API_BASE;