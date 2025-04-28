 'use client';

import { useState } from 'react';
import { pricing } from '@/lib/pricing';

export default function DonationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<keyof typeof pricing.donations>('small');

  const handleDonation = async () => {
    try {
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationType: selectedDonation,
        }),
      });

      const { sessionId } = await response.json();
      if (sessionId) {
        window.location.href = `/checkout?session_id=${sessionId}`;
      }
    } catch (error) {
      console.error('Error creating donation session:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Support Us
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Choose Support Level</h3>
          <div className="space-y-2">
            {Object.entries(pricing.donations).map(([key, donation]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="donation"
                  value={key}
                  checked={selectedDonation === key}
                  onChange={() => setSelectedDonation(key as keyof typeof pricing.donations)}
                  className="form-radio text-blue-500"
                />
                <span>{donation.name}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleDonation}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Support Now
          </button>
        </div>
      )}
    </div>
  );
} 