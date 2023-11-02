import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import './CandleChart.scss';
import {ScaleLinear, ScaleTime} from "d3";
import {ChartDatum} from "../../@types/ChartData";

interface ChartProps {
    data: Array<ChartDatum>;
}

export const addToolTip = (chartRef: React.MutableRefObject<null>, svg: Selection<ElementTagNameMap[string], unknown, null, undefined>) => {
    const tooltip = d3.select(chartRef.current).append('div').attr('class', 'tooltip');
    const tooltipRawDate = d3.select(chartRef.current)
        .append("div")
        .attr("class", "tooltip");
    const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "red")
        .style("stroke", "white")
        .attr("opacity", 0.7)
        .style("pointer-events", "none");

    const tooltipLineX = svg.append('line')
        .attr('id', 'crosshair-x')
        .attr('class', 'crosshair-x')
        .attr('stroke', 'gray')
        .attr('stroke-dasharray', '3,3');

    const tooltipLineY = svg.append('line')
        .attr('id', 'crosshair-y')
        .attr('class', 'crosshair-y')
        .attr('stroke', 'gray')
        .attr('stroke-dasharray', '3,3');
    return {tooltip, tooltipRawDate, circle, tooltipLineX, tooltipLineY};
}
const addHoverEffect = (svg: Selection<ElementTagNameMap[string], unknown, null, undefined>, width: number, height: number, x: ScaleTime<number, number, never>, data, y: ScaleLinear<number, number, never>, circle, tooltipLineX, tooltipLineY, tooltip: Selection<ElementTagNameMap[string], unknown, HTMLElement, any>, tooltipRawDate: Selection<ElementTagNameMap[string], unknown, HTMLElement, any>) => {
    const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .classed("background-rect", true);
    listeningRect.on("touchmouse mousemove", (event: MouseEvent) => {
        const [xCoord] = d3.pointer(event, this);
        const dateBisector = d3.bisector(d => d.Date).left;
        const x0 = x.invert(xCoord);
        const bisectionIndex = dateBisector(data, x0, 1);
        const d0 = data[bisectionIndex - 1];
        const d1 = data[bisectionIndex];
        const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
        const xPos = x(d.Date);
        const yPos = y(d.Close);

        circle.attr("cx", xPos).attr("cy", yPos);
        // Add transition for the circle radius
        circle.transition()
            .duration(50)
            .attr("r", 20);
        tooltipLineX.style("display", "block").attr("x1", xPos).attr("x2", xPos).attr("y1", 0).attr("y2", height);
        tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos).attr("x1", 0).attr("x2", width);
        tooltip.style("display", "block")
            .style("left", `100px`)
            .style("top", `100px`)
            .html(
                `<ul>
                            <li>Date: ${d.Date.toISOString().slice(0, 10)}</li>
                            <li>Open: ${d.open}</li>
                            <li>High: ${d.high}</li>
                            <li>Low: ${d.low}</li>
                            <li>Close: ${d.close}</li>
                        </ul>`)

    });

    listeningRect.on("mouseleave", function () {
        circle.transition().duration(50).attr("r", 0);
        tooltip.style("display", "none");
        tooltipRawDate.style("display", "none");
        tooltipLineX.attr("x1", 0).attr("x2", 0);
        tooltipLineY.attr("y1", 0).attr("y2", 0);
        tooltipLineX.style("display", "none");
        tooltipLineY.style("display", "none");
    });
}


export const CandleChart: React.FC<ChartProps> = ({ data }) => {
    const chartRef = useRef(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 1800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    useEffect(() => {
        if (!data) return;

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        x.domain(d3.extent(data, (d) => d.Date)!);
        y.domain([d3.min(data, (d) => d.low)!, d3.max(data, (d) => d.high)!]);

        const {tooltip, tooltipRawDate, circle, tooltipLineX, tooltipLineY} = addToolTip(chartRef, svg);

        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %d')));

        svg.append("g")
            .attr("transform", `translate(${width},0)`)
            .call(d3.axisRight(y).tickFormat(d => {
                if(isNaN(d as number)) return '';
                return d3.format(".2f")(d as number);
            }));

        const candleWidth = width / data.length;

        svg.selectAll('.wick')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', (d) => x(d.Date))
            .attr('x2', (d) => x(d.Date))
            .attr('y1', (d) => y(d.high))
            .attr('y2', (d) => y(d.low))
            .attr('class', (d) => (d.open < d.close ? 'wick green' : 'wick red'));

        svg.selectAll('.candle')
            .data(data)
            .enter()
             .append('rect')
            .attr('x', (d) => x(d.Date) - candleWidth / 2)
            .attr('y', (d) => y(Math.max(d.open, d.close)))
            .attr('width', candleWidth)
            .attr('height', (d) => Math.abs(y(d.open) - y(d.close)))
            .attr('class', (d) => (d.open < d.close ? 'candle green' : 'candle red'));

        addHoverEffect.call(this, svg, width, height, x, data, y, circle, tooltipLineX, tooltipLineY, tooltip, tooltipRawDate);

    }, [data]);


    return (
        <div ref={chartRef} className={'chart-container'}>
            <svg ref={svgRef}></svg>
        </div>
    );
};
