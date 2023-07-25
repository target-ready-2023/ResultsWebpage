import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "./index.css";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import BasicTable from "../table/BasicTable";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from "@mui/x-data-grid-generator";
import { AiOutlinePlus, AiFillSchedule, AiTwotoneDelete, BsFillPencilFill,AiTwotoneSave,AiTwotoneCloseSquare } from "react-icons/ai";
import {GiCancel} from "react-icons/gi";
import {GrAdd} from "react-icons/gr";

const ExamMainPage = () => {

  const [anchor, setAnchor] = React.useState(null);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  function handleChange() {}

  const [columns, setColumns] = React.useState([
    {
      field: "code",
      headerName: "Subject Code",
      type: "String",
      editable: true,
    },
    {
      field: "name",
      headerName: "Subject Name",
      editable: true,
      width: 180,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "timing",
      headerName: "Date & Time",
      type: "dateTime",
      width: 220,
      valueGetter: ({ value }) => value && new Date(value),
      editable: true,
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <button onClick={() => handleDeleteRow(params.row.id)}>
          <AiTwotoneDelete />
        </button>
      ),
    },
  ]);
  const [rows, setRows] = React.useState([
    {
      id: 1,
      code: "M101",
      name: "Mathematics",
      timing: randomCreatedDate(),
    },
    {
      id: 2,
      code: "Ph101",
      name: "Physics",
      timing: randomCreatedDate(),
    },
    { id: 3, code: "Ch101", name: "Chemistry", timing: randomCreatedDate() },
    {
      id: 4,
      code: "Co101",
      name: "Computer Science",
      timing: randomCreatedDate(),
    },
  ]);

  const handleAddRow = () => {
    const newRow = { id: "", code: "", name: "", age: "" };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;

    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };
  const handleDeleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  return (
    <>
    <div className="main-div">
      <div className="top-part">
        <div className="add-button">
          <Button variant="contained" onClick={handleClick}>
            {" "}
            <AiFillSchedule className="icon" /> Add Schedule
          </Button>
          <Popover
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={() => setAnchor(null)}
            anchorOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
          >
            <Typography sx={{ p: 2 }}>
              <div>
                <div className="add-sh-dropdowns">
                  
                  <Box className="dd1">
                    <FormControl fullWidth variant="filled" sx={{ m: 1 }}>
                      <InputLabel>Class Name</InputLabel>
                      <Select className="classForAdmin">
                        <MenuItem value={10}>10th</MenuItem>
                        <MenuItem value={9}>9th</MenuItem>
                        <MenuItem value={8}>8th</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box className="dd3">
                    <FormControl fullWidth variant="filled" sx={{ m: 1 }}>
                      <InputLabel>Schedule Name</InputLabel>
                      <Select>
                        <MenuItem value={1}>Test 1</MenuItem>
                        <MenuItem value={2}>Test 2</MenuItem>
                        <MenuItem value={4}>Mid-Term</MenuItem>
                        <MenuItem value={5}>Test 3</MenuItem>
                        <MenuItem value={6}>Test 4</MenuItem>
                        <MenuItem value={7}>Pre-Preparatory</MenuItem>
                        <MenuItem value={8}>Preparatory</MenuItem>
                        <MenuItem value={9}>Final</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="dd2">
                    <FormControl fullWidth variant="filled" sx={{ m: 1 }}>
                      <InputLabel>Schedule Type</InputLabel>
                      <Select>
                        <MenuItem value={10}>Exam</MenuItem>
                        <MenuItem value={9}>Test</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div class="Table">
                  <DataGrid
                    editMode="row"
                    rows={rows}
                    columns={columns}
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    hideFooter
                    //onCellEditCommit={handleCellEditCommit}
                  />
                </div>
                <div className="add">
                  <button onClick={handleAddRow}><GrAdd/> Subject </button>
                  <button type="cancel">Cancel {<GiCancel />}</button>
                  <button type="submit">Save Schedule {<AiTwotoneSave />}</button>
                </div>
              </div>
            </Typography>
          </Popover>
        </div>
        <div className="drop-down">
          <Box className="label">
            <FormControl fullWidth variant="filled">
              <InputLabel>Class</InputLabel>
              <Select className="dropdown-class-main">
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={8}>8</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>    
    </div>
    
        <div className="table">
        <BasicTable/>
        </div>
      </>
  );
};

export default ExamMainPage;
