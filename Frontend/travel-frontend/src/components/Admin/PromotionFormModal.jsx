import React, { useState } from 'react';
import { X } from 'lucide-react';

const PromotionFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      return setError('Vui lòng nhập mã khuyến mãi');
    }
    if (!discountValue || isNaN(Number(discountValue)) || Number(discountValue) <= 0) {
      return setError('Số tiền giảm không hợp lệ');
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: code.trim().toUpperCase(), 
          discountValue: Number(discountValue) 
        })
      });
      
      if (res.ok) {
        setCode('');
        setDiscountValue('');
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || 'Có lỗi xảy ra khi thêm mã');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-900">Thêm Mã Khuyến Mãi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã giảm giá (Code)</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="VD: SUMMER2026"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền giảm (VNĐ)</label>
              <input 
                type="number" 
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder="VD: 500000"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                min="1000"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Đang thêm...' : 'Lưu Khuyến Mãi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionFormModal;
