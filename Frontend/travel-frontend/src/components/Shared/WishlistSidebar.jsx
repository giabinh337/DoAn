import React, { useState, useEffect } from 'react';
import { X, Users, Link as LinkIcon, Plus, UserPlus, Heart, Trash2, Crown } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';

const WishlistSidebar = () => {
  const { wishlistTours, isWishlistOpen, setIsWishlistOpen, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [invited, setInvited] = useState(false);

  // Danh sách bạn bè ảo (Mock)
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'Hải Đăng', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { id: 2, name: 'Minh Thư', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  ]);

  // Thông tin user hiện tại
  const currentUser = {
    id: user?.id || 0,
    name: user?.name || 'Bạn',
    avatar: `https://ui-avatars.com/api/?name=${user?.name || 'B'}&background=f97316&color=fff`
  };

  // State quản lý chế độ Bỏ phiếu
  const [isVotingMode, setIsVotingMode] = useState(false);
  
  // State quản lý lượt vote: { tourId: [ {id, name, avatar} ] }
  const [tourVotes, setTourVotes] = useState({});

  // Reset voting mode khi tắt sidebar
  useEffect(() => {
    if (!isWishlistOpen) {
      setIsVotingMode(false);
      setTourVotes({});
    }
  }, [isWishlistOpen]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (email) {
      const newName = email.split('@')[0];
      const newFriend = {
        id: Date.now(),
        name: newName,
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
      };
      setCollaborators([...collaborators, newFriend]);
      setInvited(true);
      setEmail('');
      setTimeout(() => setInvited(false), 3000);
    }
  };

  const handleVote = (tourId) => {
    // 1. Thêm vote của người dùng hiện tại
    setTourVotes(prev => {
      const currentVotes = prev[tourId] || [];
      // Tránh vote trùng
      if (currentVotes.find(v => v.id === currentUser.id)) return prev;
      return { ...prev, [tourId]: [...currentVotes, currentUser] };
    });

    // 2. GIẢ LẬP (MOCKING): Bạn bè tự động vote sau 1-2 giây
    setTimeout(() => {
      if (wishlistTours.length > 0) {
        // Random chọn 1 người bạn
        const randomFriend = collaborators[Math.floor(Math.random() * collaborators.length)];
        // Random chọn 1 tour bất kỳ trong wishlist để vote
        const randomTour = wishlistTours[Math.floor(Math.random() * wishlistTours.length)];
        
        setTourVotes(prev => {
          const currentVotes = prev[randomTour.id] || [];
          if (currentVotes.find(v => v.id === randomFriend.id)) return prev;
          return { ...prev, [randomTour.id]: [...currentVotes, randomFriend] };
        });
      }
    }, 1500 + Math.random() * 1000); // Đợi 1.5 - 2.5s
  };

  // Tính toán Tour đang dẫn đầu
  const getTopVotedTourId = () => {
    let maxVotes = 0;
    let topTourId = null;
    
    Object.entries(tourVotes).forEach(([tourId, votes]) => {
      if (votes.length > maxVotes && votes.length > 0) {
        maxVotes = votes.length;
        topTourId = Number(tourId);
      }
    });
    return topTourId;
  };

  const topTourId = getTopVotedTourId();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 z-50 ${isWishlistOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col ${isWishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              Wishlist Chung
            </h2>
            <p className="text-gray-500 text-sm mt-1">Cùng bạn bè lên kế hoạch chuyến đi</p>
          </div>
          <button 
            onClick={() => setIsWishlistOpen(false)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Members */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" /> Thành viên ({collaborators.length + 1})
            </h3>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-3">
                <img src={currentUser.avatar} alt="Bạn" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-30" />
                {collaborators.map((c, i) => (
                  <img 
                    key={c.id} 
                    src={c.avatar} 
                    alt={c.name} 
                    title={c.name}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative"
                    style={{ zIndex: 20 - i }}
                  />
                ))}
              </div>
              <button className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-600 transition-colors bg-gray-50 relative z-10">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {!isVotingMode && (
              <>
                <form onSubmit={handleInvite} className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserPlus className="w-4 h-4 text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Nhập email bạn bè..." 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    />
                  </div>
                  <button type="submit" className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                    Mời
                  </button>
                </form>
                {invited && <p className="text-teal-600 text-xs mt-2 font-medium animate-pulse">Đã gửi lời mời thành công!</p>}
                
                <div className="mt-4">
                   <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors">
                     <LinkIcon className="w-4 h-4" /> Sao chép link chia sẻ
                   </button>
                </div>
              </>
            )}
          </section>

          <hr className="border-gray-100" />

          {/* Saved Tours */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>{isVotingMode ? 'Đang Bỏ Phiếu' : `Đã lưu (${wishlistTours.length})`}</span>
              {!isVotingMode && <span className="text-xs text-gray-400 normal-case font-normal">Chỉ nhóm mới xem được</span>}
            </h3>

            <div className="space-y-4">
              {wishlistTours.map(tour => {
                const votes = tourVotes[tour.id] || [];
                const hasVoted = votes.find(v => v.id === currentUser.id);
                const isTop = topTourId === tour.id;

                return (
                  <div key={tour.id} className={`bg-white border rounded-2xl p-3 shadow-sm transition-all relative flex flex-col gap-3 ${isTop && isVotingMode ? 'border-amber-400 ring-2 ring-amber-100' : 'border-gray-100 hover:shadow-md group'}`}>
                    
                    {/* Badge Top 1 */}
                    {isTop && isVotingMode && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10 animate-bounce">
                        <Crown className="w-3 h-3" /> TOP 1
                      </div>
                    )}

                    <div className="flex gap-4">
                      <img src={tour.image} alt={tour.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">{tour.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{tour.location}</p>
                        </div>
                        <div className="font-extrabold text-orange-500 text-sm">
                          {tour.price.toLocaleString()}đ
                        </div>
                      </div>

                      {/* Action Button (Delete vs Vote) */}
                      {!isVotingMode ? (
                        <button 
                          onClick={() => removeFromWishlist(tour.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-gray-100"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleVote(tour.id)}
                          disabled={hasVoted}
                          className={`self-center shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 shadow-sm ${
                            hasVoted 
                              ? 'bg-rose-50 border-rose-200 cursor-not-allowed' 
                              : 'bg-white border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-400 hover:text-rose-500'
                          }`}
                        >
                           <Heart className={`w-6 h-6 transition-transform ${hasVoted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Hiển thị Avatar người Vote */}
                    {isVotingMode && votes.length > 0 && (
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                        <div className="flex -space-x-2">
                          {votes.map((v, idx) => (
                            <img 
                              key={idx} 
                              src={v.avatar} 
                              alt={v.name} 
                              title={v.name}
                              className="w-6 h-6 rounded-full border border-white object-cover animate-in zoom-in" 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{votes.length} lượt vote</span>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {wishlistTours.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Chưa có tour nào trong Wishlist chung.</p>
                </div>
              )}
            </div>
          </section>

        </div>
        
        {/* Footer */}
        {wishlistTours.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto shrink-0">
             {!isVotingMode ? (
               <button 
                 onClick={() => setIsVotingMode(true)}
                 className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/20 transition-all flex justify-center items-center gap-2"
               >
                 Bắt đầu vote chốt tour
               </button>
             ) : (
               <button 
                 onClick={() => setIsVotingMode(false)}
                 className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/20 transition-all flex justify-center items-center gap-2"
               >
                 Kết thúc Bỏ phiếu
               </button>
             )}
          </div>
        )}

      </div>
    </>
  );
};

export default WishlistSidebar;
