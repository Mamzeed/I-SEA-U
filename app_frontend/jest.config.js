/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',  // <-- เพิ่มบรรทัดนี้
  // All other configurations remain the same
  
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  
  // คุณสามารถเพิ่มหรือปรับตั้งค่าอื่น ๆ ได้ตามต้องการ
};

module.exports = config;
