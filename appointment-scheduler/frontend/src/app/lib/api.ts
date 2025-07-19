export const API_BASE = "http://localhost:5000/api";

export async function fetchSlots() {
  const res = await fetch(`${API_BASE}/slots/all`, { cache: "no-store" });
  return res.json();
}

export async function fetchAvailableSlots() {
  const res = await fetch(`${API_BASE}/slots`, { cache: "no-store" });
  return res.json();
}

export async function bookAppointment(data: {
  name: string;
  email: string;
  slotId: number;
}) {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchAppointmentsByEmail(email: string) {
  const res = await fetch(`${API_BASE}/appointments/${email}`, {
    cache: "no-store",
  });
  return res.json();
}

export async function cancelAppointment(appointmentId: number) {
  const res = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function createSlot(dateTime: string, token: string) {
  const res = await fetch(`${API_BASE}/slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ dateTime }),
  });
  return res.json();
}

export async function updateSlot(slotId: number, dateTime: string, token: string) {
  const res = await fetch(`${API_BASE}/slots/${slotId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ dateTime }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Update failed');
  }
  
  return data;
}

export async function deleteSlot(slotId: number, token: string) {
  const res = await fetch(`${API_BASE}/slots/${slotId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
