import { Link } from "react-router-dom";
import React, { useState, useEffect, forwardRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import "./Day.css";
import {
  Button,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";

import { getDayOfWeek, getMonth, getDate, getYear } from "./utils";

import axios from "axios";
import ReservationChip from "./ReservationChip";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const lessees = [
  {
    user_email: "brennanj414@gmail.com",
    user_name: "John Brennan",
    user_picture:
      "https://lh3.googleusercontent.com/a/ACg8ocLe1bqDTfA5vNQLPaOiNjEDkUcLh4lChLfA1diQJEQxNdM=s96-c",
  },
  {
    user_email: "fisherben09@gmail.com",
    user_name: "Ben Fisher",
    user_picture:
      "https://lh3.googleusercontent.com/a/ACg8ocJv6jnyqtc7ZE0F6DZzUNPJMRrhJ1bcIvIJ_m95Yqxv=s96-c",
  },
  {
    user_email: "lvkordecki@gmail.com",
    user_name: "Lindsay Kordecki",
    user_picture:
      "https://lh3.googleusercontent.com/a/ACg8ocJnOJvQcHc30DFsMTcpWox8RXOrKjypImbybGVn-hHA=s96-c",
  },
  {
    user_email: "storbecktelbe@gmail.com",
    user_name: "Telbe Storbeck",
    user_picture:
      "https://lh3.googleusercontent.com/a/ACg8ocJb1r7fx5Hu2lik4JNi5wWa1H9HJy-aI98mi1as7h58AVI=s96-c",
  },
  {
    user_email: "sophia.menick@gmail.com",
    user_name: "Sophia Menick",
    user_picture:
      "https://lh3.googleusercontent.com/a/ACg8ocK860Pus1yIIcrjEcz0v_3oeEBCQukncqnaL08sAUa1cw=s96-c",
  },
  {
    user_email: "ctraut22@gmail.com",
    user_name: "Catherine Traut",
    user_picture:
      "https://lh3.googleusercontent.com/a/ACg8ocJ_bsYABo500D-45h9OXc4MTXm_4fPh655upuk35Dsj=s96-c",
  },
  {
    user_email: "mjacobson594@gmail.com",
    user_name: "Maggie Jacobson",
    user_picture:
      "https://lh3.googleusercontent.com/a/ACg8ocIt_NJ9en74gavz0rU8HXvhCf4vh5vP7Q3aYB2obNE-=s96-c",
  },
  {
    user_email: "bentraut@gmail.com",
    user_name: "Ben Traut",
    user_picture:
      "https://lh3.googleusercontent.com/a/ACg8ocIt_NJ9en74gavz0rU8HXvhCf4vh5vP7Q3aYB2obNE-=s96-c",
  },
];

export default function Day() {
  let { day } = useParams();

  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(day);
  const [reservations, setReservations] = useState(lessees);
  const [shouldDisplayError, setShouldDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const { user, isAuthenticated } = useAuth0();

  function renderRezzies() {

    return lessees.map((lessor, i) => { 

      const isIn = reservations.filter((item) => item.user_email === lessor.user_email)[0]?.is_in;

      let email = null;
      if (user) {
        email = user.email;
      }

      return <ReservationChip 
        key1={i} 
        loggedInUser={email}
        userIsIn={isIn} 
        lessor={lessor} 
        isIn={userIsIn1} />
    })
  }

  function renderGuests() {

    const lessees_emails = lessees.map((item) => item.user_email);

    const otherReservations = reservations.filter((item) => !lessees_emails.includes(item.user_email));

    return otherReservations.map((item, i) => { 
      return <ReservationChip key1={i}
        loggedInUser={user.email}
        userIsIn={item.is_in} 
        lessor={item} 
      />
   })

  }

  const handleClose = () => {
    setAnchorEl(null);
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

    setPageIsLoading(true);
    const date = window.location.pathname.split("/")[2];

    axios
      .post(`https://hil0sv4jl3.execute-api.us-west-2.amazonaws.com/prod/`, {
        reservation_date: date,
        email: "fakeEmail@gmail.com",
        name: user.name,
        picture: user.picture,
      })
      .then((response) => {
        console.log(response);

        let newReservations = reservations;

        newReservations.push({
          user_name: user.name,
          user_picture: user.picture,
          user_email: "fakeEmail@gmail.com",
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
      <Link
        to={`/year/${selectedDate.substring(
          0,
          4
        )}/month/${selectedDate.substring(4, 6)}`}
      >
        Back
      </Link>

      {pageIsLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>{`${getDayOfWeek(selectedDate)} ${getMonth(
            selectedDate
          )} ${getDate(selectedDate)}, ${getYear(selectedDate)}`}</p>

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
              {`${spotsRemaining > 0 ? `Room for ${spotsRemaining} ${spotsRemaining == 1 ? `guest` :`guests` }` : `No spots left`}`}
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
