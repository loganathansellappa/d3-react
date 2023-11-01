import React, {useMemo} from 'react';
import {useApi} from "../hooks/useOverview";
import LoadingSpinner from "./LoadingSpinner";
import {ChartComponent} from "./ChartComponent";
import * as d3 from "d3";


export const Chart: React.FC = () => {

    const { data, isLoading, isError, error } = useApi('TIME_SERIES_DAILY');
    const tableData = useMemo(() => {
        if (!data) { return { data: [] } }
        const parseDate = d3.timeParse("%Y-%m-%d");

        const stockData = Object.entries(data).map(([date, values]) => ({
            ...values,
            Date: parseDate(date),
            Close: +values.close,
        })).reverse();
        return stockData;

    }, [data]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError && error instanceof Error) {
        return <div>Error fetching data {error.message}</div>;
    }

    return (<div><ChartComponent data={tableData} /></div>);
};