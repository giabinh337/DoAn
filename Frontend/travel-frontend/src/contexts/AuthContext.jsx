import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Lưu toàn bộ thông tin user (gồm cả id)

  // Hàm giải mã Token đơn giản
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // Khi trang web vừa tải, kiểm tra xem có thẻ Token lưu trong máy không
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      const decoded = decodeToken(token);
      if (decoded) {
        setUser({ id: decoded.userId, email: decoded.email, role: decoded.role });
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    setIsLoggedIn(true);
    const decoded = decodeToken(token);
    if (decoded) {
      setUser({ id: decoded.userId, email: decoded.email, role: decoded.role });
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setUser(null);
  };

  const openAuthPopup = () => setIsAuthPopupOpen(true);
  const closeAuthPopup = () => setIsAuthPopupOpen(false);

  const openMyBookings = () => setIsMyBookingsOpen(true);
  const closeMyBookings = () => setIsMyBookingsOpen(false);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user,
      login, 
      logout,
      isAuthPopupOpen,
      openAuthPopup,
      closeAuthPopup,
      isMyBookingsOpen,
      openMyBookings,
      closeMyBookings
    }}>
      {children}
    </AuthContext.Provider>
  );
};
