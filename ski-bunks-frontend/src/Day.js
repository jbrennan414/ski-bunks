import { Link } from "react-router-dom";
import React, { useState, useEffect, forwardRef } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from 'react-router-dom';
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


const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Day() {

  let params = useParams();

  const allBeds = {
    king1: { 
      name: "King",
      capacity: 2,
      occupantPhotos: [],
      availableSpots: ["king1_1", "king1_2"]
    },
    queen1: {
      name: "Queen",
      capacity: 2,
      occupantPhotos: [],
      availableSpots: ["queen1_1", "queen1_2"]
    },
    queen2: {
      name: "Queen",
      capacity: 2,
      occupantPhotos: [],
      availableSpots: ["queen2_1", "queen2_2"]
    },
    bunk1: {
      name: "Bunk",
      capacity: 2,
      occupantPhotos: [],
      availableSpots: ["bunk1_1", "bunk1_2"]
    },
    couch: {
      name: "Couch",
      capacity: 1,
      occupantPhotos: [],
      availableSpots: ["couch"]
    },
  }


  const [selectedBed, setSelectedBed] = useState(null);
  const [beds, setBeds] = useState(allBeds);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(params.day);
  const [shouldDisplayError, setShouldDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { user, isAuthenticated } = useAuth0();

  const getBedByKeyFromSpot = (spot) => {
    for (const key in allBeds) {
      if (allBeds[key].availableSpots.includes(spot)) {
        return key;
      }
    }
    return null; // or throw an error if you prefer
  }
  

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShouldDisplayError(false);
  };


  function bookStay() {

    setPageIsLoading(true);
    const date = window.location.pathname.split("/")[2];
    const bed_id = selectedBed;

    axios.post(`https://1w37fsl0x8.execute-api.us-west-2.amazonaws.com/prod`, {
      reservation_date: date,
      bed_id,
      email: user.email,
      name: user.name,
      picture: user.picture
    })
      .then((response) => {
        console.log(response)

        const updatedBeds = beds;

        const bedKey = getBedByKeyFromSpot(bed_id);

        updatedBeds[bedKey].availableSpots = updatedBeds[bedKey].availableSpots.filter((spot) => spot !== bed_id)
        updatedBeds[bedKey].occupantPhotos.push(user.picture)

        setBeds(updatedBeds);
        setPageIsLoading(false)
        setSelectedBed(null)

    }).catch((error) => {
      setPageIsLoading(false)
      setShouldDisplayError(true)
      setErrorMessage(error.response.data.message)
      console.log("ERRRRRRROR" , error);
    });
  }

  function handleSeletedBed(bed_id) {
    setSelectedBed(beds[bed_id].availableSpots[0])
  }

  function renderBed(bed_id, i) {

    if (pageIsLoading) { return <p>Loading...</p>}

    const thisBed = beds[bed_id];

    return (
        <Bed 
          key={i}
          bed={thisBed}
          bed_id={bed_id}
          setSelectedBed={handleSeletedBed}
        />
    )
  }

  useEffect(() => {
    // I think I can improve this in react router
    // but this will work for now
    const year = selectedDate.substring(0, 4);
    const month = selectedDate.substring(4, 6);
    const day = selectedDate.substring(6, 8);

    axios.get(`https://1w37fsl0x8.execute-api.us-west-2.amazonaws.com/prod?year=${year}&month=${month}&day=${day}`)
      .then((response) => {
        const reservations = response.data.reservations;
        const updatedBeds = beds;

        reservations.forEach((reservation) => {
          const bedKey = getBedByKeyFromSpot(reservation.bed_id);

          updatedBeds[bedKey].availableSpots = updatedBeds[bedKey].availableSpots.filter((spot) => spot !== reservation.bed_id)
          updatedBeds[bedKey].occupantPhotos.push(reservation.user_picture)

        })

        setBeds(updatedBeds);
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

          <div className="bed-container">
            {Object.keys(beds).map((bed, i) => {
              return renderBed(bed, i)
            })}  
          </div>

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
      )}

      <Snackbar open={shouldDisplayError} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
      </Snackbar>
    </div>
  )
}
