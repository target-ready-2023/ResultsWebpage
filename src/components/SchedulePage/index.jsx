import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./index.css";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import BasicTable from "../table/BasicTable";
import { DataGrid } from "@mui/x-data-grid";
import { TextField } from "@mui/material";
import { AiFillSchedule, AiTwotoneSave } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { useState, useEffect } from "react";
import axios from "axios";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { Stack } from "@mui/material";
import "dayjs/locale/en";
let classCode = "";

const SchedulePage = () => {
  const [anchor, setAnchor] = React.useState(null);
  const [classNameoptions, setClassNameOptions] = useState([]);
  const [scheduleN, setScheduleN] = useState("");
  const [scheduleT, setScheduleT] = useState("");
  const [classN, setClassN] = useState("");
  const [classNameSelectforAll, setClassNameSelectForAll] = useState("");
  const [rowsDisplay, setRowsDisplay] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSelectError, setClassSelectError] = useState("");
  const [scheduleSelectError, setScheduleSelectError] = useState("");
  const [dateTimeError, setDateTimeError] = useState("");
  //let errorData = "";
  const [anchorDT, setAnchorDT] = useState(null);

  const [classError, setClassError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [dateTimeErrorParent, setDateTimeErrorParent] = useState("");
  const fourPM = dayjs().set("hour", 16).startOf("hour");
  const nineAM = dayjs().set("hour", 9).startOf("hour");
  const nextDay = dayjs().add(1, "day").startOf("day").set("hour", 9);

  let classNameSelect = "";
  let scheduleNameSelect = "";
  let scheduleType = "";
  let subjectsJson = "";
  let updatedData = "";
  let row = "";
  let subjectsFetch = "";
  useEffect(() => {
    axios
      .get("http://localhost:8080/classes/v1/classes")
      .then((response) => {
        setClassNameOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  // const [columns, setColumns] = React.useState([
  //   {
  //     field: "subjectCode",
  //     headerName: "Subject Code",
  //     type: "string",
  //     width: 150,
  //     editable: false,
  //   },
  //   {
  //     field: "subjectName",
  //     headerName: "Subject Name",
  //     type: "string",
  //     width: 150,
  //     editable: false,
  //   },
  //   {
  //     field: "dateTime",
  //     headerName: "Date & Time",
  //     type: "dateTime",
  //     width: 200,
  //     editable: true,
  //     valueGetter: (params) => {
  //       const value = params.row.dateTime;
  //       return value ? new Date(value) : null;
  //     },
  //     renderCell: (params) => (
  //       <TextField
  //         type="datetime-local"
  //         value={params.value ? params.value.toISOString().slice(0, -8) : ""}
  //         onChange={(e) => handleDateTimeChange(params, e.target.value)}
  //       />
  //     ),
  //   },
  // ]);
  const [columns, setColumns] = React.useState([
    {
      field: "subjectCode",
      headerName: "Subject Code",
      type: "string",
      width: 150,
      editable: false,
    },
    {
      field: "subjectName",
      headerName: "Subject Name",
      type: "string",
      width: 150,
      editable: false,
    },
    {
      field: "dateTime",
      headerName: "Date & Time",
      width: 200,
      renderCell: (params) => (
        <Button onClick={(event) => handleDateTimeDialogBox(event, params)}>
          {" "}
          {params.row.dateTime === ""
            ? "Select Date"
            : dayjs(params.row.dateTime).format("YYYY-MM-DD HH:mm")}
        </Button>
      ),
      // editable: true,
      // valueGetter: (params) => {
      //   const value = params.row.dateTime;
      //   return value ? new Date(value) : null;
      // },
      // renderCell: (params) => (
      //   <TextField
      //     type="datetime-local"
      //     value={params.value ? params.value.toISOString().slice(0, -8) : ""}
      //     onChange={(e) => handleDateTimeChange(params, e.target.value)}
      //   />
      // ),
    },
  ]);
  //  let x;
  const [idFormat, setIdFormat] = useState("");
  const [dateTimeSave, setDateTimeSave] = useState(null);

  const handleDateTimeDialogBox = (event, row) => {
    setAnchorDT(event.currentTarget);

    console.log(row);
    //x=row.id;
    setIdFormat(row);
    //console.log(event.currentTarget)
    const prevSavedValue = rowsDisplay.find(
      (item) => item.id === row.id
    )?.dateTime;

    setDateTimeSave(prevSavedValue ? dayjs(prevSavedValue) : null);
  };

  const handleDateTimeSelect = () => {
    const selectedDateTime = rowsDisplay.find(
      (item) => item.id === idFormat.id
    )?.dateTime;

    if (selectedDateTime) {
      const selectedTime = dayjs(selectedDateTime).format("HH:mm");
  
      const selectedHours = parseInt(selectedTime.split(":")[0], 10);
      const selectedMinutes = parseInt(selectedTime.split(":")[1], 10);
  
      if (selectedHours < 9 || (selectedHours === 9 && selectedMinutes < 0) ||
          selectedHours > 16 || (selectedHours === 16 && selectedMinutes > 0)) {
        setDateTimeError("Selected time must be between 9 AM and 4 PM.");
      } else {
        setDateTimeError("");
        setAnchorDT(null);
      }
    } else {
      setDateTimeError("Please select a date and time.");
    }
  };

  const handleDateTimeChange = (newVal) => {
    setDateTimeSave(newVal);
    const selectedDate = newVal.$d;
    const isoDateTime = dayjs(selectedDate).format("YYYY-MM-DDTHH:mm:ss");
    console.log("format : " + isoDateTime);
    const { id, field } = idFormat;
    setRowsDisplay((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: isoDateTime } : row
      )
    );
    console.log(rowsDisplay);
    const m = rowsDisplay;
    console.log(m);
    //console.log(x)
  };

  const getClassSubjects = (classCode) => {
    const classData = classNameoptions.find((item) => item.code === classCode);
    return classData ? classData.subjects : [];
  };

  const convertToJSONData = (array) => {
    const jsonData = array.map((subjectName) => {
      return { subjectName };
    });

    return jsonData;
  };

  const fetchSubjectCode = async (subjectName, classCode) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/subjects/v1/search?subjectName=${subjectName}`
      );
      const subjectData = response.data.find(
        (item) => item.classCode === classCode
      );
      return subjectData ? subjectData.subjectCode : null;
    } catch (error) {
      console.error(`Error fetching subjectCode for ${subjectName}:`, error);
      return null;
    }
  };

  const processData = async () => {
    updatedData = await Promise.all(
      subjectsJson.map(async (item) => {
        const subjectName = item.subjectName;
        const subjectCode = await fetchSubjectCode(
          subjectName,
          classNameSelect
        );
        return {
          ...item,
          subjectCode: subjectCode,
          dateTime: "",
        };
      })
    );

    console.log(updatedData);
    row = updatedData.map((item) => ({
      id: item.subjectCode, // Use 'subjectCode' as the 'id'
      ...item,
    }));
    console.log(row);
    setRowsDisplay(row);
  };
  const validateclass = () => {
    if (classN === "") {
      setClassError("select a class");
      return true;
    } else {
      setClassError("");
      return false;
    }
  };
  const validateSchedule = () => {
    if (scheduleN === "") {
      setScheduleError("Select a schedule");
      return true;
    } else {
      setScheduleError("");
      return false;
    }
  };
  const validateDateTime = (dateTime) => {
    const data = JSON.parse(JSON.stringify(rowsDisplay));
    let hasEmptyDateTime = false;

    data.forEach((row) => {
      if (!row.dateTime) {
        hasEmptyDateTime = true;
        return; // Exit the loop early if an empty dateTime is found
      }
    });
    if (hasEmptyDateTime) {
      setDateTimeErrorParent("Please provide valid date and time");
      return true;
    } else {
      setDateTimeErrorParent("");
      return false;
    }
  };

  const handleSaveSchedule = () => {
    const classnamevalidation = validateclass();
    const schedulevalidation = validateSchedule();
    const dateTimeValidation = validateDateTime();

    const copiedRows = JSON.parse(JSON.stringify(rowsDisplay));

    if (classnamevalidation || schedulevalidation || dateTimeValidation) {
      if (classnamevalidation === schedulevalidation) {
        setClassError("Please select class name and schedule name");
        setScheduleError("");
      }
    } else {
      copiedRows.forEach((subject) => {
        const [datePart, timePart] = subject.dateTime.split("T");
        subject.date = datePart;
        subject.time = timePart.slice(0, 5);
        subject.status = true;
        delete subject.id;
        delete subject.subjectName;
        delete subject.dateTime;
      });

      const classCode = classN;
      const scheduleName = scheduleN;
      const scType = scheduleT;
      console.log("code" + classCode + "Name" + scheduleName + "Type" + scType);
      console.log(subjectsFetch);

      axios
        .post(`http://localhost:8080/schedule/v1`, {
          classCode: classCode,
          subjectSchedule: copiedRows,
          scheduleName: scheduleName,
          scheduleType: scType,
          scheduleStatus: true,
        })
        .then((Response) => {
          console.log(Response);
          if (Response.data === "Successful") {
            setRowsDisplay([]);
            setClassN("");
            setScheduleN("");
            setScheduleT("");
            setAnchor(null);
          }
        });
    }
  };

  const handleClassNameSelect = (event) => {
    classNameSelect = event.target.value;
    setClassN(classNameSelect);
    console.log(classNameSelect);
    const subjectsArray = getClassSubjects(classNameSelect);
    console.log(classNameSelect + " " + subjectsArray);
    subjectsJson = convertToJSONData(subjectsArray);
    console.log(subjectsJson);
    processData();
    console.log("process data : " + rowsDisplay);
  };

  const handleClassNameSelectForAll = (event) => {
    setClassNameSelectForAll(event.target.value); //useState
    console.log("useState" + classNameSelectforAll);
    classCode = event.target.value; //let
    console.log("let " + classCode);
  };
  const handleScheduleNameSelect = (event) => {
    scheduleNameSelect = event.target.value;
    setScheduleN(scheduleNameSelect);
    const scName = scheduleNameSelect;
    console.log(scName);
    if (
      scName === "Test 1" ||
      scName === "Test 2" ||
      scName === "Test 3" ||
      scName === "Test 4"
    ) {
      scheduleType = "Test";
    } else {
      scheduleType = "Exam";
    }
    setScheduleT(scheduleType);
  };

  const handleCancelClick = () => {
    setRowsDisplay([]);
    setClassN("");
    setScheduleN("");
    setScheduleT("");
    setClassError("");
    setScheduleError("");
    setDateTimeErrorParent("");
    setAnchor(null);
  };
  const handleCloseDateTime = () => {
    setAnchorDT(null);
  };
  const isSunday = (date) => {
    const day = date.day();

    return day === 0;
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
                        <Select
                          className="classForAdmin"
                          value={classN}
                          onChange={handleClassNameSelect}
                        >
                          {classNameoptions.map((option) => (
                            <MenuItem key={option.code} value={option.code}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                  

                    <Box className="dd3">
                      <FormControl fullWidth variant="filled" sx={{ m: 1 }}>
                        <InputLabel>Schedule Name</InputLabel>
                        <Select
                          className="classForAdmin"
                          value={scheduleN}
                          onChange={handleScheduleNameSelect}
                        >
                          <MenuItem value={"Test 1"}>Test 1</MenuItem>
                          <MenuItem value={"Test 2"}>Test 2</MenuItem>
                          <MenuItem value={"Mid-Term"}>Mid-Term</MenuItem>
                          <MenuItem value={"Test 3"}>Test 3</MenuItem>
                          <MenuItem value={"Test 4"}>Test 4</MenuItem>
                          <MenuItem value={"Pre-Preparatory"}>
                            Pre-Preparatory
                          </MenuItem>
                          <MenuItem value={"Preparatory"}>Preparatory</MenuItem>
                          <MenuItem value={"Final"}>Final</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                  <div>
                    {classError && (
                      <span style={{ color: "red" }}>{classError}</span>
                    )}
                    {scheduleError && (
                      <span style={{ color: "red" }}>{scheduleError}</span>
                    )}
                  </div>
                  <div className="Table">
                    <DataGrid
                      key={row.length}
                      rows={rowsDisplay}
                      columns={columns}
                      hideFooterPagination
                      hideFooterSelectedRowCount
                      hideFooter
                      components={{
                        noRowsOverlay: () => (
                          <Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                          >
                            Select a class
                          </Stack>
                        ),
                      }}
                     
                    />
                    
                  </div>
                  <div>
                    {dateTimeErrorParent && (
                      <span style={{ color: "red" }}>
                        {dateTimeErrorParent}
                      </span>
                    )}
                  </div>
                  <Popover
                    open={Boolean(anchorDT)}
                    anchorEl={anchorDT}
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
                              // defaultValue={dateTimeSave !== null ? dateTimeSave : nineAM}
                              defaultValue={nextDay}
                              minTime={nineAM}
                              maxTime={fourPM}
                              label="Select Date and Time"
                              onChange={handleDateTimeChange}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                      <div>
                        <Button onClick={handleDateTimeSelect}>Done</Button>
                        {dateTimeError && (
                          <span style={{ color: "red" }}>{dateTimeError}</span>
                        )}
                      </div>
                    </Typography>
                  </Popover>
                  <div className="buttons-right-align">
                    <Button type="cancel" onClick={handleCancelClick}>
                      Cancel {<GiCancel />}
                    </Button>
                    <Button type="submit" onClick={handleSaveSchedule}>
                      Save Schedule {<AiTwotoneSave />}
                    </Button>
                  </div>
                </div>
              </Typography>
            </Popover>
          </div>
          <div className="drop-down">
            <Box className="label">
              <FormControl fullWidth variant="filled">
                <InputLabel>Class</InputLabel>
                <Select
                  className="dropdown-class-main"
                  value={classNameSelectforAll}
                  onChange={handleClassNameSelectForAll}
                >
                  {classNameoptions.map((option) => (
                    <MenuItem key={option.name} value={option.code}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
      </div>

      <div className="table">
        <BasicTable />
      </div>
    </>
  );
};

export default SchedulePage;
export { classCode };
