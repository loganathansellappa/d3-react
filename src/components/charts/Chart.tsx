import React, { useCallback, useMemo, useState } from "react";
import { useApi } from "../../hooks/customHooks";
import LoadingSpinner from "../loader/LoadingSpinner";
import * as d3 from "d3";
import { AreaChart } from "./AreaChart";
import { CandleChart } from "./CandleChart";
import "./Chart.scss";
import {
  ChartComponentProps,
  ChartDatum,
  ChartType,
} from "../../@types/ChartData";
import { Button } from "../button/Button";

interface ChartProps extends Omit<ChartComponentProps, "data"> {}
export const Chart: React.FC<ChartProps> = ({
  cwidth,
  cheight,
  fixedTooltip = false,
}) => {
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
        return (
          <CandleChart cwidth={cwidth} cheight={cheight} data={tableData} />
        );
      default:
        return (
          <AreaChart
            cwidth={cwidth}
            cheight={cheight}
            data={tableData}
            fixedTooltip={fixedTooltip}
          />
        );
    }
  }, [tableData, chartType, cwidth, cheight, fixedTooltip]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError && error instanceof Error) {
    return <div>Error fetching data {error.message}</div>;
  }

  return (
    <div className={"chart-wrapper"}>
      <h2 className={"title"}>Daily Data</h2>
      <Button
        buttonOneClick={() => setChartType("AREA_STICK")}
        buttonTwoClick={() => setChartType("CANDLE_STICK")}
        labelOne={"Area Chart"}
        labelTwo={"Candle Chart"}
      />
      {getChart()}
    </div>
  );
};
