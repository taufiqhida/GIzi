// Mock Data untuk Website SiGizi

export const heroImages = [
  'https://images.unsplash.com/photo-1576089073624-b5751a8f4de9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmYW1pbHklMjBudXRyaXRpb258ZW58MHx8fHwxNzY1NzA2MjAxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1758874960045-199a38f721f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxmYW1pbHklMjBudXRyaXRpb258ZW58MHx8fHwxNzY1NzA2MjAxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1548289227-b7d966b70003?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwY2hpbGRyZW58ZW58MHx8fHwxNzY1NzA2MjA4fDA&ixlib=rb-4.1.0&q=85'
];

export const layananKami = [
  {
    id: 1,
    icon: 'Users',
    title: 'Konsultasi Tatap Muka',
    description: 'Bertemu langsung dengan ahli gizi profesional kami untuk konsultasi mendalam tentang kesehatan dan nutrisi anak Anda.'
  },
  {
    id: 2,
    icon: 'Video',
    title: 'Konsultasi Online',
    description: 'Konsultasi praktis melalui video call, chat, atau telepon. Fleksibel dan mudah diakses dari mana saja.'
  },
  {
    id: 3,
    icon: 'BookOpen',
    title: 'Edukasi & Seminar',
    description: 'Ikuti seminar dan workshop edukasi gizi untuk meningkatkan pengetahuan tentang nutrisi keluarga.'
  }
];

export const artikelKesehatan = [
  {
    id: 1,
    title: '10 Makanan Super untuk Tumbuh Kembang Anak',
    excerpt: 'Temukan makanan bergizi tinggi yang dapat mendukung pertumbuhan optimal anak Anda.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    category: 'Nutrisi',
    date: '2024-12-10',
    author: 'Dr. Siti Nurhaliza'
  },
  {
    id: 2,
    title: 'Panduan Lengkap MPASI 6-12 Bulan',
    excerpt: 'Langkah demi langkah memperkenalkan makanan padat pertama untuk bayi Anda.',
    image: 'https://images.unsplash.com/photo-1604480133435-4b0a139e9783?w=400',
    category: 'MPASI',
    date: '2024-12-08',
    author: 'dr. Rizki Ananda'
  },
  {
    id: 3,
    title: 'Mengatasi Anak Susah Makan: Tips & Trik',
    excerpt: 'Strategi efektif untuk mengatasi masalah makan pada anak balita.',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400',
    category: 'Tips Parenting',
    date: '2024-12-05',
    author: 'Nutritionist Dewi'
  }
];

export const resepSehat = [
  {
    id: 1,
    title: 'Bubur Ayam Sayuran (6+ bulan)',
    description: 'Bubur lembut kaya protein dan vitamin untuk MPASI perdana',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    ingredients: ['50gr beras', '50gr ayam cincang', 'Wortel', 'Bayam', 'Kaldu ayam'],
    ageGroup: '6-8 bulan',
    prepTime: '30 menit'
  },
  {
    id: 2,
    title: 'Puree Alpukat Pisang',
    description: 'Kombinasi sempurna lemak sehat dan karbohidrat',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400',
    ingredients: ['1/2 alpukat matang', '1 pisang ambon', 'ASI/susu formula'],
    ageGroup: '6-8 bulan',
    prepTime: '10 menit'
  },
  {
    id: 3,
    title: 'Nasi Tim Ikan Salmon',
    description: 'Tinggi omega-3 untuk perkembangan otak optimal',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    ingredients: ['75gr beras', '50gr salmon', 'Brokoli', 'Wortel', 'Minyak zaitun'],
    ageGroup: '9-12 bulan',
    prepTime: '40 menit'
  }
];

export const agendaKegiatan = [
  {
    id: 1,
    title: 'Posyandu Balita',
    date: '2024-12-15',
    time: '08:00 - 12:00',
    location: 'Puskesmas Kecamatan',
    type: 'Pemeriksaan Rutin'
  },
  {
    id: 2,
    title: 'Seminar Gizi Seimbang',
    date: '2024-12-20',
    time: '09:00 - 15:00',
    location: 'Aula Puskesmas',
    type: 'Edukasi'
  },
  {
    id: 3,
    title: 'Workshop MPASI Praktis',
    date: '2024-12-22',
    time: '10:00 - 13:00',
    location: 'Ruang Konseling',
    type: 'Workshop'
  },
  {
    id: 4,
    title: 'Konsultasi Gizi Gratis',
    date: '2024-12-25',
    time: '08:00 - 14:00',
    location: 'Online via Zoom',
    type: 'Konsultasi'
  }
];

export const panduanMPASI = [
  {
    usia: '6-7 Bulan',
    tekstur: 'Puree halus',
    frekuensi: '2-3 kali/hari',
    porsi: '2-3 sdm',
    contoh: ['Bubur tepung beras', 'Puree buah', 'Puree sayur']
  },
  {
    usia: '8-9 Bulan',
    tekstur: 'Puree kasar/mashed',
    frekuensi: '3-4 kali/hari',
    porsi: '1/2 mangkuk (125ml)',
    contoh: ['Nasi tim', 'Buah potong kecil', 'Finger foods']
  },
  {
    usia: '10-12 Bulan',
    tekstur: 'Makanan cincang halus',
    frekuensi: '3-4 kali/hari + snack',
    porsi: '1/2-3/4 mangkuk',
    contoh: ['Nasi lembek', 'Lauk cincang', 'Sayur rebus']
  },
  {
    usia: '12-24 Bulan',
    tekstur: 'Makanan keluarga',
    frekuensi: '3-4 kali/hari + 2 snack',
    porsi: '3/4-1 mangkuk',
    contoh: ['Nasi tim/lembek', 'Menu keluarga yang disesuaikan']
  }
];

export const eDataStatistik = [
  {
    kategori: 'Status Gizi Balita',
    data: [
      { label: 'Gizi Baik', value: 78, color: '#10b981' },
      { label: 'Gizi Kurang', value: 15, color: '#f59e0b' },
      { label: 'Gizi Buruk', value: 5, color: '#ef4444' },
      { label: 'Obesitas', value: 2, color: '#8b5cf6' }
    ]
  },
  {
    kategori: 'Cakupan Konsultasi',
    data: [
      { bulan: 'Jan', jumlah: 120 },
      { bulan: 'Feb', jumlah: 145 },
      { bulan: 'Mar', jumlah: 165 },
      { bulan: 'Apr', jumlah: 180 },
      { bulan: 'Mei', jumlah: 195 },
      { bulan: 'Jun', jumlah: 210 }
    ]
  }
];

// Data untuk kalkulator WHO Standards (simplified)
export const whoStandards = {
  beratBadanUmur: {
    laki: {
      6: { median: 7.9, minus2sd: 6.4, plus2sd: 9.8 },
      12: { median: 9.6, minus2sd: 7.7, plus2sd: 12.0 },
      24: { median: 12.2, minus2sd: 9.7, plus2sd: 15.3 },
      36: { median: 14.3, minus2sd: 11.3, plus2sd: 18.3 },
      48: { median: 16.3, minus2sd: 12.7, plus2sd: 21.2 },
      60: { median: 18.3, minus2sd: 14.1, plus2sd: 24.2 }
    },
    perempuan: {
      6: { median: 7.3, minus2sd: 5.7, plus2sd: 9.3 },
      12: { median: 9.0, minus2sd: 7.0, plus2sd: 11.5 },
      24: { median: 11.5, minus2sd: 8.9, plus2sd: 14.8 },
      36: { median: 13.9, minus2sd: 10.8, plus2sd: 18.1 },
      48: { median: 16.0, minus2sd: 12.3, plus2sd: 21.5 },
      60: { median: 18.0, minus2sd: 13.7, plus2sd: 24.9 }
    }
  }
};