export const API_BASE = 'http://localhost:5000/api';

export async function fetchSlots() {
  const res = await fetch(`${API_BASE}/slots`, { cache: 'no-store' });
  return res.json();
}

export async function bookAppointment(data: {
  name: string;
  email: string;
  slotId: number;
}) {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchAppointmentsByEmail(email: string) {
  const res = await fetch(`${API_BASE}/appointments/${email}`, { cache: 'no-store' });
  return res.json();
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}