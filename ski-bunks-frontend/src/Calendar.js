import React, { useState, useEffect } from 'react'
import './Calendar.css';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Calendar(props) {

  const year = new Date().getFullYear(); // You can change this to the desired year
  
  const monthArray = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'
  ];

  const [month, setMonth] = useState(new Date().getMonth() + 1);   
  const [availableBeds, setAvailableBeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    axios.get(`https://fi9au6homh.execute-api.us-west-2.amazonaws.com/prod?month=${month}`)
      .then((response) => {
        setAvailableBeds(response.data);
        setIsLoading(false);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
    });
  }, [month]);


  const daysInMonth = getDaysInMonth(month, year);
  const startingDay = getStartingDay(month, year);
  const readableMonth = monthArray[month - 1];

  function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  function getStartingDay(month, year) {
    // Calculate the starting day of the month (0 for Sunday, 1 for Monday, etc.)
    const startingDay = new Date(year, month - 1, 1).getDay();
    // Ensure the grid starts on Sunday
    return startingDay === 0 ? 7 : startingDay;
  }

  const cells = [];
  let day = 1;
  let doubleDate = day;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Create cells for each day in the calendar
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startingDay) {
        cells.push(<div key={`empty-${j}`} className="cell empty-cell"></div>);
      } else if (day <= daysInMonth) {

        if (day < 10) { 
          doubleDate = '0' + day 
        } else {
          doubleDate = day;
        }
        
        const bedsAvailableToday = availableBeds[`${year}${month}${doubleDate}`].length;
        let colorClass;

        if (bedsAvailableToday === 0) {
          colorClass = "red";
        } else if (bedsAvailableToday === 1) {
          colorClass = "yellow";
        } else {
          colorClass = "green";
        }

        cells.push(
          <div id={day} key={day} className={`cell ${colorClass}`}>
            <Link to={`/day/${year}${month}${doubleDate}`}>{day}</Link>
            <p>{bedsAvailableToday}</p>
          </div>
        );
        day++;          

      }
    }
  }

  return (
    <div className="calendar">
      <div>
        <button onClick={() => {
          setIsLoading(true)
          setMonth(month - 1)
        }}>Previous Month</button>
        <h2>{readableMonth}</h2>
        <button onClick={() => { 
          setIsLoading(true)
          setMonth( month + 1)
        }}>Next Month</button>
      </div>
      <div className="calendar-grid">{cells}</div>
    </div>
  );
}
