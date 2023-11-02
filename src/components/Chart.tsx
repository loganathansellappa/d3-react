import React, { useCallback, useMemo, useState } from "react";
import { useApi } from "../hooks/useOverview";
import LoadingSpinner from "./LoadingSpinner";
import * as d3 from "d3";
import { AreaChart } from "./charts/AreaChart";
import { CandleChart } from "./charts/CandleChart";
import "./Chart.scss";
import { ChartDatum, ChartType } from "../@types/ChartData";

export const Chart: React.FC = () => {
  const { data, isLoading, isError, error } = useApi("TIME_SERIES_DAILY");
  const [chartType, setChartType] = useState<ChartType>("AREA_STICK");

  const tableData = useMemo((): Array<ChartDatum> => {
    if (!data) {
      return [];
    }
    const parseDate = d3.timeParse("%Y-%m-%d");

    const stockData = Object.entries(data)
      .map(([date, values]) => ({
        ...values,
        Date: parseDate(date),
      }))
      .reverse();
    return stockData;
  }, [data]);

  const getChart = useCallback(() => {
    switch (chartType) {
      case "CANDLE_STICK":
        return <CandleChart data={tableData} />;
      default:
        return <AreaChart data={tableData} />;
    }
  }, [tableData, chartType]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError && error instanceof Error) {
    return <div>Error fetching data {error.message}</div>;
  }

  return (
    <div>
      <div className={"button-container"}>
        <button
          className={"button"}
          onClick={() => setChartType("CANDLE_STICK")}
        >
          CANDLE STICK
        </button>
        <button className={"button"} onClick={() => setChartType("AREA_STICK")}>
          AREA STICK
        </button>
      </div>
      {getChart()}
    </div>
  );
};
