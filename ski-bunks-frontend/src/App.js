import './App.css';
import Calendar from './Calendar.js'
import { useState, React } from 'react';

function App() {

  let today = new Date();
  let currentMonth = today.getMonth() + 1;

  const [month, setMonth] = useState(currentMonth);

  return (
    <div className="App">
      <Calendar month={month} />
    </div>
  );
}

export default App;
