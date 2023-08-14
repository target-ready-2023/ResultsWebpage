import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { DatePicker, TimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
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
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import { classCode, viewClick, acYear } from "../SchedulePage";



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
  const geturlClassCode = `http://localhost:8080/schedule/v1/${classCode}/${acYear}/all`

  const [schedule, setSchedule] = useState([]);

  const fourPM = dayjs().set("hour", 16).startOf("hour");
  const nineAM = dayjs().set("hour", 9).startOf("hour");

  useEffect(() => {

    console.log("table : " + classCode)
    console.log(" year : "+acYear)
    if(classCode.trim()=== "" && acYear.trim()===""){
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
    else if(viewClick==="yes"){
      console.log("year : ",acYear)


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

  },[classCode,acYear,viewClick]);
  const handlePopoverCellChange = (params) => {
    const { id, field, value } = params;
  
    setPopoverData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
   const isSunday = (date) => {
    const day = date.day();

    return day === 0;
  };
  const [dateError,setDateError]=useState("");
  const[timeError,setTimeError]=useState("")
  let updated ="";
  const handleDateChange=(newVal)=>{
    console.log("new date : ", newVal)
    const selectedDate = newVal.$d;
    const isoDate = dayjs(selectedDate).format("YYYY-MM-DD");
    console.log("format : "+isoDate)

    const{id, field}= idFormatD;
    console.log("id : ",id , " field : ",field)
    const scheduleCode =sCode
    console.log("code : ",scheduleCode)
   // const a ={...schedule.find((item) => item.id === scheduleId)},

   const updatedSchedule = schedule.map((item) => {
    if (item.id === scheduleCode) {
      const updatedSubjectSchedule = item.subjectSchedule.map((subject) => {
        if (subject.subjectCode === id) {
          return { ...subject, date : isoDate };
        }
        return subject;
      });

      return {
        ...item,
        subjectSchedule: updatedSubjectSchedule,
      };
    }
    return item;
  })
  updated = updatedSchedule
  console.log("Schedule : ",updated)
  console.log("Updated Schedule : ", updatedSchedule)
  // setSchedule([])
  setSchedule(updatedSchedule)
  console.log("nope : ",schedule)
  const  x = updated.find((item)=>item.scheduleCode ===sCode)
  console.log("x ",x)
  }
  const handleTimeChange=()=>{

  }
  const handleTimeSelect=()=>{

  }
  const handleDateSelect=()=>{
    
    setAnchorD(null)
  }
  const handlePopoverClose = () => {
    //setPopoverData([]); // Clear popoverData
    setAnchorEl(null); // Close the popover
  };
  const handlePopoverSave = async () => {
    try {
      // Iterate through the popoverData and update each subjectSchedule object
      const updatedSubjectSchedules = await Promise.all(
        popoverData.map(async (item) => {
          const putUrl = `http://localhost:8080/schedule/v1/${item.id}`;
          const putData = {
            ...item,
            dateTime: `${item.date}T${item.time}:00`,
            status: item.scheduleStatus,
          };
          const response = await axios.put(putUrl, putData);
          console.log(response);
          return response.data; // Return the updated subjectSchedule object
        })
      );
  
      // Update the local state with the updated subjectSchedules
      const updatedSchedule = schedule.map((item) => {
        const updatedSubjectSchedule = updatedSubjectSchedules.find(
          (updatedItem) => updatedItem.id === item.id
        );
        if (updatedSubjectSchedule) {
          return {
            ...item,
            subjectSchedule: updatedSubjectSchedule.subjectSchedule,
          };
        }
        return item;
      });
  
      setSchedule(updatedSchedule);
      handlePopoverClose(); // Close the popover after saving
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };
  
  const handleStatusChange = (event, id) => {
    const newStatus = event.target.checked;
    const confirmation = window.confirm(
      "Are you sure you want to change the status of this schedule?"
    );
    
      if(confirmation)
      {
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
        window.location.reload()
      })
      .catch((error) => {
        console.log(error);
      });}
      else{}
  };
  
  const handleSubjectStatusChange = async (event, subjectCode, newStatus, scheduleId) => {
    const confirmation = window.confirm(
      "Are you sure you want to change the status of ONLY this particular subject?"
    );
    if(confirmation)
    {
    const updatedSchedule = schedule.map((item) => {
      if (item.id === scheduleId) {
        const updatedSubjectSchedule = item.subjectSchedule.map((subject) => {
          if (subject.subjectCode === subjectCode) {
            return { ...subject, status: newStatus };
          }
          return subject;
        });
  
        return {
          ...item,
          subjectSchedule: updatedSubjectSchedule,
        };
      }
      return item;
    });
  
    setSchedule(updatedSchedule);
  
    // Update the subject status in the API
    try {
      const putData = {
        ...schedule.find((item) => item.id === scheduleId),
        subjectSchedule: schedule.find((item) => item.id === scheduleId).subjectSchedule.map((subject) => {
          if (subject.subjectCode === subjectCode) {
            return { ...subject, status: newStatus };
          }
          return subject;
        }),
      };
  
      const putUrl = `http://localhost:8080/schedule/v1/${scheduleId}`;
      const response = await axios.put(putUrl, putData);
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }}
    else{}
  };

  const updateSchedule = ()=>{
    const a =schedule
   
    const  x = a.find((item)=>item.scheduleCode ===sCode)
    console.log("data final : ", x)
    const id = sCode
    axios.put(`http://localhost:8080/schedule/v1/${id}`,x)
    .then((response)=>{
      console.log("res : ",response)
    })
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState([]);
  //const popoverOpen = Boolean(anchorEl);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [sCode, setSCode] = useState(null);
  const handleNestedDataClick = async (event, row, sCode) => {
    setAnchorEl(event.currentTarget);
    console.log(sCode)
    setSCode(sCode)
    try {
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
  
      // Now, setAnchorEl to open the Popover and update popoverData
      setPopoverData(modifiedData);
    } catch (error) {
      console.error("Error fetching nested data:", error);
    }
  };
  
const handleCancelClick = () => {
   
    setAnchorEl(null);
  };

  const handleDeleteSchedule = (scheduleCode) => {
    // Filter out the deleted schedule from the schedule state
    setSchedule((prevSchedule) =>
      prevSchedule.filter((item) => item.scheduleCode !== scheduleCode)
    );
  };

  const columns = [
    { field: "classCode", headerName: "Class Name", width: 250 ,headerClassName: 'header'},
    { field: "scheduleName", headerName: "Schedule Name", width: 250 ,headerClassName: 'header'},
    {
      field: "status",
      headerClassName: 'header',
      renderCell: (params) => {
        return (
          <Switch
        checked={params.value}
        onChange={(event) => handleStatusChange(event, params.id)}
      />
        );
      },
      headerName: "Status",
      width: 180,
      type: Boolean,
    },
    {
      field: "actions",
      headerClassName: 'header',
      headerName: "View/Edit",
      width: 180,
      renderCell: (params) => (
        
        <Button
        style={{color:"black",fontWeight:"bold"}}
          onClick={(event) =>
            handleNestedDataClick(event, params.row.subjectSchedule, params.id)
          }
        >
          view
          <AiTwotoneEdit/>
        </Button>
      )
    },
    {
      field: "remove",
      headerClassName: 'header',
      renderCell: (cellValues) => {
        return   <DltPop 
                   scheduleCode={cellValues.row.id}
                   onDelete={handleDeleteSchedule}
                  
                />;
      },
      headerName: "Remove",
      width: 220
      
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
      width: 200,
      renderCell: (params) => (
        <Button onClick={(event) => handleDateDialogBox(event, params)}>
          {" "}
          {params.row.date === ""
            ? "Select Date"
            : dayjs(params.row.date).format("YYYY-MM-DD")}
        </Button>
      ),
    },
    // {
    //   field: "time",
    //   headerName: " Time",
    //   width: 200,
    //   renderCell: (params) => (
    //     <Button onClick={(event) => handleTimeDialogBox(event, params)}>
    //       {" "}
    //       {params.row.time === ""
    //         ? "Select Time"
    //         : dayjs(params.row.time).format("HH:mm")}
    //     </Button>
    //   ),
    // },

    {
      
      field: "status",
      renderCell: (params) => {
        return (
          <Switch  
          checked={params.value}
          onChange={(event) => handleSubjectStatusChange(event, params.id, event.target.checked, sCode)} />
        );
      },
      headerName: "Status",
      width: 80,
      type: Boolean,
    }
  ];
  const [idFormatD, setIdFormatD] = useState("");
  const handleDateDialogBox=(event,row)=>{
    setAnchorD(event.currentTarget)
    console.log("a : ",row)
    setIdFormatD(row);
  }
  const handleTimeDialogBox = () =>{

  }
  const [anchorD , setAnchorD]=useState(null);
  const [anchorT,setAnchorT]=useState(null)

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
        />
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
         disableClickAway={true}
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
              <div className="Table-display">
                <DataGrid
                  rows={popoverData}
                  columns={popoverColumns}
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  hideFooter
                  onEditCellChange={handlePopoverCellChange} // Add this prop
                />
                 <Popover
                    open={Boolean(anchorD)}
                    anchorEl={anchorD}
                    // onClose={handleCloseDateTime}
                    disableClickAway={true}
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DateTimePicker"]}>
                            <DateTimePicker
                              ampm={false}
                              shouldDisableDate={isSunday}
                              defaultValue={"Date"}
                              views={["year", "month", "day"]}
                            //   defaultValue={"Choose date"}
                            //   //defaultValue={dateTimeSave !== null ? dateTimeSave : nineAM}
                            //  // defaultValue={nextDay}
                            //   minTime={nineAM}
                            //   maxTime={fourPM}
                              // value={selectedPopoverDate}
                             // label="Select Date"
                              onChange={handleDateChange}
                             // renderInput={(params) => <TextField {...params} />}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                      <div>
                        <Button onClick={handleDateSelect}>Done</Button>
                        {dateError && (
                          <span style={{ color: "red" }}>{timeError}</span>
                        )}
                      </div>
                    </Typography>
                  </Popover>
                   {/* <Popover
                    open={Boolean(anchorT)}
                    anchorEl={anchorT}
                    // onClose={handleCloseDateTime}
                    disableClickAway={true}
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DateTimePicker"]}>
                            <DateTimePicker
                              ampm={false}
                              // shouldDisableDate={isSunday}
                              defaultValue={"Choose date and time"}
                              value={selectedPopoverTime}
                              //defaultValue={dateTimeSave !== null ? dateTimeSave : nineAM}
                             // defaultValue={nextDay}
                             renderInput={(params) => <TextField {...params} />}
                              minTime={nineAM}
                              maxTime={fourPM}
                              label="Select Time"
                              onChange={handleTimeChange}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                      <div>
                        <Button onClick={handleTimeSelect}>Done</Button>
                        {timeError && (
                          <span style={{ color: "red" }}>{timeError}</span>
                        )}
                      </div>
                    </Typography>
                  </Popover> */}


              </div>

            <div className="add">
              
              <Button type="cancel" 
                      onClick={handleCancelClick}
                      style={{color:"black"}}>Cancel {<GiCancel />}</Button>
                  <Button type="submit" style={{color:"black"}} onClick={updateSchedule}>Save Changes {<AiTwotoneSave />}</Button>
            </div>
          </div>
        </Typography>
      </Popover>
    </div>
  );
}

export default BasicTable;