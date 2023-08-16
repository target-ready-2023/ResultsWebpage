import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";

import { TextField } from "@mui/material";
import Switch from "@mui/material/Switch";
import DltPop from "../SchedulePage/dltpopover";
import {  AiTwotoneEdit, AiTwotoneSave } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import "./BasicTable.css";
import { Popover } from "@mui/material";
import { Typography } from "@mui/material";

import axios from "axios";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import { classCode, viewClick, acYear } from "../SchedulePage";

import swal from "sweetalert";

const fetchSubjectName = (subjectCode) => {
  return axios
    .get(`http://localhost:8080/subjects/v1/subject/${subjectCode}`)
    .then((response) => response.data.subjectName)
    .catch((error) => {
      console.error("Error fetching subjectName:", error);
      return null;
    });
};

const getModifiedData = (row) => {
  const promises = row.map((item) => {
    return fetchSubjectName(item.subjectCode).then((subjectName) => ({
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
  const [anchorD, setAnchorD] = useState(null);
  const [anchorT, setAnchorT] = useState(null);
  const [idFormatD, setIdFormatD] = useState("");
  const [idFormatT, setIdFormatT] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  
  const [anchorEl, setAnchorEl] = useState(null);

  const [popoverData, setPopoverData] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [sCode, setSCode] = useState(null);
  const [originalPopoverData, setoriginalPopoverData] = useState("");

  const [originalSchedule, setOriginalSchedule] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [displayTime, setDisplayTime] = useState("");

  //GET CALL URL
  const getUrl = " http://localhost:8080/schedule/v1/all";

  //GET ALL BY CLASSCODE
  const geturlClassCode = `http://localhost:8080/schedule/v1/${classCode}/${acYear}/all`;

  const [schedule, setSchedule] = useState([]);

  const threePM = dayjs().set("hour", 15).startOf("hour");
  const nineAM = dayjs().set("hour", 9).startOf("hour");
  let updated = "";

  useEffect(() => {
    console.log("table : " + classCode);
    console.log(" year : " + acYear);
    if (classCode.trim() === "" && acYear.trim() === "") {
      axios
        .get(getUrl)
        .then((response) => {
          console.log(response.data);
          setSchedule(response.data);
          const modifiedData = response.data.map((item) => ({
            ...item,
            id: item.scheduleCode,
            className: item.className,
            status: item.scheduleStatus,
          }));
          setSchedule(modifiedData);

          const initialCheckedState = response.data.reduce((acc, item) => {
            acc[item.id] = item.scheduleStatus === "active";
            return acc;
          }, {});
          setIsChecked(initialCheckedState);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else if (viewClick === "yes") {
      console.log("year : ", acYear);

      axios
        .get(geturlClassCode)
        .then((response) => {
          console.log("class code " + classCode);
          console.log(response.data);
          setSchedule(response.data);
          const modifiedData = response.data.map((item) => ({
            ...item,
            id: item.scheduleCode,
            className: item.className,
            status: item.scheduleStatus,
          }));
          setSchedule(modifiedData);

          const initialCheckedState = response.data.reduce((acc, item) => {
            acc[item.id] = item.scheduleStatus === "active";
            return acc;
          }, {});
          setIsChecked(initialCheckedState);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setSchedule([]);
        });
    }
  }, [classCode, acYear, viewClick]);

  //datagrid cloumn declaration
  const columns = [
    {
      field: "classCode",
      headerName: "Class Name",
      width: 250,
      headerClassName: "header",
    },
    {
      field: "scheduleName",
      headerName: "Schedule Name",
      width: 250,
      headerClassName: "header",
    },
    {
      field: "status",
      headerClassName: "header",
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
      headerClassName: "header",
      headerName: "View/Edit",
      width: 180,
      renderCell: (params) => (
        <Button
          style={{ color: "black", fontWeight: "bold" }}
          onClick={(event) =>
            handleNestedDataClick(event, params.row.subjectSchedule, params.id)
          }
        >
          view
          <AiTwotoneEdit />
        </Button>
      ),
    },
    {
      field: "remove",
      headerClassName: "header",
      renderCell: (cellValues) => {
        return (
          <DltPop
            scheduleCode={cellValues.row.id}
            onDelete={handleDeleteSchedule}
          />
        );
      },
      headerName: "Remove",
      width: 220,
    },
  ];

  //nested data(subjects) format

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
          {/* {" "} */}
          {params.row.date === ""
            ? "Select Date"
            : dayjs(params.row.date).format("DD-MM-YYYY")}
        </Button>
      ),
    },
    {
      field: "time",
      headerName: " Time",
      width: 200,
      renderCell: (params) => (
        <Button onClick={(event) => handleTimeDialogBox(event, params)}>
          {" "}
          {params.row.time === ""
            ? "Select Time"
            : dayjs(params.row.time, "HH:mm:ss").format("HH:mm:ss")}
        </Button>
      ),
    },

    {
      field: "status",
      renderCell: (params) => {
        return (
          <Switch
            checked={params.value}
            onChange={(event) =>
              handleSubjectStatusChange(
                event,
                params.id,
                event.target.checked,
                sCode
              )
            }
          />
        );
      },
      headerName: "Status",
      width: 80,
      type: Boolean,
    },
  ];

  const handleDateChange = async (newVal) => {
    console.log("new date : ", newVal);
    const selectedDate = newVal.$d;
    const isoDate = dayjs(selectedDate).format("YYYY-MM-DD");
    setSelectedDate(isoDate);
    setOriginalSchedule(schedule);
    const { id, field } = idFormatD;
    const scheduleCode = sCode;
    const updatedSchedule = schedule.map((item) => {
      if (item.id === scheduleCode) {
        const updatedSubjectSchedule = item.subjectSchedule.map((subject) => {
          if (subject.subjectCode === id) {
            return { ...subject, date: isoDate };
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
    updated = updatedSchedule;
    setSchedule(updatedSchedule);
    const scheduleData = updated.find((item) => item.scheduleCode === sCode);


    try {
      const modifiedData = await Promise.all(
        scheduleData.subjectSchedule.map(async (item) => {
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

      
      setPopoverData(modifiedData);
    } catch (error) {
      console.error("Error fetching nested data:", error);
    }

  };

  const handleDateSelect = () => {
    const a = selectedDate;

    if (a === "" || a === null) {
      setDateError("Select a date.");
      setSelectedDate("");
    } else {
      setDateError("");
      //setAnchorD(null);
      setSelectedDate("");
      closeDatePopover(); // Call the function to close the date popover
    }
  };
  
  const closeDatePopover = () => {
    setAnchorD(null);
  };
  

  const handleTimeChange = async (newVal) => {
    const selectedTime = newVal.$d;
    const isoTime = dayjs(selectedTime).format("HH:mm:ss");
    console.log(isoTime)
    
    setSelectedTime(isoTime);
    setDisplayTime(dayjs(isoTime,"HH:mm:ss").format("HH:mm"));
    console.log(displayTime)
   
    const scheduleCode = sCode;
    const { id, field } = idFormatT;

    const updatedSchedule = schedule.map((item) => {
      if (item.id === scheduleCode) {
        const updatedSubjectSchedule = item.subjectSchedule.map((subject) => {
          if (subject.subjectCode === id) {
            return { ...subject, time: isoTime };
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
    updated = updatedSchedule;
    setSchedule(updatedSchedule);
    console.log("popover : ", popoverData);
    const scheduleData = updated.find((item) => item.scheduleCode === sCode);
    try {
      const modifiedData = await Promise.all(
        scheduleData.subjectSchedule.map(async (item) => {
          const response = await axios.get(
            `http://localhost:8080/subjects/v1/subject/${item.subjectCode}`
          );
          const subjectName = response.data.subjectName;
          return {
            ...item,
            id: item.subjectCode,
            subjectName: subjectName,
            date: item.date,
          };
          
        })
      );
        
      setPopoverData(modifiedData);
    } catch (error) {
      console.error("Error fetching nested data:", error);
    }
  };
  const handleTimeSelect = () => {
    const a = selectedTime;
    if (a === null || a === "") {
     
      setTimeError("Please select a time.");
      setSelectedTime(null);
      setDisplayTime(a);
    } else {
      
      const time = dayjs(selectedTime).format("HH:mm:ss");
      const selectedHours = parseInt(time.split(":")[0], 10);
      const selectedMinutes = parseInt(time.split(":")[1], 10);
      if (
        selectedHours < 9 ||
        (selectedHours === 9 && selectedMinutes < 0) ||
        selectedHours > 15 ||
        (selectedHours === 15 && selectedMinutes > 0)
      ) {
        
        setTimeError("Selected time must be between 9 AM and 4 PM.");
      } else {
        setTimeError("");
        // setAnchorT(null);
        // setSelectedTime("");
        setSelectedTime(null); // Clear the time object state
        setDisplayTime("");
        closeTimePopover();
      }
    }
  };

  const closeTimePopover = () => {
    setAnchorT(null);
  };
 
  const handlePopoverClose = () => {
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

    if (confirmation) {
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
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  };

  const handleSubjectStatusChange = async (
    event,
    subjectCode,
    newStatus,
    scheduleId
  ) => {
    const confirmation = window.confirm(
      "Are you sure you want to change the status of ONLY this particular subject?"
    );
    if (confirmation) {
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
          subjectSchedule: schedule
            .find((item) => item.id === scheduleId)
            .subjectSchedule.map((subject) => {
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
      }
    } else {
    }
  };

  const updateSchedule = () => {
    const scheduleCopy = schedule;

    const data = scheduleCopy.find((item) => item.scheduleCode === sCode);
    const id = sCode;
    axios.put(`http://localhost:8080/schedule/v1/${id}`, data)
    .then((response) => {
      console.log("res : ", response);
      swal({
        title: "Schedule Updated Successfully",
        icon: "success",
        button: "OK",
      }).then(() => {
        window.location.reload(); 
      });
    })
    .catch((error)=>{
      swal({
        title: "Failed to Add Schedule",
        text: "An error occurred while updating the schedule.",
        icon: "error",
        button: "OK",
      }).then(() => {
        window.location.reload(); 
      });

    })
    
  };
  
  const handlePopoverCellChange = (params) => {
    const { id, field, value } = params;

    setPopoverData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  const isSunday = (date) => {
    console.log(date)
    const day = date.day();

    return day === 0;
  };
 


  const handleNestedDataClick = async (event, row, sCode) => {
    setAnchorEl(event.currentTarget);
    console.log(sCode);
    setSCode(sCode);
    // const updatedScheduleCopy
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
      console.log("Modified Data:", modifiedData);
      setoriginalPopoverData(modifiedData);
      // Now, setAnchorEl to open the Popover and update popoverData
      setPopoverData(modifiedData);
    } catch (error) {
      console.error("Error fetching nested data:", error);
    }
  };

  const handleCancelClick = () => {
    setAnchorEl(null);
    window.location.reload();
  };

  const handleDeleteSchedule = (scheduleCode) => {
    // Filter out the deleted schedule from the schedule state
    setSchedule((prevSchedule) =>
      prevSchedule.filter((item) => item.scheduleCode !== scheduleCode)
    );
  };

  const isDate = ()=>{
    return true
  }
  

  const handleDateDialogBox = (event, row) => {
    // setSelectedDate(row.row.date);
    console.log(row.row.date)
    setDisplayDate(dayjs(row.row.date))
    setSelectedDate(displayDate)
    setAnchorD(event.currentTarget);

    console.log("a : ", row);
    setIdFormatD(row);
  };

  const handleTimeDialogBox = (event, row) => {
    setAnchorT(event.currentTarget);
    setDisplayTime(row.row.time)
    console.log(row.row.time)
    setIdFormatT(row);
  };

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
                onEditCellChange={handlePopoverCellChange}
              />
              <Popover
                open={Boolean(anchorD)}
                anchorEl={anchorD}
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
                          value={displayDate}
                          views={["year", "month", "day"]}
                          label="Select Date"
                          onChange={handleDateChange}
                          //defaultValue={"Date"}
                          //   //defaultValue={dateTimeSave !== null ? dateTimeSave : nineAM}
                          //  // defaultValue={nextDay}
                          //   minTime={nineAM}
                          //   maxTime={fourPM}
                          // value={selectedPopoverDate}

                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <div>
                    {dateError && (
                      <span style={{ color: "red" }}>{dateError}</span>
                    )}
                  </div>
                  <div>
                    <Button onClick={handleDateSelect}>Done</Button>
                    <Button onClick={closeDatePopover}>Close</Button> {/* Close button */}
                  </div>
                </Typography>
              </Popover>
              <Popover
                open={Boolean(anchorT)}
                anchorEl={anchorT}
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
                          views={["hours", "minutes"]}
                          renderInput={(params) => <TextField {...params} />}
                          minTime={nineAM}
                          onClose={closeDatePopover}
                          maxTime={threePM}
                          label="Select Time"
                          onChange={handleTimeChange}
                          inputFormat="HH:mm"
                          shouldDisableDate={isDate}
                          value={displayTime}
                          //defaultValue={dateTimeSave !== null ? dateTimeSave : nineAM}
                          // defaultValue={nextDay}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <div>
                    {timeError && (
                      <span style={{ color: "red" }}>{timeError}</span>
                    )}
                  </div>
                  <div>
                    <Button onClick={handleTimeSelect}>Done</Button>
                    <Button onClick={closeTimePopover}>Close</Button> {/* Close button */}
                  </div>
                </Typography>
              </Popover>
            </div>

            <div className="add">
              <Button
                type="cancel"
                onClick={handleCancelClick}
                style={{ color: "black" }}
              >
                Cancel {<GiCancel />}
              </Button>
              <Button
                type="submit"
                style={{ color: "black" }}
                onClick={updateSchedule}
              >
                Save Changes {<AiTwotoneSave />}
              </Button>
            </div>
          </div>
        </Typography>
      </Popover>
    </div>
  );
};

export default BasicTable;
