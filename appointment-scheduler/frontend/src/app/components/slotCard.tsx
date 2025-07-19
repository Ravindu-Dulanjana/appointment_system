"use client";
import React from "react";

type Props = {
  datetime: string;
  isBooked?: boolean;
  selected?: boolean;
  onClick: () => void;
  onBookedClick?: () => void; // New prop for handling clicks on booked slots
};

export default function SlotCard({
  datetime,
  isBooked,
  selected,
  onClick,
  onBookedClick,
}: Props) {
  const date = new Date(datetime);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleClick = () => {
    if (isBooked && onBookedClick) {
      onBookedClick();
    } else if (!isBooked) {
      onClick();
    }
  };

  return (
    <div
      className={`relative rounded-xl p-5 transition-all duration-300 transform ${
        isBooked
          ? "bg-gray-50 text-gray-400 cursor-pointer border-2 border-gray-200 hover:bg-gray-100 hover:shadow-md"
          : selected
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-2 border-blue-600 cursor-pointer shadow-lg scale-105"
          : "bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-md hover:scale-102 cursor-pointer border-2 border-gray-200 shadow-sm"
      }`}
      onClick={handleClick}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                isBooked
                  ? "text-gray-400"
                  : selected
                  ? "text-blue-100"
                  : "text-gray-600"
              }`}
            >
              {dateStr}
            </p>
            <p
              className={`text-lg font-bold ${
                isBooked
                  ? "text-gray-400"
                  : selected
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {timeStr}
            </p>
          </div>

          {isBooked && (
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
              Booked
            </span>
          )}

          {!isBooked && !selected && (
            <div className="text-blue-500">
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          )}

          {selected && (
            <div className="text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {!isBooked && (
          <div
            className={`text-xs font-medium ${
              selected ? "text-blue-100" : "text-blue-600"
            }`}
          >
            {selected ? "Selected" : "Click to book"}
          </div>
        )}

        {isBooked && onBookedClick && (
          <div className="text-xs font-medium text-gray-500">
            Click to view details
          </div>
        )}
      </div>

      {/* Subtle animation indicator */}
      {!isBooked && (
        <div
          className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
            selected
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 hover:opacity-5"
          }`}
        />
      )}
    </div>
  );
}
