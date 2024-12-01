import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  Alert,
} from "@mui/material";

function FormPage() {
  const [vehicles, setVehicle] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wheels: "",
    vehicleType: "",
    specificModel: "",
    startDate: "",
    endDate: "",
  });
  console.log(vehicles);

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  const getVehicleData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3500/server/vehicle-types"
      );
      const data = response.data;

      const groupedData = data.reduce((acc, vehicle) => {
        const { wheelType, category, model } = vehicle;
        if (!acc[wheelType]) acc[wheelType] = {};
        if (!acc[wheelType][category]) acc[wheelType][category] = [];
        acc[wheelType][category].push(model);
        return acc;
      }, {});

      setVehicle(groupedData);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  useEffect(() => {
    getVehicleData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleNext = () => {
    const {
      firstName,
      lastName,
      wheels,
      vehicleType,
      specificModel,
      startDate,
      endDate,
    } = formData;

    const validation = [
      firstName && lastName,
      wheels,
      vehicleType,
      specificModel,
      startDate && endDate,
    ];

    if (!validation[currentStep]) {
      setError("Please complete this step before proceeding.");
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3500/server/form-data",
        formData
      );
      console.log("Form Submitted Successfully:", response.data);
      alert("Booking successful!");
      setFormData({
        firstName: "",
        lastName: "",
        wheels: "",
        vehicleType: "",
        specificModel: "",
        startDate: "",
        endDate: "",
      });
      setCurrentStep(0);
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const vehicleTypes = formData.wheels
    ? Object.keys(vehicles[formData.wheels] || {})
    : [];
  const models = formData.vehicleType
    ? vehicles[formData.wheels]?.[formData.vehicleType]
    : [];

  const questions = [
    {
      id: "name",
      question: "What is your name?",
      inputs: (
        <>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </>
      ),
    },
    {
      id: "wheels",
      question: "Number of wheels?",
      inputs: (
        <FormControl>
          <RadioGroup
            name="wheels"
            value={formData.wheels}
            onChange={handleChange}
          >
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
          </RadioGroup>
        </FormControl>
      ),
    },
    {
      id: "vehicleType",
      question: "Type of vehicle?",
      inputs: (
        <FormControl>
          <RadioGroup
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            {vehicleTypes.map((type) => (
              <FormControlLabel
                key={type}
                value={type}
                control={<Radio />}
                label={type}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ),
    },
    {
      id: "specificModel",
      question: "Specific Model?",
      inputs: (
        <FormControl>
          <RadioGroup
            name="specificModel"
            value={formData.specificModel}
            onChange={handleChange}
          >
            {models.map((model) => (
              <FormControlLabel
                key={model}
                value={model}
                control={<Radio />}
                label={model}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ),
    },
    {
      id: "dateRange",
      question: "Pick your booking dates",
      inputs: (
        <>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
        </>
      ),
    },
  ];
  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="w-96 bg-white p-6 shadow-lg rounded-lg">
        <form>
          <div className="mb-4">
            <h2 className=" font-bold text-xl mb-2">
              {questions[currentStep].question}
            </h2>
            {questions[currentStep].inputs}
          </div>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          <div className="flex justify-between">
            {currentStep > 0 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Back
              </Button>
            )}
            {currentStep < questions.length - 1 ? (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPage;
