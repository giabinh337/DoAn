import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddDestinationModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Miền Nam');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3000/tour/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, region })
      });

      if (response.ok) {
        const newDest = await response.json();
        onSuccess(newDest); 
        onClose(); 
        setName('');
        setRegion('Miền Nam');
      } else {
        alert('Có lỗi xảy ra khi lưu Điểm Đến mới.');
      }
    } catch (err) {
      alert('Không kết nối được với Server Backend!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-extrabold text-slate-900">Thêm Điểm Đến Mới</h2>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-full bg-white shadow-sm border border-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên Điểm Đến</label>
            <input 
              required type="text" 
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="VD: Côn Đảo" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Vùng Miền</label>
            <select 
              value={region} onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white"
            >
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" disabled={isSubmitting}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDestinationModal;
