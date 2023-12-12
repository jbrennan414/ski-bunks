import './App.css';
import Header from './Header.js'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from './Calendar.js'
import Reservations from './Reservations.js'
import Day from './Day.js'
import { React } from 'react';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Calendar />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="day/:day" element={<Day />} /> 
          <Route path="reservations" element={<Reservations />} /> 
          <Route path="*" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
