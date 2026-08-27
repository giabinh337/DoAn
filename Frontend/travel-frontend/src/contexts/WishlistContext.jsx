import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistTours, setWishlistTours] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  // Load wishlist from localStorage khi đăng nhập
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      const saved = localStorage.getItem(`wishlist_${user.email}`);
      if (saved) {
        setWishlistTours(JSON.parse(saved));
      } else {
        setWishlistTours([]);
      }
    } else {
      setWishlistTours([]);
      setIsWishlistOpen(false);
    }
  }, [isLoggedIn, user?.email]);

  // Lưu wishlist vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlistTours));
    }
  }, [wishlistTours, isLoggedIn, user?.email]);

  const toggleWishlist = (tour) => {
    setWishlistTours(prev => {
      if (prev.find(t => t.id === tour.id)) {
        return prev.filter(t => t.id !== tour.id);
      }
      return [...prev, tour];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistTours(prev => prev.filter(t => t.id !== id));
  };

  return (
    <WishlistContext.Provider value={{
      wishlistTours,
      toggleWishlist,
      removeFromWishlist,
      isWishlistOpen,
      setIsWishlistOpen
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
