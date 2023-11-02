import React from "react";
import {ScaleLinear, ScaleTime, select} from "d3";
import * as d3 from "d3";
import {ChartDatum} from "../../@types/ChartData";


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



export function getXyPosition(event: React.MouseEvent<SVGSVGElement>, x: ScaleTime<number, number, never>, data: ChartDatum[], y: ScaleLinear<number, number, never>) {
    const [xCoord] = d3.pointer(event);
    const dateBisector = d3.bisector((d: ChartDatum) => d.Date).left;
    const x0: Date = x.invert(xCoord);
    const bisectionIndex = dateBisector(data, x0, 1);
    const d0: ChartDatum = data[bisectionIndex - 1];
    const d1: ChartDatum = data[bisectionIndex];
    const d = x0.getTime() - d0.Date.getTime() > d1.Date.getTime() - x0.getTime() ? d1 : d0;
    const xPos = x(d.Date);
    const yPos = y(d.Close);
    return {d, xPos, yPos};
}