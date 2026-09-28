const express = require('express');
const cors = require('cors');
const path = require('path');
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
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('API Error /api/products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. [READ ONE] ดึงรายละเอียดสินค้า 1 ชิ้นตาม ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้านี้ในระบบ' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('API Error /api/products/:id:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. [CREATE] เพิ่มสินค้าใหม่ลงในฐานข้อมูล MySQL
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, size, stock, image_url, description } = req.body;

    // ตรวจสอบข้อมูลจำเป็น
    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อสินค้า, หมวดหมู่ และราคาให้ครบถ้วน'
      });
    }

    const defaultImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80';
    const sql = `
      INSERT INTO products (name, category, price, size, stock, image_url, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      name,
      category,
      Number(price) || 0,
      size || 'M',
      parseInt(stock) || 0,
      image_url || defaultImage,
      description || ''
    ];

    const [result] = await db.query(sql, params);

    res.status(201).json({
      success: true,
      message: 'เพิ่มสินค้าลงใน MySQL เรียบร้อยแล้ว',
      data: {
        id: result.insertId,
        name,
        category,
        price: Number(price),
        size: size || 'M',
        stock: parseInt(stock) || 0,
        image_url: image_url || defaultImage,
        description: description || ''
      }
    });
  } catch (err) {
    console.error('API Error POST /api/products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. [UPDATE] แก้ไขข้อมูลสินค้าตาม ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, size, stock, image_url, description } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อสินค้า, หมวดหมู่ และราคาให้ครบถ้วน'
      });
    }

    const sql = `
      UPDATE products
      SET name = ?, category = ?, price = ?, size = ?, stock = ?, image_url = ?, description = ?
      WHERE id = ?
    `;
    const params = [
      name,
      category,
      Number(price) || 0,
      size || 'M',
      parseInt(stock) || 0,
      image_url,
      description,
      id
    ];

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้าที่ต้องการแก้ไข' });
    }

    res.json({
      success: true,
      message: 'อัปเดตข้อมูลสินค้าใน MySQL เรียบร้อยแล้ว',
      data: { id: Number(id), name, category, price, size, stock, image_url, description }
    });
  } catch (err) {
    console.error('API Error PUT /api/products/:id:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. [DELETE] ลบสินค้าออกจากฐานข้อมูลตาม ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบสินค้าที่ต้องการลบ' });
    }

    res.json({
      success: true,
      message: `ลบสินค้า ID: ${id} ออกจาก MySQL เรียบร้อยแล้ว`
    });
  } catch (err) {
    console.error('API Error DELETE /api/products/:id:', err);
    res.status(500).json({ success: false, error: err.message });
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
  console.log(`   - GET    /api/categories\n`);
});
