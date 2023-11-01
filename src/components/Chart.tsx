import React, {useMemo} from 'react';
import {useApi} from "../hooks/useOverview";
import LoadingSpinner from "./LoadingSpinner";
import {ChartComponent} from "./ChartComponent";


export const Chart: React.FC = () => {

    const { data, isLoading, isError, error } = useApi('TIME_SERIES_DAILY');
    // const chartData = (data as TimeSeriesDailyType)?.["Time Series (Daily)"];
    const tableData = useMemo(() => {
        if (!data) { return { data: [] } }

        return data;

    }, [data]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError && error instanceof Error) {
        return <div>Error fetching data {error.message}</div>;
    }

    return (<div><ChartComponent data={tableData} chartType={'line'}/></div>);
};