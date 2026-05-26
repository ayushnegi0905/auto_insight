import API_BASE from "../config/api";

export const uploadDataset = (
  file,
  userId,
  setUploadProgress
) => {

  return new Promise((resolve, reject) => {

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "user_id",
      userId
    );

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `${API_BASE}/upload`
    );

    xhr.upload.onprogress = (event) => {

      if (event.lengthComputable) {

        const percent = Math.round(
          (event.loaded * 100) / event.total
        );

        let smoothProgress = 0;

        const interval = setInterval(() => {

          smoothProgress += 5;

          if (smoothProgress >= percent) {

            smoothProgress = percent;

            clearInterval(interval);
          }

          setUploadProgress(smoothProgress);

        }, 50);
      }
    };

    xhr.onload = () => {

      if (xhr.status === 200) {

        resolve(
          JSON.parse(xhr.response)
        );

      } else {

        reject(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject("Upload failed");
    };

    xhr.send(formData);

  });
};

export const generateCustomChart = async (
  payload
) => {

  const res = await fetch(
    `${API_BASE}/custom-chart`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  return await res.json();
};