# nuveoInvoicing
# # 🧾 ZATCA-Compliant E-Invoicing System (MERN Stack)

A full-stack invoicing web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js), designed to comply with **ZATCA** (Zakat, Tax and Customs Authority - Saudi Arabia) Phase 2 e-invoicing regulations.

## 🌍 Features

- 🔐 Secure user management and authentication
- 🧾 Create and manage ZATCA-compliant invoices
- 📦 Product and customer management
- 📄 PDF and XML generation (Phase 2 compliant)
- ☁️ Cloud-based media storage
- ⚙️ Modular backend with REST APIs (Node.js + Express)
- 🎨 Intuitive frontend (React + Tailwind + Ant Design)
- 🇸🇦 Fully aligned with Saudi Arabia’s ZATCA regulations

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/)
- [Visual Studio Code](https://code.visualstudio.com/) or [WebStorm](https://www.jetbrains.com/webstorm/)
- Git

---

## 🚀 Getting Started

Follow these steps to get the app up and running on your local machine:

### 1. Clone the Repository
```bash
git clone  https://github.com/jawad-arshad-khan97/nuveoInvoicing.git
```

### 2. Setup Frontend
Open a terminal window:
```bash
cd frontend
npm install
npm run dev
```
This will start the React app on http://localhost:5173.

### 2. Setup Backend
Open a second terminal window:
```bash
cd backend
npm install
npm start
This will start the backend server (Node.js + Express) on http://localhost:8080.
```

### ⚙️ Folder Structure
/frontend      → React app with UI & API integrations  
/backend       → Express server with MongoDB & logic  


### 📚 Tech Stack
Layer	Technology
Frontend :	React, TypeScript, Tailwind, Ant Design
Backend	 :  Node.js, Express, Mongoose
Database :	MongoDB (Cloud/Local)
Auth	   :  Octa OAuth
Storage	 :  Cloudinary (for media files)

Invoicing	Custom ZATCA-compliant XML + QR


✅ Compliance
This product follows:

✅ ZATCA Phase 2 specifications

✅ QR code and UUID generation

✅ Invoice XML embedding

✅ JSON → XML translation as per UBL standards


📩 Contact
For queries, support or contributions, contact:

Jawad Arshad Khan
📧 arshad.jak97@gmail.com

📝 License
This project is licensed under the MIT License – see the [LICENCE] file for details.
