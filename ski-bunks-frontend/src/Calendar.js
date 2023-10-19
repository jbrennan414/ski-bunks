import React from 'react';
import './Calendar.css';
import { Outlet, Link } from "react-router-dom";

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: props.month,
    };
  }

  getDaysInMonth(month, year) {
    // Calculate the number of days in a month
    return new Date(year, month, 0).getDate();
  }

  getStartingDay(month, year) {
    // Calculate the starting day of the month (0 for Sunday, 1 for Monday, etc.)
    const startingDay = new Date(year, month - 1, 1).getDay();
    // Ensure the grid starts on Sunday
    return startingDay === 0 ? 7 : startingDay;
  }

  renderDay(day) {
    console.log(day);
  }

  render() {

    const { month } = this.state;
    const year = new Date().getFullYear(); // You can change this to the desired year

    const daysInMonth = this.getDaysInMonth(month, year);
    const startingDay = this.getStartingDay(month, year);

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
            <div id={day} key={day} className="cell" onClick={() => this.renderDay(day)}>
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
          <button onClick={() => this.setState({ month: month - 1 })}>Previous Month</button>
          <h2>{readableMonth}</h2>
          <button onClick={() => this.setState({ month: month + 1 })}>Next Month</button>
        </div>
        <div className="calendar-grid">{cells}</div>
      </div>
    );
  }
}

export default Calendar;
