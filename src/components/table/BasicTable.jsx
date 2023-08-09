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
import "./BasicTable.css"
import { Popover } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {GrAdd} from "react-icons/gr";
import axios from "axios";
import { classCode } from "../SchedulePage";
import { Stack } from '@mui/material'



const fetchSubjectName = (subjectCode) => {
  return axios.get(`http://localhost:8080/subjects/v1/subject/${subjectCode}`)
    .then(response => response.data.subjectName)
    .catch(error => {
      console.error("Error fetching subjectName:", error);
      return null;
    });
};


const getModifiedData = (row) => {
  const promises = row.map(item => {
    return fetchSubjectName(item.subjectCode).then(subjectName => ({
      ...item,
      id: item.subjectCode,
      subjectName: subjectName || "",
    }));
  });

  return Promise.all(promises);
};
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
        setSchedule([])
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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState([]);
  
  
  const handleNestedDataClick = async (event, row) => {
    setAnchorEl(event.currentTarget);
    try{
    const modifiedData = await Promise.all(
      row.map(async (item) => {
        const response = await axios.get(
          `http://localhost:8080/subjects/v1/subject/${item.subjectCode}`
        );
  
        const subjectName = response.data.subjectName;
  
        return {
          ...item,
          id: item.subjectCode,
          subjectName: subjectName,
        };
      })
    );
  
    // Use the modifiedData locally without setting it to the state
    console.log('Modified Data:', modifiedData);
  
    // Now, setAnchorEl to open the Popover
    setPopoverData(modifiedData);

   
    } catch(error){
      console.error("Error fetching nested data:", error);
    }
  };
  

  const handleDeleteSchedule = (scheduleCode) => {
    // Filter out the deleted schedule from the schedule state
    setSchedule((prevSchedule) =>
      prevSchedule.filter((item) => item.scheduleCode !== scheduleCode)
    );
  };

  const columns = [
    { field: "classCode", headerName: "Class Name", width: 200 },
    { field: "scheduleName", headerName: "Schedule Name", width: 200 },
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
      width: 180,
      editable: false,
    },
    {
      field: "subjectName",
      headerName: "Subject Name",
      type: "String",
      width: 180,
      editable: false,
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
     
      <div className="table-data">
        <DataGrid
          className="schedule-display"
          rows={schedule}
          columns={columns}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
          components={{
            noRowsOverlay: ()=>(
              <Stack height="100%" alignItems="center" justifyContent="center">
              No schedules available
            </Stack>
            )
          }}
        />
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <div>
            <div 
            className="Table-display"
           
            >
              <DataGrid
                rows={popoverData}
                columns={popoverColumns}
                hideFooterPagination
                hideFooterSelectedRowCount
                hideFooter
                
              />
            </div>

            <div className="add">
              
              <Button type="cancel">Cancel {<GiCancel />}</Button>
                  <Button type="submit">Save Changes {<AiTwotoneSave />}</Button>
            </div>
          </div>
        </Typography>
      </Popover>
    </div>
  );
}

export default BasicTable;