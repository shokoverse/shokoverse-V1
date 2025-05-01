import React from 'react';
import './App.css';
import { Footer, Head, Possibility, WhatSHK } from './containers';
import { Cta, Navbar } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginApp from './components/LoginApp';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Navbar />
                <Head />
                <WhatSHK />
                <Possibility />
                <Cta />
                <Footer />
              </div>
            }
          />
          <Route path="/getstarted/*" element={<LoginApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;