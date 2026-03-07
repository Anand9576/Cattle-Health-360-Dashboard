# 🐄 Cattle Health 360

A modern, IoT-enabled livestock monitoring dashboard built with Next.js.
- Live site: https://cattle-health-360-dashboard.vercel.app

-------

## 🔍 Overview

Cattle Health 360 is a responsive, frontend-only prototype that provides a unified view of a Smart Cattle Monitoring System. It offers real-time visualization of herd health, individual animal biometrics, and hardware status. Designed to demonstrate Predictive Intervention and Operational Efficiency, it enables farmers and veterinarians to detect anomalies (such as fever or lameness) early through a "Digital Twin" interface.

------

## 🚀 Features

- ⚡ Modern UI with dark-mode glassmorphism
- 📊 Real-time herd health & sensor simulation
- 🔔 Interactive alerts & diagnostic modals
- 📱 Fully responsive layout for field use
- ⚙️ Built using Next.js & Tailwind CSS
- ☁️ Hosted on Vercel

------

## 🌐 Live Demo

👉 https://cattle-health-360-dashboard.vercel.app

------

## 📹 User Guidance Video

👉 https://www.loom.com/share/26180f841d5846f38229ccd326005e28

------

## 🛠️ Tech Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Icons: Lucide React
- Visualization: Recharts
- Deployment: Vercel
- Hosting Type: Static (Prototype / No Backend)
- Developed In: Firebase Studio

------

## 📁 Folder Structure

```
.
├── public/                                # Static assets (images, icons)
│   └── cattle-hero.jpg
├── src/
│   ├── app/                               # Next.js App Router
│   │   ├── layout.tsx                     # Root layout (HTML/Body tags)
│   │   ├── page.tsx                       # Main Dashboard (Tabs 1-9 Logic)
│   │   └── globals.css                    # Global Tailwind styles
│   ├── components/
│   │   ├── ui/                            # Reusable UI elements
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Badge.tsx
│   │   ├── dashboard/                     # specific Dashboard Widgets
│   │   │   ├── MetricCard.tsx             # Top KPI Cards
│   │   │   ├── AlertFeed.tsx              # Tab 2: Alerts List
│   │   │   ├── VitalityCharts.tsx         # Tab 3: Health Graphs
│   │   │   ├── HardwareInspector.tsx      # Tab 4: Live Sensor View
│   │   │   └── CowProfile.tsx             # Tab 8: Individual Search
│   │   └── layout/                        # specific Layout Components
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── NotificationBar.tsx        # Global Top Bar
│   └── lib/                               # Utilities & Data
│       ├── constants.ts                   # STATIC_DB (Mock Data)
│       └── utils.ts                       # Helper functions (cn, formatters)
├── next.config.js                         # Next.js configuration
├── tailwind.config.ts                     # Tailwind CSS configuration
├── tsconfig.json                          # TypeScript configuration
├── package.json                           # Project dependencies
└── README.md                              # Project documentation
```
