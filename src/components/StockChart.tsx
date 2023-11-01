import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StockChartProps {
    data: { [date: string]: { open: string; high: string; low: string; close: string; volume: string } };
}

export const StockChart: React.FC<StockChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data && svgRef.current) {
            const svg = d3.select(svgRef.current);
            const width = 800;
            const height = 400;

            // Define your scales and data processing here
            const xScale = d3
                .scaleTime()
                .domain([new Date('2023-06-09'), new Date('2023-10-31')])
                .range([0, width]);

            const yScale = d3
                .scaleLinear()
                .domain([130, 150]) // Adjust the domain based on your data
                .range([height, 0]);

            const stockData = Object.entries(data).map(([date, values]) => ({
                date: new Date(date),
                close: +values.close,
            }));

            const line = d3
                .line()
                .x((d) => xScale(d.date)!)
                .y((d) => yScale(d.close)!);

            svg
                .append('path')
                .datum(stockData)
                .attr('class', 'line')
                .attr('d', line)
                .attr('stroke', 'blue')
                .attr('fill', 'none');
        }
    }, [data]);

    return (
        <svg ref={svgRef} width={800} height={400}>
            {/* Add axes and other chart elements here */}
        </svg>
    );
};
