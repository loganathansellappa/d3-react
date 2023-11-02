import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./AreaChart.scss";
import { ScaleLinear, ScaleTime } from "d3";
import { ChartComponentProps, ChartDatum } from "../../@types/ChartData";
import {
  addToolTip,
  getXyPosition,
  onMouseLeave,
  setSvgDimensions,
} from "./ChartHelper";

interface AreaChartProps extends ChartComponentProps {}

function addHoverEffect(
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
) {
  const listeningRect = svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .classed("background-area-rect", true);

  listeningRect.on("mousemove", (event: React.MouseEvent<SVGSVGElement>) => {
    const { d, xPos, yPos } = getXyPosition(event, x, data, y);

    circle.attr("cx", xPos).attr("cy", yPos);

    // Add transition for the circle radius
    circle.transition().duration(50).attr("r", 5);

    // Update the position of the red lines

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

    // add in our tooltip

    tooltip
      .style("display", "block")
      .style("left", `${width + 400}px`)
      .style("top", `${yPos + 180}px`)
      .html(`$${d.Close !== undefined ? d.Close : "N/A"}`);

    tooltipRawDate
      .style("display", "block")
      .style("left", `${xPos + 350}px`)
      .style("top", `${height + 190}px`)
      .html(
        `${d.Date !== undefined ? d.Date.toISOString().slice(0, 10) : "N/A"}`,
      );
  });

  // listening rectangle mouse leave function

  onMouseLeave(
    listeningRect,
    circle,
    tooltip,
    tooltipRawDate,
    tooltipLineX,
    tooltipLineY,
  );
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  cwidth = 1600,
  cheight = 800,
}) => {
  const chartRef = useRef(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (!data) return;

    const margin = { top: 100, right: 60, bottom: 10, left: 10 };
    const { width, height, x, y, svg } = setSvgDimensions(
      cwidth,
      margin,
      cheight,
      svgRef,
      data,
    );
    y.domain([d3.min(data, (d) => d.Close)!, d3.max(data, (d) => d.Close)!]);

    // Add the x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the right y-axis
    svg
      .append("g")
      .attr("transform", `translate(${width},0)`)
      .call(
        d3.axisRight(y).tickFormat((d) => {
          if (isNaN(d as number)) return "";
          return d3.format(".2f")(d as number);
        }),
      );

    // Set up the line generator
    const line = d3
      .line<ChartDatum>()
      .x((d) => x(d.Date)!)
      .y((d) => y(d.Close)!);

    // Create an area generator
    const area = d3
      .area<ChartDatum>()
      .x((d) => x(d.Date)!)
      .y0(height)
      .y1((d) => y(d.Close)!);

    // Add the area path
    svg
      .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "#85bb65")
      .style("opacity", 0.5);

    // Add the line path
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#85bb65")
      .attr("stroke-width", 1)
      .attr("d", line);

    const { tooltip, tooltipRawDate, circle, tooltipLineX, tooltipLineY } =
      addToolTip(chartRef, svg);
    addHoverEffect(
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
  }, [data, cwidth, cheight]);

  return (
    <div ref={chartRef} className="chart-container" >
        <svg ref={svgRef}></svg>
    </div>
  );
};
