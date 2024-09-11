import { useMemo } from "react";
import { COLUMNS } from "./columns.jsx";
import { useTable, useGlobalFilter, usePagination } from "react-table";
import { useSelector } from "react-redux";
import "./UserTable.css";
import { GlobalFilter } from "./GlobalFilter";

const UserTable = () => {
  const userData = useSelector((state) => state.admins.userData);

  const columns = useMemo(() => COLUMNS, []);

  const tableInstance = useTable(
    {
      columns: columns,
      data: userData,
    },
    useGlobalFilter,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;
  const { globalFilter } = state;

  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th key={column.id} {...column.getHeaderProps()}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td key={cell.id} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-buttons">
        <button className="pagination-btn" onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button className="pagination-btn" onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </>
  );
};

export default UserTable;
