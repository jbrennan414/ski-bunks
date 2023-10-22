import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";

import './Calendar.css';
import axios from 'axios';
import Bed from "./Bed";

export default function Day() {

  const [openBeds, setOpenBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

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

  function bookStay() {
    setPageIsLoading(true);
    const date = window.location.pathname.split("/")[2];
    const bed_id = selectedBed;

    axios.post(`https://fi9au6homh.execute-api.us-west-2.amazonaws.com/prod`, {
      date,
      bed_id,
      email: user.email,
      name: user.name,
      picture: user.picture
    })
      .then((response) => {
        console.log(response)

        let newOpenBeds = openBeds;
        newOpenBeds.splice(newOpenBeds.indexOf(bed_id), 1);

        setOpenBeds(newOpenBeds);
        setPageIsLoading(false)

    }).catch((error) => {
      setPageIsLoading(false)
      console.log("ERRRRRRROR" , error);
    });
  }

  function renderBed(bed_id) {

    const isOccupied = !openBeds.includes(bed_id)

    return (
      <div key={bed_id}>
        <Bed 
          bed_id={bed_id} 
          isOccupied={isOccupied} 
          occupantPhoto="https://lh3.googleusercontent.com/a/ACg8ocLe1bqDTfA5vNQLPaOiNjEDkUcLh4lChLfA1diQJEQxNdM=s96-c" 
          setSelectedBed={setSelectedBed}
        />
      </div>
    )
  }

  useEffect(() => {
    // I think I can improve this in react router
    // but this will work for now
    const fullpath = window.location.pathname.split("/")[2];
    const year = fullpath.substring(0, 4);
    const month = fullpath.substring(4, 6);
    const day = fullpath.substring(6, 8);

    axios.get(`https://fi9au6homh.execute-api.us-west-2.amazonaws.com/prod?year=${year}&month=${month}&day=${day}`)
      .then((response) => {
        console.log(response)
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

          {allBeds.map((bed) => {
            return renderBed(bed)
          })}  

          { isAuthenticated ? (
            <button 
              onClick={() => { bookStay() }}
              disabled={selectedBed == null}
            >
              {`Book my stay: ${selectedBed}`}
            </button>
          ) : (
            <button 
              disabled={true}
            >
              {`Log in to book ${selectedBed}` }
            </button>
          )}
        </div>
      )}


    </div>
  )
}
