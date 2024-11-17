import React from "react";
import HomePage from "./components/home";
import { LoginComponent } from "./components/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import necessary components

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
