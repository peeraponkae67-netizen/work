# 👕 Thibest Clothing Store (ร้านขายเสื้อผ้า)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL%20%2F%20MariaDB-phpMyAdmin-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-bcrypt%20%2B%20Input%20Validation-brightgreen?style=flat&logo=shield)](file:///d:/Thibest/TEST_CASES.md)

เว็บแอปพลิเคชันระบบร้านขายเสื้อผ้าออนไลน์สไตล์มินิมอลโมเดิร์น (Modern E-Commerce) พัฒนาด้วย **Node.js, Express.js, MySQL (ผ่าน phpMyAdmin)** และ **Tailwind CSS** พร้อมระบบจัดการสินค้า (CRUD), ระบบตะกร้าสินค้า (Shopping Cart), ระบบสมาชิก (Authentication) และการแบ่งสิทธิ์ผู้ใช้ (Role-based Authorization: Admin & Customer)

---

## ✨ ฟีเจอร์เด่นของระบบ (Key Features)

### 🛍️ สำหรับลูกค้าทั่วไป (Customer / Guest)
- **หน้าร้านค้าสไตล์โมเดิร์น:** ดีไซน์ Clean & Minimal พร้อม Banner โปรโมชั่นและ Carousel แสดงสินค้า
- **ค้นหาและกรองสินค้า (Search & Filter):** ค้นหาชื่อสินค้าแบบ Real-time และกรองตามหมวดหมู่ (เสื้อยืด, เสื้อเชิ้ต, กางเกง, เสื้อกันหนาว/ฮู้ด, อุปกรณ์เสริม)
- **ระบบตะกร้าสินค้า (Shopping Cart Drawer):** เพิ่ม/ลดจำนวนสินค้า, คำนวณยอดรวมอัตโนมัติ และจำลองการชำระเงิน (Checkout)
- **ระบบสมาชิก (Authentication):** สมัครสมาชิกใหม่ (Register) และเข้าสู่ระบบ (Login)

### 👑 สำหรับผู้ดูแลระบบ (Admin)
- **ระบบจัดการสินค้าครบวงจร (Full CRUD Operations):**
  - **Create:** เพิ่มสินค้าใหม่ ระบุชื่อ หมวดหมู่ ราคา ไซส์ สต็อก และลิงก์รูปภาพ
  - **Read:** แสดงรายการสินค้าพร้อมรายละเอียดและสต็อกคงเหลือ
  - **Update:** แก้ไขข้อมูลสินค้า ราคา และจำนวนสต็อกได้ทันที
  - **Delete:** ลบสินค้าที่ไม่ต้องการออกจากฐานข้อมูลอย่างปลอดภัย
- **Role-based Access Control:** ซ่อนและจำกัดสิทธิ์ปุ่มจัดการสินค้า แสดงเฉพาะผู้ใช้ที่มีสิทธิ์ Admin เท่านั้น

### 🛡️ ความปลอดภัยและมาตรฐานโค้ด (Security Highlights)
- **Password Hashing:** รหัสผ่านทุกบัญชีเข้ารหัสด้วยอัลกอริทึม **`bcrypt`** (Salt rounds = 10) ป้องกัน Plaintext ในฐานข้อมูล 100%
- **Backend Input Validation:** มีการตรวจสอบชนิดข้อมูล ความยาว และความถูกต้องของ Payload ทุก Endpoint ในฝั่ง Backend ก่อนบันทึกลง MariaDB/MySQL
- **XSS Prevention:** ป้องกันการโจมตี Cross-Site Scripting ด้วยการเรนเดอร์ข้อความผ่าน DOM `.textContent` และการทำ Sanitization
- **SQL Injection Prevention:** ใช้ Prepared Statements (`?` placeholder) ผ่าน `mysql2/promise` ทั้งหมด

---

## 💻 เทคโนโลยีที่ใช้ (Tech Stack)

| ส่วนของระบบ | เทคโนโลยีที่เลือกใช้ |
| :--- | :--- |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js v5](https://expressjs.com/), [mysql2](https://www.npmjs.com/package/mysql2), [bcryptjs](https://www.npmjs.com/package/bcryptjs), [cors](https://www.npmjs.com/package/cors), [morgan](https://www.npmjs.com/package/morgan) |
| **Frontend** | HTML5, Vanilla JavaScript (ES6+), [Tailwind CSS (CDN)](https://tailwindcss.com/), Google Fonts ([Prompt](https://fonts.google.com/specimen/Prompt)) |
| **Database** | MySQL / MariaDB (จัดการผ่าน [phpMyAdmin](https://www.phpmyadmin.net/)) |
| **Tools** | XAMPP / Laragon, Git, VS Code |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
d:/Thibest/
├── package.json              # กำหนดค่าโปรเจกต์และรายการ Dependencies
├── database.js               # เชื่อมต่อ MySQL Connection Pool (mysql2/promise)
├── server.js                 # Express.js RESTful API, Controller, Routing & Auth
├── thibest_db.sql            # ไฟล์โครงสร้าง Database และ Seed Data สำหรับ phpMyAdmin
├── TEST_CASES.md             # รายการผลการทดสอบระบบและความปลอดภัย (Test Cases Log)
├── SLIDE_PRESENTATION.md     # เนื้อหาสไลด์สำหรับพรีเซนต์โปรเจกต์
├── .gitignore                # ละเว้น node_modules และไฟล์ชั่วคราว
└── public/
    └── index.html            # หน้าเว็บ Single Page E-Commerce UI + Tailwind CSS
```

---

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน (Getting Started)

### 1. ข้อกำหนดเบื้องต้น (Prerequisites)
- ติดตั้ง **[Node.js](https://nodejs.org/)** (เวอร์ชัน 18 ขึ้นไป)
- ติดตั้ง **[XAMPP](https://www.apachefriends.org/)** หรือ **[Laragon](https://laragon.org/)** สำหรับเปิดใช้งาน MySQL/MariaDB และ phpMyAdmin

---

### 2. ติดตั้งโปรเจกต์ (Installation)

```bash
# 1. Clone หรือเปิดโฟลเดอร์โปรเจกต์
cd d:/Thibest

# 2. ติดตั้ง Dependencies ทั้งหมด
npm install
```

---

### 3. นำเข้าฐานข้อมูลใน phpMyAdmin (Database Setup)

1. เปิดโปรแกรม **XAMPP Control Panel** หรือ **Laragon** แล้วกด **Start** ที่โมดูล **Apache** และ **MySQL**
2. เปิดเว็บเบราว์เซอร์ไปที่: `http://localhost/phpmyadmin`
3. ไปที่เมนู **Import (นำเข้า)** จากเมนูด้านบน
4. คลิกปุ่ม **Choose File (เลือกไฟล์)** แล้วเลือกไฟล์ **`thibest_db.sql`** ในโฟลเดอร์โปรเจกต์
5. เลื่อนลงด้านล่างแล้วกดปุ่ม **Import (นำเข้า / ไป)** เพื่อสร้างฐานข้อมูล `thibest_db` และตารางทั้งหมดพร้อมข้อมูลเริ่มต้น

---

### 4. ตรวจสอบการตั้งค่าฐานข้อมูล (Database Configuration)

เปิดไฟล์ `database.js` เพื่อตรวจสอบหรือแก้ไข Username / Password ของ MySQL ให้ตรงกับเครื่องของคุณ:

```javascript
// database.js
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'rootroot',   // 💡 เปลี่ยนเป็นรหัสผ่าน MySQL เครื่องคุณ (หากไม่มีให้ใส่ '')
  database: 'thibest_db', // ชื่อฐานข้อมูล
  port: 3306,             // พอร์ต MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};
```

---

### 5. เริ่มต้นรันเซิร์ฟเวอร์ (Run Application)

```bash
npm start
```

เมื่อเซิร์ฟเวอร์เริ่มทำงานสำเร็จ จะแสดงข้อความใน Terminal:
```text
✅ เชื่อมต่อฐานข้อมูล MySQL (phpMyAdmin) สำเร็จ!
📦 Database: thibest_db @ localhost:3306
🚀 เซิร์ฟเวอร์ Thibest Clothes กำลังทำงานที่ http://localhost:3000
```

เปิดเบราว์เซอร์แล้วเข้าใช้งานได้ที่: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 ข้อมูลบัญชีผู้ใช้สำหรับทดสอบ (Demo Accounts)

ระบบมีข้อมูลบัญชีตัวอย่างที่ผ่านการ Hash รหัสผ่านด้วย `bcrypt` พร้อมใช้งานทันที:

| บทบาท (Role) | ชื่อผู้ใช้ (Username) | รหัสผ่าน (Password) | สิทธิ์การใช้งาน |
| :--- | :--- | :--- | :--- |
| 👑 **ผู้ดูแลระบบ (Admin)** | `admin` | `admin1234` | เพิ่ม, แก้ไข, ลบสินค้า และสั่งซื้อสินค้า |
| 👤 **ลูกค้าทั่วไป (Customer)** | `userdemo` | `user1234` | ค้นหา, ดูสินค้า, ใช้งานตะกร้า และสั่งซื้อสินค้า |

> 💡 **หมายเหตุ:** สามารถกดปุ่ม **"สมัครสมาชิก"** บนหน้าเว็บเพื่อสร้างบัญชีลูกค้าใหม่ได้ทันที

---

## 📡 รายการ RESTful API Endpoints

| Method | Endpoint | สิทธิ์เข้าถึง | คำอธิบาย |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/products` | ทุกคน | ดึงรายการสินค้าทั้งหมด (รองรับ `?search=` และ `?category=`) |
| `GET` | `/api/products/:id` | ทุกคน | ดึงรายละเอียดสินค้าตาม ID |
| `POST` | `/api/products` | เฉพาะ Admin | เพิ่มสินค้าใหม่ลงในฐานข้อมูล |
| `PUT` | `/api/products/:id` | เฉพาะ Admin | แก้ไขข้อมูลสินค้าตาม ID |
| `DELETE` | `/api/products/:id` | เฉพาะ Admin | ลบสินค้าออกจากฐานข้อมูล |
| `GET` | `/api/categories` | ทุกคน | ดึงรายการหมวดหมู่สินค้าทั้งหมด |
| `POST` | `/api/auth/login` | ทุกคน | เข้าสู่ระบบ (ตรวจสอบรหัสผ่านด้วย `bcrypt.compare`) |
| `POST` | `/api/auth/register` | ทุกคน | สมัครสมาชิกใหม่ (Hash รหัสผ่านลงใน `users`) |
| `POST` | `/api/auth/logout` | ทุกคน | ออกจากระบบ |

---

## 📋 เอกสารการทดสอบระบบ (Test Cases & Documentation)

- ดูรายการผลการทดสอบความปลอดภัยและการทำงานทั้งหมดได้ที่: **[TEST_CASES.md](file:///d:/Thibest/TEST_CASES.md)**
- ดูเนื้อหาสไลด์สำหรับนำเสนอได้ที่: **[SLIDE_PRESENTATION.md](file:///d:/Thibest/SLIDE_PRESENTATION.md)**

---

## 📄 License & Credits

พัฒนาขึ้นเพื่อการศึกษาและเป็นตัวอย่างระบบ E-Commerce ด้วย Full-stack Node.js + MySQL  
Made with ❤️ by Thibest Team
