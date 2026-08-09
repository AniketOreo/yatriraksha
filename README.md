# 🚚 YatriRaksha — Real-Time Fleet Safety & Highway Incident RAG Assistant

> **A modern, full-stack logistics and emergency management platform designed for India's national highways.** Combining **MERN Stack**, **Socket.IO (WebSockets)**, **Retrieval-Augmented Generation (RAG)**, and **GovTech/Map APIs**.

---

## 🌟 Overview

**YatriRaksha** bridges the gap between long-haul truck drivers on remote Indian highways, fleet operations managers in central control rooms, and emergency mechanics nearby. 

When drivers face vehicle breakdowns, complex RTO rules, or highway emergencies, YatriRaksha provides:
1. **Real-Time GPS Telemetry:** Continuous low-latency location broadcasting over WebSockets.
2. **AI Highway RAG Assistant:** Fact-checked technical troubleshooting and legal advice powered by Qdrant Vector DB & Gemini AI.
3. **One-Tap Emergency SOS:** Automated garage discovery via Google Maps API & instant WhatsApp alerts via Twilio.

---

## 🏗️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │       Driver Mobile Web Interface      │
                               │  (GPS Telemetry, Voice RAG, SOS Tap)   │
                               └──────────────────┬─────────────────────┘
                                                  │
                                       Socket.IO  │  HTTP REST
                                      (WebSockets)│ (Auth / Ingestion)
                                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   YatriRaksha Backend Gateway                                    │
│                                 (Node.js / Express Server)                                       │
└──────────────┬──────────────────────────┬──────────────────────────┬─────────────────────────────┘
               │                          │                          │
               ▼                          ▼                          ▼
   ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
   │    Socket.IO Room     │  │    RAG Engine         │  │ External API Services │
   │    Broadcaster        │  │ (Qdrant / ChromaDB)   │  │ (Vahan, Maps, SMS)    │
   └───────────┬───────────┘  └───────────┬───────────┘  └───────────┬───────────┘
               │                          │                          │
               ▼                          ▼                          ▼
 ┌─────────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
 │ Control Room Dashboard  │  │ Ingested Knowledge:   │  │  - Vahan RTO API      │
 │ (React + Google Maps)   │  │  - Tata/Leyland Docs  │  │  - Google Places API  │
 └─────────────────────────┘  │  - MV Act 2019 / RTO  │  │  - Twilio WhatsApp    │
                              └───────────────────────┘  └───────────────────────┘
```

---

## ✨ Key Features

- **📱 Driver Mobile Module:**
  - **Live GPS Broadcasting:** Toggle "Start Duty" to stream coordinates every 3 seconds with zero page refresh.
  - **Streaming RAG AI Assistant:** Ask breakdown questions in Hindi or English (e.g., *"Engine coolant light glowing, what to do?"*) and receive step-by-step verified repair protocols.
  - **One-Tap Emergency SOS:** Triggers visual alarms on manager dashboards and dispatches location links to emergency contacts.

- **🖥️ Fleet Manager Control Room Module:**
  - **Interactive Fleet Map:** Live Google Maps interface tracking moving trucks across national highways.
  - **Emergency Incident Drawer:** Pops up when a driver triggers SOS, showing nearest verified garages & dispatch controls.
  - **Vahan & Compliance Inspector:** Real-time checking of vehicle fitness, permit status, and E-Way bills.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS | Fast, responsive single-page application. |
| **Real-Time Gateway** | Socket.IO (WebSockets) | Low-latency bidirectional event broadcasting. |
| **Backend API** | Node.js, Express.js | JWT-authenticated REST APIs. |
| **Database** | MongoDB (Mongoose) | User profiles, vehicle records, incident history. |
| **Vector DB (RAG)** | Qdrant / ChromaDB | High-performance vector similarity search over manual PDFs. |
| **LLM & Embeddings** | Google Gemini 1.5 Flash API | Generates factual streaming troubleshooting answers. |
| **External APIs** | Google Maps Places API, Twilio | Nearby mechanic discovery & WhatsApp emergency alerts. |

---

## 📁 Repository Structure

```
yatriraksha/
├── README.md                  # Project documentation
├── server/                    # Backend Node.js / Express / Socket.IO app
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── src/
│       ├── config/            # DB & Environment setup
│       ├── models/            # Mongoose Schemas (User, Vehicle, Incident)
│       ├── routes/            # REST API endpoints (Auth, RAG, Telemetry, SOS)
│       ├── sockets/           # Socket.IO handlers for telemetry & emergency
│       └── index.js           # Main server entrypoint
└── client/                    # Frontend React (Vite) app
    ├── package.json
    ├── index.html
    └── src/
        ├── context/           # Socket.IO & Auth Context Providers
        ├── pages/             # Login, Driver Dashboard, Admin Control Room
        ├── App.jsx            # Main React App & Router
        └── main.jsx
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI
- Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MONGODB_URI and GEMINI_API_KEY
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to launch the web application.

---

## 🔑 Environment Variables (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yatriraksha
JWT_SECRET=yatriraksha_jwt_secret_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
QDRANT_URL=https://your-qdrant-cluster.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
