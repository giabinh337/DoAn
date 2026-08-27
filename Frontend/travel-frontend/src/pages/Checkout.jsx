import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CheckoutSuccessModal from '../components/Shared/CheckoutSuccessModal';
import { X, QrCode, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { id } = useParams(); // id của Tour
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  
  const [tour, setTour] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([{ name: '', specialRequests: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Lấy thông tin tour để hiển thị giá
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`http://localhost:3000/tour/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTour(data);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin tour", error);
      }
    };
    fetchTour();
  }, [id]);

  // Bảo vệ route, chưa đăng nhập thì đuổi về
  useEffect(() => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để đặt tour!");
      navigate(`/tour/${id}`);
    }
  }, [isLoggedIn, navigate, id]);

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const handleCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setPassengerCount(count);
    
    // Tạo lại mảng hành khách theo số lượng mới
    const newPassengers = Array(count).fill(null).map((_, i) => {
      return passengers[i] || { name: '', specialRequests: '' };
    });
    setPassengers(newPassengers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate cơ bản
    const hasEmptyName = passengers.some(p => p.name.trim() === '');
    if (hasEmptyName) {
      alert("Vui lòng nhập đầy đủ họ tên cho tất cả hành khách!");
      return;
    }

    // Thay vì gọi API liền, ta mở Popup thanh toán QR
    setIsPaymentModalOpen(true);
  };

  const executeBooking = async () => {
    setIsLoading(true);
    try {
      const totalPrice = tour.price * passengerCount;
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          tourId: id,
          passengers: passengers,
          totalPrice: totalPrice
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsPaymentModalOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi đặt tour!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tour) return <div className="p-20 text-center text-xl">Đang tải thông tin...</div>;

  const totalPrice = tour.price * passengerCount;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Thanh toán & Đặt Tour</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form nhập thông tin */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng hành khách</label>
              <select 
                value={passengerCount} 
                onChange={handleCountChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} khách</option>
                ))}
              </select>
            </div>

            <div className="space-y-6">
              {passengers.map((p, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-slate-900 mb-4">Hành khách {index + 1} {index === 0 && '(Người đại diện)'}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                      <input 
                        type="text"
                        required
                        value={p.name}
                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                        placeholder="Nhập họ và tên"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu đặc biệt (Ăn chay, dị ứng...)</label>
                      <input 
                        type="text"
                        value={p.specialRequests}
                        onChange={(e) => handlePassengerChange(index, 'specialRequests', e.target.value)}
                        placeholder="Không bắt buộc"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : 'Xác nhận Đặt Tour'}
            </button>
          </form>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Tóm tắt đơn hàng</h2>
          
          <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
            <img src={tour.image} alt={tour.name} className="w-20 h-20 rounded-xl object-cover" />
            <div>
              <h3 className="font-bold text-slate-900 line-clamp-2">{tour.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{tour.destination?.name}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Giá 1 khách</span>
              <span className="font-medium text-slate-900">{tour.price.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số lượng</span>
              <span className="font-medium text-slate-900">x {passengerCount}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-900">Tổng cộng</span>
            <span className="text-2xl font-extrabold text-orange-500">{totalPrice.toLocaleString()}đ</span>
          </div>
          <p className="text-xs text-gray-500 text-right">Đã bao gồm thuế và phí</p>
        </div>
      </div>
      
      <CheckoutSuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        totalPrice={totalPrice}
      />

      {/* Modal Thanh toán QR */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                Thanh toán Quét mã QR
              </h2>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-center">
              <div className="mb-4 bg-gray-50 rounded-2xl p-4 border border-gray-100 inline-block">
                <img 
                  src="/images/Qr thanh toan/QR.jpg" 
                  alt="QR Code Thanh Toán" 
                  className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto mix-blend-multiply"
                />
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-500">Mở ứng dụng ngân hàng và quét mã để thanh toán</p>
                <div className="bg-orange-50 text-orange-700 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 border border-orange-100">
                  Tổng tiền: <span className="text-xl font-extrabold">{totalPrice.toLocaleString()}đ</span>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                  Nội dung chuyển khoản (Tự động):<br/>
                  <strong className="text-slate-900 text-sm mt-1 block">{user?.email?.split('@')[0]} thanh toan tour {tour.id}</strong>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium mb-6">
                <ShieldCheck className="w-5 h-5" /> Giao dịch được bảo mật an toàn
              </div>

              <button 
                onClick={executeBooking}
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Đang xác nhận...' : 'Tôi đã chuyển khoản thành công'}
              </button>
              
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-full mt-3 text-gray-500 font-semibold text-sm hover:text-slate-900 py-2"
              >
                Hủy thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
