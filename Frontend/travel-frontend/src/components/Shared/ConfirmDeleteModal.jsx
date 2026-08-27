import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-6 pb-0 flex justify-end">
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors bg-gray-50 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 pt-0 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">{title || 'Xác nhận xóa?'}</h2>
          <p className="text-gray-500">{message || 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?'}</p>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 transition-colors shadow-sm"
          >
            Hủy
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
          >
            Xóa
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
