import React from 'react'
import './App.css';
import { Footer, Head, Possibility, WhatSHK} from './containers'
import { Cta,Navbar} from './components'

const App = () => {
  return (
    <div className="App">
      <div className="gradient__bg">
        <Navbar />
        <Head />
      </div>
      <WhatSHK />   
      <Possibility/>
      <Cta />
      <Footer />

    </div>
  );
};

export default App;
