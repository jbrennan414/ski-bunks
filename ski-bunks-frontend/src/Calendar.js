import React, { useState, useEffect } from 'react'
import './Calendar.css';
import { Link } from "react-router-dom";
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { getMonthFromInteger, isPastDate } from './utils';
import { useLocation } from "react-router-dom";

export default function Calendar(props) {

  const location = useLocation();

  const month = parseInt(location?.state?.month) || new Date().getMonth() + 1;
  const year = parseInt(location?.state?.year) || new Date().getFullYear();

  const [selectedMonth, setMonth] = useState(month);   
  const [selectedYear, setYear] = useState(year);
  const [isLoading, setIsLoading] = useState(true);
  const [availableBeds, setAvailableBeds] = useState({});

  useEffect(() => {

    axios.get(`https://hil0sv4jl3.execute-api.us-west-2.amazonaws.com/prod?month=${selectedMonth}&year=${selectedYear}`)
      .then((response) => {
        setAvailableBeds(response.data);
        setIsLoading(false);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
    });
  }, [selectedMonth, selectedYear]);


  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const startingDay = getStartingDay(selectedMonth, selectedYear);
  const readableMonth = getMonthFromInteger(selectedMonth - 1);

  function getDaysInMonth(selectedMonth, selectedYear) {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }

  function getStartingDay(selectedMonth, selectedYear) {
    // Calculate the starting day of the selectedMonth (0 for Sunday, 1 for Monday, etc.)
    const startingDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    // Ensure the grid starts on Sunday
    return startingDay === 0 ? 7 : startingDay;
  }

  function updateMonth(selectedMonth){

    if (selectedMonth === 13) {
      setMonth(1);
      setYear(parseInt(selectedYear) + 1);
      return;
    } else if (selectedMonth === 0) {
      setMonth(12);
      setYear(parseInt(selectedYear) - 1);
      return;
    } else {
      setMonth(selectedMonth);
    }
  }

  const cells = [];
  let day = 1;
  let doubleDate = day;
  let doubleMonth = selectedMonth;

  if (isLoading) {
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

        if (selectedMonth < 10) {
          doubleMonth = '0' + selectedMonth;
        } else {
          doubleMonth = selectedMonth;
        }

        let colorClass;

        if (availableBeds[`${selectedYear}${doubleMonth}${doubleDate}`] === 0) {
          colorClass = "red";
        } else if (availableBeds[`${selectedYear}${doubleMonth}${doubleDate}`] === 1) {
          colorClass = "yellow";
        } else {
          colorClass = "green";
        }

        if (isPastDate(`${selectedYear}${doubleMonth}${doubleDate}`)) {
          colorClass = "gray";
        }

        cells.push(
          <Link key={day} style={{ textDecoration: 'none', color: 'white'}} to= {`/day/${selectedYear}${doubleMonth}${doubleDate}`}>
            <div id={day} className={`cell ${colorClass}`}>
              {day}
            </div>
          </Link>
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
          updateMonth(parseInt(selectedMonth - 1))
        }}/>

        <h2>{readableMonth}</h2>

        <NavigateNextIcon onClick={() => {
          setIsLoading(true)
          updateMonth(parseInt(selectedMonth + 1))
        }}/>
      </div>
      <div className="calendar-grid">{cells}</div>
    </div>
  );
}
