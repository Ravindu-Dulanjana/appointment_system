export type Slot = {
  id: number;
  dateTime: string;
  isBooked: boolean;
  booking?: Appointment; // Optional booking details for booked slots
};

export type Appointment = {
  id: number;
  name: string;
  email: string;
  slotId: number;
};
