'use client';

import { useState } from 'react';
import MyAppointments from '../components/MyAppointments';

export default function MyAppointmentsPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">View Appointments</h1>
      <input
        placeholder="Enter Email"
        onChange={e => setEmail(e.target.value)}
        className="border p-2"
      />
      {email && <MyAppointments email={email} />}
    </div>
  );
}