# 📖 Multaqa Quran Back-End – An-Najah National University

A back-end system for managing the Quranic gathering (**Multaqa Quran**) at An-Najah National University. The project is designed to facilitate the administration of Quran memorization circles (ḥalaqāt), track student progress, manage teachers (muḥaffiẓīn), and generate performance reports.

---

## 📌 Project Overview

This project provides a RESTful API to support the following features:

- Student and teacher account management
- Creating and managing Quran memorization circles (ḥalaqāt)
- Recording student memorization and review sessions
- Generating progress reports
- (Optional future feature) Admin dashboard with notifications and analytics

---

## 🛠️ Technologies Used

- **Language:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize – SQL Object Relational Mapper for Node.js
- **Libraries & Tools:**
  - `sequelize` – ORM for SQL databases
  - `dotenv` – Environment configuration
  - `cors` – Cross-Origin support
  - `jsonwebtoken` – Authentication via JWT
  - `bcrypt` – Password hashing

---

## 🚀 Getting Started

### 🔧 Installation

```bash
# 1. Clone the repository
git clone https://github.com/eidabdallah/multaqaQuranBackEnd.git

# 2. Navigate to the project folder
cd multaqaQuranBackEnd

# 3. Install dependencies
npm install

# 4. Create a .env file and set the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# 5. Start the server
npm run dev
