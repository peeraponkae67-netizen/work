const mysql = require('mysql2/promise');

// ตั้งค่าการเชื่อมต่อ MySQL / phpMyAdmin โดยตรงที่นี่
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'rootroot',   // รหัสผ่าน phpMyAdmin / MySQL
  database: 'thibest_db', // ชื่อฐานข้อมูล
  port: 3306,             // พอร์ต MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// สร้าง Connection Pool สำหรับจัดการ Query
const pool = mysql.createPool(dbConfig);

// ฟังก์ชันทดสอบการเชื่อมต่อเมื่อเริ่มต้นระบบ
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ เชื่อมต่อฐานข้อมูล MySQL (phpMyAdmin) สำเร็จ!`);
    console.log(`📦 Database: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
  } catch (err) {
    console.error('❌ ไม่สามารถเชื่อมต่อฐานข้อมูล MySQL ได้:');
    console.error(`   ข้อผิดพลาด: ${err.message}`);
    console.log('\n💡 คำแนะนำ:');
    console.log('   1. ตรวจสอบว่าเปิด MySQL ใน XAMPP / Laragon แล้วหรือยัง');
    console.log('   2. ตรวจสอบชื่อ database และ password ในไฟล์ database.js\n');
  }
}

// ตรวจสอบการเชื่อมต่อ
testConnection();

module.exports = pool;
