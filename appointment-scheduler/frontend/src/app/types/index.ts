export type Slot = {
  id: number;
  dateTime: string;
  isBooked: boolean;
};

export type Appointment = {
  id: number;
  name: string;
  email: string;
  slotId: number;
};