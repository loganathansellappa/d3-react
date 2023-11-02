import React from "react";
import "./Overview.scss";
import { useApi } from "../hooks/useOverview";
import LoadingSpinner from "./LoadingSpinner";
import { Chart } from "./Chart";

export const Overview: React.FC = () => {
  const { data, isLoading, isError, error } = useApi("OVERVIEW");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError && error instanceof Error) {
    return <div>Error fetching data {error.message}</div>;
  }

  if (data) {
    return (
      <div className="overview">
        <h2>Overview</h2>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([property, value]) => (
              <tr key={property}>
                <td className={"bold-property"}>{property}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Chart></Chart>
      </div>
    );
  }
  return <div>Loading...</div>;
};
