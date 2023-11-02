import React from "react";
import "./Overview.scss";
import { useApi } from "../../hooks/customHooks";
import LoadingSpinner from "../loader/LoadingSpinner";
import { Chart } from "../charts/Chart";
import { UseQueryResult } from "react-query";

export const Overview: React.FC = () => {
  const { data, isLoading, isError, error }: UseQueryResult<any> =
    useApi("OVERVIEW");

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
                <th>{data.Name!}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([property, value]) => (
                <tr key={property}>
                  <td className={"bold-property"}>{property}</td>
                  <td>{value as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="chart">
            <Chart fixedTooltip={true}></Chart>
          </div>
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
};
