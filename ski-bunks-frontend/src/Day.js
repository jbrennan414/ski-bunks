import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import './Day.css';
import { Button, Snackbar, Alert as MuiAlert } from '@mui/material';
import { getDayOfWeek, getMonth, getDate, getYear } from './utils';

import axios from 'axios';
import Bed from "./Bed";

function isGuest(email) {
  const lesees = [
    "brennanj414@gmail.com"
  ]

  return lesees.indexOf(email) === -1;
}


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Day() {

  const [openBeds, setOpenBeds] = useState([]);
  const [occupiedBeds, setOccupiedBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [shouldDisplayError, setShouldDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { user, isAuthenticated, isLoading } = useAuth0();

  const allBeds = [
    "king1_1",
    "king1_2",
    "queen1_1",
    "queen1_2",
    "queen2_1",
    "queen2_2",
    "bunk_1",
    "bunk_2",
    "couch"
  ];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShouldDisplayError(false);
  };


  function bookStay() {

    if (isGuest(user.email)) {
      console.log("you are a guest")
      return
    }

    setPageIsLoading(true);
    const date = window.location.pathname.split("/")[2];
    const bed_id = selectedBed;

    axios.post(`https://g2ivdcdgv9.execute-api.us-west-2.amazonaws.com/prod`, {
      reservation_date: date,
      bed_id,
      email: user.email,
      name: user.name,
      picture: user.picture
    })
      .then((response) => {
        console.log(response)

        let newOpenBeds = openBeds;
        newOpenBeds.splice(newOpenBeds.indexOf(bed_id), 1);

        // this is probably bad...but whatever
        // what I mean is that on a post, we should probably return the update object
        let newOccupiedBeds = occupiedBeds;
        newOccupiedBeds[bed_id] = {
          user_picture: user.picture,
          user_name: user.name
        }

        setOccupiedBeds(newOccupiedBeds);
        setOpenBeds(newOpenBeds);
        setPageIsLoading(false)

    }).catch((error) => {
      setPageIsLoading(false)
      setShouldDisplayError(true)
      setErrorMessage(error.response.data.message)
      console.log("ERRRRRRROR" , error);
    });
  }

  function renderBed(bed_id) {

    if (pageIsLoading) { return <p>Loading...</p>}

    const isOccupied = !openBeds.includes(bed_id)

    return (
        <Bed 
          bed_id={bed_id} 
          key={bed_id}
          isOccupied={isOccupied} 
          occupantPhoto= {isOccupied ? occupiedBeds[bed_id].user_picture : null}
          setSelectedBed={setSelectedBed}
        />
    )
  }

  useEffect(() => {
    // I think I can improve this in react router
    // but this will work for now
    const fullpath = window.location.pathname.split("/")[2];
    const year = fullpath.substring(0, 4);
    const month = fullpath.substring(4, 6);
    const day = fullpath.substring(6, 8);

    axios.get(`https://g2ivdcdgv9.execute-api.us-west-2.amazonaws.com/prod?year=${year}&month=${month}&day=${day}`)
      .then((response) => {
        console.log(response)
        setOccupiedBeds(response.data.occupiedBeds);
        setOpenBeds(response.data.openBeds);
        setPageIsLoading(false)
        setSelectedDate(fullpath)
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

          <div className="bed-container">

            {allBeds.map((bed) => {
              return renderBed(bed)
            })}  

            { isAuthenticated ? ( 
              <Button
                variant="contained"
                onClick={() => { bookStay() }}
                disabled={selectedBed == null}
              >
                {`Book my stay`}
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
