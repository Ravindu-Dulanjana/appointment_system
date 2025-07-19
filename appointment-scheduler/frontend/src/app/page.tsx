// import AppointmentForm from "./components/AppointmentForm";


// export default function Home() {
//   return (
//     <main className="p-4">
//       <h1 className="text-xl font-bold">Book Appointment</h1>
//       <AppointmentForm />
//     </main>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import SlotCard from "./components/slotCard";
import AppointmentForm from "./components/AppointmentForm";
import { fetchSlots } from "./lib/api";

type Slot = {
  id: number;
  dateTime: string;
  isBooked: boolean;
};

export default function Home() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const fetchSlotsFunction = async () => {
    // api.get('/slots')
    //   .then((res: any) => setSlots(res.data))
    //   .catch(err => console.error(err));
    const data = await fetchSlots();
    console.log(data);
    setSlots(data)
  };

  useEffect(() => {
    fetchSlotsFunction();
  }, []);

  const selectedSlot = slots.find(slot => slot.id === selectedSlotId);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Available Time Slots</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            datetime={slot.dateTime}
            selected={slot.id === selectedSlotId}
            onClick={() => setSelectedSlotId(slot.id)}
          />
        ))}
      </div>

      {selectedSlotId && selectedSlot && (
        <></>
        // <AppointmentForm
        //   slotId={selectedSlotId}
        //   onSuccess={() => {
        //     setSelectedSlotId(null);
        //     fetchSlots(); // Refresh slot availability
        //   }}
        // />
      )}
    </main>
  );
}