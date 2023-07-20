import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from "@mui/x-data-grid-generator";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import DltPop from "../ExamMainPage/dltpopover";
import { AiTwotoneDelete } from "react-icons/ai";
import { Popover } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {GrAdd} from "react-icons/gr";

function BasicTable() {
  const [jsonData, setJsonData] = useState([
    {
      id: 1,
      scheduleCode: "t1",
      classCode: "C1",
      className: 1,
      scheduleType: "Test 1",
      nestedData: [
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
        {
          id: 3,
          code: "Ch101",
          name: "Chemistry",
          timing: randomCreatedDate(),
        },
      ],
    },
    {
      id: 2,
      scheduleCode: "t2",
      classCode: "C2",
      className: 2,
      scheduleType: "Test 2",
      nestedData: [
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
      ],
    },
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState([]);
  const popoverOpen = Boolean(anchorEl);

  // const [openDialog, setOpenDialog] = useState(false);
  // const [dialogData, setDialogData] = useState([]);

  const handleNestedDataClick = (event, nestedData) => {
    setPopoverData(nestedData);
    setAnchorEl(event.currentTarget);
  };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  //   setDialogData([]);
  // };

  const handleDeleteRow = (id) => {
    setPopoverData((prevRows)=>prevRows.filter((row)=> row.id !== id));
  };

  const handleAddRow = () => {
     const newRow = { id: "", code: "", name: "", age: "" };
    setPopoverData((prevRows) => [...prevRows, newRow]);
  };


  const columns = [
    { field: "className", headerName: "Class Name", width: 300 },
    { field: "scheduleType", headerName: "Schedule Type", width: 300 },
    {
      field: "status",
      renderCell: (cellValues) => {
        return (
          <Switch value="checkedA" inputProps={{ "aria-label": "Switch A" }} />
        );
      },
      headerName: "Status",
      width: 150,
    },
    {
      field: "actions",
      headerName: "View/Edit",
      width: 220,
      renderCell: (params) => (
        <Button
          onClick={(event) =>
            handleNestedDataClick(event, params.row.nestedData)
          }
        >
          view
        </Button>
      ),
    },
    {
      field: "remove",
      renderCell: (cellValues) => {
        return <DltPop />;
      },
      headerName: "Remove",
      width: 250,
    },
  ];

  const popoverColumns = [
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
        <button onClick={ 
          () => handleDeleteRow(params.row.id) 
          }>
          <AiTwotoneDelete />
        </button>
      ),
    },
  ];

  const handleClosePopover = () => {
    setAnchorEl(null);
    setPopoverData([]);
  };

  return (
    <div>
      <div>
        <DataGrid
          className="schedule-display"
          rows={jsonData}
          columns={columns}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </div>

      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
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
                  <Select>
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
            </div >
            <div class="Table">
              <DataGrid
                rows={popoverData}
                columns={popoverColumns}
                hideFooterPagination
                hideFooterSelectedRowCount
                hideFooter
              />
            </div>
            {/* <div className="add">
              <button onClick={handleAddRow}>
                <GrAdd /> Subject{" "}
              </button>
            </div> */}

            <div className="add">
              <button onClick={handleAddRow}>
                <GrAdd /> Subject
              </button>
            </div>
          </div>
        </Typography>
      </Popover>
    </div>
  );
}

export default BasicTable;