import './App.css';
import Header from './Header.js'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from './Calendar.js'
import Reservations from './Reservations.js'
import Day from './Day.js'
import { useState, React } from 'react';

function App() {

  let today = new Date();
  let currentMonth = today.getMonth() + 1;

  const [month, setMonth] = useState(currentMonth);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Calendar month={month} setMonth={setMonth} />} />
          <Route path="day/*" element={<Day />} /> 
          <Route path="reservations" element={<Reservations />} /> 
          <Route path="*" element={<Calendar month={month} setMonth={setMonth} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
