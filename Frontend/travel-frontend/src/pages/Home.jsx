import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Palmtree, Utensils, Mountain, MapPin, Calendar, Search, Star, Heart, Globe, ArrowRight, X, Scale } from 'lucide-react';
import TourCard from '../components/Shared/TourCard';
import ComparePopup from '../components/Shared/ComparePopup';
import DatePickerPopup from '../components/Shared/DatePickerPopup';
import LocationPopup from '../components/Shared/LocationPopup';
import GuestPopup from '../components/Shared/GuestPopup';

// Hàm tiện ích lấy Icon
const getIcon = (iconName) => {
  switch (iconName) {
    case 'Palmtree': return <Palmtree className="w-5 h-5" />;
    case 'Utensils': return <Utensils className="w-5 h-5" />;
    case 'Mountain': return <Mountain className="w-5 h-5" />;
    default: return <Globe className="w-5 h-5" />;
  }
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryId = parseInt(searchParams.get('category') || '1');
  const [compareList, setCompareList] = useState([]);
  const [isComparePopupOpen, setIsComparePopupOpen] = useState(false);
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search state
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchGuest, setSearchGuest] = useState('');
  const [appliedSearchLocation, setAppliedSearchLocation] = useState('');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);

  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const locationPopupRef = useRef(null);
  
  const [isGuestPopupOpen, setIsGuestPopupOpen] = useState(false);
  const guestPopupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
      if (locationPopupRef.current && !locationPopupRef.current.contains(event.target)) {
        setIsLocationPopupOpen(false);
      }
      if (guestPopupRef.current && !guestPopupRef.current.contains(event.target)) {
        setIsGuestPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch dữ liệu Tour thật từ Backend
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:3000/tour');
        if (response.ok) {
          const data = await response.json();
          // Map dữ liệu CSDL sang cấu trúc Component hiển thị
          const formattedTours = data.map(t => ({
            id: t.id,
            title: t.name,
            location: t.destination?.name || 'Chưa rõ',
            price: t.price,
            image: t.image,
            categoryId: t.categoryId,
            rating: 5.0, // Tạm thời hardcode
            reviews: Math.floor(Math.random() * 500) + 50 // Random cho đẹp
          }));
          setTours(formattedTours);
        }
      } catch (error) {
        console.error("Lỗi khi tải Tour:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Xử lý Thêm/Xóa tour khỏi danh sách so sánh
  const handleCompare = (tour) => {
    setCompareList(prev => {
      if (prev.find(t => t.id === tour.id)) {
        return prev.filter(t => t.id !== tour.id);
      }
      if (prev.length >= 2) return prev;
      return [...prev, tour];
    });
  };

  // Lọc tour theo Category và Search Location
  let filteredTours = activeCategoryId === 1 
    ? tours 
    : tours.filter(tour => tour.categoryId === activeCategoryId);

  if (appliedSearchLocation) {
    const searchVal = appliedSearchLocation.toLowerCase();
    filteredTours = filteredTours.filter(tour => {
      const loc = tour.location?.toLowerCase() || '';
      const title = tour.title?.toLowerCase() || '';
      // Trích xuất các từ khóa chính để tìm kiếm thông minh hơn (bỏ chữ "thành phố", "tỉnh")
      const cleanSearch = searchVal.replace(/thành phố|tỉnh|tp\.?/g, '').trim();
      
      return loc.includes(cleanSearch) || cleanSearch.includes(loc) || 
             title.includes(cleanSearch) || cleanSearch.includes(title);
    });
  }

  const handleSearch = () => {
    setAppliedSearchLocation(searchLocation);
  };

  return (
    <div className="pb-20">
      {/* Hero Banner Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2500")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/70"></div>
        </div>

        {/* Content Box */}
        <div className="relative z-40 text-center px-4 w-full max-w-5xl mx-auto mt-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight tracking-tight">
            Thế giới ngoài kia thật rộng lớn<br className="hidden md:block" /> Đi để trải nghiệm!
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-12 drop-shadow-md font-medium max-w-3xl mx-auto">
            Khám phá những điểm đến tuyệt vời với bộ lọc theo cảm xúc của riêng bạn
          </p>

          {/* Search & Vibe Filter Card - Airbnb Style */}
          <div className="w-full mx-auto text-left max-w-4xl mt-6">

            {/* Search Bar - Airbnb Style */}
            <div className="bg-white rounded-full shadow-2xl flex items-center h-[68px] w-full mx-auto relative border border-gray-100">
              
              {/* Location */}
              <div 
                ref={locationPopupRef}
                className="flex-1 flex flex-col justify-center pl-8 pr-10 py-2 hover:bg-gray-100 rounded-full cursor-pointer h-full transition-colors focus-within:bg-white focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.1)] focus-within:z-20 relative group"
                onClick={() => setIsLocationPopupOpen(true)}
              >
                <div className="text-xs font-bold text-gray-800 tracking-wide mb-0.5">Địa điểm</div>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm điểm đến" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-transparent border-none outline-none text-sm text-gray-600 truncate placeholder-gray-400 p-0 m-0 w-full font-medium"
                />
                
                {searchLocation && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setSearchLocation(''); 
                      setAppliedSearchLocation('');
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                <LocationPopup 
                  isOpen={isLocationPopupOpen} 
                  onSelect={(loc) => {
                    setSearchLocation(loc);
                    setIsLocationPopupOpen(false);
                  }} 
                />
              </div>

              <div className="w-[1px] h-10 bg-gray-200"></div>

              {/* Date */}
              <div 
                ref={datePickerRef}
                className="flex-1 flex flex-col justify-center px-6 pr-10 py-2 hover:bg-gray-100 rounded-full cursor-pointer h-full transition-colors focus-within:bg-white focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.1)] focus-within:z-20 relative group"
                onClick={() => setIsDatePickerOpen(true)}
              >
                <div className="text-xs font-bold text-gray-800 tracking-wide mb-0.5">Thời gian</div>
                <input 
                  type="text" 
                  placeholder="Thêm ngày" 
                  value={searchDate}
                  readOnly
                  className="bg-transparent border-none outline-none text-sm text-gray-600 truncate placeholder-gray-400 p-0 m-0 w-full font-medium cursor-pointer"
                />

                {searchDate && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSearchDate(''); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                
                <DatePickerPopup 
                  isOpen={isDatePickerOpen} 
                  onSelect={(date) => {
                    setSearchDate(date);
                  }} 
                />
              </div>

              <div className="w-[1px] h-10 bg-gray-200"></div>

              {/* Guests and Button */}
              <div 
                ref={guestPopupRef}
                className="flex-1 flex items-center justify-between pl-6 pr-2 py-2 hover:bg-gray-100 rounded-full cursor-pointer h-full transition-colors focus-within:bg-white focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.1)] focus-within:z-20 relative group"
                onClick={() => setIsGuestPopupOpen(true)}
              >
                <div className="flex flex-col justify-center flex-1 relative pr-8">
                  <div className="text-xs font-bold text-gray-800 tracking-wide mb-0.5">Khách</div>
                  <input 
                    type="text" 
                    placeholder="Thêm khách" 
                    value={searchGuest}
                    readOnly
                    className="bg-transparent border-none outline-none text-sm text-gray-600 truncate placeholder-gray-400 p-0 m-0 w-full font-medium cursor-pointer"
                  />
                  {searchGuest && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSearchGuest(''); }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSearch(); }}
                  className="bg-teal-600 hover:bg-teal-700 text-white w-12 h-12 rounded-full transition-all flex items-center justify-center shrink-0 ml-2 group shadow-md hover:shadow-lg shadow-teal-600/20"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                </button>
                
                <GuestPopup 
                  isOpen={isGuestPopupOpen}
                  onGuestChange={(val) => setSearchGuest(val)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20 md:py-28 container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Trải nghiệm nổi bật</h2>
            <p className="text-gray-500 text-lg">Những hành trình được yêu thích nhất trong tuần</p>
          </div>
          <button className="text-teal-600 font-bold hover:text-teal-700 transition-all flex items-center gap-1 group bg-teal-50 hover:bg-teal-100 px-5 py-2.5 rounded-full">
            Xem tất cả
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Smart Fallback Logic */}
        {isLoading ? (
          <div className="py-20 text-center font-bold text-gray-500">Đang tải các điểm đến tuyệt đẹp...</div>
        ) : filteredTours.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center max-w-4xl mx-auto">
             <div className="w-20 h-20 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mx-auto mb-6">
               <Calendar className="w-10 h-10 text-rose-400" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-3">Rất tiếc, chưa có tour phù hợp</h3>
             <p className="text-gray-500 mb-10 mx-auto">
                Hiện tại chưa có hành trình nào khớp với thời gian và trải nghiệm bạn chọn. 
                Bạn có thể xem thử các <strong className="text-slate-700">Gợi ý lân cận</strong> cực HOT dưới đây nhé!
             </p>
             
             {/* Gợi ý Smart (lấy 3 tour khác category) */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                {tours.filter(t => t.categoryId !== activeCategoryId).slice(0, 3).map(tour => (
                   <TourCard key={tour.id} tour={tour} onCompare={handleCompare} isCompared={compareList.some(t => t.id === tour.id)} />
                ))}
             </div>

             <button 
                onClick={() => {
                  setSearchParams({ category: '1' });
                  setAppliedSearchLocation('');
                  setSearchLocation('');
                }}
                className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
             >
               Xem tất cả hành trình hiện có
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <TourCard 
                key={tour.id} 
                tour={tour} 
                onCompare={handleCompare} 
                isCompared={compareList.some(t => t.id === tour.id)} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-40 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
              <Scale className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="font-bold">So sánh Tour</div>
              <div className="text-xs text-slate-300">Đã chọn {compareList.length}/2</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
            <button 
              onClick={() => setIsComparePopupOpen(true)}
              disabled={compareList.length < 2}
              className={`px-5 py-2 rounded-full font-bold transition-colors ${compareList.length === 2 ? 'bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              So sánh ngay
            </button>
            <button 
              onClick={() => setCompareList([])}
              className="w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {isComparePopupOpen && (
        <ComparePopup 
          tours={compareList} 
          onClose={() => setIsComparePopupOpen(false)} 
        />
      )}
    </div>
  );
};

export default Home;
