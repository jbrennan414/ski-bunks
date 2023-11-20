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
    email: "brennanj414@gmail.com",
    name: "John Brennan",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocLe1bqDTfA5vNQLPaOiNjEDkUcLh4lChLfA1diQJEQxNdM=s96-c",
  },
  {
    email: "fisherben09@gmail.com",
    name: "Ben Fisher",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocJv6jnyqtc7ZE0F6DZzUNPJMRrhJ1bcIvIJ_m95Yqxv=s96-c",
  },
  {
    email: "lvkordecki@gmail.com",
    name: "Lindsay Kordecki",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocJnOJvQcHc30DFsMTcpWox8RXOrKjypImbybGVn-hHA=s96-c",
  },
  {
    email: "storbecktelbe@gmail.com",
    name: "Telbe Storbeck",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocJb1r7fx5Hu2lik4JNi5wWa1H9HJy-aI98mi1as7h58AVI=s96-c",
  },
  {
    email: "sophia.menick@gmail.com",
    name: "Sophia Menick",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocK860Pus1yIIcrjEcz0v_3oeEBCQukncqnaL08sAUa1cw=s96-c",
  },
  {
    email: "ctraut22@gmail.com",
    name: "Catherine Traut",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocJ_bsYABo500D-45h9OXc4MTXm_4fPh655upuk35Dsj=s96-c",
  },
  {
    email: "mjacobson594@gmail.com",
    name: "Maggie Jacobson",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocIt_NJ9en74gavz0rU8HXvhCf4vh5vP7Q3aYB2obNE-=s96-c",
  },
  {
    email: "bentraut@gmail.com",
    name: "Ben Traut",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocIt_NJ9en74gavz0rU8HXvhCf4vh5vP7Q3aYB2obNE-=s96-c",
  },
];

export default function Day() {
  let { day } = useParams();

  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(day);
  const [reservations, setReservations] = useState([]);
  const [shouldDisplayError, setShouldDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const { user, isAuthenticated } = useAuth0();

  function renderRezzies() {

    return lessees.map((lessor, i) => { 

      const isIn = reservations.filter((item) => item.user_email === lessor.email)[0]?.is_in;

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
        email: user.email,
        name: user.name,
        picture: user.picture,
      })
      .then((response) => {
        console.log(response);

        let newReservations = reservations;

        newReservations.push({
          user_name: user.name,
          user_picture: user.picture,
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
        console.log("##########", response.data);

        setReservations(response.data.reservations);

        setPageIsLoading(false);
        setSelectedDate(selectedDate);
      })
      .catch((error) => {
        console.log("ERRRRRRROR", error);
        setPageIsLoading(false);
      });
  }, []);

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

          <div className="reservation-container">{renderRezzies()}</div>
          {isAuthenticated ? (
            <Button
              variant="contained"
              onClick={() => {
                bookStay();
              }}
            >
              {`Join Us!`}
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
