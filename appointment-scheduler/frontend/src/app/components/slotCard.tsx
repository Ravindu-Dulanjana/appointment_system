'use client';
import React from 'react';

type Props = {
  datetime: string;
  selected?: boolean;
  onClick: () => void;
};

export default function SlotCard({ datetime, selected, onClick }: Props) {
  const formatted = new Date(datetime).toLocaleString();

  return (
    <div
      className={`border rounded p-4 cursor-pointer transition 
        ${selected ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}
      `}
      onClick={onClick}
    >
      {formatted}
    </div>
  );
}