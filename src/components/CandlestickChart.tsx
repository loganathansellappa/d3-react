import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './CandlestickChart.scss';

interface ChartProps {
    data: Array<{
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
        Date: Date;
    }>;
}

export const CandlestickChart: React.FC<ChartProps> = ({ data }) => {
    const chartRef = useRef(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    useEffect(() => {
        if (!data) return;


        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const svg = d3.select(svgRef.current)
            // .attr('width', width + margin.left + margin.right)
            // .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const tooltip = d3.select(chartRef.current).append('div').attr('class', 'tooltip');
        const tooltipRawDate = d3.select(chartRef.current)
            .append("div")
            .attr("class", "tooltip");

        x.domain(d3.extent(data, (d) => d.Date)!);
        y.domain([d3.min(data, (d) => d.low)!, d3.max(data, (d) => d.high)!]);


        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat('%Y-%m-%d')));

        svg.append("g")
            .attr("transform", `translate(${width},0)`)
            .call(d3.axisRight(y).tickFormat(d => {
                if(isNaN(d as number)) return '';
                return d3.format(".2f")(d as number);
            }));



        const candleWidth = width / data.length;
        const circle = svg.append("circle")
            .attr("r", 5)
            .attr("fill", "red")
            .style("stroke", "white")
            .attr("opacity", 0.7)
            .style("pointer-events", "none");

        const tooltipLineX = svg.append('line')
            .attr('id', 'crosshair-x')
            .attr('class', 'crosshair-x')
            .attr('stroke', 'gray')
            .attr('stroke-dasharray', '3,3');

        const tooltipLineY =  svg.append('line')
            .attr('id', 'crosshair-y')
            .attr('class', 'crosshair-y')
            .attr('stroke', 'gray')
            .attr('stroke-dasharray', '3,3')

        svg.selectAll('.wick')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', (d) => x(d.Date))
            .attr('x2', (d) => x(d.Date))
            .attr('y1', (d) => y(d.high))
            .attr('y2', (d) => y(d.low))
            .attr('class', (d) => (d.open < d.close ? 'wick green' : 'wick red'));

        const listeningRect = svg.append("rect")
            .attr("class", 'rect-listener')
            .attr("width", width)
            .attr("height", height)
            .classed("background-rect", true);
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
            tooltipLineX.style("display", "block").attr("x1", xPos).attr("x2", xPos).attr("y1", 0).attr("y2", height);
            tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos).attr("x1", 0).attr("x2", width);
            tooltip
                .style("display", "block")
                .style("left", `${width + 400}px`)
                .style("top", `${yPos + 180}px`)
                .html(
                `<ul>
                            <li>Date: ${d.Date ? d.Date.toISOString().slice(0, 10) : 'N/A'}</li>
                            <li>Open: ${d.open}</li>
                            <li>High: ${d.high}</li>
                            <li>Low: ${d.low}</li>
                            <li>Close: ${d.close}</li>
                        </ul>`)

        })
        svg.selectAll('.candle')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => x(d.Date) - candleWidth / 2)
            .attr('y', (d) => y(Math.max(d.open, d.close)))
            .attr('width', candleWidth)
            .attr('height', (d) => Math.abs(y(d.open) - y(d.close)))
            .attr('class', (d) => (d.open < d.close ? 'candle green' : 'candle red'))
            // .on('moduseover moudsemove', (event,d) => {
            //     const [xCoord, yCoord] = d3.pointer(event);
            //     setCrosshairX(xCoord);
            //     setCrosshairY(yCoord);
            //
            //     crosshair.style('display', 'block');
            //     crosshair
            //         .select('.crosshair-line')
            //         .attr('x1', xCoord)
            //         .attr('x2', xCoord)
            //         .attr('y1', 0)
            //         .attr('y2', height);
            //     crosshair.select('#crosshair-x').attr('x1', xCoord).attr('x2', xCoord);
            //     crosshair.select('#crosshair-y').attr('y1', yCoord).attr('y2', yCoord);
            //     const bisectDate = d3.bisector((d: any) => new Date(d.Date)).left;
            //     const x0 = x.invert(xCoord);
            //     const i = bisectDate(data, x0, 1);
            //     const d0 = data[i - 1];
            //     const d1 = data[i];
            //     const dd = x0 - new Date(d0.Date) > new Date(d1.Date) - x0 ? d1 : d0;
            //
            //     tooltip.style('display', 'block');
            //     tooltip.html(
            //         `<ul>
            //                 <li>Date: ${d.Date ? d.Date.toISOString().slice(0, 10) : 'N/A'}</li>
            //                 <li>Open: ${d.open}</li>
            //                 <li>High: ${d.high}</li>
            //                 <li>Low: ${d.low}</li>
            //                 <li>Close: ${d.close}</li>
            //             </ul>`
            //     );
            //     tooltip.style('left', `${x(d.Date) + margin.left - 30}px`);
            //     tooltip.style('top', `${y(Math.max(d.open, d.close)) + margin.top + 20}px`);
            //     setCrosshairX(x(dd.Date));
            //     setCrosshairY(y(Math.max(dd.open, dd.close)));
            // })
            .on('mouseout mouseleave', () => {
                tooltip.style('display', 'none');
                circle.transition().duration(50).attr("r", 0);
                tooltip.style("display", "none");
                tooltipRawDate.style("display", "none");
                tooltipLineX.attr("x1", 0).attr("x2", 0);
                tooltipLineY.attr("y1", 0).attr("y2", 0);
                tooltipLineX.style("display", "none");
                tooltipLineY.style("display", "none");
                // crosshair.style('display', 'none');

            });
    }, [data]);

    return (
        <div ref={chartRef} className={'chart-container'}>
            <svg ref={svgRef} height={100} width={1000}></svg>
        </div>
    );
};
