import React from "react";
import "./Overview.scss";
import { useApi } from "../../hooks/customHooks";
import LoadingSpinner from "../loader/LoadingSpinner";
import { Chart } from "../charts/Chart";

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
        <div className="overview__content">
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
          <div className="chart">
            <Chart></Chart>
          </div>
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
};
