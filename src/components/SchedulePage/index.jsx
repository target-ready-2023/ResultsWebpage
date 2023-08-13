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
import swal from "sweetalert";
import "dayjs/locale/en";

let classCode = "";
let viewClick = "";
let acYear = "";

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

  const [disableAcYear, setDisableAcYear] = useState(true);
  const [classError, setClassError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [dateTimeErrorParent, setDateTimeErrorParent] = useState("");
  const fourPM = dayjs().set("hour", 16).startOf("hour");
  const nineAM = dayjs().set("hour", 9).startOf("hour");
  const nextDay = dayjs().add(1, "day").startOf("day").set("hour", 9);
  const [disabledScheduleNames, setDisabledScheduleNames] = useState(true);
  const [schedules, setSchedules] = useState([
    "Test 1",
    "Test 2",
    "Mid-Term",
    "Test 3",
    "Test 4",
    "Pre-Preparatory",
    "Preparatory",
    "Final",
  ]);
  const [alert, setAlert] = useState("");

  const [year, setYear] = useState("");
  const [classAcademiYears, setClassAcademicYears] = useState([]);

  let academicYear = "";
  let diableSchedule = true;
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
    },
  ]);

  const [idFormat, setIdFormat] = useState("");
  const [dateTimeSave, setDateTimeSave] = useState(null);

  const handleDateTimeDialogBox = (event, row) => {
    setAnchorDT(event.currentTarget);

    //console.log("hey " ,row);
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

      if (
        selectedHours < 9 ||
        (selectedHours === 9 && selectedMinutes < 0) ||
        selectedHours > 16 ||
        (selectedHours === 16 && selectedMinutes > 0)
      ) {
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

  const getAcademicYears = (classCode) => {
    axios
      .get(`http://localhost:8080/schedule/v1/${classCode}/acYears`)
      .then((response) => {
        setClassAcademicYears(response.data);
        console.log("acYear : " + response.data);
        // acYear=response.data
        // console.log("ac yeat : ",acYear)
      })
      .catch((error) => {
        console.error("Error ", error);
      });
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
      if (
        classnamevalidation === schedulevalidation &&
        schedulevalidation === true
      ) {
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
          if (Response.data.classCode === classCode) {
            setRowsDisplay([]);
            setClassN("");
            setScheduleN("");
            setScheduleT("");
            setAnchor(null);
            setAlert("Success");
            swal({
              title: "Schedule Added Successfully",
              icon: "success",
              button: "OK",
            });
          }
        });
    }
  };

  const getExistingSchedulesofClass = () => {
    console.log("class code : ", classNameSelect);
    // let existingSchedules=""
    axios
      .get(
        `http://localhost:8080/schedule/v1/current/scNames?classCode=${classNameSelect}`
      )
      .then((res) => {
        console.log("Response ", res.data);
        const existingSchedules = res.data;
        const updatedSchedules = schedules.filter(
          (schedule) => !existingSchedules.includes(schedule)
        );
        console.log("Updated schedule : ", updatedSchedules);
        setSchedules(updatedSchedules);
      })
      .catch((error) => {
        console.log("Error ", error);
      });
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
    getExistingSchedulesofClass();
    console.log("process data : " + rowsDisplay);
    setDisabledScheduleNames(false);
    const className = classNameoptions.find(
      (item) => item.code === classNameSelect
    );
    // fetchScheduleNames(className.name);
  };

  const handleClassNameSelectForAll = (event) => {
    setClassNameSelectForAll(event.target.value); //useState
    console.log("useState" + classNameSelectforAll);
    classCode = event.target.value; //let
    console.log("let " + classCode);
    getAcademicYears(classCode);
    setDisableAcYear(false);
  };
  const handleYearSelect = (event) => {
    setYear(event.target.value);
    acYear = event.target.value;
    academicYear = event.target.value;
    console.log("let : ", academicYear);
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
    } else if (scName === "Final") {
      scheduleType = "Final";
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
  const [fetchError, setFetchError] = useState("");
  const [classE, setClassE] = useState("");
  const [yearError, setYearError] = useState("");
  const classValid = () => {
    if (classCode === "") {
      setClassE("Please select class");
      return true;
    } else {
      setClassE("");
      return false;
    }
  };
  const yearValid = () => {
    if (acYear === "") {
      setYearError("Please select academic year");
      return true;
    } else {
      setYearError("");
      return false;
    }
  };
  const handleView = () => {
    const classvalid = classValid();
    const acYearValid = yearValid();
    // console.log("a : " +classvalid + " b : "+ acYearValid)
    // if(classCode.trim() !== "" && )
    if (classvalid || acYearValid) {
      if (classvalid === acYearValid) {
        setClassE("Please Select Class and Academic Year");
        setYearError("");
      }
    } else {
      viewClick = "yes";
    }
  };

  return (
    <>
      <div>
        <center>
          <h2>Exam Schedules</h2>
        </center>
      </div>
      <div className="main-div">
        <div className="top-part">
          <div className="add-button">
            <Button
              onClick={handleClick}
              className="button"
              sx={{ m: 1, minWidth: 160, minHeight: 20 }}
              size="small"
            >
              {" "}
              <AiFillSchedule className="icon" /> Add Schedule
            </Button>
            <Popover
              open={Boolean(anchor)}
              anchorEl={anchor}
              disableClickAway={true}
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
                          disabled={disabledScheduleNames}
                          value={scheduleN}
                          onChange={handleScheduleNameSelect}
                        >
                          {schedules.map((schedule, index) => (
                            <MenuItem key={index} value={schedule}>
                              {schedule}
                            </MenuItem>
                          ))}
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
                              defaultValue={"Choose date and time"}
                              //defaultValue={dateTimeSave !== null ? dateTimeSave : nineAM}
                             // defaultValue={nextDay}
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
                    <Button
                      type="cancel"
                      onClick={handleCancelClick}
                      style={{ color: "black" }}
                    >
                      Cancel {<GiCancel />}
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSaveSchedule}
                      style={{ color: "black" }}
                    >
                      Save Schedule {<AiTwotoneSave />}
                    </Button>
                  </div>
                </div>
              </Typography>
            </Popover>
          </div>
          <div className="classdiv">
            <Box>
              <FormControl sx={{ m: 1, minWidth: 160 }} size="size">
                <InputLabel className="classlabel">Class</InputLabel>
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
          <div className="classdiv">
            <Box>
              <FormControl sx={{ m: 1, minWidth: 160 }} size="size">
                <InputLabel className="classlabel">Academic Year</InputLabel>
                <Select
                  className="dropdown-class-main"
                  value={year}
                  onChange={handleYearSelect}
                  disabled={disableAcYear}
                >
                  {classAcademiYears.map((years, index) => (
                    <MenuItem value={years}>{years}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
          <div className="view-results-button">
            <FormControl>
              <button
                variant="contained"
                onClick={handleView}
                className="view-buttonresult"
              >
                view
              </button>
            </FormControl>
          </div>
        </div>
        <div>
        <center>
          <div>
            {classE && <span style={{ color: "red" }}>{classE}</span>}
          </div>
          <div>
            {yearError && <span style={{ color: "red" }}>{yearError}</span>}
          </div>
          
        </center>
      </div>

        <BasicTable />
      </div>
    </>
  );
};

export default SchedulePage;
export { classCode, viewClick, acYear };
