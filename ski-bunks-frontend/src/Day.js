import { Link } from "react-router-dom";
import React, { useState, useEffect, forwardRef } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from 'react-router-dom';
import './Day.css';
import { Button, Snackbar, Alert as MuiAlert } from '@mui/material';
import { getDayOfWeek, getMonth, getDate, getYear } from './utils';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import axios from 'axios';

function isGuest(email) {
  const lesees = [
    "brennanj414@gmail.com"
  ]

  return lesees.indexOf(email) === -1;
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Day() {

  let { day } = useParams();

  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(day);
  const [reservations, setReservations] = useState([]);
  const [shouldDisplayError, setShouldDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { user, isAuthenticated } = useAuth0();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShouldDisplayError(false);
  };


  function renderRezzies() {
    if (reservations.length === 0) {
      return <h3>No reservations yet!</h3>;
    } else {
      return reservations.map((reservation, i) => {
        return (
          <Chip
            key={i}
            avatar={<Avatar alt="Natacha" src={reservation.user_picture} />}
            label={reservation.user_name}
            variant="outlined"
          />
        )
      })
    }
  }

  function bookStay() {

    setPageIsLoading(true);
    const date = window.location.pathname.split("/")[2];

    axios.post(`https://fsb2mqq1og.execute-api.us-west-2.amazonaws.com/prod`, {
      reservation_date: date,
      email: user.email,
      name: user.name,
      picture: user.picture
    })
      .then((response) => {
        console.log(response)

        let newReservations = reservations;
        
        newReservations.push({
          user_name: user.name,
          user_picture: user.picture
        })

        setReservations(newReservations);

        setPageIsLoading(false);

    }).catch((error) => {
      setPageIsLoading(false)
      setShouldDisplayError(true)
      setErrorMessage(error.response.data.message)
      console.log("ERRRRRRROR" , error);
    });
  }


  useEffect(() => {
    // I think I can improve this in react router
    // but this will work for now
    axios.get(`https://fsb2mqq1og.execute-api.us-west-2.amazonaws.com/prod?date=${selectedDate}`)
      .then((response) => {
        console.log("##########", response.data);

        setReservations(response.data.reservations);

        setPageIsLoading(false)
        setSelectedDate(selectedDate)
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
      setPageIsLoading(false)
    });
  }, []);

  return (
    <div>
      <Link to="/">Back</Link>

      {pageIsLoading ? <div>Loading...</div> : (
        <div>
        <p>{`${getDayOfWeek(selectedDate)} ${getMonth(selectedDate)} ${getDate(selectedDate)}, ${getYear(selectedDate)}`}</p>

        <div className="reservation-container"> 
          {renderRezzies()}
        </div>
          { isAuthenticated ? ( 
            <Button
              variant="contained"
              onClick={() => { bookStay() }}
            >
              {`Join Us!`}
            </Button>
          ) : (
            <Button 
              variant="contained"
              disabled={true}
            >
              {`Sign in to book` }
            </Button>
          )}

        </div>
      )}

      <Snackbar open={shouldDisplayError} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
      </Snackbar>
    </div>
  )
}
