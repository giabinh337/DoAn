import React from 'react';
import { Navigation, MapPin } from 'lucide-react';

const domesticLocations = [
  { id: 'hcm', title: 'Thành phố Hồ Chí Minh', subtitle: 'Có các thắng cảnh như Chợ Bến Thành' },
  { id: 'hue', title: 'Thành phố Huế', subtitle: 'Có kiến trúc ấn tượng' },
  { id: 'hn', title: 'Hà Nội', subtitle: 'Có ẩm thực đỉnh cao' },
  { id: 'dn', title: 'Đà Nẵng', subtitle: 'Điểm đến có bãi biển được ưa chuộng' },
  { id: 'dl', title: 'Đà Lạt', subtitle: 'Thành phố ngàn hoa thơ mộng' },
  { id: 'pq', title: 'Phú Quốc', subtitle: 'Đảo ngọc thiên đường' },
];

const LocationPopup = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-[80px] left-0 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 w-[450px] z-50 border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-xs font-bold text-gray-800 mb-4 px-2 tracking-wide">Điểm đến được đề xuất</div>
      
      <div className="flex flex-col max-h-[450px] overflow-y-auto no-scrollbar">
        {/* Lân cận */}
        <button 
          onClick={() => onSelect('Lân cận')}
          className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl transition-colors text-left"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
            <Navigation className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">Lân cận</div>
            <div className="text-sm text-gray-500">Tìm xung quanh bạn</div>
          </div>
        </button>

        {/* Domestic Locations */}
        {domesticLocations.map(loc => (
          <button 
            key={loc.id}
            onClick={() => onSelect(loc.title)}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl transition-colors text-left"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
              <MapPin className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">{loc.title}</div>
              <div className="text-sm text-gray-500">{loc.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationPopup;
