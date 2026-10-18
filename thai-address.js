/**
 * Thai Address Autocomplete & Postal Code Lookup Engine
 * ช่วยดึง ตำบล/แขวง อำเภอ/เขต จังหวัด จากรหัสไปรษณีย์ 5 หลัก
 */

const THAI_POSTAL_DB = {
  // กรุงเทพฯ
  "10110": [
    { subdistrict: "คลองเตย", district: "คลองเตย", province: "กรุงเทพมหานคร" },
    { subdistrict: "คลองตัน", district: "คลองเตย", province: "กรุงเทพมหานคร" },
    { subdistrict: "พระโขนง", district: "คลองเตย", province: "กรุงเทพมหานคร" }
  ],
  "10120": [
    { subdistrict: "ยานนาวา", district: "สาทร", province: "กรุงเทพมหานคร" },
    { subdistrict: "ทุ่งวัดดอน", district: "สาทร", province: "กรุงเทพมหานคร" },
    { subdistrict: "ทุ่งมหาเมฆ", district: "สาทร", province: "กรุงเทพมหานคร" },
    { subdistrict: "บางคอแหลม", district: "บางคอแหลม", province: "กรุงเทพมหานคร" }
  ],
  "10150": [
    { subdistrict: "บางมด", district: "จอมทอง", province: "กรุงเทพมหานคร" },
    { subdistrict: "บางขุนเทียน", district: "จอมทอง", province: "กรุงเทพมหานคร" },
    { subdistrict: "ท่าข้าม", district: "บางขุนเทียน", province: "กรุงเทพมหานคร" },
    { subdistrict: "แสมดำ", district: "บางขุนเทียน", province: "กรุงเทพมหานคร" }
  ],
  "10200": [
    { subdistrict: "พระบรมมหาราชวัง", district: "พระนคร", province: "กรุงเทพมหานคร" },
    { subdistrict: "วังบูรพาภิรมย์", district: "พระนคร", province: "กรุงเทพมหานคร" },
    { subdistrict: "ชนะสงคราม", district: "พระนคร", province: "กรุงเทพมหานคร" },
    { subdistrict: "ศาลเจ้าพ่อเสือ", district: "พระนคร", province: "กรุงเทพมหานคร" }
  ],
  "10250": [
    { subdistrict: "สวนหลวง", district: "สวนหลวง", province: "กรุงเทพมหานคร" },
    { subdistrict: "พัฒนาการ", district: "สวนหลวง", province: "กรุงเทพมหานคร" }
  ],
  "10300": [
    { subdistrict: "ดุสิต", district: "ดุสิต", province: "กรุงเทพมหานคร" },
    { subdistrict: "วชิรพยาบาล", district: "ดุสิต", province: "กรุงเทพมหานคร" },
    { subdistrict: "สวนจิตรลดา", district: "ดุสิต", province: "กรุงเทพมหานคร" },
    { subdistrict: "สี่แยกมหานาค", district: "ดุสิต", province: "กรุงเทพมหานคร" },
    { subdistrict: "ถนนนครไชยศรี", district: "ดุสิต", province: "กรุงเทพมหานคร" }
  ],
  "10310": [
    { subdistrict: "ลาดพร้าว", district: "ลาดพร้าว", province: "กรุงเทพมหานคร" },
    { subdistrict: "จรเข้บัว", district: "ลาดพร้าว", province: "กรุงเทพมหานคร" },
    { subdistrict: "สะพานสอง", district: "วังทองหลาง", province: "กรุงเทพมหานคร" }
  ],
  "10330": [
    { subdistrict: "ปทุมวัน", district: "ปทุมวัน", province: "กรุงเทพมหานคร" },
    { subdistrict: "ลุมพินี", district: "ปทุมวัน", province: "กรุงเทพมหานคร" },
    { subdistrict: "รองเมือง", district: "ปทุมวัน", province: "กรุงเทพมหานคร" },
    { subdistrict: "วังใหม่", district: "ปทุมวัน", province: "กรุงเทพมหานคร" }
  ],
  "10400": [
    { subdistrict: "สามเสนใน", district: "พญาไท", province: "กรุงเทพมหานคร" },
    { subdistrict: "พญาไท", district: "พญาไท", province: "กรุงเทพมหานคร" },
    { subdistrict: "มักกะสัน", district: "ราชเทวี", province: "กรุงเทพมหานคร" },
    { subdistrict: "ถนนเพชรบุรี", district: "ราชเทวี", province: "กรุงเทพมหานคร" }
  ],
  "10500": [
    { subdistrict: "บางรัก", district: "บางรัก", province: "กรุงเทพมหานคร" },
    { subdistrict: "สี่พระยา", district: "บางรัก", province: "กรุงเทพมหานคร" },
    { subdistrict: "สีลม", district: "บางรัก", province: "กรุงเทพมหานคร" },
    { subdistrict: "สุริยวงศ์", district: "บางรัก", province: "กรุงเทพมหานคร" }
  ],
  "10600": [
    { subdistrict: "สมเด็จเจ้าพระยา", district: "คลองสาน", province: "กรุงเทพมหานคร" },
    { subdistrict: "คลองสาน", district: "คลองสาน", province: "กรุงเทพมหานคร" },
    { subdistrict: "คลองต้นไทร", district: "คลองสาน", province: "กรุงเทพมหานคร" },
    { subdistrict: "บางยี่เรือ", district: "ธนบุรี", province: "กรุงเทพมหานคร" }
  ],
  "10700": [
    { subdistrict: "ศิริราช", district: "บางกอกน้อย", province: "กรุงเทพมหานคร" },
    { subdistrict: "บ้านช่างหล่อ", district: "บางกอกน้อย", province: "กรุงเทพมหานคร" },
    { subdistrict: "บางขุนนนท์", district: "บางกอกน้อย", province: "กรุงเทพมหานคร" },
    { subdistrict: "อรุณอมรินทร์", district: "บางกอกน้อย", province: "กรุงเทพมหานคร" }
  ],
  "10800": [
    { subdistrict: "บางซื่อ", district: "บางซื่อ", province: "กรุงเทพมหานคร" },
    { subdistrict: "วงศ์สว่าง", district: "บางซื่อ", province: "กรุงเทพมหานคร" }
  ],
  "10900": [
    { subdistrict: "ลาดยาว", district: "จตุจักร", province: "กรุงเทพมหานคร" },
    { subdistrict: "เสนานิคม", district: "จตุจักร", province: "กรุงเทพมหานคร" },
    { subdistrict: "จันทรเกษม", district: "จตุจักร", province: "กรุงเทพมหานคร" },
    { subdistrict: "จอมพล", district: "จตุจักร", province: "กรุงเทพมหานคร" },
    { subdistrict: "จตุจักร", district: "จตุจักร", province: "กรุงเทพมหานคร" }
  ],

  // ปริมณฑล
  "11000": [
    { subdistrict: "สวนใหญ่", district: "เมืองนนทบุรี", province: "นนทบุรี" },
    { subdistrict: "ตลาดขวัญ", district: "เมืองนนทบุรี", province: "นนทบุรี" },
    { subdistrict: "บางเขน", district: "เมืองนนทบุรี", province: "นนทบุรี" },
    { subdistrict: "บางกระสอ", district: "เมืองนนทบุรี", province: "นนทบุรี" }
  ],
  "11110": [
    { subdistrict: "บางบัวทอง", district: "บางบัวทอง", province: "นนทบุรี" },
    { subdistrict: "โสนลอย", district: "บางบัวทอง", province: "นนทบุรี" },
    { subdistrict: "พิมลราช", district: "บางบัวทอง", province: "นนทบุรี" }
  ],
  "11120": [
    { subdistrict: "ปากเกร็ด", district: "ปากเกร็ด", province: "นนทบุรี" },
    { subdistrict: "บางพูด", district: "ปากเกร็ด", province: "นนทบุรี" },
    { subdistrict: "บ้านใหม่", district: "ปากเกร็ด", province: "นนทบุรี" },
    { subdistrict: "คลองเกลือ", district: "ปากเกร็ด", province: "นนทบุรี" }
  ],
  "12000": [
    { subdistrict: "บางปรอก", district: "เมืองปทุมธานี", province: "ปทุมธานี" },
    { subdistrict: "บ้านใหม่", district: "เมืองปทุมธานี", province: "ปทุมธานี" },
    { subdistrict: "บางหลวง", district: "เมืองปทุมธานี", province: "ปทุมธานี" }
  ],
  "12120": [
    { subdistrict: "คลองหนึ่ง", district: "คลองหลวง", province: "ปทุมธานี" },
    { subdistrict: "คลองสอง", district: "คลองหลวง", province: "ปทุมธานี" }
  ],
  "12130": [
    { subdistrict: "ประชาธิปัตย์", district: "ธัญบุรี", province: "ปทุมธานี" },
    { subdistrict: "บึงยี่โถ", district: "ธัญบุรี", province: "ปทุมธานี" }
  ],
  "10270": [
    { subdistrict: "ปากน้ำ", district: "เมืองสมุทรปราการ", province: "สมุทรปราการ" },
    { subdistrict: "ท้ายบ้าน", district: "เมืองสมุทรปราการ", province: "สมุทรปราการ" },
    { subdistrict: "บางเมือง", district: "เมืองสมุทรปราการ", province: "สมุทรปราการ" }
  ],
  "10540": [
    { subdistrict: "บางพลีใหญ่", district: "บางพลี", province: "สมุทรปราการ" },
    { subdistrict: "ราชาเทวะ", district: "บางพลี", province: "สมุทรปราการ" },
    { subdistrict: "บางปลา", district: "บางพลี", province: "สมุทรปราการ" }
  ],

  // ภาคกลางและตะวันออก
  "13000": [{ subdistrict: "ประตูชัย", district: "พระนครศรีอยุธยา", province: "พระนครศรีอยุธยา" }],
  "20000": [{ subdistrict: "บางปลาสร้อย", district: "เมืองชลบุรี", province: "ชลบุรี" }],
  "20150": [{ subdistrict: "หนองปรือ", district: "บางละมุง (พัทยา)", province: "ชลบุรี" }],
  "20230": [{ subdistrict: "ทุ่งสุขลา", district: "ศรีราชา", province: "ชลบุรี" }],
  "21000": [{ subdistrict: "ท่าประดู่", district: "เมืองระยอง", province: "ระยอง" }],

  // ภาคเหนือ
  "50000": [
    { subdistrict: "ศรีภูมิ", district: "เมืองเชียงใหม่", province: "เชียงใหม่" },
    { subdistrict: "พระสิงห์", district: "เมืองเชียงใหม่", province: "เชียงใหม่" },
    { subdistrict: "ช้างคลาน", district: "เมืองเชียงใหม่", province: "เชียงใหม่" },
    { subdistrict: "สุเทพ", district: "เมืองเชียงใหม่", province: "เชียงใหม่" },
    { subdistrict: "แม่เหียะ", district: "เมืองเชียงใหม่", province: "เชียงใหม่" }
  ],
  "50200": [{ subdistrict: "สันทรายน้อย", district: "สันทราย", province: "เชียงใหม่" }],
  "57000": [{ subdistrict: "เวียง", district: "เมืองเชียงราย", province: "เชียงราย" }],
  "52000": [{ subdistrict: "เวียงเหนือ", district: "เมืองลำปาง", province: "ลำปาง" }],
  "65000": [{ subdistrict: "ในเมือง", district: "เมืองพิษณุโลก", province: "พิษณุโลก" }],

  // ภาคอีสาน
  "30000": [
    { subdistrict: "ในเมือง", district: "เมืองนครราชสีมา", province: "นครราชสีมา" },
    { subdistrict: "หนองไผ่ล้อม", district: "เมืองนครราชสีมา", province: "นครราชสีมา" }
  ],
  "40000": [
    { subdistrict: "ในเมือง", district: "เมืองขอนแก่น", province: "ขอนแก่น" },
    { subdistrict: "ศิลา", district: "เมืองขอนแก่น", province: "ขอนแก่น" }
  ],
  "41000": [{ subdistrict: "หมากแข้ง", district: "เมืองอุดรธานี", province: "อุดรธานี" }],
  "34000": [{ subdistrict: "ในเมือง", district: "เมืองอุบลราชธานี", province: "อุบลราชธานี" }],
  "31000": [{ subdistrict: "ในเมือง", district: "เมืองบุรีรัมย์", province: "บุรีรัมย์" }],

  // ภาคใต้
  "83000": [
    { subdistrict: "ตลาดใหญ่", district: "เมืองภูเก็ต", province: "ภูเก็ต" },
    { subdistrict: "ตลาดเหนือ", district: "เมืองภูเก็ต", province: "ภูเก็ต" }
  ],
  "83150": [{ subdistrict: "ป่าตอง", district: "กะทู้", province: "ภูเก็ต" }],
  "90110": [{ subdistrict: "หาดใหญ่", district: "หาดใหญ่", province: "สงขลา" }],
  "84000": [{ subdistrict: "ตลาด", district: "เมืองสุราษฎร์ธานี", province: "สุราษฎร์ธานี" }],
  "84320": [{ subdistrict: "บ่อผุด", district: "เกาะสมุย", province: "สุราษฎร์ธานี" }],
  "80000": [{ subdistrict: "ในเมือง", district: "เมืองนครศรีธรรมราช", province: "นครศรีธรรมราช" }]
};

// ฟังก์ชันค้นหาข้อมูลที่อยู่จากรหัสไปรษณีย์
window.lookupThaiPostalCode = function (postalCode) {
  postalCode = (postalCode || "").trim();
  if (postalCode.length !== 5) return null;

  if (THAI_POSTAL_DB[postalCode]) {
    return THAI_POSTAL_DB[postalCode];
  }

  // หากเป็นรหัสไปรษณีย์นอกเหนือจากฐานข้อมูลหลัก สร้างค่าเริ่มต้นฉลาดๆ ให้ลูกค้า
  const prefix2 = postalCode.substring(0, 2);
  const PROVINCE_MAP = {
    "10": "กรุงเทพมหานคร", "11": "นนทบุรี", "12": "ปทุมธานี", "13": "พระนครศรีอยุธยา",
    "14": "อ่างทอง", "15": "ลพบุรี", "16": "สิงห์บุรี", "17": "ชัยนาท", "18": "สระบุรี",
    "20": "ชลบุรี", "21": "ระยอง", "22": "จันทบุรี", "23": "ตราด", "24": "ฉะเชิงเทรา",
    "25": "ปราจีนบุรี", "26": "นครนายก", "27": "สระแก้ว",
    "30": "นครราชสีมา", "31": "บุรีรัมย์", "32": "สุรินทร์", "33": "ศรีสะเกษ", "34": "อุบลราชธานี",
    "35": "ยโสธร", "36": "ชัยภูมิ", "37": "อำนาจเจริญ", "38": "บึงกาฬ", "39": "หนองบัวลำภู",
    "40": "ขอนแก่น", "41": "อุดรธานี", "42": "เลย", "43": "หนองคาย", "44": "มหาสารคาม",
    "45": "ร้อยเอ็ด", "46": "กาฬสินธุ์", "47": "สกลนคร", "48": "นครพนม", "49": "มุกดาหาร",
    "50": "เชียงใหม่", "51": "ลำพูน", "52": "ลำปาง", "53": "อุตรดิตถ์", "54": "แพร่",
    "55": "น่าน", "56": "พะเยา", "57": "เชียงราย", "58": "แม่ฮ่องสอน",
    "60": "นครสวรรค์", "61": "อุทัยธานี", "62": "กำแพงเพชร", "63": "ตาก", "64": "สุโขทัย",
    "65": "พิษณุโลก", "66": "พิจิตร", "67": "เพชรบูรณ์",
    "70": "ราชบุรี", "71": "กาญจนบุรี", "72": "สุพรรณบุรี", "73": "นครปฐม", "74": "สมุทรสาคร",
    "75": "สมุทรสงคราม", "76": "เพชรบุรี", "77": "ประจวบคีรีขันธ์",
    "80": "นครศรีธรรมราช", "81": "กระบี่", "82": "พังงา", "83": "ภูเก็ต", "84": "สุราษฎร์ธานี",
    "85": "ระนอง", "86": "ชุมพร",
    "90": "สงขลา", "91": "สตูล", "92": "ตรัง", "93": "พัทลุง", "94": "ปัตตานี", "95": "ยะลา", "96": "นราธิวาส"
  };

  const province = PROVINCE_MAP[prefix2] || "ต่างจังหวัด";
  return [
    { subdistrict: "กรุณาระบุตำบล/แขวง", district: "กรุณาระบุอำเภอ/เขต", province: province }
  ];
};
