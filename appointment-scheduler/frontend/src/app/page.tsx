// export default function Home() {
//   return (
//     <main className="p-4">
//       <h1 className="text-xl font-bold">Book Appointment</h1>
//       <AppointmentForm />
//     </main>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import SlotCard from "./components/slotCard";
import AppointmentForm from "./components/AppointmentForm";
import Modal from "./components/Modal";
import BookingDetailsModal from "./components/BookingDetailsModal";
import { fetchSlots } from "./lib/api";

type Slot = {
  id: number;
  dateTime: string;
  isBooked: boolean;
};

export default function Home() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookedSlot, setSelectedBookedSlot] = useState<Slot | null>(
    null
  );
  const [isBookingDetailsModalOpen, setIsBookingDetailsModalOpen] =
    useState(false);

  const fetchSlotsFunction = async () => {
    try {
      const data = await fetchSlots();
      console.log(data);
      setSlots(data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  useEffect(() => {
    fetchSlotsFunction();
  }, []);

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

  const handleSlotClick = (slotId: number) => {
    const slot = slots.find((s) => s.id === slotId);
    if (slot && !slot.isBooked) {
      setSelectedSlotId(slotId);
      setIsModalOpen(true);
    }
  };

  const handleBookingSuccess = () => {
    setSelectedSlotId(null);
    setIsModalOpen(false);
    fetchSlotsFunction(); // Refresh slots to show updated booking status
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlotId(null);
  };

  const handleBookedSlotClick = (slot: Slot) => {
    setSelectedBookedSlot(slot);
    setIsBookingDetailsModalOpen(true);
  };

  const handleCloseBookingDetailsModal = () => {
    setIsBookingDetailsModalOpen(false);
    setSelectedBookedSlot(null);
  };

  const handleCancelSuccess = () => {
    fetchSlotsFunction(); // Refresh slots after cancellation
  };

  const availableSlots = slots.filter((slot) => !slot.isBooked);
  const bookedSlots = slots.filter((slot) => slot.isBooked);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4">
              <a
                href="/my-appointments"
                className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                My Appointments
              </a>
            </div>
            <a
              href="/admin"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Admin Login
            </a>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select an available time slot that works best for you. Click on any
            available slot to book your appointment.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
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
                <p className="text-sm font-medium text-gray-600">
                  Booked Slots
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookedSlots.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Slots Section */}
        {availableSlots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Available Time Slots
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableSlots.map((slot) => (
                <SlotCard
                  key={slot.id}
                  datetime={slot.dateTime}
                  isBooked={slot.isBooked}
                  selected={slot.id === selectedSlotId}
                  onClick={() => handleSlotClick(slot.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Booked Slots Section */}
        {bookedSlots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Booked Appointments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {bookedSlots.map((slot) => (
                <SlotCard
                  key={slot.id}
                  datetime={slot.dateTime}
                  isBooked={slot.isBooked}
                  selected={false}
                  onClick={() => {}} // No action for regular clicks
                  onBookedClick={() => handleBookedSlotClick(slot)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {slots.length === 0 && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">
              Loading available time slots...
            </p>
          </div>
        )}

        {/* No Slots Available */}
        {slots.length > 0 && availableSlots.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-600"
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
            <p className="text-gray-600 text-lg mb-2">No Available Slots</p>
            <p className="text-gray-500">
              All appointment slots are currently booked. Please check back
              later.
            </p>
          </div>
        )}
      </div>

      {/* Appointment Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Book Your Appointment"
      >
        {selectedSlot && (
          <AppointmentForm
            selectedSlot={selectedSlot}
            onSuccess={handleBookingSuccess}
            onClose={handleCloseModal}
          />
        )}
      </Modal>

      {/* Booking Details Modal */}
      {selectedBookedSlot && (
        <BookingDetailsModal
          isOpen={isBookingDetailsModalOpen}
          onClose={handleCloseBookingDetailsModal}
          slot={selectedBookedSlot}
          onCancelSuccess={handleCancelSuccess}
        />
      )}
    </main>
  );
}
