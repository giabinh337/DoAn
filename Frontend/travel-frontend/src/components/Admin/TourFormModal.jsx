import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import AddDestinationModal from './AddDestinationModal';

const TourFormModal = ({ isOpen, onClose, onSuccess, tourData = null }) => {
  const isEditMode = !!tourData;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    destinationId: '',
    overview: '',
    highlights: ''
  });
  
  // Itinerary builder state
  const [itinerary, setItinerary] = useState([
    { day: "Ngày 1", title: "", activityDesc: "" }
  ]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [oldGallery, setOldGallery] = useState([]); // Giữ lại ảnh cũ khi edit nếu không tải lên ảnh mới

  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isAddingDest, setIsAddingDest] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategoriesAndDestinations();
      if (tourData) {
        // Edit mode
        setFormData({
          name: tourData.name || '',
          price: tourData.price || '',
          categoryId: tourData.categoryId || '',
          destinationId: tourData.destinationId || '',
          overview: tourData.overview || '',
          highlights: Array.isArray(tourData.highlights) ? tourData.highlights.join(', ') : ''
        });
        
        // Parse itinerary from old data if exists
        if (Array.isArray(tourData.itinerary) && tourData.itinerary.length > 0) {
          const parsedItinerary = tourData.itinerary.map(item => ({
            day: item.day || '',
            title: item.title || '',
            activityDesc: item.activities && item.activities[0] ? item.activities[0].desc : ''
          }));
          setItinerary(parsedItinerary);
        } else {
          setItinerary([{ day: "Ngày 1", title: "", activityDesc: "" }]);
        }

        // Keep old gallery images
        if (Array.isArray(tourData.gallery)) {
          setOldGallery(tourData.gallery);
          setPreviewUrls(tourData.gallery); // show old images as preview
        } else if (tourData.image) {
          setOldGallery([tourData.image]);
          setPreviewUrls([tourData.image]);
        }
      } else {
        // Add mode
        setFormData({ name: '', price: '', categoryId: '', destinationId: '', overview: '', highlights: '' });
        setItinerary([{ day: "Ngày 1", title: "", activityDesc: "" }]);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setOldGallery([]);
      }
    }
  }, [isOpen, tourData]);

  const fetchCategoriesAndDestinations = async () => {
    try {
      const [catRes, destRes] = await Promise.all([
        fetch('http://localhost:3000/tour/categories'),
        fetch('http://localhost:3000/tour/destinations')
      ]);
      const catData = await catRes.json();
      const destData = await destRes.json();
      setCategories(catData);
      setDestinations(destData);
      
      // Select first if adding new
      if (!tourData) {
        if (catData.length > 0) setFormData(prev => ({ ...prev, categoryId: catData[0].id }));
        if (destData.length > 0) setFormData(prev => ({ ...prev, destinationId: destData[0].id }));
      }
    } catch (e) {
      console.error("Lỗi fetch lookup data", e);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItineraryChange = (index, field, value) => {
    const newItin = [...itinerary];
    newItin[index][field] = value;
    setItinerary(newItin);
  };

  const addItineraryDay = () => {
    setItinerary([...itinerary, { day: `Ngày ${itinerary.length + 1}`, title: "", activityDesc: "" }]);
  };

  const removeItineraryDay = (index) => {
    const newItin = itinerary.filter((_, i) => i !== index);
    // re-number days
    newItin.forEach((item, i) => { item.day = `Ngày ${i + 1}` });
    setItinerary(newItin);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Nếu chọn file mới, xóa preview của ảnh cũ đi (chỉ dùng ảnh mới)
    if (selectedFiles.length === 0 && oldGallery.length > 0) {
      setPreviewUrls([]); // Clear old previews
    }

    setSelectedFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    // Nếu đang show oldGallery (không có file upload mới)
    if (selectedFiles.length === 0 && oldGallery.length > 0) {
      const newOldGallery = oldGallery.filter((_, i) => i !== index);
      setOldGallery(newOldGallery);
      setPreviewUrls(newOldGallery);
      return;
    }

    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddDestinationSuccess = (newDest) => {
    setDestinations(prev => [...prev, newDest]);
    setFormData(prev => ({ ...prev, destinationId: newDest.id }));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return oldGallery; // Dùng ảnh cũ nếu không up ảnh mới
    
    const uploadData = new FormData();
    selectedFiles.forEach(file => {
      uploadData.append('files', file);
    });

    const res = await fetch('http://localhost:3000/upload/images', {
      method: 'POST',
      body: uploadData
    });
    
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    // Nếu upload ảnh mới, ta có thể nối thêm hoặc đè. Ở đây ta đè lên ảnh cũ cho dễ quản lý.
    return data.urls; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalGallery = [];
      if (selectedFiles.length > 0) {
        finalGallery = await uploadImages();
      } else {
        finalGallery = oldGallery;
      }

      const formattedItinerary = itinerary.map(item => ({
        day: item.day,
        title: item.title || "Tự do khám phá",
        activities: [{
          time: "08:00",
          desc: item.activityDesc || "Hoạt động tự do",
          icon: "MapPin"
        }]
      }));

      const highlightsArray = formData.highlights.split(',').map(h => h.trim()).filter(h => h !== '');
      const mainImage = finalGallery.length > 0 ? finalGallery[0] : undefined;

      const payload = {
        name: formData.name,
        image: mainImage,
        gallery: finalGallery,
        overview: formData.overview,
        highlights: highlightsArray,
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        destinationId: Number(formData.destinationId),
        itinerary: formattedItinerary
      };

      const url = isEditMode ? `http://localhost:3000/tour/${tourData.id}` : 'http://localhost:3000/tour';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSuccess(); 
        onClose(); 
      } else {
        alert('Có lỗi xảy ra khi lưu vào Database.');
      }
    } catch (err) {
      alert('Đã xảy ra lỗi (Có thể do dung lượng ảnh lớn hoặc mất kết nối).');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{isEditMode ? 'Chỉnh Sửa Tour' : 'Thêm Tour Mới'}</h2>
              <p className="text-sm text-gray-500 mt-1">Dữ liệu sẽ được lưu trực tiếp vào hệ thống</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors bg-white shadow-sm border border-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* THÔNG TIN CƠ BẢN */}
            <div className="space-y-4">
              <h3 className="font-bold text-teal-600 border-b border-teal-100 pb-2">1. Thông tin cơ bản</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên Tour nổi bật</label>
                <input 
                  required type="text" name="name" 
                  value={formData.name} onChange={handleChange}
                  placeholder="VD: Tour Sapa 3N2Đ săn mây cực chất" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Giá tiền (VNĐ)</label>
                  <input 
                    required type="number" name="price" min="0" 
                    value={formData.price} onChange={handleChange}
                    placeholder="VD: 2500000" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Danh Mục</label>
                  <select 
                    name="categoryId" value={formData.categoryId} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-bold text-gray-700">Điểm Đến</label>
                  <button 
                    type="button" onClick={() => setIsAddingDest(true)}
                    className="text-xs font-bold text-teal-600 flex items-center hover:text-teal-700 bg-teal-50 px-2 py-1 rounded-md"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Thêm mới
                  </button>
                </div>
                <select 
                  name="destinationId" value={formData.destinationId} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
                >
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ALBUM ẢNH */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-teal-600 border-b border-teal-100 pb-2">2. Hình ảnh</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Album Ảnh (Gallery)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-teal-500 cursor-pointer transition-colors"
                >
                  <Upload className="w-8 h-8 mb-2 text-teal-600" />
                  <p className="font-medium">Nhấn để tải ảnh lên (Hỗ trợ nhiều ảnh)</p>
                  <p className="text-xs mt-1">Sẽ thay thế ảnh cũ nếu bạn tải lên ảnh mới</p>
                </div>
                <input 
                  type="file" multiple accept="image/*" 
                  className="hidden" ref={fileInputRef} onChange={handleFileSelect}
                />
                
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-0 inset-x-0 bg-teal-600/90 text-white text-[10px] text-center py-1 font-bold">
                            ẢNH CHÍNH
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CHI TIẾT TOUR */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-teal-600 border-b border-teal-100 pb-2">3. Chi tiết & Trải nghiệm</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tổng quan Tour (Overview)</label>
                <textarea 
                  name="overview" rows="3"
                  value={formData.overview} onChange={handleChange}
                  placeholder="Giới thiệu chung về chuyến đi này..." 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none resize-none" 
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Điểm nổi bật (Highlights)</label>
                <input 
                  type="text" name="highlights" 
                  value={formData.highlights} onChange={handleChange}
                  placeholder="Cách nhau bằng dấu phẩy. VD: Khám phá thiên nhiên hùng vĩ, Ẩm thực đa dạng" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none" 
                />
                <p className="text-xs text-gray-500 mt-1">Mỗi điểm sẽ hiển thị kèm một dấu check màu xanh lục.</p>
              </div>
            </div>

            {/* LỊCH TRÌNH (ITINERARY) */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center border-b border-teal-100 pb-2">
                <h3 className="font-bold text-teal-600">4. Xây dựng Lịch trình</h3>
                <button type="button" onClick={addItineraryDay} className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md hover:bg-teal-100 flex items-center">
                  <Plus className="w-3 h-3 mr-1" /> Thêm Ngày
                </button>
              </div>
              
              <div className="space-y-3">
                {itinerary.map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                    {itinerary.length > 1 && (
                      <button type="button" onClick={() => removeItineraryDay(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-rose-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="font-bold text-slate-800 mb-2">{item.day}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <input 
                          type="text" placeholder="Tiêu đề (VD: Khởi hành)" 
                          value={item.title} onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <input 
                          type="text" placeholder="Hoạt động chính (VD: 08:00 - Đón khách tại bến xe)" 
                          value={item.activityDesc} onChange={(e) => handleItineraryChange(idx, 'activityDesc', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </form>

          <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50/50 shrink-0">
            <button 
              type="button" onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 transition-colors shadow-sm"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-600/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật Tour' : 'Lưu Tour Này')}
            </button>
          </div>
        </div>
      </div>

      <AddDestinationModal 
        isOpen={isAddingDest} 
        onClose={() => setIsAddingDest(false)} 
        onSuccess={handleAddDestinationSuccess} 
      />
    </>
  );
};

export default TourFormModal;
