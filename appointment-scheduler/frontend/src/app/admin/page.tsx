"use client";
import { useState, useEffect } from "react";
import {
  adminLogin,
  fetchSlots,
  cancelAppointment,
  createSlot,
  deleteSlot,
  updateSlot,
} from "../lib/api";
import AddSlotModal from "../components/AddSlotModal";
import EditSlotModal from "../components/EditSlotModal";

interface AdminSlot {
  id: number;
  dateTime: string;
  isBooked: boolean;
  booking?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [slots, setSlots] = useState<AdminSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"slots" | "appointments">("slots");
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [isEditSlotModalOpen, setIsEditSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AdminSlot | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchAllSlots();
    }
  }, []);

  const fetchAllSlots = async () => {
    try {
      const data = await fetchSlots();
      setSlots(data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("Attempting login with:", { email, password: "***" });
      const res = await adminLogin(email, password);
      console.log("Login response:", res);

      if (res.token) {
        setToken(res.token);
        localStorage.setItem("adminToken", res.token);
        setIsLoggedIn(true);
        fetchAllSlots();
        console.log("Login successful");
      } else {
        console.error("No token in response:", res);
        alert("Login failed: No token received");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(`Login failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem("adminToken");
    setSlots([]);
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await cancelAppointment(appointmentId);
      alert("Appointment canceled successfully!");
      fetchAllSlots(); // Refresh data
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment");
    }
  };

  const handleAddSlot = async (dateTime: string) => {
    if (!token) return;

    try {
      await createSlot(dateTime, token);
      alert("Slot created successfully!");
      fetchAllSlots(); // Refresh data
    } catch (error: any) {
      console.error("Error creating slot:", error);
      alert(error.message || "Failed to create slot");
      throw error; // Re-throw to handle in modal
    }
  };

  const handleEditSlot = (slot: AdminSlot) => {
    setEditingSlot(slot);
    setIsEditSlotModalOpen(true);
  };

  const handleUpdateSlot = async (slotId: number, dateTime: string) => {
    if (!token) return;

    try {
      await updateSlot(slotId, dateTime, token);
      alert("Slot updated successfully!");
      fetchAllSlots(); // Refresh data
    } catch (error: any) {
      console.error("Error updating slot:", error);
      alert(error.message || "Failed to update slot");
      throw error; // Re-throw to handle in modal
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this slot?")) {
      return;
    }

    setDeletingSlotId(slotId);
    try {
      await deleteSlot(slotId, token);
      alert("Slot deleted successfully!");
      fetchAllSlots(); // Refresh data
    } catch (error: any) {
      console.error("Error deleting slot:", error);
      alert(error.message || "Failed to delete slot");
    } finally {
      setDeletingSlotId(null);
    }
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Access the appointment management system
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">
              Default Admin Credentials:
            </p>
            <p className="text-sm text-gray-500">Email: admin@example.com</p>
            <p className="text-sm text-gray-500">Password: admin123</p>
          </div>
        </div>
      </main>
    );
  }

  // Admin Dashboard
  const availableSlots = slots.filter((slot) => !slot.isBooked);
  const bookedSlots = slots.filter((slot) => slot.isBooked);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage appointments and time slots
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Available Slots
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {availableSlots.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Booked Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookedSlots.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Slots</p>
                <p className="text-2xl font-bold text-gray-900">
                  {slots.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("slots")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "slots"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Manage Slots
              </button>
              <button
                onClick={() => setActiveTab("appointments")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "appointments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                View Appointments
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "slots" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Time Slots Management
                  </h2>
                  <button
                    onClick={() => setIsAddSlotModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add New Slot
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-lg border-2 ${
                        slot.isBooked
                          ? "border-red-200 bg-red-50"
                          : "border-green-200 bg-green-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(slot.dateTime).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {new Date(slot.dateTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            slot.isBooked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {slot.isBooked ? "Booked" : "Available"}
                        </span>
                      </div>

                      {slot.isBooked && slot.booking && (
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Customer:</span>{" "}
                            {slot.booking.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span>{" "}
                            {slot.booking.email}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEditSlot(slot)}
                          className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        {slot.isBooked && slot.booking ? (
                          <button
                            onClick={() =>
                              handleCancelAppointment(slot.booking!.id)
                            }
                            className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            disabled={deletingSlotId === slot.id}
                            className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition-colors"
                          >
                            {deletingSlotId === slot.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "appointments" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  All Appointments
                </h2>

                {bookedSlots.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">
                      No appointments found
                    </p>
                    <p className="text-gray-400">
                      Booked appointments will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookedSlots.map((slot) => (
                      <div key={slot.id} className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <svg
                                  className="w-5 h-5 text-blue-600"
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
                                <p className="font-semibold text-gray-900">
                                  {new Date(slot.dateTime).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                                <p className="text-lg font-bold text-blue-600">
                                  {new Date(slot.dateTime).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </p>
                              </div>
                            </div>

                            {slot.booking && (
                              <div className="ml-12 space-y-1">
                                <p className="text-gray-700">
                                  <span className="font-medium">Customer:</span>{" "}
                                  {slot.booking.name}
                                </p>
                                <p className="text-gray-700">
                                  <span className="font-medium">Email:</span>{" "}
                                  {slot.booking.email}
                                </p>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              slot.booking &&
                              handleCancelAppointment(slot.booking.id)
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Cancel Appointment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      <AddSlotModal
        isOpen={isAddSlotModalOpen}
        onClose={() => setIsAddSlotModalOpen(false)}
        onSlotAdded={() => setIsAddSlotModalOpen(false)}
        onAddSlot={handleAddSlot}
      />

      {/* Edit Slot Modal */}
      <EditSlotModal
        isOpen={isEditSlotModalOpen}
        onClose={() => {
          setIsEditSlotModalOpen(false);
          setEditingSlot(null);
        }}
        onSlotUpdated={() => {
          setIsEditSlotModalOpen(false);
          setEditingSlot(null);
        }}
        onUpdateSlot={handleUpdateSlot}
        slot={editingSlot}
      />
    </main>
  );
}
