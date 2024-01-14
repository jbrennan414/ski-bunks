import { Link } from "react-router-dom";
import React, { useState, useEffect, forwardRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import "./Day.css";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {
  Button,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";

import { getDayOfWeek, getMonth, getDate, getYear } from "./utils";

import axios from "axios";
import ReservationChip from "./ReservationChip";
import { lessees, isPastDate } from "./utils";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Day(props) {
  let { day } = useParams();

  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(day);
  const [reservations, setReservations] = useState(lessees);
  const [shouldDisplayError, setShouldDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { user, isAuthenticated } = useAuth0();

  function renderRezzies() {

    return lessees.map((lessor, i) => { 

      const isIn = reservations.filter((item) => item.user_email === lessor.user_email)[0]?.is_in;

      let email = null;
      if (user) {
        email = user?.email;
      }

      return <ReservationChip 
        key={lessor.user_email} 
        loggedInUser={email}
        isPastDate={isPastDate(day)}
        userIsIn={isIn} 
        lessor={lessor} 
        isIn={userIsIn1} />
    })
  }

  function renderGuests() {

    const lessees_emails = lessees.map((item) => item.user_email);

    const otherReservations = reservations.filter((item) => !lessees_emails.includes(item.user_email));

    return otherReservations.map((item, i) => { 
      return <ReservationChip 
        key={item.reservation_id}
        isPastDate={isPastDate(day)}
        loggedInUser={user?.email}
        userIsIn={item.is_in} 
        lessor={item} 
        isIn={userIsIn1}
      />
   })

  }

  const handleClose = () => {
    setShouldDisplayError(false);
  };

  const userIsIn1 = (status) => {

    setPageIsLoading(true);

    const boolStatus = status === "in";
    const date = window.location.pathname.split("/")[2];

    axios.post(`https://hil0sv4jl3.execute-api.us-west-2.amazonaws.com/prod/`, {
        reservation_date: date,
        email: user.email,
        name: user.name,
        picture: user.picture,
        is_in: boolStatus
      })
      .then((response) => {

        setPageIsLoading(false);

        let newReservations = reservations;

        const userReservation = newReservations.filter((item) => item.user_email === user.email)[0];

        if (!userReservation) {
          newReservations.push({
            user_name: user.name,
            user_picture: user.picture,
            user_email: user.email,
            is_in: boolStatus
          });
          setReservations(newReservations);
          setPageIsLoading(false);
          return;
        }

        userReservation.is_in = boolStatus;

        setReservations(newReservations);
        setPageIsLoading(false);
      })
      .catch((error) => {
        console.log("ERRRRRRROR", error);
        setPageIsLoading(false);
      });

  }

  function bookStay() {

    const currentReservations = reservations.filter((item) => item.user_email);

    const currentReservationsEmails = currentReservations.map((item) => item.user_email);

    if (currentReservationsEmails.includes(user.email)) {
      setShouldDisplayError(true);
      setPageIsLoading(false)
      setErrorMessage("Oops! You already have a reservation!");
      return;
    }

    setPageIsLoading(true);

    const lessorsEmails = lessees.map((item) => item.user_email);

    console.log("lessorsEmails", lessorsEmails);

    if (lessorsEmails.includes(user.email)) {
      setShouldDisplayError(true);
      setPageIsLoading(false)
      setErrorMessage("Select yourself to book a stay");
      return;
    }

    const date = window.location.pathname.split("/")[2];

    axios
      .post(`https://hil0sv4jl3.execute-api.us-west-2.amazonaws.com/prod/`, {
        reservation_date: date,
        email: user.email,
        name: user.name,
        picture: user.picture,
      })
      .then((response) => {

        let newReservations = reservations;

        newReservations.push({
          user_name: user.name,
          user_picture: user.picture,
          user_email: user.email,
          is_in: true
        });

        setReservations(newReservations);

        setPageIsLoading(false);
      })
      .catch((error) => {
        setPageIsLoading(false);
        setShouldDisplayError(true);
        setErrorMessage(error.response.data.message);
        console.log("ERRRRRRROR", error);
      });
  }

  useEffect(() => {
    // I think I can improve this in react router
    // but this will work for now
    axios
      .get(
        `https://hil0sv4jl3.execute-api.us-west-2.amazonaws.com/prod/?date=${selectedDate}`
      )
      .then((response) => {

        setReservations(response.data.reservations);

        setPageIsLoading(false);
        setSelectedDate(selectedDate);
      })
      .catch((error) => {
        console.log("ERRRRRRROR", error);
        setPageIsLoading(false);
      });
  }, []);

  let spotsRemaining = 9;

  const lessees_emails = lessees.map((item) => item.user_email);

  lessees.forEach((item) => {
    const index = reservations.findIndex((reservation) => reservation.user_email === item.user_email);

    if (reservations[index]?.is_in === true) {
      spotsRemaining--;
    }

    if (index === -1) {
      spotsRemaining--;
    }
    
  })

  // count current guests
  const guests = reservations.filter((item) => !lessees_emails.includes(item.user_email) && item.is_in).length;

  spotsRemaining = spotsRemaining - guests;

  return (
    <div>
      {pageIsLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div 
            id="header-line" 
            style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
          >
            <Link
              state={{ 
              month: selectedDate.substring(4, 6), 
              year: selectedDate.substring(0, 4) }}
              to={`/calendar`}
            >
              <NavigateBeforeIcon />
            </Link>
            <p>{`${getDayOfWeek(selectedDate)} ${getMonth(
              selectedDate
            )} ${getDate(selectedDate)}, ${getYear(selectedDate)}`}</p>
          </div>

          <div className="reservation-container">
            {renderRezzies()}
            {renderGuests()}
          </div>

          {isAuthenticated ? (
            <Button
              variant="contained"
              disabled={spotsRemaining === 0}
              onClick={() => {
                bookStay();
              }}
            >
              {`${spotsRemaining > 0 ? `Room for ${spotsRemaining} ${spotsRemaining === 1 ? `guest` :`guests` }` : `No spots left`}`}
            </Button>
          ) : (
            <Button variant="contained" disabled={true}>
              {`Sign in to book`}
            </Button>
          )}
        </div>
      )}

      <Snackbar
        open={shouldDisplayError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
