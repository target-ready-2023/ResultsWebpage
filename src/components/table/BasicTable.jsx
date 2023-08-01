import React, { useState, useEffect, useRef } from "react";
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
import DltPop from "../SchedulePage/dltpopover";
import { AiTwotoneDelete, AiTwotoneEdit, AiTwotoneSave } from "react-icons/ai";
import {GiCancel} from "react-icons/gi";

import { Popover } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {GrAdd} from "react-icons/gr";
import axios from "axios";
import { classCode } from "../SchedulePage";

const BasicTable = () => {

  const [data, setData] = useState([]);  
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  //GET CALL URL
  const getUrl = " http://localhost:8080/schedule/v1/all"

  //GET ALL BY CLASSCODE
  const geturlClassCode = `http://localhost:8080/schedule/v1/${classCode}/all`

  const [schedule, setSchedule] = useState([]);
  useEffect(() => {

    console.log("table : " + classCode)
    if(classCode.trim()=== ""){
      axios.get(getUrl).then((response) => {
        console.log(response.data)
         setSchedule(response.data);
        const modifiedData = response.data.map((item) => ({
          ...item,
          id: item.scheduleCode,
          className: item.className,
          status: item.scheduleStatus
        }));
        setSchedule(modifiedData);
  
        const initialCheckedState = response.data.reduce((acc, item) => {
          acc[item.id] = item.scheduleStatus === 'active';
          return acc;
        }, {});
        setIsChecked(initialCheckedState);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
    else{


      axios.get(geturlClassCode).then((response) => {
        console.log("class code "+ classCode)
        console.log(response.data)
         setSchedule(response.data);
        const modifiedData = response.data.map((item) => ({
          ...item,
          id: item.scheduleCode,
          className: item.className,
          status: item.scheduleStatus
        }));
        setSchedule(modifiedData);
  
        const initialCheckedState = response.data.reduce((acc, item) => {
          acc[item.id] = item.scheduleStatus === 'active';
          return acc;
        }, {});
        setIsChecked(initialCheckedState);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    }

  },[classCode]);

  const handleStatusChange = (event, id) => {
    const newStatus = event.target.checked;
    const updatedData = schedule.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          scheduleStatus: newStatus ? "true" : "false",
        };
      }
      return item;
    });
  
    const selectedRow = schedule.find((item) => item.id === id);
    const putData = {
      classCode: selectedRow?.classCode, // Use optional chaining to prevent undefined error
      subjectSchedule: Array.isArray(selectedRow?.subjectSchedule)
        ? selectedRow.subjectSchedule.map((scheduleItem) => ({
            ...scheduleItem,
          }))
        : [],
      scheduleType: selectedRow?.scheduleType,
      scheduleName: selectedRow?.scheduleName,
      scheduleStatus: newStatus ? "true" : "false",
    };
  
    const putUrl = `http://localhost:8080/schedule/v1/${id}`;
    axios
      .put(putUrl, putData)
      .then((response) => {
        setSchedule(updatedData);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState([]);
  const popoverOpen = Boolean(anchorEl);

  // const [openDialog, setOpenDialog] = useState(false);
  // const [dialogData, setDialogData] = useState([]);
  
  const handleNestedDataClick = (event, row) => {
    const nestedDataWithIdFromBackend = row.map((item) => ({
      ...item,
      id: item.subjectCode,
    }));
    setPopoverData(nestedDataWithIdFromBackend);
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

  const handleDeleteSchedule = (scheduleCode) => {
    // Filter out the deleted schedule from the schedule state
    setSchedule((prevSchedule) =>
      prevSchedule.filter((item) => item.scheduleCode !== scheduleCode)
    );
  };

  const columns = [
    { field: "classCode", headerName: "Class Name", width: 200 },
    { field: "scheduleType", headerName: "Schedule Type", width: 200 },
    {
      field: "status",
      renderCell: (params) => {
        return (
          <Switch  
          checked={isChecked[params.id]}
          onChange={(event) => handleStatusChange(event, params.id)} />
        );
      },
      headerName: "Status",
      width: 80,
      type: Boolean,
    },
    {
      field: "actions",
      headerName: "View/Edit",
      width: 220,
      renderCell: (params) => (
        <Button
          onClick={(event) =>
            handleNestedDataClick(event, params.row.subjectSchedule)
          }
        >
          view
          <AiTwotoneEdit/>
        </Button>
      ),
    },
    {
      field: "remove",
      renderCell: (cellValues) => {
        return <DltPop 
                   scheduleCode={cellValues.row.id}
                   onDelete={handleDeleteSchedule}
                />;
      },
      headerName: "Remove",
      width: 250,
    },
  ];

  const popoverColumns = [
    {
      field: "id",
      headerName: "Subject Code",
      type: "String",
      editable: true,
    },
    {
      field: "subjectName",
      headerName: "Subject Name",
      type: "String",
      editable: true,
    },
    {
      field: "date",
      headerName: "Date",
      editable: true,
      width: 180,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "time",
      headerName: "Time",
      //type: "dateTime",
      width: 220,
      //valueGetter: ({ value }) => value && new Date(value),
      editable: true,
    },
    {
      
      field: "status",
      renderCell: (params) => {
        return (
          <Switch  
          checked={isChecked[params.id]}
          onChange={(event) => handleStatusChange(event, params.id)} />
        );
      },
      headerName: "Status",
      width: 80,
      type: Boolean,
    }
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
          rows={schedule}
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
              
              <button type="cancel">Cancel {<GiCancel />}</button>
                  <button type="submit">Save Changes {<AiTwotoneSave />}</button>
            </div>
          </div>
        </Typography>
      </Popover>
    </div>
  );
}

export default BasicTable;