import API_BASE from "../config/api";

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};

export const generateCustomChart = async (payload) => {
  const res = await fetch(`${API_BASE}/custom-chart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
};