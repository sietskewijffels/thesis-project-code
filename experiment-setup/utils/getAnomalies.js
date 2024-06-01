const BASE_URL = "http://localhost:5000"

async function getAnomalies (blocks)
{
   const response = await fetch(BASE_URL + "/detect-anomalies", {
    method: "POST",
    body: JSON.stringify(blocks),
    headers: {
      "Content-type": "application/json"
    }
  }
  );
  return response.json();
}

export default getAnomalies;