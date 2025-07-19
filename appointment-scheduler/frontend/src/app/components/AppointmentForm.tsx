/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { bookAppointment, fetchSlots } from '../lib/api';

export default function AppointmentForm() {
  const [slots, setSlots] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '', slotId: '' });

  useEffect(() => {
    fetchSlots().then(setSlots);
  }, []);

  const handleSubmit = async () => {
    const res = await bookAppointment({
      name: form.name,
      email: form.email,
      slotId: Number(form.slotId),
    });
    alert('Appointment Booked!');
  };

  return (
    <div>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <select onChange={e => setForm({ ...form, slotId: e.target.value })}>
        <option value="">Select Slot</option>
        {slots.map(slot => (
          <option key={slot.id} value={slot.id}>
            {new Date(slot.dateTime).toLocaleString()}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>Book</button>
    </div>
  );
}