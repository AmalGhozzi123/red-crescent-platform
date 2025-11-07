# 🩺 Red Crescent Management Platform – Beb Bhar Committee

This project was developed as part of my role as **IT Manager of the Red Crescent Club – Beb Bhar Committee**.  
It is a **comprehensive web platform** designed to **manage humanitarian missions, volunteers, and club activities** in a modern, centralized, and efficient way.

---

## 🚀 Key Features

- 👥 **Volunteer Management:** registration, activation/deactivation, and profile updates.  
- 🩹 **Mission Management:** creation, modification, and deletion of humanitarian missions.  
- 📅 **Smart Calendar:** visualizes missions based on their current status (ongoing or completed).  
- 🧩 **Volunteer Assignment:** link volunteers to missions via a dynamic **MissionStatus** system.  
- 🔐 **Secure Authentication** for administrators using FastAPI and Firebase.  
- 📨 **Modern & responsive interface** built with **ReactJS** and professional UI design.  
- ⚙️ **RESTful Backend API** built with **FastAPI** and connected to **Firebase Firestore**.  

---

## 🛠️ Technologies Used

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React.js, Tailwind CSS, React Calendar |
| **Backend** | Python, FastAPI, Firebase Admin SDK |
| **Database** | Google Firestore (NoSQL) |
| **Authentication** | JWT + Bcrypt |

---

## ❤️ Project Goal

This application aims to **facilitate the coordination and management of local humanitarian activities**,  
by providing Red Crescent administrators with a **centralized tool** to:
- monitor missions,  
- manage volunteers,  
- and improve communication and responsiveness within the committee.  

---

## ⚙️ Installation 
If you want to run the project locally:
```bash
# Clone the repository
git clone https://github.com/YourUsername/red-crescent-platform.git

# Backend setup
cd backend
pip install -r requirements.txt
uvicorn app:app --reload

# Frontend setup
cd ../frontend
npm install
npm start
