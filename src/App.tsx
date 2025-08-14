// src/app.tsx (or src/App.tsx)
import DemoReviewerApp from "@/DemoReviewerApp";
import "./index.css";

// ✅ Add this import
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <DemoReviewerApp />
      {/* ✅ Renders the lightweight tracker on every page */}
      <Analytics />
    </>
  );
}
