import React from "react";

interface KeyValueTableProps {
  data: { [key: string]: string }[];
  headers: Array<string>;
}

export const KeyValueTable: React.FC<KeyValueTableProps> = ({
  data,
  headers,
}) => {
  // Extract all unique keys from the data
  const allKeys = Array.from(
    new Set(data.flatMap((item) => Object.keys(item))),
  );

  return (
    <table>
      <thead>
        <tr>
          {headers.map((h, index) => (
            <th key={index}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {allKeys.map((key) => (
          <tr key={key}>
            <td>{key}</td>
            {data.map((item, itemIndex) => (
              <td key={itemIndex}>{item[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
