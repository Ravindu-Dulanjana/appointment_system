"use client";
import React, { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSlotUpdated: () => void;
  onUpdateSlot: (slotId: number, dateTime: string) => Promise<void>;
  slot: {
    id: number;
    dateTime: string;
    isBooked: boolean;
  } | null;
};

export default function EditSlotModal({
  isOpen,
  onClose,
  onSlotUpdated,
  onUpdateSlot,
  slot,
}: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slot && isOpen) {
      const slotDate = new Date(slot.dateTime);
      setDate(slotDate.toISOString().split("T")[0]);
      setTime(slotDate.toTimeString().slice(0, 5));
    }
  }, [slot, isOpen]);

  if (!isOpen || !slot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      alert("Please select both date and time");
      return;
    }

    // Combine date and time
    const dateTime = new Date(`${date}T${time}`);

    // Check if the date is in the future
    if (dateTime <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdateSlot(slot.id, dateTime.toISOString());
      onSlotUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating slot:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDate("");
    setTime("");
    onClose();
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Time Slot</h2>
          <button
            onClick={handleClose}
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

        {/* Current Slot Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Current Slot</h3>
          <p className="text-blue-800">
            {new Date(slot.dateTime).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at{" "}
            {new Date(slot.dateTime).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="text-yellow-600 mr-3 mt-0.5">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-yellow-800 font-medium">Warning</p>
                <p className="text-sm text-yellow-700">
                  {slot.isBooked
                    ? "This slot is currently booked. Editing it may affect the existing appointment."
                    : "Only future dates and times can be selected."}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
