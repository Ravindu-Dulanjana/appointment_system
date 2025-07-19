"use client";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSlotAdded: () => void;
  onAddSlot: (dateTime: string) => Promise<void>;
};

export default function AddSlotModal({
  isOpen,
  onClose,
  onSlotAdded,
  onAddSlot,
}: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
      await onAddSlot(dateTime.toISOString());
      onSlotAdded();
      setDate("");
      setTime("");
      onClose();
    } catch (error) {
      console.error("Error adding slot:", error);
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
          <h2 className="text-xl font-bold text-gray-800">Add New Time Slot</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
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
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="text-blue-600 mr-3 mt-0.5">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium">Note</p>
                <p className="text-sm text-blue-700">
                  Only future dates and times can be selected. The slot will be
                  available for clients to book.
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
              {isSubmitting ? "Adding..." : "Add Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
