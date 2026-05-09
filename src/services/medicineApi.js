const API_BASE_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getMedicines() {
  return request("/medicines");
}

export function getMedicineById(id) {
  return request(`/medicines/${id}`);
}

export function createMedicine(payload) {
  return request("/medicines", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteMedicine(id) {
  return request(`/medicines/${id}`, { method: "DELETE" });
}
