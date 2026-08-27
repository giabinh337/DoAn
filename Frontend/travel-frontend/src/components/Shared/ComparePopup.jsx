import React from 'react';
import { X, Check, XCircle } from 'lucide-react';

const ComparePopup = ({ tours, onClose }) => {
  if (tours.length < 2) return null;

  const [tour1, tour2] = tours;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-extrabold text-slate-900">So sánh Tour</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-slate-900 shadow-sm border border-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="w-1/4 p-4 border-b border-gray-200"></th>
                <th className="w-3/8 p-4 border-b border-gray-200 align-top">
                  <img src={tour1.image} alt={tour1.title} className="w-full h-40 object-cover rounded-xl mb-4 shadow-sm" />
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-2">{tour1.title}</h3>
                </th>
                <th className="w-3/8 p-4 border-b border-gray-200 align-top">
                  <img src={tour2.image} alt={tour2.title} className="w-full h-40 object-cover rounded-xl mb-4 shadow-sm" />
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-2">{tour2.title}</h3>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Giá */}
              <tr>
                <td className="p-4 border-b border-gray-100 font-semibold text-gray-700">Giá tour</td>
                <td className="p-4 border-b border-gray-100 font-extrabold text-orange-500 text-xl">{tour1.price.toLocaleString()}đ</td>
                <td className="p-4 border-b border-gray-100 font-extrabold text-orange-500 text-xl">{tour2.price.toLocaleString()}đ</td>
              </tr>
              {/* Đánh giá */}
              <tr>
                <td className="p-4 border-b border-gray-100 font-semibold text-gray-700">Đánh giá</td>
                <td className="p-4 border-b border-gray-100 font-bold text-slate-900">{tour1.rating} <span className="text-gray-500 font-normal">({tour1.reviews} đánh giá)</span></td>
                <td className="p-4 border-b border-gray-100 font-bold text-slate-900">{tour2.rating} <span className="text-gray-500 font-normal">({tour2.reviews} đánh giá)</span></td>
              </tr>
              {/* Vị trí */}
              <tr>
                <td className="p-4 border-b border-gray-100 font-semibold text-gray-700">Địa điểm</td>
                <td className="p-4 border-b border-gray-100 text-gray-600">{tour1.location}</td>
                <td className="p-4 border-b border-gray-100 text-gray-600">{tour2.location}</td>
              </tr>
              {/* Phong cách */}
              <tr>
                <td className="p-4 border-b border-gray-100 font-semibold text-gray-700">Phong cách</td>
                <td className="p-4 border-b border-gray-100">
                  <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-md text-sm font-semibold">{tour1.vibe}</span>
                </td>
                <td className="p-4 border-b border-gray-100">
                  <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-md text-sm font-semibold">{tour2.vibe}</span>
                </td>
              </tr>
              {/* Dịch vụ */}
              <tr>
                <td className="p-4 font-semibold text-gray-700">Tiện ích đi kèm</td>
                <td className="p-4">
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Xác nhận tức thời</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Hủy miễn phí</li>
                    <li className="flex items-center gap-2">{tour1.discount > 0 ? <Check className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />} Ưu đãi {tour1.discount}%</li>
                  </ul>
                </td>
                <td className="p-4">
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Xác nhận tức thời</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Hủy miễn phí</li>
                    <li className="flex items-center gap-2">{tour2.discount > 0 ? <Check className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />} Ưu đãi {tour2.discount}%</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparePopup;
