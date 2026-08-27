import React from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const ConfirmOrderModal = ({ isOpen, onClose, onConfirm, order, newStatus }) => {
  const [reason, setReason] = React.useState('');

  if (!isOpen || !order) return null;

  const isConfirm = newStatus === 'CONFIRMED';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-6 flex flex-col items-center justify-center relative border-b ${isConfirm ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4 ${isConfirm ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
            {isConfirm ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-white" />
            )}
          </div>
          
          <h2 className={`text-xl font-bold ${isConfirm ? 'text-emerald-800' : 'text-rose-800'}`}>
            {isConfirm ? 'Xác nhận duyệt đơn hàng?' : 'Xác nhận hủy đơn hàng?'}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 bg-white">
          <p className="text-gray-600 text-sm mb-4 text-center">
            Bạn đang chuẩn bị chuyển trạng thái của đơn hàng <strong>{order.orderCode}</strong> thành <strong className={isConfirm ? 'text-emerald-600' : 'text-rose-600'}>{newStatus}</strong>.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Khách hàng:</span>
              <span className="font-bold text-slate-800">{order.user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Số lượng khách:</span>
              <span className="font-bold text-blue-600">{order.passengers?.length || 0} người</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tổng tiền:</span>
              <span className="font-bold text-orange-500">{order.totalPrice.toLocaleString()}đ</span>
            </div>
          </div>

          {!isConfirm && (
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Lý do từ chối / hủy đơn:</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ví dụ: Đã hết chỗ, Khách tự yêu cầu hủy..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm resize-none"
                rows="2"
              ></textarea>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={() => onConfirm(reason)}
            className={`flex-1 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all ${
              isConfirm 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
            }`}
          >
            Đồng ý
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmOrderModal;
