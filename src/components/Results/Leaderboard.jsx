import * as React from "react";
import "./Leaderboard.css"
import { FormControl, InputLabel, MenuItem, Select, Box, TableContainer } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";



const dataRows = [
    { id: 1, rank: 1, name: "John Doe", class: "Class A", year: "2023", aggregate: 92.5 },
    { id: 2, rank: 2, name: "Jane Smith", class: "Class B", year: "2023", aggregate: 88.7 },
    { id: 3, rank: 3, name: "Michael Johnson", class: "Class A", year: "2022", aggregate: 85.2 },
    { id: 4, rank: 4, name: "Emily Brown", class: "Class C", year: "2022", aggregate: 78.9 },
    { id: 5, rank: 5, name: "William Lee", class: "Class B", year: "2021", aggregate: 75.6 },
  ];
  
  const columns = [
    { field: "rank", headerName: "Rank", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "class", headerName: "Class", width: 100 },
    { field: "year", headerName: "Year", width: 100 },
    { field: "aggregate", headerName: "Aggregate %", width: 100 },
  ];

const Leaderboard = () => {
    return (
        <div>
            <div className="container">
                <div className="heading">
                    <h2>TOPPERS</h2>
                </div>
        </div>

        <div>
            <div className="lb-year-dd">
                    <Box className="lb-box1">
                    <FormControl fullWidth variant="filled">
                            <InputLabel>YEAR</InputLabel>
                                <Select className="dropdown-class-main">
                                    <MenuItem value={2023}>2023</MenuItem>
                                    <MenuItem value={2022}>2022</MenuItem>
                                    <MenuItem value={2021}>2021</MenuItem>
                                </Select>
                        </FormControl>
                    </Box>
                </div>

                <div className="lb-class-dd">
                    <Box className="lb-box1">
                        <FormControl fullWidth variant="filled">
                            <InputLabel>CLASS</InputLabel>
                                <Select className="dropdown-class-main">
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={9}>9</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                </Select>
                        </FormControl>
                    </Box>
                </div>
            </div>

            
            <div className="lb-table">
                <DataGrid
                    rows={dataRows}
                    columns={columns}
                    pageSize={5}
                    autoHeight
                    hideFooter
                    hideFooterPagination
                    hideFooterSelectedRowCount
                />
            </div>

            <div className="footnote">
            <h1>
                WE ARE PROUD OF OUR ACHIEVERS !!
            </h1>
            </div>

            </div>
    )
}
export default Leaderboard;