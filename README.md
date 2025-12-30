# 📌 Pastebin Lite – Secure Paste Sharing App

A simple and secure Pastebin-like web application that allows users to paste text and share it via unique links.  
Built with **Next.js**, **Upstash Redis**, and deployed using **Vercel**.

---

## 🚀 Features
- ✏️ Create and save text snippets
- 🔗 Shareable unique links
- ⏳ Supports expiry
- ⚡ Fast (Serverless + Redis)
- ☁️ Free tier friendly
- 🛡️ Secure (no data leaks, no analytics tracking)

---

## 📂 Tech Stack
- **Frontend:** Next.js / React
- **Backend:** Next.js API Routes
- **Database:** Upstash Redis
- **Hosting:** Vercel

---

# ✅ Getting Started (Local Setup)

### 📥 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### 📦 2️⃣ Install Dependencies
```bash
npm install
```

---

## 🔐 3️⃣ Create `.env.local` File
Create a `.env.local` file in project root and add environment variables:

```
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ Never commit `.env` to GitHub.

---

# 🗄️ Upstash Setup Guide

### 1️⃣ Go to Upstash
https://console.upstash.com

### 2️⃣ Create Redis Database
- Click **Redis**
- Click **Create Database**
- Select:
  - Region closest to Vercel
  - Free tier is enough

### 3️⃣ Open Database
Copy the following values:
- **REST URL**
- **REST TOKEN**

### 4️⃣ Paste them in `.env.local`
```
UPSTASH_REDIS_REST_URL=xxxxxxxxxxxxxxxx
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxx
```

Save the file.

---

# ▶️ Run Locally
```bash
npm run dev
```

Visit:
```
http://localhost:3000
```

---

# 🌍 Deployment — Vercel

### 1️⃣ Push Project to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

---

## 🚀 Deploy on Vercel

### Step 1 — Open Vercel
https://vercel.com

Login using GitHub

---

### Step 2 — Import Project
- Click Add New → Project
- Select your GitHub Repo

---

### Step 3 — Add Environment Variables

Go to:
```
Project → Settings → Environment Variables
```

Add:

| Key | Value |
|------|--------|
| UPSTASH_REDIS_REST_URL | your value |
| UPSTASH_REDIS_REST_TOKEN | your value |
| NEXT_PUBLIC_APP_URL | your vercel domain |

Environment: All

Click Save

---

### Step 4 — Redeploy
Click Deploy / Redeploy

Done 🎉

---

# 🧪 Test
Open:
```
https://your-project-name.vercel.app
```

If Paste Not Found appears → env problem → fix & redeploy

---

# 🛠️ Common Issues

Paste Not Found → Check Upstash credentials  
Undefined Variables → Add env + redeploy  
Works Locally but Not on Vercel → Use /api not localhost APIs

---

