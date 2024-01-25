import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Slider,
} from "@mui/material";
import "../App.css"; // Import App.css for common styles

const Settings = () => {
  const [refreshInterval, setRefreshInterval] = useState(30); // in seconds
  const [tempThreshold, setTempThreshold] = useState(25); // temperature threshold for notifications

  const saveSettings = async () => {
    try {
      // Create an object with the settings data to be saved
      const settingsData = {
        refreshInterval,
        tempThreshold,
      };

      // Send a POST request to your backend API to save the settings
      const response = await fetch("/api/save-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
      });

      if (response.ok) {
        // Settings were successfully saved
        console.log("Settings saved successfully");
      } else {
        // Handle the case where saving settings failed
        console.error("Failed to save settings");
      }
    } catch (error) {
      // Handle any errors that occurred during the save process
      console.error("Error saving settings:", error);
    }
  };

  const handleSliderChange = (event, newValue) => {
    setRefreshInterval(newValue);
  };

  const handleTempThresholdChange = (event) => {
    setTempThreshold(event.target.value);
  };

  return (
    <Container>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        className="page-title"
      >
        Settings
      </Typography>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        {/* Existing API Configuration */}
        {/* ... */}

        {/* Data Refresh Interval */}
        <Typography gutterBottom>Data Refresh Interval (seconds)</Typography>
        <Slider
          value={refreshInterval}
          onChange={handleSliderChange}
          step={10}
          marks
          min={10}
          max={120}
          valueLabelDisplay="auto"
        />

        {/* Notification Temperature Threshold */}
        <TextField
          label="Temperature Threshold for Notification (°C)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={tempThreshold}
          onChange={handleTempThresholdChange}
        />

        <Button variant="contained" color="primary" onClick={saveSettings}>
          Save Settings
        </Button>
      </Paper>
    </Container>
  );
};

export default Settings;
