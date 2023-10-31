import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { getBedName } from './utils';

export default function Reservations(props) {

  const [reservations, setReservations] = useState([]);
  const [pageIsLoading, setpageIsLoading] = useState(true);

  const { user, isLoading } = useAuth0();

  useEffect(() => {

    if (isLoading) return;

    axios.get(`https://43xrqkj1bc.execute-api.us-west-2.amazonaws.com/prod?user=${user.email}`)
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
    axios.delete(`https://43xrqkj1bc.execute-api.us-west-2.amazonaws.com/prod?date=${reservationToRemove.reservation_date}&bed_id=${reservationToRemove.bed_id}`)
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

    const year = dateString.substring(0,4);
    const month = dateString.substring(4,6);
    const day = dateString.substring(6,8);

    const monthArray = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December'
    ];

    const dayArray = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

    const date = new Date(year, month, day);

    return `${dayArray[date.getDay()]} ${monthArray[month-1]} ${date.getDate()}, ${date.getFullYear()}`
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