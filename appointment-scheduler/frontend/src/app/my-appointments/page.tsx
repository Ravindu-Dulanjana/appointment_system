"use client";

import { useState } from "react";
import MyAppointments from "../components/MyAppointments";

export default function MyAppointmentsPage() {
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchEmail(email.trim());
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <a
              href="/"
              className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              ← Back to Booking
            </a>
            <a
              href="/admin"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Admin Login
            </a>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            My Appointments
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your email address to view and manage your appointments
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View My Appointments
              </button>
            </div>
          </form>
        </div>

        {/* Appointments Results */}
        {searchEmail && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Appointments for {searchEmail}
              </h2>
              <p className="text-gray-600">
                Here are all your upcoming appointments
              </p>
            </div>

            <MyAppointments email={searchEmail} />
          </div>
        )}

        {/* Help Section */}
        {!searchEmail && (
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="text-blue-600 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
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
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How to view your appointments
            </h3>
            <p className="text-blue-700">
              Enter the email address you used when booking your appointment.
              You'll be able to view all your upcoming appointments and cancel
              them if needed.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
