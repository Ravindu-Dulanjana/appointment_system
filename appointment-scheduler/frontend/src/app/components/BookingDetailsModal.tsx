"use client";
import React, { useState } from "react";
import { cancelAppointment } from "../lib/api";
import { Slot } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  slot: Slot;
  onCancelSuccess: () => void;
};

export default function BookingDetailsModal({
  isOpen,
  onClose,
  slot,
  onCancelSuccess,
}: Props) {
  const [isCanceling, setIsCanceling] = useState(false);

  if (!isOpen || !slot.booking) return null;

  const date = new Date(slot.dateTime);
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

  const handleCancel = async () => {
    if (!slot.booking) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsCanceling(true);
    try {
      await cancelAppointment(slot.booking.id);
      alert("Appointment canceled successfully!");
      onCancelSuccess();
      onClose();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Appointment Info */}
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Appointment Time
            </h3>
            <p className="text-blue-800">{dateStr}</p>
            <p className="text-blue-800 font-medium">{timeStr}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Customer Details
            </h3>
            <div className="space-y-1">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {slot.booking.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {slot.booking.email}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleCancel}
            disabled={isCanceling}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCanceling ? "Canceling..." : "Cancel Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
