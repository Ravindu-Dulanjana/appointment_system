/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { bookAppointment } from "../lib/api";

type Props = {
  selectedSlot: {
    id: number;
    dateTime: string;
    isBooked: boolean;
  };
  onSuccess: () => void;
  onClose: () => void;
};

export default function AppointmentForm({
  selectedSlot,
  onSuccess,
  onClose,
}: Props) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await bookAppointment({
        name: form.name.trim(),
        email: form.email.trim(),
        slotId: selectedSlot.id,
      });
      alert("Appointment Booked Successfully!");
      setForm({ name: "", email: "" });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDateTime = new Date(selectedSlot.dateTime).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Selected Time Slot Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm font-medium text-gray-600 mb-1">
          Selected Time Slot:
        </p>
        <p className="text-lg font-semibold text-blue-800">
          {formattedDateTime}
        </p>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Booking...
              </div>
            ) : (
              "Book Appointment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
