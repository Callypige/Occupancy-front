import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
import App from "../App";

// This sets the mock adapter on the default instance
var mockAxios = new MockAdapter(axios);

it("should fetch and display sensors data", async () => {
  const sensorsData = [
    { id: 1, name: "Sensor 1", occupancy: 5 },
    { id: 2, name: "Sensor 2", occupancy: 3 },
    { id: 3, name: "Sensor 3", occupancy: 2 },
  ];

  mockAxios.onGet("http://localhost:3001/api/sensors").reply(200, sensorsData);

  render(<App />);

  // Wait for the sensors data to be fetched and displayed
  await waitFor(() => {
    const sensorOptions = screen.getAllByRole("option");
    expect(sensorOptions.length).toBe(sensorsData.length + 1); // +1 for the default option
  });
});
