# 📚 AI Study Assistant (SaaS Platform)

A Full Stack SaaS application that transforms static PDF documents into interactive study materials using Artificial Intelligence.

Users can upload documents to chat with them, generate flashcards, and create interactive quizzes to test their knowledge. The platform features a credit-based subscription system (Free vs. Paid tiers).

## 🚀 Key Features

* **📄 Document Analysis:** Upload PDFs and extract text for AI processing.
* **🤖 Chat with PDF (RAG):** Context-aware chat using Google Gemini and Pinecone (Vector DB) to answer questions based *only* on your document.
* **⚡ Real-time Updates:** Instant  updates using Socket.IO.
* **🧠 Study Tools:** Automatically generate Flashcards and Quizzes from document content.
* **🔐 Authentication:** Secure login with Google OAuth and Email/Password.
* **💰 Subscription System:** Tiered access (Free/Premium) with usage limits tracked in the database.
* **⚙️ Background Processing:** Uses Inngest to handle heavy AI tasks (embeddings, text parsing) without freezing the UI.

## 🛠️ Tech Stack

### Frontend
* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State/Data:** React Router, Axios,Zustand

### Backend
* **Server:** Node.js, Express.js
* **Real-time:** Socket.IO
* **Background Jobs:** Inngest (Serverless Queues)

### Database & Storage
* **Main Database:** PostgreSQL
* **ORM:** Prisma
* **Vector Database:** Pinecone (for AI Embeddings)
* **Caching and user Sessions:** Redis
* **File Storage:** Cloudinary

### AI & Machine Learning
* **LLM:** Google Gemini , OpenAi
* **Framework:** LangChain

## 🗄️ Database Schema

The application uses a relational schema managed by Prisma. Key models include:
* **User:** Manages authentication, roles, and subscription plans.
* **Document:** Stores file metadata and processing status.
* **ChatMessage:** Stores chat history for context-aware AI responses.
* **Flashcard/Quiz:** Generated study materials linked to specific documents.

