/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { fetchAppointmentsByEmail, cancelAppointment } from "../lib/api";

export default function MyAppointments({ email }: { email: string }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<number | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointmentsByEmail(email);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [email]);

  const handleCancelAppointment = async (appointmentId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment? This action cannot be undone."
    );

    if (!confirmed) return;

    setCanceling(appointmentId);
    try {
      await cancelAppointment(appointmentId);
      alert("Appointment canceled successfully!");
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setCanceling(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading your appointments...</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No Appointments Found
        </h3>
        <p className="text-gray-500 mb-4">
          We couldn't find any appointments for{" "}
          <span className="font-medium">{email}</span>
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Book New Appointment
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Found {appointments.length} appointment
          {appointments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {appointments.map((appointment) => {
        const date = new Date(appointment.slot.dateTime);
        const dateStr = date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const timeStr = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        const isUpcoming = date > new Date();
        const isPast = date < new Date();

        return (
          <div
            key={appointment.id}
            className={`p-6 rounded-lg border-2 ${
              isPast
                ? "border-gray-200 bg-gray-50"
                : "border-blue-200 bg-blue-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-full ${
                      isPast ? "bg-gray-200" : "bg-blue-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        isPast ? "text-gray-500" : "text-blue-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                        isPast ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      {dateStr}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        isPast ? "text-gray-500" : "text-blue-600"
                      }`}
                    >
                      {timeStr}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <p className={isPast ? "text-gray-500" : "text-gray-700"}>
                    <span className="font-medium">Name:</span>{" "}
                    {appointment.name}
                  </p>
                  <p className={isPast ? "text-gray-500" : "text-gray-700"}>
                    <span className="font-medium">Email:</span>{" "}
                    {appointment.email}
                  </p>
                </div>

                {isPast && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                      Past Appointment
                    </span>
                  </div>
                )}
              </div>

              {isUpcoming && (
                <div className="ml-4">
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    disabled={canceling === appointment.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {canceling === appointment.id ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Canceling...
                      </span>
                    ) : (
                      "Cancel"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Book Another Appointment
        </a>
      </div>
    </div>
  );
}
