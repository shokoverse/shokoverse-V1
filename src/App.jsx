import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";

function App() {
  const [account, setAccount] = useState(null);

  return (
    <Router>
      <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <NavLink
              to="/"
              className="text-lg font-semibold hover:text-blue-300 transition"
            >
              Certificate NFT
            </NavLink>
            <NavLink
              to="/institution"
              className="hover:text-blue-300 transition"
            >
              Institution
            </NavLink>
            <NavLink
              to="/student"
              className="hover:text-blue-300 transition"
            >
              Student
            </NavLink>
          </div>
          <ConnectWallet setAccount={setAccount} />
        </div>
      </nav>

      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/institution"
            element={<Dashboard account={account} isInstitution={true} />}
          />
          <Route
            path="/student"
            element={<Dashboard account={account} isInstitution={false} />}
          />
          <Route
            path="/"
            element={
              <div className="text-center py-16 animate-fade-in">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to Certificate NFT Minting
                </h1>
                <p className="mt-4 text-gray-600">
                  Choose your role: Institution or Student
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;