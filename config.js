// ==========================================================================
// ⚙️ ไฟล์ตั้งค่าระบบ PRE-ORDER เสื้อ "เอ็ม ธวัชชัย" (CONFIG.JS)
// ==========================================================================

const APP_CONFIG = {
  // แถบประกาศบนสุด (Top Ticker Banner)
  ticker: {
    enabled: true,
    text: "🔥 PRE-ORDER EXCLUSIVE • เสื้อสตรีทแวร์คอลเลกชัน 'เอ็ม ธวัชชัย' • สั่ง 2 ตัวขึ้นไปส่งฟรี!"
  },

  // ข้อมูลสินค้าและราคา
  product: {
    name: "เสื้อยืดสตรีทแวร์ เอ็ม ธวัชชัย (คอลเลกชันพิเศษ 01)",
    price: 590,               // ราคาเสื้อต่อตัว (บาท)
    originalPrice: 790,       // ราคาเต็มก่อนลด (บาท)
    shippingFee: 50,          // ค่าจัดส่ง (บาท)
    isFreeShippingAll: false, // บังคับส่งฟรีทุกออเดอร์หรือไม่
    freeShippingMinItems: 2,  // สั่งกี่ตัวขึ้นไปส่งฟรี

    // รูปภาพสินค้าจริง
    images: {
      overview: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80", // ภาพรวมคอลเลกชัน
      blackFront: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      blackBack: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
      whiteFront: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
      whiteBack: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
    }
  },

  // วิดีโอขอบคุณจาก เอ็ม ธวัชชัย (YouTube / MP4 / Video Link)
  video: {
    enabled: true,
    title: "วิดีโอขอบคุณจาก เอ็ม ธวัชชัย",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ" // URL สำหรับแสดงในบัตรขอบคุณ
  },

  // ไฟล์เสียงจริง
  audio: {
    voiceFile: "audio/m-voice.mp3",
    storyTitle: "ฟังเรื่องราวของเสื้อตัวนี้จากเสียงของ เอ็ม ธวัชชัย",
    storySubtitle: "แรงบันดาลใจจากความมืดมิดสู่พลังใจในการใช้ชีวิต"
  },

  // ข้อมูลบัญชีรับเงิน & QR Code พร้อมเพย์
  payment: {
    bankName: "ธนาคารกสิกรไทย (KBANK)",
    accountNumber: "123-4-56789-0",
    accountName: "นาย ธวัชชัย (เอ็ม) และทีมงาน",
    promptpayNumber: "0812345678",
    customQrImage: ""
  },

  // ข้อมูลผู้ส่ง (สำหรับพิมพ์ใบปะหน้า)
  sender: {
    name: "เอ็ม ธวัชชัย (M Thawatchai Official)",
    phone: "081-234-5678",
    address: "เลขที่ 99/9 อาคารสตรีทเฮาส์ ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110"
  },

  // รหัสผ่านเข้าแอดมิน
  admin: {
    defaultPin: "1234"
  },

  // Supabase
  supabase: {
    url: "",
    anonKey: "",
    storageBucket: "payment_slips"
  }
};

window.APP_CONFIG = APP_CONFIG;
