import React, { useState } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';
import Dashboard from './Dashboard';

function LoginApp() {
  const [account, setAccount] = useState(null);

  return (
    <div>
      <nav className="text-white bg-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <NavLink
              to="/getstarted"
              className="text-lg font-semibold hover:text-blue-300 transition"
            >
              <img src="/logo.png" alt="logo" className="w-[210px]" />
            </NavLink>
          </div>
          <ConnectWallet setAccount={setAccount} />
        </div>
      </nav>

      <div className="sm:h-[90vh] h-full flex bg-gray-100 bg-gradient-to-r from-gray-200 to-gray-300">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col m-auto w-full text-center animate-fade-in">
                <svg
                  className="w-[100px] h-[100px] text-blue-700 m-auto"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.3"
                    d="M14.6144 7.19994c.3479.48981.5999 1.15357.5999 1.80006 0 1.6569-1.3432 3-3 3-1.6569 0-3.00004-1.3431-3.00004-3 0-.67539.22319-1.29865.59983-1.80006M6.21426 6v4m0-4 6.00004-3 6 3-6 2-2.40021-.80006M6.21426 6l3.59983 1.19994M6.21426 19.8013v-2.1525c0-1.6825 1.27251-3.3075 2.95093-3.6488l3.04911 2.9345 3-2.9441c1.7026.3193 3 1.9596 3 3.6584v2.1525c0 .6312-.5373 1.1429-1.2 1.1429H7.41426c-.66274 0-1.2-.5117-1.2-1.1429Z"
                  />
                </svg>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to Shokoverse
                </h1>
                <p className="mt-4 text-red-600 text-lg">
                  Choose your role: Institution or Student
                </p>
                <div className="grid grid-cols-2 w-full md:w-[400px] mt-5 gap-1.5 px-2.5 m-auto mb-3">
                  <NavLink
                    to="institution" // Relative path
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 animate-fade-in transition"
                  >
                    Institution
                  </NavLink>
                  <NavLink
                    to="student" // Relative path
                    className="shadow-drop-2-center w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 animate-fade-in transition"
                  >
                    Student
                  </NavLink>
                </div>
              </div>
            }
          />
          <Route
            path="institution"
            element={<Dashboard account={account} isInstitution={true} />}
          />
          <Route
            path="student"
            element={<Dashboard account={account} isInstitution={false} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default LoginApp;