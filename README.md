# 🤖 AI Chat Bot — Full-Stack Conversational Application  

A responsive, full-stack AI chat bot built with modern frontend and backend technologies.  
This project demonstrates end-to-end development — from UI to server to AI integration — featuring clean architecture, modular code, and deployable infrastructure.

---

## 🚀 Built With  
- ⚛️ **Frontend**: React (with TypeScript)  
- 🎨 **Styling & UI**: Tailwind CSS (with Shadcn) 
- 🧠 **AI / Chat Engine**: OpenAI API  
- 🖥 **Backend**: Node.js + Express 
- 🧩 **ORM / Database**: Prisma ORM + SQL database 

---

## ✨ Features  
✅ Real-time AI-powered chat interface  
✅ Full-stack architecture (React + Node + Prisma)  
✅ Stores and retrieves chat history from a relational database  
✅ Responsive, mobile-friendly UI  
✅ Clean, reusable TypeScript components  
✅ Secure environment variable management  
✅ Scalable, production-ready configuration  
---

## 🛠 Getting Started  

### Prerequisites  
- Node.js (>= 14.x)  
- npm or Yarn  
- A database connection (PostgreSQL, SQLite, or MySQL)  
- API key for AI model (e.g., `OPENAI_API_KEY`)  

---

### Installation  

```bash
# Clone the repository
git clone https://github.com/shahab-faderani/ai-chat-bot.git

# Navigate to the project folder
cd ai-chat-bot

# Install dependencies
npm install   # or yarn install

# Initialize Prisma
npx prisma init

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio for visual data browsing
npx prisma studio

# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev

