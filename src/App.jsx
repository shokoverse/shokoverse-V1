import React from 'react'
import './App.css';
import { Footer, Head, Possibility, WhatSHK} from './containers'
import { Cta,Navbar} from './components'
import LoginApp from './components/LoginApp';


function App() {
  return (

    <div className="App">
      <Navbar />
      <Head />
      <WhatSHK />   
      <Possibility/>
      <Cta />
      <Footer />
      {/* <LoginApp/>    */}
    </div>
  );
};

export default App;
