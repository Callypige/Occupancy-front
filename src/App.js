import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [occupancyResult, setOccupancyResult] = useState("");
  const [selectedSensor, setSelectedSensor] = useState("");
  const [selectedSensorName, setSelectedSensorName] = useState("");
  const [atInstant, setAtInstant] = useState("");
  const [error, setError] = useState("");
  const [sensors, setSensor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/sensors");
        setSensor(res.data);
        setError("");
      } catch (error) {
        console.error("Error getting sensors data : " + error);
        setError("Error getting sensors data");
      }
    };

    fetchData();
  }, []);

  const handleShowOccupancyClick = async () => {
    try {
      let res;
      if (atInstant) {
        const formattedDateTime = atInstant.toISOString(); // Convert the selected date and time to a string format
        res = await axios.get(
          `http://localhost:3001/api/occupancy/${selectedSensor}/occupancy?atInstant=${formattedDateTime}`
        );
        setError("");
      } else {
        res = await axios.get(
          `http://localhost:3001/api/occupancy/${selectedSensor}/occupancy`
        );
        setError("");
      }
      setOccupancyResult(res.data.occupancy);
      setSelectedSensorName(res.data.name);
    } catch (error) {
      console.error("Error getting occupancy data", error);
      setError(
        "The sensor does not exist at this specific moment in time. Please try again."
      );
    }
  };

  const handleDateTimeChange = (date) => {
    setAtInstant(date);
  };

  const handleChange = (event) => {
    setSelectedSensor(event.target.value);
  };

  return (
    <div className="App">
      {/* <p>{!data ? "Loading..." : data.message} </p> */}
      <div>
        <h1>Meeting Room Occupancy</h1>
        <label>
          <span style={{ marginRight: "20px" }}>Select a sensor:</span>
          <select value={selectedSensor} onChange={handleChange}>
            <option value="">-- Select a sensor --</option>
            {sensors.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <br />
        <label>
          Select a date and time : (For example 2023-05-14)
          <DatePicker
            selected={atInstant}
            onChange={handleDateTimeChange}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
          />
        </label>
        <br />
        <button
          style={{ marginTop: "50px" }}
          onClick={handleShowOccupancyClick}
        >
          Show Occupancy
        </button>
        <div>
          {error ? (
            <span style={{ color: "red" }}>{error}</span>
          ) : (
            <>
              {occupancyResult && (
                <p>
                  Sensor <strong>{selectedSensorName}</strong> reports room
                  occupancy of <strong>{occupancyResult}</strong> people
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
