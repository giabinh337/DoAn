import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DatePickerPopup = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const augDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const augEmptyStart = Array.from({ length: 5 }, () => null);
  const sepDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const sepEmptyStart = Array.from({ length: 1 }, () => null);

  const [activeTab, setActiveTab] = useState('ngay');
  const [activeFlex, setActiveFlex] = useState('chinh-xac');

  const flexOptions = [
    { id: 'chinh-xac', label: 'Ngày chính xác' },
    { id: '1-ngay', label: '± 1 ngày' },
    { id: '2-ngay', label: '± 2 ngày' },
    { id: '3-ngay', label: '± 3 ngày' },
    { id: '7-ngay', label: '± 7 ngày' },
    { id: '14-ngay', label: '± 14 ngày' },
  ];

  // Range Selection Logic
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getDateValue = (day, month, year) => day + (month * 100) + (year * 10000);

  const handleDateClick = (day, month, year) => {
    const dateVal = getDateValue(day, month, year);
    const dateStr = `${day} thg ${month}`;
    
    if (!startDate || (startDate && endDate)) {
      setStartDate({ day, month, year, val: dateVal, str: dateStr });
      setEndDate(null);
      onSelect(dateStr);
    } else {
      if (dateVal < startDate.val) {
        setStartDate({ day, month, year, val: dateVal, str: dateStr });
        onSelect(dateStr);
      } else {
        setEndDate({ day, month, year, val: dateVal, str: dateStr });
        onSelect(`${startDate.str} - ${dateStr}`);
      }
    }
  };

  const renderDayButton = (day, month, year) => {
    const val = getDateValue(day, month, year);
    const isStart = startDate && startDate.val === val;
    const isEnd = endDate && endDate.val === val;
    const isBetween = startDate && endDate && val > startDate.val && val < endDate.val;

    return (
      <div key={day} className="flex justify-center items-center relative w-full h-12">
        {/* Background pill for range connecting */}
        {isBetween && <div className="absolute inset-0 bg-gray-100"></div>}
        {isStart && endDate && <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gray-100"></div>}
        {isEnd && startDate && <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gray-100"></div>}

        <button 
          onClick={() => handleDateClick(day, month, year)}
          className={`w-12 h-12 flex items-center justify-center text-sm font-semibold transition-all relative z-10 ${
            isStart || isEnd 
              ? 'bg-slate-900 text-white rounded-full hover:bg-slate-800' 
              : 'text-slate-800 rounded-full hover:border hover:border-gray-800'
          } ${!isStart && !isEnd && !isBetween ? 'hover:bg-gray-50' : ''}`}
        >
          {day}
        </button>
      </div>
    );
  };

  return (
    <div 
      className="absolute top-[80px] left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-8 w-[850px] z-50 border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* Top Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1.5 rounded-full flex gap-1">
          <button 
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'ngay' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('ngay')}
          >
            Ngày
          </button>
          <button 
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'linh-hoat' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('linh-hoat')}
          >
            Linh hoạt
          </button>
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab === 'ngay' ? (
        <>
          {/* Calendars */}
          <div className="flex justify-between gap-12 mb-6 relative px-4">
            <button className="absolute -left-2 top-0 p-2 text-gray-400 hover:text-gray-800 transition-colors hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="absolute -right-2 top-0 p-2 text-gray-400 hover:text-gray-800 transition-colors hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Month 1 */}
            <div className="flex-1">
              <h3 className="text-center font-bold text-slate-800 mb-6 text-base">Tháng 8 năm 2026</h3>
              <div className="grid grid-cols-7 text-center mb-4">
                {daysOfWeek.map(d => <div key={d} className="text-xs text-gray-500 font-semibold">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {augEmptyStart.map((_, i) => <div key={`e-${i}`} />)}
                {augDays.map(d => renderDayButton(d, 8, 2026))}
              </div>
            </div>

            {/* Month 2 */}
            <div className="flex-1">
              <h3 className="text-center font-bold text-slate-800 mb-6 text-base">Tháng 9 năm 2026</h3>
              <div className="grid grid-cols-7 text-center mb-4">
                {daysOfWeek.map(d => <div key={d} className="text-xs text-gray-500 font-semibold">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {sepEmptyStart.map((_, i) => <div key={`e-${i}`} />)}
                {sepDays.map(d => renderDayButton(d, 9, 2026))}
              </div>
            </div>
          </div>

          {/* Bottom Options */}
          <div className="flex justify-start gap-3 pt-6 border-t border-gray-100">
            {flexOptions.map(opt => (
              <button 
                key={opt.id}
                onClick={() => setActiveFlex(opt.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  activeFlex === opt.id 
                    ? 'border-slate-800 text-slate-800 bg-gray-50' 
                    : 'border-gray-200 text-slate-600 hover:border-gray-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="px-8 pb-4">
          <div className="text-center font-semibold text-slate-800 mb-4">Bạn muốn ở trong bao lâu?</div>
          <div className="flex justify-center gap-3 mb-10">
            <button className="px-6 py-2 rounded-full border border-gray-200 hover:border-gray-800 text-sm font-medium transition-colors">Cuối tuần</button>
            <button className="px-6 py-2 rounded-full border border-gray-800 bg-gray-50 text-slate-800 text-sm font-medium transition-colors">1 tuần</button>
            <button className="px-6 py-2 rounded-full border border-gray-200 hover:border-gray-800 text-sm font-medium transition-colors">1 tháng</button>
          </div>

          <div className="text-center font-semibold text-slate-800 mb-6">Bạn muốn đi khi nào?</div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-center relative">
            {/* Mockup months */}
            {[
              { id: 't9', title: 'Tháng 9', year: '2026' },
              { id: 't10', title: 'Tháng 10', year: '2026' },
              { id: 't11', title: 'Tháng 11', year: '2026' },
              { id: 't12', title: 'Tháng 12', year: '2026' },
              { id: 't1', title: 'Tháng 1', year: '2027' },
              { id: 't2', title: 'Tháng 2', year: '2027' }
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => onSelect(`${m.title} ${m.year}`)}
                className="flex-shrink-0 w-32 h-36 border border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-800 transition-colors hover:shadow-md bg-white"
              >
                <div className="w-10 h-10 mb-1">
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: 'none', height: '32px', width: '32px', stroke: 'currentColor', strokeWidth: 2, overflow: 'visible'}}>
                    <path d="M22 2v4M10 2v4M2 12h28M4 6h24a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
                  </svg>
                </div>
                <div className="font-semibold text-slate-800 text-sm">{m.title}</div>
                <div className="text-xs text-gray-500">{m.year}</div>
              </button>
            ))}
            <button className="absolute right-0 bg-white shadow-md rounded-full p-2 border border-gray-100 text-gray-500 hover:text-gray-800 z-10 translate-x-4">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DatePickerPopup;
