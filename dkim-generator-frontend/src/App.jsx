import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DkimForm from "./components/DkimForm";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DkimForm />} />
      </Routes>
    </Router>
  );
}
