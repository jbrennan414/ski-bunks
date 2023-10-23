import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export default function Reservations(props) {

  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {

    axios.get(`https://fi9au6homh.execute-api.us-west-2.amazonaws.com/prod?user=${user.email}`)
      .then((response) => {
        setReservations(response.data);
        setIsLoading(false);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
      setIsLoading(false);
    });
  }, []);

  function deleteReservation(reservationToRemove) {
    setIsLoading(true);
    axios.delete(`https://fi9au6homh.execute-api.us-west-2.amazonaws.com/prod?date=${reservationToRemove.date}&bed_id=${reservationToRemove.bed_id}`)
      .then((response) => {

        let newReservations = reservations;

        newReservations.forEach(reservation => {
          if (reservation.bed_id === reservationToRemove.bed_id && reservation.date === reservationToRemove.date) {
            newReservations.splice(newReservations.indexOf(reservation), 1)
          }
        })

        setReservations(newReservations);
        setIsLoading(false);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
      setIsLoading(false);
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
    const date = new Date(`${monthArray[month-1]} ${day}, ${year}`);

    return `${dayArray[date.getDay()]} ${monthArray[month-1]} ${date.getDate()}, ${date.getFullYear()}`
  }

  return (
    <div>
    {isLoading && <div>Loading...</div>}
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
                  {parseDateString(row.date)}
                </TableCell>
                <TableCell align="right">{row.bed_id}</TableCell>
                <TableCell align="right"><Button onClick={() => deleteReservation(row)} variant="outlined">Remove</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}