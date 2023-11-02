import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./CandleChart.scss";
import { ChartComponentProps } from "../../@types/ChartData";
import { addToolTip, displayOnHover, setSvgDimensions } from "./ChartHelper";
interface CandleChartProps extends ChartComponentProps {}

export const CandleChart: React.FC<CandleChartProps> = ({
  data,
  cheight = 800,
  cwidth = 1600,
  fixedTooltip = true,
}) => {
  const chartRef = useRef(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data) return;

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const { width, height, x, y, svg } = setSvgDimensions(
      cwidth,
      margin,
      cheight,
      svgRef,
      data,
    );
    y.domain([d3.min(data, (d) => d.low)!, d3.max(data, (d) => d.high)!]);

    const { tooltip, tooltipRawDate, circle, tooltipLineX, tooltipLineY } =
      addToolTip(chartRef, svg);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3.axisBottom(x).tickFormat((d) => d3.timeFormat("%b %d")(d as Date)),
      );

    svg
      .append("g")
      .attr("transform", `translate(${width},0)`)
      .call(
        d3.axisRight(y).tickFormat((d) => {
          if (isNaN(d as number)) return "";
          return d3.format(".2f")(d as number);
        }),
      );

    const candleWidth = width / data.length;

    svg
      .selectAll(".wick")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (d) => x(d.Date))
      .attr("x2", (d) => x(d.Date))
      .attr("y1", (d) => y(d.high))
      .attr("y2", (d) => y(d.low))
      .attr("class", (d) => (d.open < d.Close ? "wick green" : "wick red"));

    svg
      .selectAll(".candle")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.Date) - candleWidth / 2)
      .attr("y", (d) => y(Math.max(d.open, d.Close)))
      .attr("width", candleWidth)
      .attr("height", (d) => Math.abs(y(d.open) - y(d.Close)))
      .attr("class", (d) => (d.open < d.Close ? "candle green" : "candle red"));

    displayOnHover(
      fixedTooltip,
      svg,
      width,
      height,
      x,
      data,
      y,
      circle,
      tooltipLineX,
      tooltipLineY,
      tooltip as unknown as d3.Selection<SVGSVGElement, any, HTMLElement, any>,
      tooltipRawDate as unknown as d3.Selection<
        SVGSVGElement,
        any,
        HTMLElement,
        any
      >,
    );
  }, [data, cheight, cwidth, fixedTooltip]);

  return (
    <div ref={chartRef} className={"chart-container"}>
      <svg ref={svgRef}></svg>
    </div>
  );
};
