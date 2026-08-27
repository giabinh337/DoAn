import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Sun, Coffee, Heart, Share, ImageIcon, Check, Palmtree, Utensils, Mountain, Globe, User } from 'lucide-react';
import TourCard from '../components/Shared/TourCard';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import ImageGalleryModal from '../components/Shared/ImageGalleryModal';

// Hàm tiện ích lấy Icon cho tab Gợi ý Tour
const getIcon = (iconName) => {
  switch (iconName) {
    case 'Palmtree': return <Palmtree className="w-5 h-5" />;
    case 'Utensils': return <Utensils className="w-5 h-5" />;
    case 'Mountain': return <Mountain className="w-5 h-5" />;
    default: return <Globe className="w-5 h-5" />;
  }
};

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishlistTours, toggleWishlist, setIsWishlistOpen } = useWishlist();
  const { isLoggedIn, openAuthPopup, user } = useAuth();
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [backendTour, setBackendTour] = useState(null);
  const [similarTours, setSimilarTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);

  // Cuộn lên đầu trang mỗi khi chuyển sang tour mới
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch dữ liệu Tour thật từ Backend
  useEffect(() => {
    const fetchTourAndSimilar = async () => {
      try {
        setIsLoading(true);
        // Lấy chi tiết Tour
        const resDetail = await fetch(`http://localhost:3000/tour/${id}`);
        if (resDetail.ok) {
          const detailData = await resDetail.json();
          setBackendTour(detailData);
          
          // Lấy đánh giá của Tour
          try {
            const resReviews = await fetch(`http://localhost:3000/reviews/tour/${id}`);
            if (resReviews.ok) {
              setReviews(await resReviews.json());
            }
          } catch (e) {
            console.error("Lỗi khi tải đánh giá:", e);
          }
          
          // Lấy danh sách Tour tương tự
          const resAll = await fetch(`http://localhost:3000/tour`);
          if (resAll.ok) {
            const allTours = await resAll.json();
            // Map danh sách tour tương tự sang cấu trúc TourCard cần
            const formattedSimilar = allTours
              .filter(t => t.categoryId === detailData.categoryId && t.id !== detailData.id)
              .slice(0, 3)
              .map(t => ({
                id: t.id,
                title: t.name,
                location: t.destination?.name || 'Chưa rõ',
                price: t.price,
                image: t.image,
                categoryId: t.categoryId,
                rating: 5.0,
                reviews: Math.floor(Math.random() * 500) + 50
              }));
            setSimilarTours(formattedSimilar);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết Tour:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTourAndSimilar();
  }, [id]);

  if (isLoading) return <div className="py-32 text-center text-xl font-bold">Đang tải thông tin Tour...</div>;
  if (!backendTour) return <div className="py-32 text-center text-xl font-bold">Không tìm thấy Tour này!</div>;

  // Parse lịch trình nếu nó là chuỗi (đề phòng)
  let parsedItinerary = typeof backendTour.itinerary === 'string' ? JSON.parse(backendTour.itinerary) : backendTour.itinerary;
  
  // Chuẩn hóa định dạng lịch trình (nếu là dạng đơn giản tạo từ Admin Dashboard thì chuyển thành dạng mảng activities)
  const normalizedItinerary = Array.isArray(parsedItinerary) ? parsedItinerary.map(d => {
    if (d.activities) return d; // Đã chuẩn form mock
    return {
      day: `Ngày ${d.day}`,
      title: 'Hoạt động nổi bật',
      activities: [
        { time: 'Tự do', desc: d.activity || 'Không có mô tả', icon: 'Sun' }
      ]
    };
  }) : [];

  // Trích xuất thư mục ảnh dựa vào ảnh chính lưu trong DB
  let baseFolder = '/images/tours/Đà Lạt';
  let baseName = 'Đà Lạt';
  if (backendTour.image && backendTour.image.includes('/images/tours/')) {
    const parts = backendTour.image.split('/');
    if (parts.length >= 4) {
       baseFolder = `/images/tours/${parts[3]}`;
       baseName = parts[3];
    }
  }

  // Kết hợp dữ liệu thật từ Backend (Tên, Ảnh, Giá, Lịch trình) với giao diện thiết kế sẵn
  const mockTour = {
    id: backendTour.id,
    categoryId: backendTour.categoryId,
    title: backendTour.name,
    location: backendTour.destination?.name || 'Chưa rõ',
    price: backendTour.price,
    originalPrice: backendTour.price * 1.2,
    rating: 5.0,
    reviews: 124,
    image: backendTour.image,
    images: Array.isArray(backendTour.gallery) && backendTour.gallery.length > 0 ? backendTour.gallery : [
      backendTour.image || `${baseFolder}/${baseName} 1.jpg`,
      `${baseFolder}/${baseName} 2.jpg`,
      `${baseFolder}/${baseName} 3.jpg`,
      `${baseFolder}/${baseName} 4.jpg`,
      `${baseFolder}/${baseName} 5.jpg`
    ],
    overview: backendTour.overview || 'Chuyến đi sẽ đưa bạn khám phá những điểm đến tuyệt đẹp và trải nghiệm không thể quên. Tận hưởng không gian nghỉ ngơi thoải mái và các hoạt động thú vị, hòa mình vào thiên nhiên và văn hóa đặc sắc.',
    highlights: Array.isArray(backendTour.highlights) ? backendTour.highlights : [
      'Trải nghiệm đẳng cấp và dịch vụ chuyên nghiệp suốt hành trình.',
      'Khám phá các điểm check-in nổi tiếng và cảnh quan thiên nhiên hùng vĩ.',
      'Thưởng thức đặc sản địa phương phong phú và đa dạng.',
      'Tìm hiểu văn hóa, lịch sử và đời sống của người dân bản địa.'
    ],
    itinerary: normalizedItinerary
  };

  const availableSeats = backendTour.schedules && backendTour.schedules.length > 0 
    ? backendTour.schedules[0].availableSeats 
    : 20;

  const isWishlisted = wishlistTours.some(t => t.id === mockTour.id);

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      openAuthPopup();
      return;
    }
    navigate(`/checkout/${id}`);
  };

  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      openAuthPopup();
      return;
    }

    toggleWishlist(mockTour);
    if (!isWishlisted) {
      setIsHeartAnimating(true);
      setTimeout(() => {
        setIsHeartAnimating(false);
        setIsWishlistOpen(true);
      }, 400);
    } else {
      setIsWishlistOpen(true);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user?.id) {
      openAuthPopup();
      return;
    }
    if (!newReview.comment.trim()) {
      setToastMessage('Vui lòng nhập nội dung đánh giá!');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          tourId: backendTour.id,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      if (res.ok) {
        // Lấy lại danh sách reviews
        const resReviews = await fetch(`http://localhost:3000/reviews/tour/${backendTour.id}`);
        if (resReviews.ok) setReviews(await resReviews.json());
        
        setNewReview({ rating: 5, comment: '' });
        setToastMessage('Cảm ơn bạn đã đánh giá!');
        setTimeout(() => setToastMessage(''), 2000);
      } else {
        setToastMessage('Có lỗi xảy ra khi gửi đánh giá');
        setTimeout(() => setToastMessage(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setToastMessage('Có lỗi xảy ra');
      setTimeout(() => setToastMessage(''), 2000);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Mock thêm các feedback ảo cho giao diện đỡ trống
  const fakeReviews = [
    {
      id: 'fake-1',
      user: { email: 'Nguyễn Văn A' },
      rating: 5,
      comment: 'Chuyến đi tuyệt vời! Cảnh quan hùng vĩ và dịch vụ chăm sóc khách hàng cực kỳ chu đáo. Chắc chắn sẽ giới thiệu cho bạn bè.',
      date: 'Tháng 8 năm 2026',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'fake-2',
      user: { email: 'Trần Thị B' },
      rating: 4,
      comment: 'Hướng dẫn viên nhiệt tình, đồ ăn ngon và phong phú. Tuy nhiên thời gian di chuyển hơi dài một chút, nhưng nhìn chung là một trải nghiệm đáng nhớ.',
      date: 'Tháng 7 năm 2026',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    }
  ];

  const allReviews = [...reviews, ...fakeReviews];

  // Tính rating trung bình từ DB + Fake
  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1) 
    : 5.0;

  return (
    <div className="bg-gray-50 pb-20 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* 1. KHỐI HEADER - BỘ SƯU TẬP ẢNH (GALLERY) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        <div className="relative rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px]">
          {/* Ảnh lớn bên trái */}
          <div 
            className="md:col-span-2 md:row-span-2 relative group cursor-pointer"
            onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}
          >
            <img 
              src={mockTour.images[0]} 
              alt="Main tour" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800' }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
          </div>
          
          {/* 4 ảnh nhỏ bên phải */}
          {mockTour.images.slice(1).map((img, index) => (
            <div 
              key={index} 
              className="hidden md:block relative group cursor-pointer overflow-hidden"
              onClick={() => { setGalleryIndex(index + 1); setIsGalleryOpen(true); }}
            >
              <img 
                src={img} 
                alt={`Gallery ${index}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                onError={(e) => { e.target.src = mockTour.images[0] }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            </div>
          ))}

          {/* Nút xem tất cả ảnh */}
          <button 
            onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}
            className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-xl font-bold text-slate-900 flex items-center gap-2 shadow-lg hover:bg-white hover:scale-105 transition-all"
          >
            <ImageIcon className="w-5 h-5" />
            Xem tất cả ảnh
          </button>
        </div>
      </section>

      <ImageGalleryModal 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        images={mockTour.images} 
        initialIndex={galleryIndex} 
      />

      {/* 2. BỐ CỤC CHÍNH (2 CỘT) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* CỘT TRÁI (70%) - NỘI DUNG VÀ TIMELINE */}
          <div className="w-full lg:w-[70%]">
            {/* Tour Info */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-3">
                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {mockTour.location}
                </span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {mockTour.rating} <span className="text-gray-500 font-normal underline cursor-pointer">({mockTour.reviews} đánh giá)</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                {mockTour.title}
              </h1>
              <div className="flex flex-wrap gap-4 border-b border-gray-200 pb-8">
                <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <span className="font-medium">3 Ngày 2 Đêm</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                  <Check className="w-5 h-5 text-teal-600" />
                  <span className="font-medium">Hoàn hủy miễn phí</span>
                </div>
              </div>
            </div>

            {/* Về chuyến đi này (Overview) */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Về chuyến đi này</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {mockTour.overview}
              </p>
              
              {mockTour.images[1] && (
                <div className="rounded-2xl overflow-hidden mb-8 shadow-sm bg-gray-100 flex items-center justify-center">
                   <img src={mockTour.images[1]} alt="Tour overview" className="w-full max-h-[500px] object-contain hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = mockTour.images[0] }} />
                </div>
              )}

              <ul className="space-y-4 mb-8">
                {mockTour.highlights.map((highlight, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
              
              <div className="grid grid-cols-2 gap-4">
                 {mockTour.images[2] && (
                   <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                      <img src={mockTour.images[2]} alt="Detail 1" className="w-full max-h-[300px] object-contain hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = mockTour.images[0] }} />
                   </div>
                 )}
                 {mockTour.images[3] && (
                   <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                      <img src={mockTour.images[3]} alt="Detail 2" className="w-full max-h-[300px] object-contain hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = mockTour.images[0] }} />
                   </div>
                 )}
              </div>
            </div>

            {/* Timeline Lịch Trình (Interactive) */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Lịch trình chi tiết</h2>
              <div className="space-y-8">
                {mockTour.itinerary.map((day, dIndex) => (
                  <div key={dIndex} className="relative pl-6 md:pl-8 border-l-2 border-teal-100">
                    {/* Điểm Node ngày */}
                    <div className="absolute -left-[11px] top-1 w-5 h-5 bg-teal-500 rounded-full border-4 border-white shadow-sm"></div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm">{day.day}</span>
                        {day.title}
                      </h3>
                    </div>

                    {/* Các hoạt động trong ngày */}
                    <div className="space-y-4">
                      {day.activities.map((act, aIndex) => (
                        <div 
                          key={aIndex} 
                          className="group flex gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            {act.icon === 'MapPin' && <MapPin className="w-6 h-6" />}
                            {act.icon === 'Clock' && <Clock className="w-6 h-6" />}
                            {act.icon === 'Sun' && <Sun className="w-6 h-6" />}
                            {act.icon === 'Coffee' && <Coffee className="w-6 h-6" />}
                            {!['MapPin', 'Clock', 'Sun', 'Coffee'].includes(act.icon) && <MapPin className="w-6 h-6" />}
                          </div>
                          <div>
                            <div className="font-bold text-teal-600 mb-1">{act.time}</div>
                            <p className="text-gray-600 font-medium">{act.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Đánh giá của khách hàng (Reviews) */}
            <div className="mt-16 pt-10 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-10">
                <Star className="w-7 h-7 text-slate-900 fill-slate-900" />
                <h2 className="text-2xl font-bold text-slate-900">
                  {averageRating} · {reviews.length} đánh giá
                </h2>
              </div>

              {/* Form Viết Đánh Giá (Đơn giản) */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10">
                <h3 className="font-bold text-slate-900 mb-4">Viết đánh giá của bạn</h3>
                {isLoggedIn ? (
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chấm điểm:</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                              newReview.rating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                            }`}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <textarea 
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        rows="3"
                        placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi này..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmittingReview}
                      className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                  </form>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Vui lòng <button onClick={openAuthPopup} className="text-teal-600 font-bold hover:underline">đăng nhập</button> để viết đánh giá.
                  </p>
                )}
              </div>

              {/* Danh sách Đánh giá */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {allReviews.map(review => (
                  <div key={review.id} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      {review.avatar ? (
                        <img src={review.avatar} alt={review.user?.email} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg uppercase shadow-sm">
                          {review.user?.email?.[0] || 'U'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900">{review.user?.email?.split('@')[0] || 'Khách hàng'}</div>
                        <div className="text-sm text-gray-500">{review.date || 'Khách du lịch VibeTravel'}</div>
                      </div>
                    </div>
                    <div>
                       <div className="flex items-center gap-2 text-sm text-gray-800 font-medium mb-2">
                          <div className="flex">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-slate-900 fill-slate-900' : 'text-gray-300'}`} />
                             ))}
                          </div>
                       </div>
                       <p className="text-gray-700 leading-relaxed">"{review.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {allReviews.length > 4 && (
                <button className="mt-10 px-6 py-3 border border-slate-900 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition-colors">
                  Hiển thị tất cả {allReviews.length} đánh giá
                </button>
              )}
            </div>
          </div>

          {/* CỘT PHẢI (30%) - STICKY BOOKING CARD */}
          <div className="w-full lg:w-[30%]">
            <div className="sticky top-28 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="mb-6">
                <div className="text-gray-400 line-through text-lg font-medium mb-1">
                  {mockTour.originalPrice.toLocaleString()}đ
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-orange-500 tracking-tight">
                    {mockTour.price.toLocaleString()}đ
                  </span>
                  <span className="text-gray-500 font-medium mb-1">/ khách</span>
                </div>
              </div>
              
              {/* Hiển thị số chỗ còn trống */}
              <div className="mb-6 bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 font-bold" />
                  </div>
                  <span className="font-bold text-orange-800">Số chỗ còn trống</span>
                </div>
                <div className="text-xl font-extrabold text-orange-600">
                  {availableSeats} <span className="text-sm font-medium text-orange-700">chỗ</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-4">
                <button 
                  onClick={handleBookingClick}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 flex justify-center items-center gap-2"
                >
                  Đặt ngay
                </button>
                
                {/* Collaborative Wishlist Button */}
                <button 
                  onClick={handleWishlistClick}
                  className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-base font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2 group relative overflow-hidden"
                >
                  {isHeartAnimating && (
                    <span className="absolute w-20 h-20 bg-teal-200 rounded-full animate-ping opacity-50"></span>
                  )}
                  <Heart className={`w-5 h-5 transition-colors relative z-10 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'group-hover:fill-teal-600 group-hover:text-teal-600'}`} />
                  <span className="relative z-10">{isWishlisted ? 'Đã thêm vào Wishlist' : 'Thêm vào Wishlist chung'}</span>
                </button>
              </div>

              {/* Extra Info */}
              <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <Check className="w-5 h-5 text-green-500" /> Xác nhận tức thì
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <Check className="w-5 h-5 text-green-500" /> Không phí ẩn
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 3. KHỐI GỢI Ý TOUR TƯƠNG TỰ */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-20 border-t border-gray-200 pt-16">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-10 tracking-tight">Khám phá thêm các trải nghiệm tương tự</h2>

        {/* Lưới Tour */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {similarTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TourDetail;
