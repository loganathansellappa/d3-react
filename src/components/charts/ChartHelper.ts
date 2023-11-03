import React from "react";
import { ScaleLinear, ScaleTime, select } from "d3";
import * as d3 from "d3";
import { ChartDatum } from "../../@types/ChartData";

/*
 * This function is used to add the tooltip to the chart
 * @param chartRef - The reference to the chart
 * @param svg - The svg element
 * @returns tooltip, tooltipRawDate, circle, tooltipLineX, tooltipLineY
 * tooltip - The tooltip element
 * tooltipRawDate - The tooltip element for the raw date
 * circle - The circle element
 * tooltipLineX - The line element for the x axis
 * tooltipLineY - The line element for the y axis
 *
 */
export const addToolTip = (
  chartRef: React.MutableRefObject<null>,
  svg: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
) => {
  const tooltip = select(chartRef.current)
    .append("div")
    .attr("class", "tooltip");
  const tooltipRawDate = select(chartRef.current)
    .append("div")
    .attr("class", "tooltip");
  const circle = (<any>svg)
    .append("circle")
    .attr("r", 0)
    .attr("fill", "red")
    .style("stroke", "white")
    .attr("opacity", 0.7)
    .style("pointer-events", "none");

  const tooltipLineX = (<any>svg)
    .append("line")
    .attr("id", "crosshair-x")
    .attr("class", "crosshair-x")
    .attr("stroke", "gray")
    .attr("stroke-dasharray", "3,3");

  const tooltipLineY = (<any>svg)
    .append("line")
    .attr("id", "crosshair-y")
    .attr("class", "crosshair-y")
    .attr("stroke", "gray")
    .attr("stroke-dasharray", "3,3");
  return { tooltip, tooltipRawDate, circle, tooltipLineX, tooltipLineY };
};

/*
 * This function is used to get the current position of the nearest data point
 * @param event - The mouse event
 * @param x - The x axis
 * @param data - The data
 * @param y - The y axis
 * @returns d, xPos, yPos
 * d - The nearest data point
 * xPos - The x position of the nearest data point
 * yPos - The y position of the nearest data point
 *
 */

export const getXyPosition = (
  event: React.MouseEvent<SVGSVGElement>,
  x: ScaleTime<number, number, never>,
  data: ChartDatum[],
  y: ScaleLinear<number, number, never>,
) => {
  const [xCoord] = d3.pointer(event);
  const dateBisector = d3.bisector((d: ChartDatum) => d.Date).left;
  const x0: Date = x.invert(xCoord);
  const bisectionIndex = dateBisector(data, x0, 1);
  const d0: ChartDatum = data[bisectionIndex - 1];
  const d1: ChartDatum = data[bisectionIndex];
  const d =
    x0.getTime() - d0.Date.getTime() > d1.Date.getTime() - x0.getTime()
      ? d1
      : d0;
  const xPos = x(d.Date);
  const yPos = y(d.Close);
  return { d, xPos, yPos };
};

/*
 * This function is used to remove the tooltip when the mouse leaves the chart
 */
export const onMouseLeave = (
  listeningRect: d3.Selection<SVGRectElement, any, HTMLElement, any>,
  circle: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
  tooltip: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
  tooltipRawDate: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
  tooltipLineX: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
  tooltipLineY: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
) => {
  listeningRect.on("mouseleave", function () {
    circle.transition().duration(50).attr("r", 0);
    tooltip.style("display", "none");
    tooltipRawDate.style("display", "none");
    tooltipLineX.attr("x1", 0).attr("x2", 0);
    tooltipLineY.attr("y1", 0).attr("y2", 0);
    tooltipLineX.style("display", "none");
    tooltipLineY.style("display", "none");
  });
};

export const setSvgDimensions = (
  cwidth: number,
  margin: { top: number; left: number; bottom: number; right: number },
  cheight: number,
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  data: ChartDatum[],
) => {
  const width = cwidth - margin.left - margin.right;
  const height = cheight - margin.top - margin.bottom;

  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const svg = d3.select(svgRef.current) as unknown as d3.Selection<
    SVGSVGElement,
    any,
    HTMLElement,
    any
  >;

  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  svg
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  x.domain(
    d3.extent(data, (d: ChartDatum) => d.Date)! as unknown as [Date, Date],
  );
  return { width, height, x, y, svg };
};

export const addFixedHoverEffect = (
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
    const { svgXpos, svgWidth, svgHeight, svgTop } = getSvgDimenstions(svg);

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
      .style("left", svgXpos! + svgWidth! - 100 + "px")
      .style("top", (svgHeight! + svgTop!) / 4 + "px")
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

export const getSvgDimenstions = (
  svg: d3.Selection<SVGSVGElement, any, HTMLElement, any>,
) => {
  const svgXpos = svg.node()?.getBoundingClientRect().left;
  const svgWidth = svg.node()?.getBoundingClientRect().width;
  const svgHeight = svg.node()?.getBoundingClientRect().height;
  const svgTop = svg.node()?.getBoundingClientRect().top;
  return { svgXpos, svgWidth, svgHeight, svgTop };
};

export const addHoverEffect = (
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
    .classed("background-area-rect", true);

  listeningRect.on("mousemove", (event: React.MouseEvent<SVGSVGElement>) => {
    const { d, xPos, yPos } = getXyPosition(event, x, data, y);

    circle.attr("cx", xPos).attr("cy", yPos);

    // Add transition for the circle radius
    circle.transition().duration(50).attr("r", 5);

    // Update the position of the crosshair lines
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

    const { svgXpos, svgWidth, svgHeight, svgTop } = getSvgDimenstions(svg);

    tooltip
      .style("display", "block")
      .style("left", `${svgXpos! + svgWidth!}px`)
      .style("top", `${yPos + 180}px`)
      .html(`$${d.Close !== undefined ? d.Close : "N/A"}`);

    tooltipRawDate
      .style("display", "block")
      .style("left", `${xPos + 200}px`)
      .style("top", `${svgHeight! + svgTop! - 100}px`)
      .html(
        `${d.Date !== undefined ? d.Date.toISOString().slice(0, 10) : "N/A"}`,
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

/*
 * This function is used to decide whether to display the fixed tooltip or the hover tooltip
 */
export const displayOnHover = (
  fixedTooltip: boolean,
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
  if (fixedTooltip) {
    addFixedHoverEffect(
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
  } else {
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
  }
};
