import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Tag, Package, Users, DollarSign, CheckCircle, XCircle, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import TourFormModal from '../components/Admin/TourFormModal';
import ConfirmOrderModal from '../components/Shared/ConfirmOrderModal';
import OrderDetailModal from '../components/Admin/OrderDetailModal';
import PromotionFormModal from '../components/Admin/PromotionFormModal';
import ConfirmDeleteModal from '../components/Shared/ConfirmDeleteModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('tours'); // 'tours' | 'orders' | 'promotions'
  
  const [tours, setTours] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [deleteTourId, setDeleteTourId] = useState(null);
  
  // State quản lý Modal
  const [confirmOrder, setConfirmOrder] = useState({ isOpen: false, order: null, newStatus: '' });
  const [viewingOrder, setViewingOrder] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [toursRes, ordersRes, promoRes, statsRes] = await Promise.all([
        fetch('http://localhost:3000/tour'),
        fetch('http://localhost:3000/orders'),
        fetch('http://localhost:3000/promotions'),
        fetch('http://localhost:3000/orders/stats')
      ]);
      
      if (!toursRes.ok || !ordersRes.ok) throw new Error('Không thể tải dữ liệu');
      
      setTours(await toursRes.json());
      setOrders(await ordersRes.json());
      setPromotions(promoRes.ok ? await promoRes.json() : []);
      setStats(statsRes.ok ? await statsRes.json() : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTour = (id) => {
    setDeleteTourId(id);
  };

  const executeDeleteTour = async () => {
    if (!deleteTourId) return;
    try {
      const response = await fetch(`http://localhost:3000/tour/${deleteTourId}`, { method: 'DELETE' });
      if (response.ok) {
        setTours(tours.filter(t => t.id !== deleteTourId));
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa!');
    } finally {
      setDeleteTourId(null);
    }
  };

  const handleAddPromotion = () => {
    setIsPromoModalOpen(true);
  };

  const handleDeletePromotion = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã này?')) return;
    try {
      const res = await fetch(`http://localhost:3000/promotions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPromotions(promotions.filter(p => p.id !== id));
      }
    } catch (err) {
      alert('Lỗi khi xóa!');
    }
  };

  const handleUpdateOrderStatus = (order, status) => {
    setConfirmOrder({ isOpen: true, order, newStatus: status });
  };

  const executeUpdateOrderStatus = async (reason) => {
    const { order, newStatus } = confirmOrder;
    if (!order) return;
    
    try {
      const payload = { status: newStatus };
      if (reason) payload.cancelReason = reason;

      const res = await fetch(`http://localhost:3000/orders/${order.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
      } else {
        alert('Cập nhật thất bại');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra');
    } finally {
      setConfirmOrder({ isOpen: false, order: null, newStatus: '' });
    }
  };

  // Thống kê Doanh thu từ API Backend
  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const cancelledOrders = stats?.cancelledOrders || 0;
  const totalPassengers = stats?.totalPassengers || 0;

  const pieData = [
    { name: 'Đã xử lý', value: orders.filter(o => o.status === 'CONFIRMED').length },
    { name: 'Chờ xử lý', value: orders.filter(o => o.status === 'PENDING').length },
    { name: 'Đã hủy', value: orders.filter(o => o.status === 'CANCELLED').length },
  ];
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Quản trị Hệ thống</h1>
          <p className="text-gray-500 mt-2">Theo dõi doanh thu, quản lý đơn hàng và dữ liệu Tour</p>
        </div>
      </div>

      {/* Thẻ Thống Kê (Statistics) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <DollarSign className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tổng Doanh Thu</p>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{totalRevenue.toLocaleString()}đ</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Package className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tổng Đơn Hàng</p>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{totalOrders} <span className="text-sm font-normal text-gray-400">đơn</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
            <XCircle className="w-7 h-7 text-rose-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Đơn Bị Hủy</p>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{cancelledOrders} <span className="text-sm font-normal text-gray-400">đơn</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Khách Phục Vụ</p>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{totalPassengers} <span className="text-sm font-normal text-gray-400">khách</span></p>
          </div>
        </div>
      </div>

      {/* Biểu đồ Doanh thu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Top Doanh Thu Theo Tour</h2>
          {stats?.revenueByTour && stats.revenueByTour.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.revenueByTour.slice(0, 5)} margin={{ top: 10, right: 10, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    tickFormatter={(val) => (val / 1000000) + 'M'}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [value.toLocaleString() + 'đ', 'Doanh thu']}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#0D9488" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500">Chưa có dữ liệu doanh thu</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Tổng Quan Trạng Thái</h2>
          {pieData.length > 0 ? (
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500">Chưa có dữ liệu đơn hàng</div>
          )}
        </div>
      </div>

      {/* Tabs Menu & Actions */}
      <div className="flex justify-between items-end mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('tours')}
            className={`pb-4 px-2 font-bold transition-colors border-b-2 ${
              activeTab === 'tours' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Quản lý Tour ({tours.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-bold transition-colors border-b-2 ${
              activeTab === 'orders' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Đơn Đặt Tour ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('promotions')}
            className={`pb-4 px-2 font-bold transition-colors border-b-2 ${
              activeTab === 'promotions' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Khuyến Mãi ({promotions.length})
          </button>
        </div>

        <div className="pb-3">
          {activeTab === 'tours' && (
            <button 
              onClick={() => { setEditingTour(null); setIsModalOpen(true); }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Thêm Tour Mới
            </button>
          )}
          {activeTab === 'promotions' && (
            <button 
              onClick={handleAddPromotion}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Thêm Khuyến Mãi
            </button>
          )}
        </div>
      </div>

      {/* Nội dung Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="p-10 text-center text-red-500">{error}</div>
        ) : (
          <>
            {/* TAB: TOURS */}
            {activeTab === 'tours' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-semibold">Tên Tour</th>
                      <th className="p-4 font-semibold">Mức Giá</th>
                      <th className="p-4 font-semibold">Danh Mục</th>
                      <th className="p-4 font-semibold">Điểm Đến</th>
                      <th className="p-4 font-semibold text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {tours.length === 0 && (
                      <tr><td colSpan="5" className="p-10 text-center text-gray-500">Chưa có dữ liệu Tour.</td></tr>
                    )}
                    {tours.map(tour => (
                      <tr key={tour.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={tour.image} alt={tour.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            <span className="font-bold text-slate-900 line-clamp-2">{tour.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-orange-500 font-bold">{tour.price.toLocaleString()}đ</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium text-xs">
                            <Tag className="w-3.5 h-3.5" /> {tour.category?.name}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-medium text-xs">
                            <MapPin className="w-3.5 h-3.5" /> {tour.destination?.name}
                          </span>
                        </td>
                        <td className="p-4 flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingTour(tour); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteTour(tour.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-semibold">Mã Đơn</th>
                      <th className="p-4 font-semibold">Khách Hàng</th>
                      <th className="p-4 font-semibold">Tour</th>
                      <th className="p-4 font-semibold">Tổng Tiền</th>
                      <th className="p-4 font-semibold">Trạng Thái</th>
                      <th className="p-4 font-semibold text-right">Duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {orders.length === 0 && (
                      <tr><td colSpan="6" className="p-10 text-center text-gray-500">Chưa có đơn đặt tour nào.</td></tr>
                    )}
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700">{order.orderCode}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{order.user?.email || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{order.passengers?.length || 0} khách</p>
                        </td>
                        <td className="p-4 text-slate-600 font-medium line-clamp-2 max-w-[200px]">
                          {order.schedule?.tour?.name}
                        </td>
                        <td className="p-4 text-orange-500 font-bold">{order.totalPrice.toLocaleString()}đ</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-bold text-xs ${
                            order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status === 'PENDING' ? 'Đang chờ' : 
                             order.status === 'CANCELLED' ? 'Từ chối' : order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2 items-center">
                            <button 
                              onClick={() => setViewingOrder(order)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            
                            {order.status === 'PENDING' ? (
                              <>
                                <button 
                                  onClick={() => handleUpdateOrderStatus(order, 'CONFIRMED')}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                                  title="Xác nhận đơn"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleUpdateOrderStatus(order, 'CANCELLED')}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                                  title="Từ chối đơn"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-gray-400 text-xs italic ml-2">Đã xử lý</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: PROMOTIONS */}
            {activeTab === 'promotions' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-semibold">Mã Khuyến Mãi</th>
                      <th className="p-4 font-semibold">Giá Trị Giảm</th>
                      <th className="p-4 font-semibold text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {promotions.length === 0 && (
                      <tr><td colSpan="3" className="p-10 text-center text-gray-500">Chưa có mã khuyến mãi nào.</td></tr>
                    )}
                    {promotions.map(promo => (
                      <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700">
                          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md border border-emerald-100">{promo.code}</span>
                        </td>
                        <td className="p-4 text-orange-500 font-bold">{promo.discountValue.toLocaleString()}đ</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDeletePromotion(promo.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <TourFormModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTour(null); }}
        onSuccess={() => fetchData()} 
        tourData={editingTour}
      />

      <ConfirmOrderModal 
        isOpen={confirmOrder.isOpen} 
        onClose={() => setConfirmOrder({ isOpen: false, order: null, newStatus: '' })} 
        onConfirm={executeUpdateOrderStatus}
        order={confirmOrder.order}
        newStatus={confirmOrder.newStatus}
      />
      
      <OrderDetailModal 
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        order={viewingOrder}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTourId}
        onClose={() => setDeleteTourId(null)}
        onConfirm={executeDeleteTour}
        title="Xóa Tour này?"
        message="Dữ liệu về Tour này sẽ bị xóa vĩnh viễn khỏi hệ thống. Bạn chắc chắn chứ?"
      />

      <PromotionFormModal 
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        onSuccess={() => fetchData()}
      />
    </div>
  );
};

export default AdminDashboard;
