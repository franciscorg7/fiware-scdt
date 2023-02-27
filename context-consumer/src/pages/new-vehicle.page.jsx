import React, { useState } from "react";
import styled from "styled-components";
import { CompassOutlined, IdcardOutlined } from "@ant-design/icons";
import { Input, Select, Button } from "antd";

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
`;
const TitleWrapper = styled.div`
  width: 100%;
  font-size: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
const FormWrapper = styled.div`,
  width: 50%;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  justify-content: flex-start;

  > * {
    width: 20vw;
  }
`;
const CreateButton = styled(Button)`
  background-color: #d50e0e;
  color: white;
  font-weight: bold;
`;

/**
 * Vehicle (https://github.com/smart-data-models/dataModel.Transportation/blob/master/Vehicle/doc/spec.md)
 *
 * Required properties:
 * - id
 * - category
 * - location
 * - type (must be "vehicle")
 * - vehicleType
 *
 */

const NewVehicle = () => {
  const [id, setId] = useState(null);
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const [fuelEfficiency, setFuelEfficiency] = useState(null);

  /**
   * Vehicle category(ies) from an external point of view.
   * This is different than the vehicle type (car, lorry, etc.) represented by the vehicleType property.
   */
  const categoryEnum = [
    { value: "municipalServices", label: "Municipal Services" },
    { value: "nonTracked", label: "Non-tracked" },
    { value: "private", label: "Private" },
    { value: "public", label: "Public" },
    { value: "specialUsage", label: "Special Usage" },
    { value: "tracked", label: "Tracked" },
  ];

  /**
   * Type of vehicle from the point of view of its structural characteristics.
   * This is different than the vehicle category.
   */
  const vehicleTypeEnum = [
    { value: "agriculturalVehicle", label: "Agricultural Vehicle" },
    { value: "anyVehicle", label: "Any" },
    { value: "articulatedVehicle", label: "Articulated Vehicle" },
    { value: "bicycle", label: "Bicycle" },
    { value: "binTrolley", label: "Bin Trolley" },
    { value: "bus", label: "Bus" },
    { value: "car", label: "Car" },
    { value: "caravan", label: "Caravan" },
    { value: "carOrLightVehicle", label: "Light Vehicle" },
    { value: "carWithTrailer", label: "Car with Trailer" },
    { value: "cleaningTrolley", label: "Cleaning Trolley" },
    {
      value: "constructionOrMaintenanceVehicle",
      label: "Construction Vehicle",
    },
    { value: "fourWheelDrive", label: "Four-Wheel Vehicle" },
    { value: "highSidedVehicle", label: "High-Sided Vehicle" },
    { value: "lorry", label: "Lorry" },
    { value: "minibus", label: "Mini Bus" },
    { value: "moped", label: "Moped" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "motorcycleWithSideCar", label: "Motorcycle with Side Car" },
    { value: "motorscooter", label: "Motor Scooter" },
    { value: "sweepingMachine", label: "Sweeping Machine" },
    { value: "tanker", label: "Tanker" },
    { value: "threeWheeledVehicle", label: "Three-Wheeled Vehicle" },
    { value: "trailer", label: "Trailer" },
    { value: "tram", label: "Tram" },
    { value: "twoWheeledVehicle", label: "Two-Wheeled Vehicle" },
    { value: "trolley", label: "Trolley" },
    { value: "van", label: "Van" },
    {
      value: "vehicleWithoutCatalyticConverter",
      label: "Vehicle without Catalytic Converter",
    },
    { value: "vehicleWithCaravan", label: "Vehicle with Caravan" },
    { value: "vehicleWithTrailer", label: "Vehicle with Trailer" },
  ];

  const onVehicleTypeChange = (value) => {
    setVehicleType(value);
  };

  const onCategoryChange = (value) => {
    setCategory(value);
  };

  return (
    <PageWrapper>
      <TitleWrapper>
        <h1>New vehicle...</h1>
      </TitleWrapper>
      <FormWrapper>
        <Input
          size="large"
          placeholder="Entity ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          prefix={<IdcardOutlined />}
        />
        <Select
          mode="multiple"
          style={{ textAlign: "left" }}
          value={category}
          showSearch
          placeholder="Select a category"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          onChange={onCategoryChange}
          options={categoryEnum}
        />
        <Input
          size="large"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          prefix={<CompassOutlined />}
        />
        <Select
          style={{ textAlign: "left" }}
          value={vehicleType}
          showSearch
          placeholder="Select a type"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          onChange={onVehicleTypeChange}
          options={vehicleTypeEnum}
        />
        <Input
          size="large"
          placeholder="Fuel Efficiency"
          value={fuelEfficiency}
          onChange={(e) => setFuelEfficiency(e.target.value)}
          addonBefore="km/L"
        />
        <CreateButton>CREATE</CreateButton>
      </FormWrapper>
    </PageWrapper>
  );
};

export default NewVehicle;
