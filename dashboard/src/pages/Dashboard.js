import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import "chartjs-adapter-luxon";
import { Chart, registerables } from "chart.js";
import { Container, Grid, Paper, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThermostatAutoIcon from "@mui/icons-material/ThermostatAuto";
import OpacityIcon from "@mui/icons-material/Opacity";
import WaterIcon from "@mui/icons-material/Water";
import "../App.css"; // Import App.css for common styles

Chart.register(...registerables);

const Dashboard = () => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null); // Rename 'chart' to 'chartInstance'
  const [latestData, setLatestData] = useState({}); // State to store the latest data
  const [averageTemperature, setAverageTemperature] = useState(null); // State for average temperature
  const [averageHumidity, setAverageHumidity] = useState(null); // State for average humidity

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/environment-data"
        );

        const currentTime = DateTime.now();
        const filteredData = response.data.filter((d) => {
          const dataTime = DateTime.fromISO(d.date);
          return dataTime.diff(currentTime, "hours").hours >= -4;
        });

        const data = filteredData.map((d) => ({
          ...d,
          date: DateTime.fromISO(d.date),
        }));

        // Destroy the previous chart instance if it exists
        if (chartInstance) {
          chartInstance.destroy();
        }

        // Extract temperature and humidity data
        const humidityData = data.map((d) => ({
          x: d.date.toMillis(),
          y: parseFloat(d.temperature.split(": ")[1]),
        }));
        const temperatureData = data.map((d) => ({
          x: d.date.toMillis(),
          y: parseFloat(d.humidity.split(": ")[1]),
        }));

        // Create a new chart instance
        const newChartInstance = new Chart(chartRef.current, {
          type: "line",
          data: {
            datasets: [
              {
                label: "Temperature",
                data: temperatureData,
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                fill: false,
              },
              {
                label: "Humidity",
                data: humidityData,
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "hour",
                  displayFormats: {
                    hour: "MMM dd, yyyy HH:mm:ss",
                  },
                },
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        // Update the chartInstance state
        setChartInstance(newChartInstance);

        // Calculate and set the latest data
        const latest = data[data.length - 1];
        setLatestData(latest);

        // Calculate and set average temperature and humidity
        const temperatureSum = temperatureData.reduce(
          (acc, point) => acc + point.y,
          0
        );
        const humiditySum = humidityData.reduce(
          (acc, point) => acc + point.y,
          0
        );
        const averageTemp = temperatureSum / temperatureData.length;
        const averageHumid = humiditySum / humidityData.length;
        setAverageTemperature(averageTemp);
        setAverageHumidity(averageHumid);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndRenderChart();
  }, [chartInstance]); // Use 'chartInstance' as the dependency

  return (
    <Container>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        className="page-title"
      >
        Environment Data Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Latest Data */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3}>
            <Typography variant="h5" align="center">
              Latest Data
            </Typography>
            <Typography variant="subtitle1" align="center">
              <AccessTimeIcon /> Date:{" "}
              {latestData.date &&
                latestData.date.toFormat("MMM dd, yyyy HH:mm:ss")}
            </Typography>
            <Typography variant="subtitle1" align="center">
              <ThermostatAutoIcon /> Temperature: {latestData.temperature}
            </Typography>
            <Typography variant="subtitle1" align="center">
              <OpacityIcon /> Humidity: {latestData.humidity}
            </Typography>
          </Paper>
        </Grid>
        {/* Average Data */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3}>
            <Typography variant="h5" align="center">
              Average Data
            </Typography>
            <Typography variant="subtitle1" align="center">
              <ThermostatAutoIcon /> Average Temperature:{" "}
              {averageTemperature !== null
                ? `${averageTemperature.toFixed(2)}°C`
                : "N/A"}
            </Typography>
            <Typography variant="subtitle1" align="center">
              <WaterIcon /> Average Humidity:{" "}
              {averageHumidity !== null
                ? `${averageHumidity.toFixed(2)}%`
                : "N/A"}
            </Typography>
          </Paper>
        </Grid>
        {/* Temperature and Humidity Trends */}
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Typography variant="h5" align="center">
              Temperature and Humidity Trends
            </Typography>
            <canvas ref={chartRef} /> {/* Render Chart.js chart */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
