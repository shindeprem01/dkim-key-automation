import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DkimForm from "./components/DkimForm";
import "@tabler/core/dist/css/tabler.min.css";

const App: React.FC = () => {
return (
<Router>
  <Routes>
    <Route path="/" element={<DkimForm />} />
  </Routes>
</Router>
);
};

export default App;