import React, {  useState } from 'react'
import './Calendar.css';
import { Link } from "react-router-dom";

export default function Calendar(props) {

  const [month, setMonth] = useState(props.month);    

  function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  
  function getStartingDay(month, year) {
    // Calculate the starting day of the month (0 for Sunday, 1 for Monday, etc.)
    const startingDay = new Date(year, month - 1, 1).getDay();
    // Ensure the grid starts on Sunday
    return startingDay === 0 ? 7 : startingDay;
  }
  
  function renderDay(day) {
    console.log(day); 
  }
  
  const year = new Date().getFullYear(); // You can change this to the desired year

  const daysInMonth = getDaysInMonth(month, year);
  const startingDay = getStartingDay(month, year);

  const monthArray = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'
  ];

  const readableMonth = monthArray[month - 1];

  const cells = [];
  let day = 1;

  // Create cells for each day in the calendar
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startingDay) {
        cells.push(<div key={`empty-${j}`} className="cell empty-cell"></div>);
      } else if (day <= daysInMonth) {
        cells.push(
          <div id={day} key={day} className="cell" onClick={() => renderDay(day)}>
            <Link to={`/day/${year}${month}${day}`}>{day}</Link>
          </div>
        );
        day++;
      }
    }
  }

  return (
    <div className="calendar">
      <div>
        <button onClick={() => setMonth({ month: month - 1 })}>Previous Month</button>
        <h2>{readableMonth}</h2>
        <button onClick={() => setMonth({ month: month + 1 })}>Next Month</button>
      </div>
      <div className="calendar-grid">{cells}</div>
    </div>
  );
}
