import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { getBedName, getDate, getDayOfWeek, getMonth, getYear } from './utils';

export default function Reservations(props) {

  const [reservations, setReservations] = useState([]);
  const [pageIsLoading, setpageIsLoading] = useState(true);

  const { user, isLoading } = useAuth0();

  useEffect(() => {

    if (isLoading) return;

    axios.get(`https://1w37fsl0x8.execute-api.us-west-2.amazonaws.com/prod?user=${user.email}`)
      .then((response) => {
        setReservations(response.data);
        setpageIsLoading(false);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
      setpageIsLoading(false);
    });
  }, [isLoading, user]);

  function deleteReservation(reservationToRemove) {
    setpageIsLoading(true);
    axios.delete(`https://1w37fsl0x8.execute-api.us-west-2.amazonaws.com/prod?date=${reservationToRemove.reservation_date}&bed_id=${reservationToRemove.bed_id}`)
      .then((response) => {

        let newReservations = reservations;

        newReservations.forEach(reservation => {
          if (reservation.bed_id === reservationToRemove.bed_id && reservation.reservation_date === reservationToRemove.reservation_date) {
            newReservations.splice(newReservations.indexOf(reservation), 1)
          }
        })

        setReservations(newReservations);
        setpageIsLoading(false);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
      setpageIsLoading(false);
    });
  }

  function parseDateString(dateString){

    const dayOfWeek = getDayOfWeek(dateString);
    const month = getMonth(dateString);
    const day = getDate(dateString);
    const year = getYear(dateString);

    return `${dayOfWeek} ${month} ${day}, ${year}`
  }

  return (
    <div>
      {pageIsLoading ? (<div>Loading...</div>) : (

        <TableContainer component={Paper}>
          <Table sx={{  }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Bed</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {parseDateString(row.reservation_date)}
                  </TableCell>
                  <TableCell align="right">{getBedName(row.bed_id)}</TableCell>
                  <TableCell align="right"><Button onClick={() => deleteReservation(row)} variant="outlined">Remove</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}