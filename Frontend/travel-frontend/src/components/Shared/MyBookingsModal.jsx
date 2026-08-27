import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MyBookingsModal = () => {
  const { isMyBookingsOpen, closeMyBookings, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isMyBookingsOpen && user?.id) {
      fetchMyBookings();
    }
  }, [isMyBookingsOpen, user]);

  const fetchMyBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/orders/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMyBookingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Chuyến đi của tôi</h2>
            <p className="text-sm text-gray-500 mt-1">Danh sách các tour bạn đã đặt chỗ</p>
          </div>
          <button 
            onClick={closeMyBookings} 
            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors bg-white shadow-sm border border-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader className="w-10 h-10 animate-spin text-teal-500 mb-4" />
              <p>Đang tải dữ liệu chuyến đi...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-teal-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bạn chưa đặt chuyến đi nào</h3>
              <p className="text-gray-500">Hãy khám phá các tour hấp dẫn của VibeTravel nhé!</p>
              <button onClick={closeMyBookings} className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-teal-600/20 transition-all">
                Khám phá ngay
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const tour = order.schedule?.tour;
                const startDate = new Date(order.schedule?.startDate);
                
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                    {/* Ảnh Tour */}
                    <div className="w-full md:w-64 h-48 md:h-auto relative shrink-0">
                      <img 
                        src={tour?.image} 
                        alt={tour?.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800' }}
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-teal-700 shadow-sm">
                        {order.orderCode}
                      </div>
                    </div>

                    {/* Chi tiết đơn hàng */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 pr-4">{tour?.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                            order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                            order.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status === 'PENDING' ? 'Đang xử lý' : 
                             order.status === 'CONFIRMED' ? 'Đã xác nhận' : 
                             order.status === 'CANCELLED' ? 'Đã hủy / Từ chối' : order.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4 mb-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5 text-teal-600" />
                            {tour?.destination?.name}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-orange-500" />
                            Khởi hành: {startDate.toLocaleDateString('vi-VN')}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1.5 text-blue-500" />
                            {order.passengers?.length || 0} hành khách
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500 mb-0.5">Tổng thanh toán</p>
                          <p className="text-xl font-extrabold text-orange-500">{order.totalPrice.toLocaleString()}đ</p>
                        </div>
                        <button 
                          onClick={() => {
                            closeMyBookings();
                            navigate(`/tour/${tour?.id}`);
                          }}
                          className="text-sm font-bold text-teal-600 hover:text-teal-700 underline decoration-2 underline-offset-4"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsModal;
