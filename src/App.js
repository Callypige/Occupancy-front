import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [occupancyResult, setOccupancyResult] = useState("");
  const [selectedSensor, setSelectedSensor] = useState("");
  const [selectedSensorName, setSelectedSensorName] = useState("");
  const [sensors, setSensor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/sensors");
        setSensor(res.data);
      } catch (error) {
        console.error("Error getting sensors data : " + error);
      }
    };

    fetchData();
  }, []);

  const handleShowOccupancyClick = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/${selectedSensor}/occupancy`
      );
      setOccupancyResult(res.data.occupancy);
      setSelectedSensorName(res.data.name);
    } catch (error) {
      console.error("Error getting occupancy data", error);
    }
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
        <button
          style={{ marginTop: "50px" }}
          onClick={handleShowOccupancyClick}
        >
          Show Occupancy
        </button>
        <div>
          {occupancyResult && (
            <p>
              Sensor <strong>{selectedSensorName}</strong> reports room
              occupancy of <strong>{occupancyResult}</strong> people
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
