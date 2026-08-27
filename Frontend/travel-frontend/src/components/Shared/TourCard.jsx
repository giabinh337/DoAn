import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart, ArrowRight, Scale } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';

const TourCard = ({ tour, onCompare, isCompared }) => {
  const { wishlistTours, toggleWishlist } = useWishlist();
  const { isLoggedIn, openAuthPopup } = useAuth();
  const isWishlisted = wishlistTours.some(t => t.id === tour.id);
  return (
    <Link 
      to={`/tour/${tour.id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col cursor-pointer block"
    >
      {/* Thumbnail */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={tour.image} 
          alt={tour.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm text-slate-800">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          {tour.rating} <span className="text-gray-400 font-medium">({tour.reviews})</span>
        </div>
        {/* Heart Icon */}
        <button 
          className="absolute top-4 right-4 w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm z-10"
          onClick={(e) => { 
            e.preventDefault(); 
            if (!isLoggedIn) {
              openAuthPopup();
              return;
            }
            toggleWishlist(tour);
          }}
        >
          <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-rose-500'}`} />
        </button>
        
        {/* Compare Button */}
        {onCompare && (
          <button 
            className={`absolute top-16 right-4 w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-sm z-10 ${isCompared ? 'bg-teal-600 text-white' : 'bg-white/70 hover:bg-white text-slate-600 hover:text-teal-600'}`}
            onClick={(e) => {
              e.preventDefault();
              onCompare(tour);
            }}
          >
            <Scale className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <div className="text-sm text-gray-500 mb-1 font-medium">
          {tour.vibe} • {tour.location}
        </div>
        <h3 className="font-bold text-lg text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">
          {tour.title}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">Đặt ngay hôm nay</span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">Xác nhận tức thời</span>
        </div>

        {/* Rating & Bookings */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
           <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1 shrink-0" />
           <span className="font-bold text-amber-500 mr-1">{tour.rating}</span>
           <span className="truncate">({tour.reviews}) • {tour.booked} Đã được đặt</span>
        </div>
        
        {/* Price and Action */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 mb-1">đ {tour.price.toLocaleString()}</span>
              {tour.discount > 0 && (
                <div className="flex items-center">
                   <span className="text-xs text-rose-500 border border-rose-200 bg-rose-50 px-2 py-0.5 rounded-md font-medium">
                     Sale • Giảm {tour.discount}%
                   </span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
