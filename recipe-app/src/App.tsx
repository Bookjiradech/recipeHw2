import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto px-5 py-6">
        <Outlet />
      </div>
      <footer className="bg-gray-200 text-black text-center p-4">
        <p>&copy; 2025 Menu Recipe. All rights reserved.</p>
      </footer>
    </div>
  );
}
