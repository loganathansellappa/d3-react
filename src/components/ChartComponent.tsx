import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ChartComponent.scss';
interface StockChartProps {
    data: { [date: string]: { open: string; high: string; low: string; close: string; volume: string } };
}

export const ChartComponent: React.FC<StockChartProps> = ({ data }) => {
    const chartContainerRef = useRef(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Set dimensions and margins for the chart
        const margin = { top: 70, right: 60, bottom: 50, left: 0 };
        const width = 1600 - margin.left - margin.right;
        const height = 800 - margin.top - margin.bottom;

        // Set up the x and y scales
        const x = d3.scaleTime().range([0, width]);
        const yRight = d3.scaleLinear().range([height, 0]);

        const svg = d3.select(chartContainerRef.current).select('svg');

        if (!svg.empty()) {
            svg.selectAll('*').remove();
        } else {
            const newSvg = d3
                .select(chartContainerRef.current)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

            svgRef.current = newSvg.node();
        }


        // Create the SVG element and append it to the chart container
        // const svg = d3.select(chartContainerRef.current)
        //     .append("svg")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform", `translate(${margin.left},${margin.top})`);

        // Parse the Date and convert the Close to a number
        const parseDate = d3.timeParse("%Y-%m-%d");
        const stockData = Object.entries(data).map(([date, values]) => ({
            Date: parseDate(date),
            Close: +values.close,
            Data: values, // Store the entire data object
        }));

        // Set the domains for the x and y scales
        x.domain(d3.extent(stockData, d => d.Date)!);
        yRight.domain([d3.min(stockData, d => d.Close)!, d3.max(stockData, d => d.Close)!]);

        // Add the x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Add the right y-axis
        svg.append("g")
            .attr("transform", `translate(${width},0)`)
            .call(d3.axisRight(yRight).tickFormat(d3.format("$.2f")));

        // Set up the line generator
        const line = d3.line()
            .x(d => x(d.Date)!)
            .y(d => yRight(d.Close)!);

        // Create an area generator
        const area = d3.area()
            .x(d => x(d.Date)!)
            .y0(height)
            .y1(d => yRight(d.Close)!);

        // Add the area path
        svg.append("path")
            .datum(stockData)
            .attr("class", "area")
            .attr("d", area)
            .style("fill", "#85bb65")
            .style("opacity", 0.5);

        // Add the line path
        svg.append("path")
            .datum(stockData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#85bb65")
            .attr("stroke-width", 1)
            .attr("d", line);

        // Create a tooltip for displaying data on mouseover
        const tooltip = d3.select(chartContainerRef.current)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);



        svg.selectAll(".data-point")
            .data(stockData)
            .enter()
            .append("circle")
            .attr("class", "data-point")
            .attr("cx", d => x(d.Date)!)
            .attr("cy", d => yRight(d.Close)!)
            .attr("r", 5)
            .on("mouseover", (event, d) => {
                const tooltipHTML = Object.entries(d.Data)
                    .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
                    .join('');

                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(tooltipHTML)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 28}px`);

            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


    }, [data]);

    return <div ref={chartContainerRef} />;
};
