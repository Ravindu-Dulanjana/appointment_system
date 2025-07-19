/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { fetchAppointmentsByEmail } from '../lib/api';

export default function MyAppointments({ email }: { email: string }) {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointmentsByEmail(email).then(setAppointments);
  }, [email]);

  return (
    <div>
      <h2>My Appointments</h2>
      {appointments.map(appt => (
        <div key={appt.id}>
          <p>{appt.name} @ {new Date(appt.slot.dateTime).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}