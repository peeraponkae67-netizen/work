# 👕 Thibest Clothing Store (ร้านขายเสื้อผ้าสไตล์ Mercular)

เว็บร้านขายเสื้อผ้าออนไลน์ พัฒนาด้วย **Node.js, Express.js, MySQL (phpMyAdmin)** และ **Tailwind CSS**

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
d:/Thibest/
├── package.json          # รายการ dependencies (express, mysql2, cors, morgan)
├── database.js           # จัดการเชื่อมต่อฐานข้อมูล MySQL (phpMyAdmin)
├── server.js             # Express.js RESTful API Backend
├── thibest_db.sql        # ไฟล์ฐานข้อมูลสำหรับ Import ใน phpMyAdmin
├── .gitignore            # ละเว้น node_modules ไม่ให้อัปขึ้น Git
└── public/
    └── index.html        # หน้าเว็บหน้าร้านขายเสื้อผ้า (Single File Frontend + Tailwind CSS)
```

---

## 🚀 วิธีติดตั้งและเริ่มใช้งาน (สำหรับเพื่อนที่ Clone โปรเจกต์ไป)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. นำเข้าฐานข้อมูลใน phpMyAdmin
1. เปิด **XAMPP** หรือ **Laragon** แล้วกด **Start** ที่ **MySQL** และ **Apache**
2. เปิดเบราว์เซอร์ไปที่ `http://localhost/phpmyadmin`
3. ไปที่แท็บ **Import (นำเข้า)** แล้วเลือกไฟล์ `thibest_db.sql` เพื่อนำเข้าฐานข้อมูล `thibest_db`
4. หาก MySQL ของคุณมีรหัสผ่าน ให้ไปแก้ไขที่ไฟล์ `database.js`:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'รหัสผ่าน_MySQL_ของคุณ',
  database: 'thibest_db',
  port: 3306
};
```

### 3. รันเซิร์ฟเวอร์
```bash
npm start
```
เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`
