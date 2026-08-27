import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AuthPopup = () => {
  const { isAuthPopupOpen, closeAuthPopup, login } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' hoặc 'register'
  
  // Các state lưu trữ thông tin người dùng gõ vào
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State thông báo lỗi hoặc thành công
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthPopupOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang web load lại
    setMessage('');
    
    // Kiểm tra cơ bản nếu là form đăng ký
    if (activeTab === 'register' && password !== confirmPassword) {
      setMessage('Mật khẩu nhập lại không khớp!');
      return;
    }

    setIsLoading(true);

    try {
      // Gửi API xuống Backend
      const url = activeTab === 'login' 
        ? 'http://localhost:3000/auth/login' 
        : 'http://localhost:3000/auth/register';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend trả về lỗi (ví dụ: sai mật khẩu, email đã tồn tại)
        setMessage(data.message || 'Có lỗi xảy ra!');
      } else {
        // Thành công!
        if (activeTab === 'login') {
          login(data.access_token); // Lưu token và báo đã đăng nhập
          closeAuthPopup(); // Đóng popup
        } else {
          setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
          setActiveTab('login'); // Tự động chuyển qua tab đăng nhập
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (error) {
      setMessage('Không thể kết nối đến Server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Khung Popup */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Nút Đóng */}
        <button 
          onClick={closeAuthPopup}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            {activeTab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản mới'}
          </h2>

          {/* 2 Nút chuyển tab (Tab chuyển đổi) */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setActiveTab('login'); setMessage(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'login' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => { setActiveTab('register'); setMessage(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'register' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Hiện thông báo lỗi màu đỏ nếu có */}
          {message && (
            <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.includes('thành công') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {message}
            </div>
          )}

          {/* Form Nhập Liệu */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Chỉ hiện ô Nhập lại mật khẩu nếu đang ở tab Đăng ký */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              {isLoading ? 'Đang xử lý...' : (activeTab === 'login' ? 'Đăng nhập' : 'Hoàn tất Đăng ký')}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
