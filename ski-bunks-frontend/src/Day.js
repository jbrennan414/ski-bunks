import { Link } from "react-router-dom";
import React, { useState, useEffect, useParams } from 'react'
import './Calendar.css';
import axios from 'axios';

export default function Day() {

  const [openBeds, setOpenBeds] = useState([]);

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

  function renderBed(bed_id) {

    const bedStatus = !openBeds.includes(bed_id) && "❌"

    return (
      <div key={bed_id}>
        <p>{bedStatus} {bed_id}</p>
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
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
    });
  }, []);


  return (
    <div>
      <Link to="/">Back</Link>
        {allBeds.map((bed) => {
          return renderBed(bed)
        })}  
    </div>
  )
}
