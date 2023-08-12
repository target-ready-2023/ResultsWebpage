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
import {
  AiFillSchedule,
  AiTwotoneSave,
} from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { useState, useEffect } from "react";
import axios from "axios";


let classCode = "";

const SchedulePage = () => {
  const [anchor, setAnchor] = React.useState(null);
  const [classNameoptions, setClassNameOptions] = useState([]);
  const [scheduleN, setScheduleN] = useState("");
  const [scheduleT, setScheduleT] = useState("");
  const [classN, setClassN] = useState("");
  const [classNameSelectforAll, setClassNameSelectForAll] = useState("");
  const [rowsDisplay, setRowsDisplay] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [classSelectError, setClassSelectError]=useState("")
  const [scheduleSelectError, setScheduleSelectError]=useState("")
  const [dateTimeError, setDateTimeError]=useState("")
 let errorData= "";
  

 
  let classNameSelect = "";
  let scheduleNameSelect = "";
  let scheduleType = "";
  let subjectsJson = "";
  let updatedData = "";
  let row = "";
  let subjectsFetch=""
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8080/classes/v1/classes")
  //     .then((response) => {
  //       setClassNameOptions(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

  useEffect(() => {
    axios
      .get("http://localhost:8080/classes/v1/classes")
      .then((response) => {
        // Sort the classNameOptions array based on the 'name' property
        const sortedClassNames = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        console.log("X : ",sortedClassNames)
        setClassNameOptions(sortedClassNames);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  

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
      type: "dateTime",
      width: 200,
      editable: true,
      valueGetter: (params) => {
        const value = params.row.dateTime;
        return value ? new Date(value) : null;
      },
      renderCell: (params) => (
        <TextField
          type="datetime-local"
          value={params.value ? params.value.toISOString().slice(0, -8) : ""}
          onChange={(e) => handleDateTimeChange(params, e.target.value)}
        />
      ),
    },
  ]);


 
  const handleDateTimeChange = (params, newValue) => {
    const { id, field } = params;

    const localDate = new Date(newValue);
    const offset = localDate.getTimezoneOffset();
    const convertedDate = new Date(localDate.getTime() - offset * 60 * 1000);

    const minTime = new Date(convertedDate);
    minTime.setHours(9, 0, 0, 0); // Set the minimum time to 9:00 AM
  
    const maxTime = new Date(convertedDate);
    maxTime.setHours(16, 0, 0, 0); // Set the maximum time to 4:00 PM
    
    // if (convertedDate < minTime || convertedDate > maxTime) {
    //   //setDateTimeError("Select a time between 9AM and 4PM")
    //   errorData="Select a time between 9AM and 4PM"
    //   console.log("Selected time must be between 9 AM and 4 PM.");
    //   //return;
    // }
    // else{
    //   //setDateTimeError("")
    //   errorData=""
    // }
   
    setRowsDisplay((prevRows) =>
    prevRows.map((row) =>
      row.id === id ? { ...row, [field]: convertedDate.toISOString() } : row
    )
  );


    console.log("Selected Date & Time:", convertedDate.toISOString());
  

   
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

  const handleSaveSchedule = () => {

    const copiedRows = JSON.parse(JSON.stringify(rowsDisplay));
    console.log("x : ", copiedRows)

    copiedRows.forEach((subject) => {

      const [datePart, timePart] = subject.dateTime.split('T');
      subject.date = datePart;
      subject.time = timePart.slice(0, 5); 
      subject.status = true;
      delete subject.id;
      delete subject.subjectName;
      delete subject.dateTime;
    });

    const classCode = classN;
    const scheduleName= scheduleN;
    const scType = scheduleT;
    console.log("code" + classCode + "Name" + scheduleName + "Type" + scType)
    console.log(subjectsFetch);

    axios.post(`http://localhost:8080/schedule/v1`,
    {
      classCode : classCode,
      subjectSchedule : copiedRows,
      scheduleName : scheduleName,
      scheduleType : scType,
      scheduleStatus: true
    }
    ).then((Response)=>{
      console.log(Response)
      if(Response.data === "Successful"){

        setRowsDisplay([]);
        setClassN('');
        setScheduleN('');
        setScheduleT('')
        setAnchor(null);

      }
    })
    
  };

  
  const handleClassNameSelect = (event) => {
    classNameSelect = event.target.value;
    setClassN(classNameSelect);
    console.log(classNameSelect)
    const subjectsArray = getClassSubjects(classNameSelect);
    console.log(classNameSelect + " " + subjectsArray);
    subjectsJson = convertToJSONData(subjectsArray);
    console.log(subjectsJson);
    processData();
    console.log("process data : " + rowsDisplay);
  };

  const handleClassNameSelectForAll = (event) => {
    setClassNameSelectForAll(event.target.value);//useState
    console.log("useState" + classNameSelectforAll);
    classCode = event.target.value;//let
    console.log("let " + classCode)
  };
  const handleScheduleNameSelect = (event) => {
    scheduleNameSelect = event.target.value;
    setScheduleN(scheduleNameSelect);
    const scName = scheduleNameSelect;
    console.log(scName)
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
        setClassN('');
        setScheduleN('');
        setScheduleT('')
        setAnchor(null);
  };

  return (
    <>
    <div>
      <center><h2>Exam Schedules</h2></center>
    </div>
      <div className="main-div">
        <div className="top-part">
          <div className="add-button" >
            <Button  onClick={handleClick} className="button" sx={{ m: 1, minWidth: 160 ,minHeight:20}} size="small">
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
                      <FormControl  fullWidth variant="filled" sx={{ m: 1 }}>
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
                  <div 
                  className="Table" 
                  >
                    <DataGrid
                      key={row.length}
                      rows={rowsDisplay}
                      columns={columns}
                      hideFooterPagination
                      hideFooterSelectedRowCount
                      hideFooter
                      onEditCellChange={handleDateTimeChange}
                    />
                 
                  </div>
                  <div className="buttons-right-align">
                    <Button type="cancel" onClick={handleCancelClick} style={{color:"black"}}>
                      Cancel {<GiCancel />}
                    </Button>
                    <Button type="submit" onClick={handleSaveSchedule} style={{color:"black"}}>
                      Save Schedule {<AiTwotoneSave />}
                    </Button>
                  </div>
                </div>
              </Typography>
            </Popover>
          </div>
          <div className="classdiv">
            <Box  >
              <FormControl sx={{ m: 1, minWidth: 160 }}  size="size">
                <InputLabel className="classlabel">Class Name</InputLabel>
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
        <BasicTable />
      </div>

      {/* <div className="table">
       
      </div> */}
    </>
  );
};

export default SchedulePage;
export { classCode };
