import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./CandleChart.scss";
import { ScaleLinear, ScaleTime } from "d3";
import { ChartDatum } from "../../@types/ChartData";
import { addToolTip, getXyPosition, onMouseLeave } from "./ChartHelper";

interface ChartProps {
  data: Array<ChartDatum>;
}

const addHoverEffect = (
  svg: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
  width: number,
  height: number,
  x: ScaleTime<number, number, never>,
  data: ChartDatum[],
  y: ScaleLinear<number, number, never>,
  circle: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
  tooltipLineX: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
  tooltipLineY: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
  tooltip: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
  tooltipRawDate: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
) => {
  const listeningRect = svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .classed("background-rect", true);
  listeningRect.on("mousemove", (event: React.MouseEvent<SVGSVGElement>) => {
    const { d, xPos, yPos } = getXyPosition(event, x, data, y);

    circle.attr("cx", xPos).attr("cy", yPos);
    // Add transition for the circle radius
    circle.transition().duration(50).attr("r", 20);
    tooltipLineX
      .style("display", "block")
      .attr("x1", xPos)
      .attr("x2", xPos)
      .attr("y1", 0)
      .attr("y2", height);
    tooltipLineY
      .style("display", "block")
      .attr("y1", yPos)
      .attr("y2", yPos)
      .attr("x1", 0)
      .attr("x2", width);
    tooltip
      .style("display", "block")
      .style("left", `100px`)
      .style("top", `100px`)
      .html(
        `<ul>
                            <li>Date: ${d.Date.toISOString().slice(0, 10)}</li>
                            <li>Open: ${d.open}</li>
                            <li>High: ${d.high}</li>
                            <li>Low: ${d.low}</li>
                            <li>Close: ${d.Close}</li>
                        </ul>`,
      );
  });
  onMouseLeave(
    listeningRect,
    circle,
    tooltip,
    tooltipRawDate,
    tooltipLineX,
    tooltipLineY,
  );
};

export const CandleChart: React.FC<ChartProps> = ({ data }) => {
  const chartRef = useRef(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data) return;

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 1800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const svg = d3.select(svgRef.current) as unknown as d3.Selection<
      SVGSVGElement,
      any,
      HTMLElement,
      any
    >;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    x.domain(d3.extent(data, (d) => d.Date)! as [Date, Date]);
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

    addHoverEffect.call(
      this,
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
  }, [data]);

  return (
    <div ref={chartRef} className={"chart-container"}>
      <svg ref={svgRef}></svg>
    </div>
  );
};
