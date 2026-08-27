import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const GuestPopup = ({ isOpen, onGuestChange }) => {
  if (!isOpen) return null;

  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0
  });

  const updateGuest = (type, operation) => {
    setGuests(prev => {
      const current = prev[type];
      let newValue = current;
      if (operation === 'add') {
        newValue = current + 1;
      } else if (operation === 'subtract' && current > 0) {
        newValue = current - 1;
      }
      
      const newGuests = { ...prev, [type]: newValue };
      
      // Calculate total for display, usually infants aren't counted in the main "Khách" number, 
      // but let's just sum adults + children for the main label
      const total = newGuests.adults + newGuests.children;
      const displayString = total > 0 ? `${total} khách${newGuests.infants > 0 ? `, ${newGuests.infants} em bé` : ''}` : '';
      
      if (onGuestChange) {
        onGuestChange(displayString);
      }
      
      return newGuests;
    });
  };

  const rows = [
    { id: 'adults', title: 'Người lớn', subtitle: 'Từ 13 tuổi trở lên' },
    { id: 'children', title: 'Trẻ em', subtitle: 'Độ tuổi 2 – 12' },
    { id: 'infants', title: 'Em bé', subtitle: 'Dưới 2 tuổi' },
  ];

  return (
    <div 
      className="absolute top-[80px] right-0 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 w-[400px] z-50 border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-6">
        {rows.map((row, index) => (
          <div key={row.id} className={`flex items-center justify-between ${index !== rows.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
            <div>
              <div className="font-semibold text-slate-800">{row.title}</div>
              <div className="text-sm text-gray-500">{row.subtitle}</div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => updateGuest(row.id, 'subtract')}
                disabled={guests[row.id] === 0}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                  guests[row.id] === 0 
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                    : 'border-gray-400 text-gray-600 hover:border-gray-800 hover:text-gray-800'
                }`}
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="w-4 text-center font-medium text-slate-800">{guests[row.id]}</span>
              
              <button 
                onClick={() => updateGuest(row.id, 'add')}
                className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center hover:border-gray-800 hover:text-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestPopup;
