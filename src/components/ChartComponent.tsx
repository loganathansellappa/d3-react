import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ChartComponent.scss';
interface ChartProps {
    data: Array<{ open: string; high: string; low: string; close: string; volume: string }>;
    name?: string;
}

export const ChartComponent: React.FC<ChartProps> = ({ data }) => {
    const chartRef = useRef(null);
    const chartContainerRef = useRef(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const margin = { top: 100, right: 60, bottom: 10, left: 10 };
    const width = 1600 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    useEffect(() => {
        if(!data) return;

        // Set dimensions and margins for the chart
        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const svg = d3.select(chartContainerRef.current).select('svg');

        if (!svg.empty()) {
            svg.selectAll('*').remove();
        } else {
            const newSvg = d3
                .select(chartContainerRef.current)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
            svgRef.current = newSvg.node();
        }

        svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const tooltip = d3.select(chartRef.current)
            .append("div")
            .attr("class", "tooltip");

        // Create a  tooltip div for raw date

        const tooltipRawDate = d3.select(chartRef.current)
            .append("div")
            .attr("class", "tooltip");

        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#85bb65")
            .attr("stop-opacity", 1);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#85bb65")
            .attr("stop-opacity", 0);


        // Set the domains for the x and y scales
        x.domain(d3.extent(data, d => d.Date)!);
        y.domain([d3.min(data, d => d.Close)!, d3.max(data, d => d.Close)!]);

        // Add the x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Add the right y-axis
        svg.append("g")
            .attr("transform", `translate(${width},0)`)
            .call(d3.axisRight(y).tickFormat(d => {
                if(isNaN(d as number)) return '';
                return d3.format(".2f")(d as number);
            }));

        // Set up the line generator
        const line = d3.line()
            .x(d => x(d.Date)!)
            .y(d => y(d.Close)!);

        // Create an area generator
        const area = d3.area()
            .x(d => x(d.Date)!)
            .y0(height)
            .y1(d => y(d.Close)!);

        // Add the area path
        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)
            .style("fill", "#85bb65")
            .style("opacity", 0.5);

        // Add the line path
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#85bb65")
            .attr("stroke-width", 1)
            .attr("d", line);

        const circle = svg.append("circle")
            .attr("r", 5)
            .attr("fill", "red")
            .style("stroke", "white")
            .attr("opacity", 0.7)
            .style("pointer-events", "none");

        // Add red lines extending from the circle to the date and value

        const tooltipLineX = svg.append("line")
            .attr("class", "tooltip-line")
            .attr("id", "tooltip-line-x")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2");

        const tooltipLineY = svg.append("line")
            .attr("class", "tooltip-line")
            .attr("id", "tooltip-line-y")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2");
        const listeningRect = svg.append("rect")
            .attr("width", width)
            .attr("height", height);

        listeningRect.on("touchmouse mousemove",(event) => {

            const [xCoord] = d3.pointer(event, this);
            const dateBisector = d3.bisector(d => d.Date).left;
            const x0 = x.invert(xCoord);
            const bisectionIndex = dateBisector(data,x0,1);
            const d0 = data[bisectionIndex - 1];
            const d1 = data[bisectionIndex];
            const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
            const xPos = x(d.Date);
            const yPos = y(d.Close);

            circle.attr("cx", xPos).attr("cy", yPos);


            // Add transition for the circle radius
            circle.transition()
                .duration(50)
                .attr("r", 5);

            // Update the position of the red lines

            tooltipLineX.style("display", "block").attr("x1", xPos).attr("x2", xPos).attr("y1", 0).attr("y2", height);
            tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos).attr("x1", 0).attr("x2", width);


            // add in our tooltip

            tooltip
                .style("display", "block")
                .style("left", `${width + 400}px`)
                .style("top", `${yPos + 180}px`)
                .html(`$${d.Close !== undefined ? d.Close : 'N/A'}`);


            tooltipRawDate
                .style("display", "block")
                .style("left", `${xPos + 350}px`)
                .style("top", `${height + 190}px`)
                .html(`${d.Date !== undefined ? d.Date.toISOString().slice(0, 10) : 'N/A'}`);
        });

        // listening rectangle mouse leave function

        listeningRect.on("mouseleave", function () {
            circle.transition().duration(50).attr("r", 0);
            tooltip.style("display", "none");
            tooltipRawDate.style("display", "none");
            tooltipLineX.attr("x1", 0).attr("x2", 0);
            tooltipLineY.attr("y1", 0).attr("y2", 0);
            tooltipLineX.style("display", "none");
            tooltipLineY.style("display", "none");
        });
        // Add the chart title

        svg.append('text')
            .attr('class', 'chart-title')
            .attr('x', width / 2) // Adjust the x-coordinate to center the title
            .attr('y', margin.top   ) // Adjust the y-coordinate for positioning
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style('font-family', 'sans-serif')
            .text('Nintendo Co., Ltd. (NTDOY)');
    }, [data]);


    return (
            <div ref={chartRef} >
                <div className="chart-container" ref={chartContainerRef}/>
            </div>
    );
};
