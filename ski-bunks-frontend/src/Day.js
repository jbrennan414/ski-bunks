import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import './Calendar.css';
import axios from 'axios';

export default function Day() {

  // useEffect(() => {
  //   axios.get(`https://fi9au6homh.execute-api.us-west-2.amazonaws.com/prod?month=${month}&year=${year}`)
  //     .then((response) => {
  //       setAvailableBeds(response.data);
  //       setIsLoading(false);
  //   }).catch((error) => {
  //     console.log("ERRRRRRROR" , error);
  //   });
  // }, [month]);

  return (
    <div>
        <Link to="/">Back</Link>
        <p>Day</p>
        <p>King 1</p>
        <p>King 2</p>
        <p>Queen 1</p>
        <p>Queen 2</p>
        <p>Bunk Bed 1</p>
        <p>Bunk Bed 2</p>
        <p>Couch</p>
    </div>
  )
}
