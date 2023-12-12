import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { getDate, getDayOfWeek, getMonth, getYear } from './utils';

export default function Reservations(props) {

  const [reservations, setReservations] = useState([]);
  const [pageIsLoading, setpageIsLoading] = useState(true);

  const { user, isLoading } = useAuth0();

  useEffect(() => {

    if (isLoading) return;

    axios.get(`https://hil0sv4jl3.execute-api.us-west-2.amazonaws.com/prod?user=${user.email}`)
      .then((response) => {
        sortDates(response.data);
        setpageIsLoading(false);
    }).catch((error) => {
      console.log("ERRRRRRROR" , error);
      setpageIsLoading(false);
    });
  }, [isLoading, user]);

  function sortDates(reservationData) {

    const now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');

    const today = `${year}${month}${day}`;

    reservationData = reservationData.filter(reservation => {
      return reservation.reservation_date >= today;
    })

    setReservations(reservationData.sort((a, b) => {
      return a.reservation_date - b.reservation_date;
    }))

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
                  <TableCell align="right">
                    <Link to={`/day/${row.reservation_date}`}>
                      <Button variant="outlined">Open</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}