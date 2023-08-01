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
import { TextField } from "@mui/material";
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from "@mui/x-data-grid-generator";
import {
  AiOutlinePlus,
  AiFillSchedule,
  AiTwotoneDelete,
  BsFillPencilFill,
  AiTwotoneSave,
  AiTwotoneCloseSquare,
} from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { GrAdd } from "react-icons/gr";
import { useState, useEffect } from "react";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import axios from "axios";
import Input from "@mui/material/Input";
import { Contrast } from "@mui/icons-material";

let classCode = "";

const SchedulePage = () => {
  const [anchor, setAnchor] = React.useState(null);
  const [classNameoptions, setClassNameOptions] = useState([]);
  const [scheduleN, setScheduleN] = useState("");
  const [scheduleT, setScheduleT] = useState("");
  const [classN, setClassN] = useState("");
  const [rows, setRows] = useState([]);
  const [classNameSelectforAll, setClassNameSelectForAll] = useState("");
  const [subjectsClass, setSubjectClass] = useState("");
  const [rowsDisplay, setRowsDisplay] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [selectedDateAndTime, setSelectedDateAndTime] = useState({});

  // Using let to store the data for API calls
  let scheduleDataForApi = [];

  let classNameSelect = "";
  let scheduleNameSelect = "";
  let scheduleType = "";
  let subjectsJson = "";
  let updatedData = "";
  let row = "";
  let subjectsFetch=""
  useEffect(() => {
    axios
      .get("http://localhost:8080/classes/v1/classes")
      .then((response) => {
        //console.log(response.data);
        // const subjectsArray = response.data.map((item) => item.subjects);
        // console.log(subjectsArray);
        setClassNameOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  useEffect(() => {
    // Log the updated rows whenever the rows state changes
    console.log("Updated rows:", rows);
  }, [rows]);

  const jsonData = subjects.map((subject) => {
    return {
      subjectName: subject,
    };
  });

  function handleChange() {}
  const handleDeleteRow = (id) => {
    console.log("Got in handleDeletefunction")
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    console.log(id);
  };

  // const [columns, setColumns] = React.useState([
  //   {
  //     field: "subjectCode",
  //     headerName: "Subject Code",
  //     type: "String",
  //     editable: true,
  //   },
  //   {
  //     field: "subjectName",
  //     headerName: "Subject Name",
  //     editable: true,
  //     width: 180,
  //     align: "left",
  //     headerAlign: "left",
  //   },
  //   // {
  //   //   field: "timing",
  //   //   headerName: "Date & Time",
  //   //   type: "dateTime",
  //   //   width: 220,
  //   //   valueGetter: ({ value }) => value && new Date(value),
  //   //   editable: true,
  //   // },
  //   {
  //     field: "date",
  //     headerName: "Date",
  //     type: "date",
  //     width: 150,
  //     editable: true,
  //     onEditCellProps: (params) => ({

  //       // Disable editing for cells where subjectCode is 'N/A'
  //       disabled: params.row.subjectCode === "N/A",
  //     }),

  //   },
  //   {
  //     field: "time",
  //     headerName: "Time",
  //     type: "time",
  //     width: 150,
  //     editable: true,
  //     onEditCellProps: (params) => ({
  //       // Disable editing for cells where subjectCode is 'N/A'
  //       disabled: params.row.subjectCode === "N/A",
  //     }),
  //   },

  //   // {
  //   //   field: "actions",
  //   //   headerName: "",
  //   //   width: 50,
  //   //   renderCell: (params) => (
  //   //     <button onClick={() => handleDeleteRow(params.row.id)}>
  //   //       <AiTwotoneDelete />
  //   //     </button>
  //   //   ),
  //   // },
  // ]);

  const [columns, setColumns] = React.useState([
    {
      field: "subjectCode",
      headerName: "Subject Code",
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "subjectName",
      headerName: "Subject Name",
      type: "string",
      width: 150,
      editable: true,
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

  // const handleDateTimeChange = (params) => {
  //   const { id, field, value } = params;
  //   setUpdateValues((prevData) =>
  //     prevData.map((row) =>
  //       row.id === id ? { ...row, [field]: value } : row
  //     )
  //   );
  //   //console.log(updateValues)
  // };
  const [editedRows, setEditedRows] = useState([]);
  const [x, setX] = useState("");

  const handleDateTimeChange = (params, newValue) => {
    const { id, field } = params;

    const localDate = new Date(newValue);
    const offset = localDate.getTimezoneOffset();
    const convertedDate = new Date(localDate.getTime() - offset * 60 * 1000);

    // setSelectedDateAndTime((prevData) =>
    //   prevData.map((row) =>
    //     row.id === id ? { ...row, [field]: convertedDate.toISOString() } : row
    //   )
    // );
    setRowsDisplay((prevRows) =>
    prevRows.map((row) =>
      row.id === id ? { ...row, [field]: convertedDate.toISOString() } : row
    )
  );
  
    scheduleDataForApi = scheduleDataForApi.map((item) =>
      item.id === id ? { ...item, [field]: convertedDate.toISOString() } : item
    );

    console.log("Selected Date & Time:", convertedDate.toISOString());
    console.log("Schedule Data for API:", scheduleDataForApi);

   
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



    console.log("DataGrid Values:", rowsDisplay);
    subjectsFetch = rowsDisplay
    console.log("in const : ", JSON.stringify(subjectsFetch,null,2));



    subjectsFetch.forEach((subject) => {

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
      subjectSchedule : subjectsFetch,
      scheduleName : scheduleName,
      scheduleType : scType,
      scheduleStatus: true
    }
    ).then((Response)=>{
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
    setClassNameSelectForAll(event.target.value);
    console.log(classNameSelectforAll);
    classCode = event.target.value;
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
    setAnchor(null);
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
                  <div className="Table">
                    <DataGrid
                      key={row.length}
                      rows={rowsDisplay}
                      columns={columns}
                      hideFooterPagination
                      hideFooterSelectedRowCount
                      hideFooter
                      onEditCellChange={handleDateTimeChange}
                      //onEditCellChange={handleCellEditCommit}
                    />
                  </div>
                  <div className="buttons-right-align">
                    <button type="cancel" onClick={handleCancelClick}>
                      Cancel {<GiCancel />}
                    </button>
                    <button type="submit" onClick={handleSaveSchedule}>
                      Save Schedule {<AiTwotoneSave />}
                    </button>
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
