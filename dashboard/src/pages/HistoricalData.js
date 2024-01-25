import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import axios from "axios";
import { DateTime } from "luxon";
import "../App.css"; // Import App.css for common styles

const HistoricalData = () => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/environment-data"
        );
        const currentTime = DateTime.now();
        const filteredData = response.data.filter((d) => {
          const dataTime = DateTime.fromISO(d.date);
          return dataTime.diff(currentTime, "hours").hours >= -4;
        });

        setHistoricalData(filteredData);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        className="page-title"
      >
        Historical Data Dashboard
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Temperature (°C)</TableCell>
              <TableCell>Humidity (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historicalData.map((dataPoint, index) => (
              <TableRow key={index}>
                <TableCell>
                  {DateTime.fromISO(dataPoint.date).toFormat("HH:mm")}
                </TableCell>
                <TableCell>{dataPoint.temperature.split(": ")[1]}</TableCell>
                <TableCell>{dataPoint.humidity.split(": ")[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default HistoricalData;
