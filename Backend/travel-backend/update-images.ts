import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const folderMapping: Record<string, string> = {
  'Hải Phòng': 'Hạ Long',
  'Kiên Giang': 'Phú Quốc',
  'Ninh Thuận': 'Nha Trang',
  'Bà Rịa - Vũng Tàu': 'Nha Trang',
  'Quảng Ninh': 'Hạ Long',
  'Bình Định': 'Quy Nhơn',
  'Khánh Hòa': 'Nha Trang',
  'Hà Nội': 'Hà Nội',
  'Hồ Chí Minh': 'Đà Nẵng', // Fallback
  'Thừa Thiên Huế': 'Huế',
  'Đà Nẵng': 'Đà Nẵng',
  'Sapa': 'Sapa',
  'Lâm Đồng': 'Đà Lạt',
  'Quảng Bình': 'Hạ Long',
  'Yên Bái': 'Sapa',
  'Hà Giang': 'Sapa',
  'Phú Quốc': 'Phú Quốc',
  'Đà Lạt': 'Đà Lạt',
  'Huế': 'Huế',
  'Nha Trang': 'Nha Trang',
  'Quy Nhơn': 'Quy Nhơn',
  'Hạ Long': 'Hạ Long',
  'Phú Quý': 'Phú Quý'
};

async function main() {
  const tours = await prisma.tour.findMany({
    include: { destination: true }
  });

  for (const tour of tours) {
    if (tour.destination) {
      let destName = tour.destination.name;
      
      // Lấy tên thư mục map với điểm đến trong DB (nếu không có thì random 1 cái)
      let mappedFolder = folderMapping[destName] || 'Đà Lạt';
      
      const newImagePath = `/images/tours/${mappedFolder}/${mappedFolder} 1.jpg`;
      
      await prisma.tour.update({
        where: { id: tour.id },
        data: { image: newImagePath }
      });
      console.log(`Updated Tour ID ${tour.id} (${tour.name}) with mapped image: ${newImagePath}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
