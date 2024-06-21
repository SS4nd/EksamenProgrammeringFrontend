import React from "react";
import { NavLink } from "react-router-dom";
import "./deltagerTable.css";

interface DeltagerTableProps {
  data: any[]; // Replace 'any[]' with your actual data type
}

const DeltagerTable: React.FC<DeltagerTableProps> = ({ data }) => {
  const renderTableRows = () => {
    const rows = [];
    for (let i = 0; i < data.length; i += 3) {
      const row = (
        <tr key={i}>
          {[0, 1, 2].map((j) => {
            const index = i + j;
            if (index < data.length) {
              const item = data[index];
              return (
                <td key={item.deltagerID} className="table-cell">
                  <NavLink
                    to={`/deltager/${item.deltagerID}`}
                    className="active-link"
                  >
                    {item.navn}
                  </NavLink>
                  <div className="data-info">
                    <div>Gender: {item.gender}</div>
                    <div>Age: {item.alder}</div>
                    <div>Club: {item.klub}</div>
                  </div>
                </td>
              );
            } else {
              return <td key={`${i}-${j}`}></td>;
            }
          })}
        </tr>
      );
      rows.push(row);
    }
    return rows;
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <tbody>{data && renderTableRows()}</tbody>
      </table>
    </div>
  );
};

export default DeltagerTable;
