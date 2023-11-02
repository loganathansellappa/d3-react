import React, { useMemo, useState } from "react";
import { KeyValueTable } from "../common/KeyValueTable";
import { BalanceSheetSchemaType } from "../../@types/zodSchema";
import { useApi } from "../../hooks/customHooks";
import LoadingSpinner from "../loader/LoadingSpinner";
import "./Data.scss";
interface DataProps {
  dataKey: string;
  title: string;
}

export const DataComponent: React.FC<DataProps> = ({ dataKey, title }) => {
  const { data, isLoading, isError, error } = useApi(dataKey);
  const [displayAnnual, setDisplayAnnual] = useState(true);
  const reports = displayAnnual
    ? (data as BalanceSheetSchemaType)?.annualReports
    : (data as BalanceSheetSchemaType)?.quarterlyReports;

  const tableData = useMemo(() => {
    if (!reports) {
      return { headers: [], data: [] };
    }

    const headers = [
      "Breakdown",
      ...reports.map((report) => report.fiscalDateEnding),
    ];
    const data = reports.filter(
      (report) => report.fiscalDateEnding !== "fiscalDateEnding",
    );

    return { headers, data };
  }, [reports]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError && error instanceof Error) {
    return <div>Error fetching data {error.message}</div>;
  }

  return (
    <div className="data">
      <h2>{title}</h2>
      <div className={"button-container"}>
        <button className={"button"} onClick={() => setDisplayAnnual(true)}>
          Annual
        </button>
        <button className={"button"} onClick={() => setDisplayAnnual(false)}>
          Quarterly
        </button>
      </div>
      <KeyValueTable headers={tableData.headers} data={tableData.data} />
    </div>
  );
};
