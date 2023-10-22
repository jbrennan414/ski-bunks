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

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {

    axios.get(`https://fi9au6homh.execute-api.us-west-2.amazonaws.com/prod?user=${user.email}`)
      .then((response) => {
        setReservations(response.data);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
    });
  }, [user]);

  function deleteReservation(id) {
    console.log("OMG THAT ORKED", id)
    axios.delete(`https://fi9au6homh.execute-api.us-west-2.amazonaws.com/prod?id=${id.id}`)
      .then((response) => {
        console.log("response", response)
        // setReservations(response.data);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
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
  );
}