import React from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { IconButton } from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useSelectedItemContext } from "../store/selected_item_store";

const CommonTable = ({
  headers,
  data,
  editFunc,
  deleteFunc,
  viewFunc,
  currentPage,
  itemsPerPage,
  onPageChange,
  primaryFieldName,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { setSelectedItem } = useSelectedItemContext();
  const paginatedData = data.slice(startIndex, endIndex);
  return (
    <TableContainer component={Paper} sx={{ flex: 1, marginBottom: "16px" }}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((data, index) => (
              <TableCell key={index}>{data.toUpperCase()}</TableCell>
            ))}
            <TableCell>Actions </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) => (
            <TableRow key={index}>
              {headers.map((key, index) => (
                <TableCell key={index}>{row[key]}</TableCell>
              ))}
              <TableCell>
                {viewFunc && (
                  <IconButton
                    onClick={() => {
                      localStorage.setItem(
                        "selected_value",
                        row[primaryFieldName]
                      );
                      setSelectedItem(row);
                      viewFunc();
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
                {editFunc && (
                  <IconButton
                    onClick={() => {
                      localStorage.setItem(
                        "selected_value",
                        row[primaryFieldName]
                      );
                      setSelectedItem(row);
                      setTimeout(editFunc, 2000);
                    }}
                  >
                    <Edit />
                  </IconButton>
                )}
                {deleteFunc && (
                  <IconButton
                    onClick={() => {
                      localStorage.setItem(
                        "selected_value",
                        row[primaryFieldName]
                      );
                      setSelectedItem(row);
                      deleteFunc();
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;
