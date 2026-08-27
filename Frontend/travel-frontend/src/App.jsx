import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import TourDetail from './pages/TourDetail';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tour/:id" element={<TourDetail />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </MainLayout>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
