import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CheckoutSuccessModal = ({ isOpen, onClose, totalPrice }) => {
  const navigate = useNavigate();
  const { openMyBookings } = useAuth();

  if (!isOpen) return null;

  const handleGoToHome = () => {
    onClose();
    navigate('/');
  };

  const handleOpenMyBookings = () => {
    onClose();
    navigate('/');
    // Đợi 1 chút để chuyển trang xong rồi mới mở popup
    setTimeout(() => {
      openMyBookings();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 relative text-center">
        
        {/* Nền xanh trên cùng */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 pt-10 pb-16 px-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-teal-900/20 mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-teal-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Thành công!</h2>
          <p className="text-teal-50 text-lg">Đơn đặt tour của bạn đã được ghi nhận.</p>
        </div>

        <div className="px-8 py-8 -mt-6 bg-white rounded-t-3xl relative">
          <div className="mb-8">
            <p className="text-gray-500 mb-1">Tổng thanh toán</p>
            <p className="text-4xl font-extrabold text-orange-500">{totalPrice.toLocaleString()}đ</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleOpenMyBookings}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center group"
            >
              Xem chuyến đi của tôi
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleGoToHome}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-4 rounded-xl transition-colors border border-gray-200"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessModal;
