import React, { useState, useEffect } from 'react'
import './Calendar.css';
import { Link } from "react-router-dom";
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { getMonthFromInteger } from './utils';

export default function Calendar(props) {

  const [month, setMonth] = useState(new Date().getMonth() + 1);   
  const [year, setYear] = useState(new Date().getFullYear());
  const [availableBeds, setAvailableBeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    axios.get(`https://twx69ovt0b.execute-api.us-west-2.amazonaws.com/prod?month=${month}&year=${year}`)
      .then((response) => {
        setAvailableBeds(response.data);
        setIsLoading(false);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
    });
  }, [month]);


  const daysInMonth = getDaysInMonth(month, year);
  const startingDay = getStartingDay(month, year);
  const readableMonth = getMonthFromInteger(month - 1);

  function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  function getStartingDay(month, year) {
    // Calculate the starting day of the month (0 for Sunday, 1 for Monday, etc.)
    const startingDay = new Date(year, month - 1, 1).getDay();
    // Ensure the grid starts on Sunday
    return startingDay === 0 ? 7 : startingDay;
  }

  function updateMonth(month){

    if (month === 13) {
      setMonth(1);
      setYear(year + 1);
      return;
    } else if (month === 0) {
      setMonth(12);
      setYear(year - 1);
      return;
    } else {
      setMonth(month);
    }
  }

  const cells = [];
  let day = 1;
  let doubleDate = day;

  if (isLoading || availableBeds.length === 0) {
    return <div>Loading...</div>;
  }

  cells.push(<div key={"s"} className="cell">S</div>)
  cells.push(<div key={"m"} className='cell'>M</div>)
  cells.push(<div key={"t"} className='cell'>T</div>)
  cells.push(<div key={"w"}className='cell'>W</div>)
  cells.push(<div key={"th"} className='cell'>Th</div>)
  cells.push(<div key={"f"} className='cell'>F</div>)
  cells.push(<div key={"sat"} className='cell'>S</div>)

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startingDay) {
        if (startingDay !== 7) {
          cells.push(<div key={`empty-${j}`} className="cell empty-cell"></div>);
        }
      } else if (day <= daysInMonth) {

        if (day < 10) { 
          doubleDate = '0' + day 
        } else {
          doubleDate = day;
        }

        const bedsAvailableToday = availableBeds[`${year}${month < 10 ? "0" + month : month}${doubleDate}`].length;
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
            <Link style={{ textDecoration: 'none', color: 'white'}} to= {`/day/${year}${month}${doubleDate}`}>{day}</Link>
          </div>
        );
        day++;          

      }
    }
  }

  return (
    <div className="calendar">
      <div className="month-nav">
        <NavigateBeforeIcon onClick={() => {
          setIsLoading(true)
          updateMonth(month - 1)
        }}/>

        <h2>{readableMonth}</h2>
        <NavigateNextIcon onClick={() => {
          setIsLoading(true)
          updateMonth( month + 1)
        }}/>
      </div>
      <div className="calendar-grid">{cells}</div>
    </div>
  );
}
