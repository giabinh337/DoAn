import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockTours = [
  // ĐÀ LẠT
  {
    categoryId: 2,
    location: 'Đà Lạt',
    name: 'Khám Phá Đà Lạt Mộng Mơ 3N2Đ',
    price: 2800000,
    overview: 'Hành trình khám phá thành phố sương mù Đà Lạt với những điểm đến lãng mạn. Bạn sẽ được tận hưởng không khí se lạnh đặc trưng, thưởng thức cà phê giữa rừng thông và check-in tại các vườn hoa rực rỡ.',
    highlights: [
      'Tham quan Thung Lũng Tình Yêu, Thác Datanla hoang sơ',
      'Thưởng thức đặc sản lẩu gà lá é, bánh ướt lòng gà',
      'Check-in Quảng trường Lâm Viên, Hồ Xuân Hương',
      'Thư giãn tại các quán cafe săn mây cực chill'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Khởi hành đến Đà Lạt", activities: [{ time: "08:00", desc: "Đón khách và di chuyển lên Đà Lạt", icon: "MapPin" }, { time: "15:00", desc: "Tham quan Thác Datanla", icon: "Sun" }, { time: "18:00", desc: "Ăn lẩu gà lá é và tự do dạo chợ đêm", icon: "Coffee" }] },
      { day: "Ngày 2", title: "Nét Đẹp Ngàn Hoa", activities: [{ time: "07:30", desc: "Ăn sáng và thưởng thức cafe", icon: "Coffee" }, { time: "09:00", desc: "Khám phá Thung Lũng Tình Yêu", icon: "Sun" }, { time: "15:00", desc: "Tham quan Vườn Dâu Tây", icon: "MapPin" }] },
      { day: "Ngày 3", title: "Tạm biệt Thành phố sương mù", activities: [{ time: "08:00", desc: "Mua sắm đặc sản chợ Đà Lạt", icon: "MapPin" }, { time: "12:00", desc: "Lên xe trở về", icon: "Clock" }] }
    ]
  },
  {
    categoryId: 4,
    location: 'Đà Lạt',
    name: 'Săn Mây Đà Lạt & Cắm Trại Đồi Đa Phú',
    price: 1950000,
    overview: 'Trải nghiệm ngủ lều, đốt lửa trại giữa đồi thông tĩnh lặng và thức dậy sớm để đón bình minh rực rỡ cùng biển mây bềnh bồng tại đồi Đa Phú.',
    highlights: [
      'Trải nghiệm cắm trại, BBQ tối giữa rừng thông',
      'Đón bình minh và săn mây từ sáng sớm trên đồi',
      'Tận hưởng không gian thiên nhiên thanh bình tuyệt đối'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Cắm Trại Rừng Thông", activities: [{ time: "14:00", desc: "Tập trung và di chuyển lên đồi Đa Phú", icon: "MapPin" }, { time: "18:00", desc: "Dựng lều, thưởng thức BBQ và đàn hát", icon: "Coffee" }] },
      { day: "Ngày 2", title: "Săn Biển Mây Đa Phú", activities: [{ time: "05:00", desc: "Dậy sớm săn mây và đón bình minh", icon: "Sun" }, { time: "07:30", desc: "Thưởng thức cafe sáng giữa rừng", icon: "Coffee" }, { time: "10:00", desc: "Thu dọn lều và kết thúc hành trình", icon: "Clock" }] }
    ]
  },

  // ĐÀ NẴNG
  {
    categoryId: 2,
    location: 'Đà Nẵng',
    name: 'Vi Vu Thành Phố Đáng Sống Đà Nẵng 4N3Đ',
    price: 4500000,
    overview: 'Khám phá "Thành phố đáng sống nhất Việt Nam" với cảnh quan thiên nhiên hài hòa giữa sông, núi, biển. Chiêm ngưỡng những cây cầu độc đáo và bán đảo Sơn Trà tuyệt đẹp.',
    highlights: [
      'Tham quan Bán đảo Sơn Trà, Chùa Linh Ứng',
      'Chiêm ngưỡng Cầu Rồng phun lửa, Cầu Tình Yêu',
      'Tắm biển Mỹ Khê - một trong những bãi biển đẹp nhất hành tinh',
      'Thưởng thức hải sản tươi sống và mì Quảng truyền thống'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Đón khách - Bán đảo Sơn Trà", activities: [{ time: "09:00", desc: "Đón sân bay và nhận phòng", icon: "Clock" }, { time: "15:00", desc: "Viếng Chùa Linh Ứng", icon: "Sun" }, { time: "19:00", desc: "Ngắm Cầu Rồng phun lửa", icon: "MapPin" }] },
      { day: "Ngày 2", title: "Biển Xanh Nắng Vàng", activities: [{ time: "08:00", desc: "Tắm biển Mỹ Khê", icon: "Sun" }, { time: "14:00", desc: "Tham quan Ngũ Hành Sơn", icon: "MapPin" }, { time: "19:00", desc: "Ăn tối hải sản biển", icon: "Coffee" }] },
      { day: "Ngày 3", title: "Khám Phá Thành Phố", activities: [{ time: "09:00", desc: "Tham quan chợ Hàn", icon: "MapPin" }, { time: "15:00", desc: "Tự do dạo phố và mua sắm", icon: "Clock" }] },
      { day: "Ngày 4", title: "Tạm biệt Đà Nẵng", activities: [{ time: "10:00", desc: "Trả phòng và tiễn khách", icon: "Clock" }] }
    ]
  },
  {
    categoryId: 4,
    location: 'Đà Nẵng',
    name: 'Biển Mỹ Khê & Khám Phá Bà Nà Hills Tiên Cảnh',
    price: 5200000,
    overview: 'Một hành trình đến với Bà Nà Hills "Đường lên tiên cảnh", check-in Cầu Vàng huyền thoại và vui chơi không giới hạn tại Fantasy Park, kết hợp nghỉ dưỡng biển Mỹ Khê.',
    highlights: [
      'Đi cáp treo đạt kỷ lục Guinness lên Bà Nà Hills',
      'Check-in Cầu Vàng - tuyệt tác kiến trúc thế giới',
      'Vui chơi tại công viên giải trí trong nhà Fantasy Park',
      'Trải nghiệm làng Pháp cổ kính giữa mây trời'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Khởi hành lên tiên cảnh", activities: [{ time: "08:00", desc: "Di chuyển đến cáp treo Bà Nà", icon: "MapPin" }, { time: "09:30", desc: "Check-in Cầu Vàng", icon: "Sun" }, { time: "12:00", desc: "Ăn trưa Buffet tại Làng Pháp", icon: "Coffee" }] },
      { day: "Ngày 2", title: "Vui chơi thả ga", activities: [{ time: "09:00", desc: "Khám phá hầm rượu Debay, Vườn hoa", icon: "Sun" }, { time: "14:00", desc: "Vui chơi tại Fantasy Park", icon: "Clock" }, { time: "18:00", desc: "Trở về trung tâm Đà Nẵng", icon: "MapPin" }] }
    ]
  },

  // HẠ LONG
  {
    categoryId: 2,
    location: 'Hạ Long',
    name: 'Trải Nghiệm Du Thuyền Vịnh Hạ Long 5 Sao 2N1Đ',
    price: 3600000,
    overview: 'Tận hưởng kỳ nghỉ sang trọng trên du thuyền 5 sao đẳng cấp. Bạn sẽ lênh đênh giữa hàng ngàn hòn đảo đá vôi kỳ vĩ của Di sản Thiên nhiên Thế giới Vịnh Hạ Long.',
    highlights: [
      'Nghỉ dưỡng phòng sang trọng trên du thuyền',
      'Thưởng thức các bữa ăn chuẩn nhà hàng Michelin',
      'Ngắm hoàng hôn và bình minh tuyệt đẹp trên Sundeck',
      'Tham gia lớp học nấu ăn, câu mực đêm'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Lên Du Thuyền", activities: [{ time: "12:00", desc: "Nhận phòng trên du thuyền", icon: "Clock" }, { time: "13:00", desc: "Ăn trưa và ngắm Vịnh", icon: "Coffee" }, { time: "17:00", desc: "Sunset party trên sundeck", icon: "Sun" }, { time: "20:00", desc: "Câu mực đêm", icon: "MapPin" }] },
      { day: "Ngày 2", title: "Đón Bình Minh Trên Vịnh", activities: [{ time: "06:00", desc: "Tập Thái Cực Quyền đón bình minh", icon: "Sun" }, { time: "08:00", desc: "Tham quan Hang Sửng Sốt", icon: "MapPin" }, { time: "11:30", desc: "Cập bến và kết thúc hành trình", icon: "Clock" }] }
    ]
  },
  {
    categoryId: 4,
    location: 'Hạ Long',
    name: 'Thám Hiểm Hang Động & Kayak Trên Vịnh Hạ Long',
    price: 2400000,
    overview: 'Chuyến phiêu lưu lý tưởng cho những ai thích khám phá. Bạn sẽ tự tay chèo Kayak luồn lách qua các hang động và bãi tắm hoang sơ giữa kỳ quan Hạ Long.',
    highlights: [
      'Khám phá Hang Sửng Sốt - hang động lớn nhất Hạ Long',
      'Chèo Kayak tại Hang Luồn, ngắm khỉ hoang dã',
      'Tắm biển tại đảo Ti Tốp và leo núi ngắm toàn cảnh Vịnh'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Hành Trình Bắt Đầu", activities: [{ time: "08:00", desc: "Đón khách tại Cảng Tuần Châu", icon: "MapPin" }, { time: "10:30", desc: "Khám phá Hang Sửng Sốt", icon: "Sun" }, { time: "14:00", desc: "Chèo Kayak tại Hang Luồn", icon: "Clock" }] },
      { day: "Ngày 2", title: "Đỉnh Ti Tốp Kêu Gọi", activities: [{ time: "09:00", desc: "Leo đỉnh Ti Tốp ngắm cảnh", icon: "Sun" }, { time: "11:00", desc: "Tắm biển", icon: "MapPin" }, { time: "14:00", desc: "Về lại bến cảng", icon: "Clock" }] }
    ]
  },

  // HÀ NỘI
  {
    categoryId: 2,
    location: 'Hà Nội',
    name: 'Hà Nội Trăm Năm Phố Cổ 2N1Đ',
    price: 1800000,
    overview: 'Một chuyến đi ngược dòng lịch sử để cảm nhận nhịp sống chậm rãi và nét văn hóa ngàn năm văn hiến của Thủ đô. Tham quan các di tích lịch sử và 36 phố phường.',
    highlights: [
      'Viếng Lăng Bác, Hồ Gươm, Đền Ngọc Sơn',
      'Ngồi xích lô dạo quanh 36 phố phường Hà Nội',
      'Tham quan Văn Miếu Quốc Tử Giám',
      'Thưởng thức bún chả, phở bò truyền thống'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Dấu ấn Lịch sử", activities: [{ time: "08:00", desc: "Viếng Lăng Bác, Chùa Một Cột", icon: "MapPin" }, { time: "14:00", desc: "Tham quan Văn Miếu Quốc Tử Giám", icon: "Sun" }, { time: "19:00", desc: "Dạo Hồ Gươm, thưởng thức kem Tràng Tiền", icon: "Coffee" }] },
      { day: "Ngày 2", title: "Nét Đẹp Phố Cổ", activities: [{ time: "09:00", desc: "Ngồi xích lô dạo Phố Cổ", icon: "Sun" }, { time: "12:00", desc: "Thưởng thức chả cá Lã Vọng", icon: "Coffee" }, { time: "15:00", desc: "Mua sắm chợ Đồng Xuân", icon: "MapPin" }] }
    ]
  },
  {
    categoryId: 3,
    location: 'Hà Nội',
    name: 'Trải Nghiệm Ẩm Thực Đường Phố Hà Nội Về Đêm',
    price: 750000,
    overview: 'Trải nghiệm ẩm thực đêm sôi động của Hà Nội. Dạo bước qua những con ngõ nhỏ phố cổ và nếm thử những món ăn đường phố đậm đà bản sắc.',
    highlights: [
      'Thưởng thức Phở cuốn Ngũ Xã, Nem chua rán Ngõ Tạm Thương',
      'Khám phá phố bia Tạ Hiện sầm uất',
      'Uống cafe trứng Giảng đặc sản Hà Thành'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Food Tour Bắt Đầu", activities: [{ time: "18:00", desc: "Tập trung tại Phố Cổ", icon: "MapPin" }, { time: "19:00", desc: "Thưởng thức Phở Cuốn", icon: "Coffee" }, { time: "20:30", desc: "Trải nghiệm Bia Tạ Hiện", icon: "Sun" }, { time: "22:00", desc: "Nhâm nhi Cafe Trứng", icon: "Coffee" }] }
    ]
  },

  // HUẾ
  {
    categoryId: 2,
    location: 'Huế',
    name: 'Hành Trình Về Thăm Cố Đô Huế 3N2Đ',
    price: 3200000,
    overview: 'Đến với Huế để lắng đọng tâm hồn giữa vẻ đẹp cổ kính của các lăng tẩm hoàng gia và kiến trúc triều Nguyễn, xen lẫn vẻ đẹp thơ mộng của dòng Hương Giang.',
    highlights: [
      'Tham quan Đại Nội Huế, Tử Cấm Thành',
      'Viếng Chùa Thiên Mụ, Lăng Tự Đức, Lăng Khải Định',
      'Thưởng thức ẩm thực Huế: bún bò, bánh bèo, nậm, lọc',
      'Dạo bước cầu Tràng Tiền lấp lánh về đêm'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Dấu ấn Hoàng gia", activities: [{ time: "13:00", desc: "Nhận phòng khách sạn", icon: "Clock" }, { time: "15:00", desc: "Tham quan Đại Nội Huế", icon: "Sun" }, { time: "19:00", desc: "Ăn tối bánh khoái, nem lụi", icon: "Coffee" }] },
      { day: "Ngày 2", title: "Lăng Tẩm Cổ Kính", activities: [{ time: "08:30", desc: "Viếng Chùa Thiên Mụ", icon: "MapPin" }, { time: "14:00", desc: "Khám phá Lăng Tự Đức, Khải Định", icon: "Sun" }, { time: "20:00", desc: "Dạo cầu Tràng Tiền", icon: "Clock" }] },
      { day: "Ngày 3", title: "Hương vị Xứ Huế", activities: [{ time: "08:00", desc: "Ăn sáng bún bò Huế", icon: "Coffee" }, { time: "10:00", desc: "Mua sắm chợ Đông Ba", icon: "MapPin" }, { time: "12:00", desc: "Kết thúc tour", icon: "Clock" }] }
    ]
  },
  {
    categoryId: 3,
    location: 'Huế',
    name: 'Thưởng Thức Nhã Nhạc Cung Đình & Sông Hương',
    price: 950000,
    overview: 'Một buổi tối đậm chất nghệ thuật cung đình. Ngồi thuyền rồng thả trôi trên sông Hương lộng gió và lắng nghe những điệu hò, điệu lý của Nhã nhạc Cung đình Huế.',
    highlights: [
      'Trải nghiệm đi thuyền rồng trên dòng sông Hương',
      'Nghe ca Huế và giao lưu cùng các nghệ nhân',
      'Thả hoa đăng cầu bình an'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Đêm Hoàng Cung", activities: [{ time: "18:00", desc: "Lên thuyền rồng tại bến Tòa Khâm", icon: "MapPin" }, { time: "19:00", desc: "Thưởng thức Nhã nhạc Cung đình", icon: "Sun" }, { time: "20:30", desc: "Thả hoa đăng trên sông Hương", icon: "Coffee" }, { time: "21:30", desc: "Kết thúc hành trình", icon: "Clock" }] }
    ]
  },

  // NHA TRANG
  {
    categoryId: 2,
    location: 'Nha Trang',
    name: 'Nghỉ Dưỡng Vinpearl & Biển Xanh Nha Trang 4N3Đ',
    price: 5800000,
    overview: 'Thỏa sức vui chơi và nghỉ dưỡng tại thiên đường biển Nha Trang với hệ thống cáp treo vượt biển và công viên giải trí VinWonders đẳng cấp quốc tế.',
    highlights: [
      'Nghỉ dưỡng tại Vinpearl Resort 5 sao',
      'Khám phá hàng trăm trò chơi tại VinWonders',
      'Trải nghiệm cáp treo vượt biển dài nhất thế giới',
      'Tắm biển Nha Trang trong xanh, cát trắng'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Check-in Đảo Ngọc", activities: [{ time: "12:00", desc: "Đón sân bay và di chuyển ra đảo Hòn Tre", icon: "MapPin" }, { time: "14:00", desc: "Nhận phòng Vinpearl", icon: "Clock" }, { time: "16:00", desc: "Tắm biển tự do", icon: "Sun" }] },
      { day: "Ngày 2", title: "Phá Đảo VinWonders", activities: [{ time: "09:00", desc: "Vui chơi công viên nước", icon: "Sun" }, { time: "14:00", desc: "Tham gia các trò chơi cảm giác mạnh", icon: "Clock" }, { time: "19:30", desc: "Xem nhạc nước hoành tráng", icon: "Coffee" }] },
      { day: "Ngày 3", title: "Thư Giãn Cùng Thiên Nhiên", activities: [{ time: "08:00", desc: "Tham quan Thủy Cung", icon: "MapPin" }, { time: "15:00", desc: "Trải nghiệm Spa chăm sóc sức khỏe", icon: "Coffee" }] },
      { day: "Ngày 4", title: "Kết thúc kỳ nghỉ", activities: [{ time: "10:00", desc: "Trả phòng và đi cáp treo về đất liền", icon: "Clock" }] }
    ]
  },
  {
    categoryId: 4,
    location: 'Nha Trang',
    name: 'Lặn Ngắm San Hô Kỳ Thú Đảo Hòn Mun',
    price: 1500000,
    overview: 'Khám phá thế giới đại dương huyền bí tại Hòn Mun - khu bảo tồn biển lớn nhất Việt Nam. Trải nghiệm lặn biển bình khí ngắm các rạn san hô đa dạng màu sắc.',
    highlights: [
      'Trải nghiệm lặn biển Scuba Diving có huấn luyện viên kèm',
      'Chiêm ngưỡng hàng trăm loài cá và san hô quý hiếm',
      'Thưởng thức tiệc bar nổi trên biển'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Chinh Phục Đại Dương", activities: [{ time: "08:00", desc: "Lên cano di chuyển ra Hòn Mun", icon: "MapPin" }, { time: "09:30", desc: "Học kỹ năng và thực hành lặn biển", icon: "Sun" }, { time: "12:00", desc: "Ăn trưa và tham gia Bar nổi", icon: "Coffee" }, { time: "15:00", desc: "Quay về đất liền", icon: "Clock" }] }
    ]
  },

  // PHÚ QUỐC
  {
    categoryId: 2,
    location: 'Phú Quốc',
    name: 'Khám Phá Đảo Ngọc Phú Quốc Toàn Diện 4N3Đ',
    price: 5200000,
    overview: 'Kỳ nghỉ tuyệt vời tại Đảo Ngọc Phú Quốc với những bãi biển hoang sơ, hải sản phong phú và văn hóa bản địa độc đáo. Một hành trình nghỉ dưỡng thực thụ.',
    highlights: [
      'Tham quan nhà tù Phú Quốc, Chùa Hộ Quốc',
      'Thư giãn tại Bãi Sao - bãi biển đẹp nhất Phú Quốc',
      'Khám phá cơ sở cấy ngọc trai, vườn tiêu, nhà thùng nước mắm',
      'Ngắm hoàng hôn tuyệt đẹp tại Sunset Sanato'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Chào Phú Quốc", activities: [{ time: "14:00", desc: "Nhận phòng khách sạn", icon: "Clock" }, { time: "16:30", desc: "Check-in Sunset Sanato ngắm hoàng hôn", icon: "Sun" }, { time: "19:00", desc: "Khám phá chợ đêm Dinh Cậu", icon: "MapPin" }] },
      { day: "Ngày 2", title: "Biển Xanh Cát Trắng", activities: [{ time: "09:00", desc: "Tham quan Cơ sở nuôi cấy ngọc trai", icon: "Coffee" }, { time: "14:00", desc: "Tắm biển Bãi Sao", icon: "Sun" }, { time: "16:00", desc: "Viếng Thiền viện Trúc Lâm Hộ Quốc", icon: "MapPin" }] },
      { day: "Ngày 3", title: "Khám Phá Nam Đảo", activities: [{ time: "08:30", desc: "Trải nghiệm cáp treo Hòn Thơm", icon: "Sun" }, { time: "15:00", desc: "Tham quan nhà tù Phú Quốc", icon: "MapPin" }] },
      { day: "Ngày 4", title: "Tạm biệt Đảo Ngọc", activities: [{ time: "09:00", desc: "Tham quan vườn tiêu, cơ sở nước mắm", icon: "Coffee" }, { time: "12:00", desc: "Tiễn sân bay", icon: "Clock" }] }
    ]
  },
  {
    categoryId: 4,
    location: 'Phú Quốc',
    name: 'Trải Nghiệm Đỉnh Cao Safari & Grand World',
    price: 3800000,
    overview: 'Hòa mình vào không gian sôi động của Bắc Đảo Phú Quốc. Trải nghiệm vườn thú mở bán hoang dã đầu tiên tại Việt Nam và "Thành phố không ngủ" Grand World.',
    highlights: [
      'Ngồi xe bus "nhốt người thả thú" tại Vinpearl Safari',
      'Chụp ảnh cùng các loài động vật hoang dã quý hiếm',
      'Dạo thuyền Gondola trên dòng kênh Venice tại Grand World',
      'Thưởng thức show diễn Tinh Hoa Việt Nam hoành tráng'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Thế giới Động Vật", activities: [{ time: "09:00", desc: "Tham quan Vinpearl Safari", icon: "MapPin" }, { time: "11:00", desc: "Trải nghiệm xe bus thú", icon: "Sun" }, { time: "15:00", desc: "Tự do vui chơi", icon: "Clock" }] },
      { day: "Ngày 2", title: "Thành phố Không Ngủ", activities: [{ time: "10:00", desc: "Tham quan Grand World, đi thuyền Venice", icon: "Sun" }, { time: "20:00", desc: "Xem show diễn Tinh Hoa Việt Nam", icon: "Coffee" }, { time: "22:00", desc: "Thưởng thức Sắc màu Venice", icon: "Clock" }] }
    ]
  },

  // PHÚ QUÝ
  {
    categoryId: 2,
    location: 'Phú Quý',
    name: 'Trải Nghiệm Biển Hoang Sơ Đảo Phú Quý 3N2Đ',
    price: 3100000,
    overview: 'Rời xa thành thị ồn ào, đến với hòn đảo Phú Quý bình yên và hoang sơ bậc nhất Bình Thuận. Tận hưởng làn nước trong vắt và khung cảnh hùng vĩ của thiên nhiên.',
    highlights: [
      'Check-in Phong Điện Phú Quý (cối xay gió)',
      'Khám phá Vịnh Triều Dương, Chùa Linh Sơn, Núi Cao Cát',
      'Thưởng thức cua Huỳnh Đế và hải sản tươi sống',
      'Cảm nhận nhịp sống chậm rãi, bình dị của người dân đảo'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Vượt Sóng Ra Đảo", activities: [{ time: "08:00", desc: "Đi tàu cao tốc ra đảo Phú Quý", icon: "MapPin" }, { time: "14:00", desc: "Nhận phòng và nghỉ ngơi", icon: "Clock" }, { time: "16:00", desc: "Tắm biển Vịnh Triều Dương", icon: "Sun" }] },
      { day: "Ngày 2", title: "Khám Phá Cảnh Quan Điển Hình", activities: [{ time: "08:00", desc: "Chinh phục núi Cao Cát", icon: "Sun" }, { time: "10:30", desc: "Viếng Chùa Linh Sơn", icon: "MapPin" }, { time: "16:00", desc: "Check-in cánh đồng Phong Điện", icon: "Coffee" }] },
      { day: "Ngày 3", title: "Chia tay Đảo ngọc", activities: [{ time: "07:00", desc: "Dạo chợ cá buổi sáng", icon: "Coffee" }, { time: "10:00", desc: "Lên tàu trở về đất liền", icon: "Clock" }] }
    ]
  },
  {
    categoryId: 4,
    location: 'Phú Quý',
    name: 'Chinh Phục Gành Hang & Lặn Biển Bãi Nhỏ',
    price: 1950000,
    overview: 'Dành cho những tâm hồn đam mê xê dịch, hành trình leo núi, len lỏi qua các vách đá Gành Hang và lặn ngắm san hô tại hồ vô cực tự nhiên tuyệt đẹp.',
    highlights: [
      'Chinh phục vách đá Gành Hang hùng vĩ',
      'Tắm "hồ vô cực" tự nhiên giữa biển khơi',
      'Trải nghiệm chèo SUP và lặn biển ngắm san hô'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Chinh Phục Thiên Nhiên", activities: [{ time: "08:30", desc: "Trekking nhẹ nhàng ra Gành Hang", icon: "MapPin" }, { time: "10:00", desc: "Tắm hồ bơi tự nhiên Bãi Nhỏ", icon: "Sun" }, { time: "14:00", desc: "Chèo SUP và lặn san hô", icon: "Clock" }, { time: "18:00", desc: "Thưởng thức hải sản nướng", icon: "Coffee" }] }
    ]
  },

  // QUY NHƠN
  {
    categoryId: 2,
    location: 'Quy Nhơn',
    name: 'Kỳ Co - Eo Gió: Tuyệt Tác Biển Xanh Quy Nhơn 3N2Đ',
    price: 3400000,
    overview: 'Quy Nhơn được mệnh danh là "Jeju của Việt Nam" với những dải cát trắng mịn và biển xanh ngọc bích. Trải nghiệm vẻ đẹp kỳ vĩ của Kỳ Co và Eo Gió.',
    highlights: [
      'Đi cano siêu tốc ra đảo Kỳ Co, lặn ngắm san hô Bãi Dứa',
      'Check-in Eo Gió - nơi ngắm hoàng hôn đẹp nhất Việt Nam',
      'Tham quan Khu dã ngoại Trung Lương',
      'Khám phá Tháp Đôi - di tích văn hóa Chăm Pa cổ'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Đón nắng gió Quy Nhơn", activities: [{ time: "13:00", desc: "Đón khách và nhận phòng", icon: "Clock" }, { time: "15:00", desc: "Tham quan Tháp Đôi", icon: "MapPin" }, { time: "18:30", desc: "Ăn tối đặc sản bún tôm, bún rạm", icon: "Coffee" }] },
      { day: "Ngày 2", title: "Maldives thu nhỏ", activities: [{ time: "08:00", desc: "Đi cano ra Kỳ Co", icon: "Sun" }, { time: "11:00", desc: "Lặn biển Bãi Dứa", icon: "MapPin" }, { time: "15:00", desc: "Check-in Eo Gió và Tịnh xá Ngọc Hòa", icon: "Clock" }] },
      { day: "Ngày 3", title: "Kết thúc hành trình", activities: [{ time: "09:00", desc: "Tham quan Khu dã ngoại Trung Lương", icon: "Sun" }, { time: "12:00", desc: "Mua sắm và ra sân bay", icon: "Clock" }] }
    ]
  },
  {
    categoryId: 4,
    location: 'Quy Nhơn',
    name: 'Cắm Trại Đảo Cù Lao Xanh Quy Nhơn',
    price: 2100000,
    overview: 'Đổi gió với trải nghiệm ngủ lều bên bờ biển Cù Lao Xanh hoang sơ. Hành trình mang đến cho bạn cảm giác tự do, phóng khoáng hòa mình vào thiên nhiên.',
    highlights: [
      'Tham quan ngọn hải đăng Cù Lao Xanh trăm tuổi',
      'Cắm trại qua đêm trên bãi biển hoang sơ',
      'Giao lưu lửa trại, nướng BBQ hải sản dưới bầu trời đầy sao'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Trải Nghiệm Hoang Đảo", activities: [{ time: "08:00", desc: "Di chuyển ra Cù Lao Xanh", icon: "MapPin" }, { time: "14:00", desc: "Chinh phục ngọn Hải Đăng", icon: "Sun" }, { time: "17:00", desc: "Dựng lều, chuẩn bị BBQ và đốt lửa trại", icon: "Coffee" }] },
      { day: "Ngày 2", title: "Bình Minh Đảo Ngọc", activities: [{ time: "05:30", desc: "Ngắm bình minh trên biển", icon: "Sun" }, { time: "09:00", desc: "Tự do tắm biển và bắt ốc", icon: "MapPin" }, { time: "14:00", desc: "Trở về đất liền", icon: "Clock" }] }
    ]
  },

  // SAPA
  {
    categoryId: 2,
    location: 'Sapa',
    name: 'Khám Phá Sapa Mù Sương & Đỉnh Fansipan 3N2Đ',
    price: 3600000,
    overview: 'Lên Tây Bắc cảm nhận cái lạnh buốt giá và vẻ đẹp hùng vĩ của dãy Hoàng Liên Sơn. Trải nghiệm cáp treo lên đỉnh Fansipan - Nóc nhà Đông Dương.',
    highlights: [
      'Đi cáp treo chinh phục đỉnh Fansipan cao 3143m',
      'Tham quan Thung lũng Mường Hoa, Bãi đá cổ Sapa',
      'Giao lưu văn hóa tại nhà thờ đá Sapa, chợ tình (nếu vào cuối tuần)',
      'Thưởng thức cá hồi, lợn bản cắp nách'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Thị Trấn Trong Sương", activities: [{ time: "13:00", desc: "Đến Sapa nhận phòng", icon: "Clock" }, { time: "15:00", desc: "Thăm Nhà Thờ Đá, núi Hàm Rồng", icon: "MapPin" }, { time: "19:00", desc: "Thưởng thức lẩu cá hồi", icon: "Coffee" }] },
      { day: "Ngày 2", title: "Nóc Nhà Đông Dương", activities: [{ time: "08:30", desc: "Đi cáp treo lên đỉnh Fansipan", icon: "Sun" }, { time: "14:00", desc: "Khám phá Thung Lũng Mường Hoa", icon: "MapPin" }, { time: "20:00", desc: "Dạo chợ đêm Sapa", icon: "Clock" }] },
      { day: "Ngày 3", title: "Tạm biệt Tây Bắc", activities: [{ time: "08:00", desc: "Mua sắm quà lưu niệm", icon: "Coffee" }, { time: "12:00", desc: "Lên xe về Hà Nội", icon: "Clock" }] }
    ]
  },
  {
    categoryId: 4,
    location: 'Sapa',
    name: 'Trekking Bản Cát Cát - Khám Phá Văn Hóa Tây Bắc',
    price: 2400000,
    overview: 'Hành trình đi bộ luồn lách qua các thửa ruộng bậc thang tuyệt đẹp, ghé thăm bản làng của người H’Mông, tìm hiểu phong tục tập quán và đời sống mộc mạc của đồng bào.',
    highlights: [
      'Đi bộ xuyên các thửa ruộng bậc thang hùng vĩ',
      'Khám phá Bản Cát Cát, thác Thủy Điện cổ',
      'Hòa mình vào nhịp sống thường ngày của người H’Mông',
      'Thử trang phục truyền thống rực rỡ'
    ],
    itinerary: [
      { day: "Ngày 1", title: "Trekking Bản Làng", activities: [{ time: "08:00", desc: "Bắt đầu trekking xuống Bản Cát Cát", icon: "MapPin" }, { time: "11:00", desc: "Tham quan Thác nước và Trạm Thủy Điện", icon: "Sun" }, { time: "13:00", desc: "Ăn trưa đặc sản vùng cao", icon: "Coffee" }, { time: "15:30", desc: "Giao lưu văn hóa người bản địa", icon: "MapPin" }] }
    ]
  }
];

async function main() {
  console.log('Clearing old data (Orders, Schedules, Tours, Destinations)...');
  await prisma.passenger.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.tourSchedule.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.tour.deleteMany({});
  await prisma.destination.deleteMany({});

  console.log('Seeding mock categories...');
  const categories = [
    { id: 1, name: "Tất cả", vibeIcon: "Globe" },
    { id: 2, name: "Nghỉ dưỡng", vibeIcon: "Palmtree" },
    { id: 3, name: "Food tour", vibeIcon: "Utensils" },
    { id: 4, name: "Mạo hiểm", vibeIcon: "Mountain" }
  ];

  for (const cat of categories) {
    const exists = await prisma.category.findUnique({ where: { id: cat.id } });
    if (!exists) {
      await prisma.category.create({
        data: {
          id: cat.id,
          name: cat.name,
          vibeIcon: cat.vibeIcon
        }
      });
    }
  }

  const destinations = [...new Set(mockTours.map(t => t.location))];
  const destMap: Record<string, number> = {};

  for (const loc of destinations) {
    const destination = await prisma.destination.create({
      data: {
        name: loc,
        region: "Vietnam"
      }
    });
    destMap[loc] = destination.id;
  }

  console.log('Seeding 20 high-quality tours...');
  for (let i = 0; i < mockTours.length; i++) {
    const tour = mockTours[i];
    
    // Mỗi địa điểm có 2 tour, tour đầu dùng ảnh 1, tour sau dùng ảnh 2 (hoặc 3) để tránh trùng lặp
    // VD: /images/tours/Đà Lạt/Đà Lạt 1.jpg và /images/tours/Đà Lạt/Đà Lạt 2.jpg
    const isFirstOfLocation = mockTours.findIndex(t => t.location === tour.location) === i;
    const imageSuffix = isFirstOfLocation ? '1' : '3'; // Dùng ảnh 1 và 3 cho 2 tour khác nhau
    
    const newImagePath = `/images/tours/${tour.location}/${tour.location} ${imageSuffix}.jpg`;

    await prisma.tour.create({
      data: {
        categoryId: tour.categoryId,
        destinationId: destMap[tour.location],
        name: tour.name,
        price: tour.price,
        image: newImagePath,
        overview: tour.overview,
        highlights: tour.highlights, // Stored as JSON automatically
        itinerary: tour.itinerary
      }
    });
  }

  console.log('Successfully seeded 20 tours!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
