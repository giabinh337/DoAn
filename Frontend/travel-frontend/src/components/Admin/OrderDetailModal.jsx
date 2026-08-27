import React from 'react';
import { X, User, FileText, Calendar, MapPin } from 'lucide-react';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Chi Tiết Đơn Đặt Tour</h2>
            <p className="text-sm text-gray-500 mt-1">Mã đơn: <span className="font-bold text-teal-600">{order.orderCode}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          
          {/* Thông tin Tour */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Thông tin Tour
            </h3>
            <div className="flex gap-4">
              <img 
                src={order.schedule?.tour?.image} 
                alt={order.schedule?.tour?.name} 
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <p className="font-bold text-slate-900 leading-snug">{order.schedule?.tour?.name}</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> 
                  Khởi hành: {new Date(order.schedule?.startDate).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-orange-500 font-bold mt-2">{order.totalPrice.toLocaleString()}đ</p>
              </div>
            </div>
            
            {order.status === 'CANCELLED' && order.cancelReason && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg">
                <p className="text-sm font-bold text-rose-800 mb-1">Lý do từ chối/hủy:</p>
                <p className="text-sm text-rose-700 italic">{order.cancelReason}</p>
              </div>
            )}
          </div>

          {/* Danh sách hành khách */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Danh sách Hành Khách ({order.passengers?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.passengers?.map((p, index) => (
                <div key={p.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{p.fullName}</p>
                    {p.specialRequests && (
                      <div className="mt-2 flex gap-2 text-sm text-gray-600 items-start bg-white p-2.5 rounded-lg border border-gray-100">
                        <FileText className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        <span className="italic">{p.specialRequests}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {(!order.passengers || order.passengers.length === 0) && (
                <p className="text-gray-500 text-sm italic">Không có thông tin hành khách.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailModal;
