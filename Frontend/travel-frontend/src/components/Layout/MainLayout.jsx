import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plane, User, Heart, Palmtree, Utensils, Mountain, Globe } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import WishlistSidebar from '../Shared/WishlistSidebar';
import AuthPopup from '../Shared/AuthPopup';
import MyBookingsModal from '../Shared/MyBookingsModal';
import { categories } from '../../data/mockTours';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'Palmtree': return <Palmtree className="w-5 h-5" />;
    case 'Utensils': return <Utensils className="w-5 h-5" />;
    case 'Mountain': return <Mountain className="w-5 h-5" />;
    default: return <Globe className="w-5 h-5" />;
  }
};

const MainLayout = ({ children }) => {
  const { wishlistTours, setIsWishlistOpen } = useWishlist();
  const { isLoggedIn, user, openAuthPopup, logout, openMyBookings } = useAuth();
  const [searchParams] = useSearchParams();
  const activeCategory = parseInt(searchParams.get('category') || '0');
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="w-full mx-auto px-6 md:px-10 xl:px-20 h-20 flex items-center justify-between">

          {/* Logo - Flex 1 */}
          <div className="flex-1 flex items-center justify-start">
            <Link to="/" className="flex items-center gap-2 text-slate-900 font-extrabold text-2xl tracking-tight">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Plane className="w-6 h-6" />
              </div>
              <span>VibeTravel<span className="text-teal-600">.</span></span>
            </Link>
          </div>

          {/* Nav - Centered naturally */}
          <nav className="hidden md:flex items-center justify-center gap-10 lg:gap-16 font-semibold text-gray-500 pt-2 shrink-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <Link
                  key={cat.id}
                  to={`/?category=${cat.id}`}
                  className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-all ${isActive ? 'text-slate-900 border-slate-900' : 'border-transparent hover:text-slate-800 hover:border-gray-300'
                    }`}
                >
                  {getIcon(cat.icon)}
                  <span className="text-sm">{cat.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions - Flex 1 */}
          <div className="flex-1 flex items-center justify-end gap-5">
            <button
              onClick={() => isLoggedIn ? setIsWishlistOpen(true) : openAuthPopup()}
              className="relative p-2 text-gray-500 hover:text-rose-500 transition-colors"
            >
              <Heart className="w-6 h-6" />
              {wishlistTours.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                  {wishlistTours.length}
                </span>
              )}
            </button>

            {/* Conditional Rendering dựa trên trạng thái Đăng nhập */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col gap-1 w-4">
                    <span className="w-full h-0.5 bg-gray-500 rounded"></span>
                    <span className="w-full h-0.5 bg-gray-500 rounded"></span>
                    <span className="w-full h-0.5 bg-gray-500 rounded"></span>
                  </div>
                  <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 mb-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.email ? user.email : 'Tài khoản của tôi'}
                      </p>
                    </div>
                    
                    {/* Chỉ hiện nút Admin nếu có quyền ADMIN */}
                    {user?.role === 'ADMIN' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block w-full text-left px-4 py-2.5 text-sm font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 transition-colors"
                      >
                        Vào trang Quản trị (Admin)
                      </Link>
                    )}

                    <button 
                      onClick={() => {
                        openMyBookings();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Chuyến đi của tôi
                    </button>
                    <button
                      onClick={() => {
                        setIsWishlistOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Wishlist chung
                    </button>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={openAuthPopup}
                  className="hidden md:flex items-center gap-2 text-gray-600 hover:text-teal-600 font-medium px-2 py-2 transition"
                >
                  <User className="w-5 h-5" />
                  Đăng nhập
                </button>
                <button
                  onClick={openAuthPopup}
                  className="bg-slate-900 hover:bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all duration-300"
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 font-extrabold text-2xl mb-6">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6" />
              </div>
              <span>VibeTravel<span className="text-teal-600">.</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Khám phá thế giới theo cách riêng của bạn. Đặt tour dễ dàng, trải nghiệm tối đa với bộ lọc cảm xúc độc quyền.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Về chúng tôi</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="#" className="hover:text-teal-400 transition">Câu chuyện thương hiệu</Link></li>
              <li><Link to="#" className="hover:text-teal-400 transition">Tuyển dụng</Link></li>
              <li><Link to="#" className="hover:text-teal-400 transition">Báo chí</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Hỗ trợ khách hàng</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="#" className="hover:text-teal-400 transition">Trung tâm trợ giúp</Link></li>
              <li><Link to="#" className="hover:text-teal-400 transition">Chính sách bảo mật</Link></li>
              <li><Link to="#" className="hover:text-teal-400 transition">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Kết nối</h4>
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-slate-800 hover:bg-teal-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300">FB</div>
              <div className="w-11 h-11 bg-slate-800 hover:bg-teal-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300">IG</div>
              <div className="w-11 h-11 bg-slate-800 hover:bg-teal-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300">YT</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          © 2026 VibeTravel. All rights reserved.
        </div>
      </footer>

      {/* Global Wishlist Sidebar */}
      <WishlistSidebar />

      {/* Global Auth Popup */}
      <AuthPopup />

      {/* My Bookings Modal */}
      <MyBookingsModal />
    </div>
  );
};

export default MainLayout;
