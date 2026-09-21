# 🧠 TraumaCare

### AI-Assisted Trauma Triage & Mental Health Support Platform

<p align="center">
  <strong>TraumaCare</strong> is a technology-driven platform designed to assist in identifying psychological distress, organizing trauma-related information, and supporting faster intervention through AI-assisted analysis.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
</p>

---

## 🌟 Overview

**TraumaCare** is a web-based platform focused on trauma assessment and early identification of psychological distress.

The application combines:

* 🧠 AI-assisted distress analysis
* 📝 Text-based assessment
* 🎙️ Voice-based interaction
* 📊 Trauma/triage analysis
* 📈 Diagnostic visualization
* 🔐 User authentication
* 🗄️ Secure data storage
* 🕒 Assessment history
* 🥽 VR-related support interfaces

The goal is to provide a structured digital environment that can assist users and authorized personnel in understanding trauma-related indicators and facilitating appropriate intervention.

> **Note:** TraumaCare is a technological support system and should not be treated as a replacement for qualified medical, psychological, or legal professionals.

---

## ✨ Key Features

### 🧠 Distress Analysis

Processes assessment information using a dedicated distress-analysis engine to identify relevant indicators.

### 📝 Text Assessment

Allows users to provide information through text-based interaction.

### 🎙️ Voice Interaction

Provides a voice-oriented interface for trauma-related interaction and assessment.

### 📊 Triage Dashboard

Presents analyzed information through a structured dashboard for easier interpretation.

### 📈 Diagnostic Visualization

Visualizes assessment-related information using interactive diagnostic charts.

### 🕒 Assessment History

Maintains previous assessment information so authorized users can review historical records.

### 🔐 Authentication

Uses Supabase authentication to manage user access.

### 🗄️ Database

Supabase is used for persistent application data and backend services.

### 🥽 VR Interface

Includes dedicated interfaces for VR-related trauma-support experiences.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   TraumaCare UI     │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
        ┌─────────┐       ┌─────────┐       ┌─────────┐
        │  Text   │       │  Voice  │       │   VR    │
        │Assessment│      │Assessment│      │Interface│
        └────┬────┘       └────┬────┘       └────┬────┘
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Distress Analysis   │
                    │      Engine         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Triage Dashboard   │
                    │ & Visualization      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Supabase       │
                    │ Auth + Database     │
                    └─────────────────────┘
```

---

## 🛠️ Technology Stack

| Technology       | Purpose                             |
| ---------------- | ----------------------------------- |
| **React**        | User interface                      |
| **TypeScript**   | Type-safe application development   |
| **Vite**         | Development server and build system |
| **Tailwind CSS** | UI styling                          |
| **Lucide React** | Interface icons                     |
| **Supabase**     | Authentication and database         |
| **ESLint**       | Code quality and linting            |

---

## 📁 Project Structure

```text
TraumaCare/
│
├── public/
│   ├── courtroom.html
│   └── sanctuary.html
│
├── src/
│   │
│   ├── components/
│   │   ├── AuthScreen.tsx
│   │   ├── DiagnosticsChart.tsx
│   │   ├── HistoryTab.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TextTab.tsx
│   │   ├── TriageDashboard.tsx
│   │   ├── VRTab.tsx
│   │   └── VoiceTab.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── lib/
│   │   ├── distressEngine.ts
│   │   └── supabase.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── supabase/
│   └── migrations/
│
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/TraumaCare.git
cd TraumaCare
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

⚠️ **Never commit your `.env` file to GitHub.**

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local URL displayed by Vite.

---

## 🔧 Available Commands

```bash
# Start development server
npm run dev

# Build production version
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Run TypeScript checking
npm run typecheck
```

---

## 🔐 Environment Variables

TraumaCare requires Supabase configuration.

| Variable                 | Description                          |
| ------------------------ | ------------------------------------ |
| `VITE_SUPABASE_URL`      | Supabase project URL                 |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public client key |

For security:

* Never upload `.env`
* Never expose service-role keys
* Never commit private credentials
* Use environment variables for deployment

---

## 🔄 Application Flow

```text
User
  │
  ▼
Authentication
  │
  ▼
Assessment
  │
  ├── Text
  ├── Voice
  └── VR
  │
  ▼
Distress Analysis
  │
  ▼
Triage Processing
  │
  ▼
Visualization
  │
  ▼
Assessment History
  │
  ▼
Supabase Database
```

---

## 🎯 Project Objectives

* Provide a structured digital trauma-assessment environment
* Assist with early identification of distress indicators
* Organize assessment information
* Provide visual insights through dashboards
* Maintain assessment history
* Support technology-assisted intervention workflows

---

## 🔮 Future Improvements

Potential future development includes:

* Advanced ML model integration
* Explainable AI using SHAP
* Automated notification workflows
* Integration with authorized support personnel
* Improved voice analysis
* Expanded VR experiences
* Mobile application support
* Enhanced analytics and reporting
* Role-based access control

---

## ⚠️ Disclaimer

TraumaCare is an educational/technological project intended to demonstrate the use of modern web technologies and AI-assisted analysis in trauma-support workflows.

It does **not** provide medical, psychological, legal, or emergency advice and should not replace qualified professionals or emergency services.

---

## 👨‍💻 Development

Built using modern web technologies with a focus on modular architecture, usability, and extensibility.

```text
React
  +
TypeScript
  +
Vite
  +
Tailwind CSS
  +
Supabase
  =
TraumaCare
```

---

## 📄 License

This project is currently intended for educational and demonstration purposes.

A formal open-source license can be added if the project is released for public reuse.

---

<p align="center">
  Made with 🧠, 💻 & ❤️
</p>
