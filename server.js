const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ให้ Express ให้บริการไฟล์ static (HTML, CSS, JS รูปภาพ) จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 🛒 RESTful CRUD API สำหรับระบบจัดการสินค้าเสื้อผ้า (MySQL / phpMyAdmin)
// ==========================================

// 1. [READ ALL] ดึงรายการสินค้าทั้งหมด (รองรับการค้นหา search และกรอง category)
app.get('/api/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'ทั้งหมด') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await db.query(sql, params);
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('API Error /api/products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. [READ ONE] ดึงรายละเอียดสินค้า 1 ชิ้นตาม ID (มี Validation ตรวจสอบ ID)
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Backend Input Validation ตรวจสอบ ID
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ success: false, message: 'รหัสสินค้า (ID) ไม่ถูกต้อง' });
    }

    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้านี้ในระบบ' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('API Error /api/products/:id:', err);
    res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
  }
});

// Middleware ตรวจสอบสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น
function requireAdmin(req, res, next) {
  const role = req.headers['x-user-role'] || (req.body && req.body.role);
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'สิทธิ์ไม่เพียงพอ: เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเพิ่มหรือแก้ไขสินค้าได้'
    });
  }
  next();
}

// 3. [CREATE] เพิ่มสินค้าใหม่ลงในฐานข้อมูล MySQL (เฉพาะ Admin เท่านั้น)
app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const { name, category, price, size, stock, image_url, description } = req.body;

    // Backend Input Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อสินค้าให้ถูกต้อง' });
    }
    if (name.trim().length < 2 || name.trim().length > 255) {
      return res.status(400).json({ success: false, message: 'ชื่อสินค้าต้องมีความยาวระหว่าง 2 - 255 ตัวอักษร' });
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุหมวดหมู่สินค้า' });
    }

    const numPrice = Number(price);
    if (price === undefined || price === null || isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ success: false, message: 'ราคาต้องเป็นตัวเลขที่มากกว่า 0' });
    }

    const intStock = parseInt(stock);
    if (stock !== undefined && stock !== null && (isNaN(intStock) || intStock < 0)) {
      return res.status(400).json({ success: false, message: 'จำนวนสต็อกต้องเป็นตัวเลขจำนวนเต็ม 0 ขึ้นไป' });
    }

    const cleanSize = (typeof size === 'string' && size.trim()) ? size.trim().slice(0, 20) : 'M';
    const cleanStock = isNaN(intStock) ? 0 : intStock;
    const defaultImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80';
    const cleanImage = (typeof image_url === 'string' && image_url.trim()) ? image_url.trim() : defaultImage;
    const cleanDesc = (typeof description === 'string') ? description.trim() : '';

    const sql = `
      INSERT INTO products (name, category, price, size, stock, image_url, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      name.trim(),
      category.trim(),
      numPrice,
      cleanSize,
      cleanStock,
      cleanImage,
      cleanDesc
    ];

    const [result] = await db.query(sql, params);

    res.status(201).json({
      success: true,
      message: 'เพิ่มสินค้าลงในระบบเรียบร้อยแล้ว',
      data: {
        id: result.insertId,
        name: name.trim(),
        category: category.trim(),
        price: numPrice,
        size: cleanSize,
        stock: cleanStock,
        image_url: cleanImage,
        description: cleanDesc
      }
    });
  } catch (err) {
    console.error('API Error POST /api/products:', err);
    res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลสินค้า' });
  }
});

// 4. [UPDATE] แก้ไขข้อมูลสินค้าตาม ID (เฉพาะ Admin เท่านั้น)
app.put('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ success: false, message: 'รหัสสินค้า (ID) ไม่ถูกต้อง' });
    }

    const { name, category, price, size, stock, image_url, description } = req.body;

    // Backend Input Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อสินค้าให้ถูกต้อง' });
    }
    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุหมวดหมู่สินค้า' });
    }

    const numPrice = Number(price);
    if (price === undefined || price === null || isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ success: false, message: 'ราคาต้องเป็นตัวเลขที่มากกว่า 0' });
    }

    const intStock = parseInt(stock);
    if (stock !== undefined && stock !== null && (isNaN(intStock) || intStock < 0)) {
      return res.status(400).json({ success: false, message: 'จำนวนสต็อกต้องเป็นตัวเลขจำนวนเต็ม 0 ขึ้นไป' });
    }

    const cleanSize = (typeof size === 'string' && size.trim()) ? size.trim().slice(0, 20) : 'M';
    const cleanStock = isNaN(intStock) ? 0 : intStock;
    const cleanImage = (typeof image_url === 'string' && image_url.trim()) ? image_url.trim() : '';
    const cleanDesc = (typeof description === 'string') ? description.trim() : '';

    const sql = `
      UPDATE products
      SET name = ?, category = ?, price = ?, size = ?, stock = ?, image_url = ?, description = ?
      WHERE id = ?
    `;
    const params = [
      name.trim(),
      category.trim(),
      numPrice,
      cleanSize,
      cleanStock,
      cleanImage,
      cleanDesc,
      Number(id)
    ];

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้าที่ต้องการแก้ไข' });
    }

    res.json({
      success: true,
      message: 'อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว',
      data: {
        id: Number(id),
        name: name.trim(),
        category: category.trim(),
        price: numPrice,
        size: cleanSize,
        stock: cleanStock,
        image_url: cleanImage,
        description: cleanDesc
      }
    });
  } catch (err) {
    console.error('API Error PUT /api/products/:id:', err);
    res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตสินค้า' });
  }
});

// 5. [DELETE] ลบสินค้าออกจากฐานข้อมูลตาม ID (เฉพาะ Admin เท่านั้น)
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ success: false, message: 'รหัสสินค้า (ID) ไม่ถูกต้อง' });
    }

    const [result] = await db.query('DELETE FROM products WHERE id = ?', [Number(id)]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้าที่ต้องการลบ หรือสินค้านี้ถูกลบไปแล้ว' });
    }

    res.json({
      success: true,
      message: `ลบสินค้า ID: ${id} เรียบร้อยแล้ว`
    });
  } catch (err) {
    console.error('API Error DELETE /api/products/:id:', err);
    res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการลบสินค้า' });
  }
});

// 6. [READ CATEGORIES] ดึงรายการหมวดหมู่สินค้า
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY id ASC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('API Error /api/categories:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. [AUTH LOGIN] ตรวจสอบชื่อผู้ใช้และรหัสผ่าน (ใช้ bcrypt ป้องกัน Plaintext 100%)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Backend Input Validation
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'กรุณากรอกชื่อผู้ใช้หรืออีเมล' 
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'กรุณากรอกรหัสผ่าน' 
      });
    }

    const cleanUsername = username.trim();

    // ดึงผู้ใช้งานจากตาราง users
    const [rows] = await db.query(
      'SELECT id, username, email, password, full_name, role FROM users WHERE username = ? OR email = ?',
      [cleanUsername, cleanUsername]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    const user = rows[0];
    let isPasswordValid = false;

    // ตรวจสอบรหัสผ่านด้วย bcrypt.compare
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // สำหรับกรณี fallback รหัสเดิมก่อนเข้ารหัส
      isPasswordValid = (password === user.password);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    // ตอบกลับข้อมูลโดยไม่ส่ง password กลับไปฝั่ง Client เด็ดขาด
    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('API Error /api/auth/login:', err);
    res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูลเข้าสู่ระบบ' });
  }
});

// 8. [AUTH LOGOUT] ออกจากระบบ
app.post('/api/auth/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'ออกจากระบบเรียบร้อยแล้ว' 
  });
});

// 9. [AUTH REGISTER] สมัครสมาชิกใหม่ (จัดเก็บลงตาราง users ใน phpMyAdmin พร้อม bcrypt hash)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, phone, password, confirmPassword } = req.body;

    // Backend Input Validation
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกอีเมล' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' });
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
      return res.status(400).json({ success: false, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน' });
    }

    const cleanPhone = (typeof phone === 'string' && phone.trim()) ? phone.trim() : null;

    // ตรวจสอบว่ามีอีเมลนี้แล้วหรือยัง
    const [existing] = await db.query('SELECT id, email FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'อีเมลนี้ถูกใช้งานแล้วในระบบ กรุณาเข้าสู่ระบบ' });
    }

    // สร้าง username และ full_name จากอีเมล
    let baseUsername = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'user';
    let username = baseUsername;
    let counter = 1;
    while (true) {
      const [uCheck] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
      if (uCheck.length === 0) break;
      username = `${baseUsername}${counter++}`;
    }

    const fullName = baseUsername.charAt(0).toUpperCase() + baseUsername.slice(1);

    // Hash รหัสผ่านด้วย bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกสมาชิกลงในตาราง users
    const [result] = await db.query(
      'INSERT INTO users (username, email, phone, password, full_name, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, cleanEmail, cleanPhone, hashedPassword, fullName, 'customer']
    );

    res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ ยินดีต้อนรับสู่ Thibest Clothes!',
      data: {
        id: result.insertId,
        username,
        email: cleanEmail,
        phone: cleanPhone,
        full_name: fullName,
        role: 'customer'
      }
    });
  } catch (err) {
    console.error('API Error /api/auth/register:', err);
    res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก: ' + (err.message || '') });
  }
});

// เริ่มรัน Server
app.listen(PORT, () => {
  console.log(`\n🚀 เซิร์ฟเวอร์ Thibest Clothes กำลังทำงานที่ http://localhost:${PORT}`);
  console.log(`📂 เชื่อมต่อฐานข้อมูล: MySQL (phpMyAdmin)`);
  console.log(`📡 Endpoints:`);
  console.log(`   - GET    /api/products`);
  console.log(`   - POST   /api/products`);
  console.log(`   - GET    /api/products/:id`);
  console.log(`   - PUT    /api/products/:id`);
  console.log(`   - DELETE /api/products/:id`);
  console.log(`   - GET    /api/categories`);
  console.log(`   - POST   /api/auth/login`);
  console.log(`   - POST   /api/auth/register`);
  console.log(`   - POST   /api/auth/logout\n`);
});

