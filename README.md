# Insure Ensure

Insure Ensure is a comprehensive web application designed to handle insurance-related functionalities natively. It provides users with features like AI-powered insurance recommendations, a generalized chatbot, document-based chatting using Retrieval-Augmented Generation (RAG), and a complete reimbursement submission and auditing system.

## 🚀 Key Features

- **AI Recommendations**: Get tailor-made insurance plan recommendations driven by Google Gemini.
- **Intelligent Chatbots**:
  - **General Chatbot**: For answering typical insurance queries.
  - **Document Chat**: Ask questions directly based on your uploaded policy documents (RAG integration).
- **Reimbursement System**: Apply for reimbursements securely and have them audited.
- **Authentication**: Secure sign-up, sign-in, and password recovery via Firebase Authentication.

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) (Powered by [Vite](https://vitejs.dev/))
- [Tailwind CSS v4](https://tailwindcss.com/) for rapid and beautiful styling
- [React Router DOM](https://reactrouter.com/) for navigation
- [Firebase](https://firebase.google.com/) for seamless Authentication

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (using Mongoose) for database management
- [Google GenAI SDK](https://ai.google.dev/) for intelligent chatbots and recommendations
- [Multer](https://github.com/expressjs/multer) for handling file uploads

---

## ⚙️ Prerequisites

Before you start, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [MongoDB](https://www.mongodb.com/) account or local instance
- A [Firebase](https://firebase.google.com/) project (for authentication)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

## 📦 Installation & Setup

Follow these steps to get a local copy up and running.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/insure-ensure.git
cd insure-ensure
```

### 2. Frontend Setup
Install the frontend dependencies:
```bash
npm install
```

Create a `.env` file in the **root** folder (`/Insure_Ensure`) and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"
```

Start the frontend development server:
```bash
npm run dev
```

### 3. Backend Setup
Open a new terminal window/tab and navigate to the backend directory:
```bash
cd server
```

Install the backend dependencies:
```bash
npm install
```

Create a `.env` file in the **server** folder (`/Insure_Ensure/server`) and add your Database and LLM credentials:
```env
PORT=5001
MONGODB_URI="your_mongodb_connection_string"
GEMINI_API_KEY="your_google_gemini_api_key"
```

Start the backend development server:
```bash
npm run dev
```

---

## 🏃‍♂️ Usage

1. Start both the frontend (`npm run dev` in the root) and backend (`npm run dev` in the `/server` folder).
2. Open your browser and navigate to the local link provided by Vite (typically `http://localhost:xxxx`).
3. Sign up or log in to access the Dashboard, generate Recommendations, or use the Chatbot/Document Chat features.
