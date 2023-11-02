import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./AreaChart.scss";
import { ChartComponentProps, ChartDatum } from "../../@types/ChartData";
import { addToolTip, displayOnHover, setSvgDimensions } from "./ChartHelper";

interface AreaChartProps extends ChartComponentProps {}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  cwidth = 1600,
  cheight = 800,
  fixedTooltip = true,
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
  }, [data, cwidth, cheight, fixedTooltip]);

  return (
    <div ref={chartRef} className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};
