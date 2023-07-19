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
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';
import DltPop from "../ExamMainPage/dltpopover";
import { AiTwotoneDelete } from "react-icons/ai";

function BasicTable() {
  const [jsonData,setJsonData] = useState( [
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
          timing: randomCreatedDate() 
        }
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
        }
      ],
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState([]);

  const handleNestedDataClick = (nestedData) => {
    setDialogData(nestedData);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData([]);
  };

  const handleDeleteRow = (id)=>{
    //setJsonData((prevRows)=>prevRows.filter((row)=> row.id !== id));
  }

  const columns = [
    // { field: "scheduleCode", headerName: "Schedule Code", width: 200 },
    // { field: "classCode", headerName: "Class Code", width: 200 },
    { field: "className", headerName: "Class Name", width: 300 },
    { field: "scheduleType", headerName: "Schedule Type", width: 300 },
    { 
      field: "status",
      renderCell:(cellValues)=>
      {
        return(<Switch value="checkedA" inputProps={{ 'aria-label': 'Switch A' }} />);
      }, 
      headerName: "Status", width: 150 },
    {
      field: "actions",
      headerName: "View/Edit",
      width: 220,
      renderCell: (params) => (
        <Button onClick={() => handleNestedDataClick(params.row.nestedData)}>
          view
        </Button>
      ),
    },
    { field: "remove",
    renderCell:(cellValues)=>
      {
        return(<DltPop/>);
      },
       headerName: "Remove", 
       width: 250 
      },
       
  ];

  const dialogColumns = [
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
        <button >
          <AiTwotoneDelete />
        </button>
      ),
    }
  ];

  return (
    <div>
      <div >
        <DataGrid className="schedule-display"  rows={jsonData} columns={columns} hideFooter hideFooterPagination hideFooterSelectedRowCount/>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Schedule</DialogTitle>
        <DialogContent className="content-dialog" >
          <DataGrid rows={dialogData} columns={dialogColumns}  hideFooter hideFooterPagination hideFooterSelectedRowCount/>
        </DialogContent>
        <DialogActions>
          <Button >Add Subject</Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BasicTable;