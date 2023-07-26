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
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from "@mui/x-data-grid-generator";
import { AiOutlinePlus, AiFillSchedule, AiTwotoneDelete, BsFillPencilFill,AiTwotoneSave,AiTwotoneCloseSquare } from "react-icons/ai";
import {GiCancel} from "react-icons/gi";
import {GrAdd} from "react-icons/gr";
import { useState, useEffect } from "react";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import axios from "axios";
import Input from '@mui/material/Input';



const SchedulePage = () => {

  const [anchor, setAnchor] = React.useState(null);
  const [classNameSelect, setClassNameSelect] = useState('');
  const [classNameoptions, setClassNameOptions] = useState([]);
  const [scheduleNameSelect, setScheduleNameSelect] = useState('');
  const [scheduleType, setScheduleType]=useState('');  
  const [rows, setRows]=useState([]);



  useEffect( ()=>{

    
    axios.get ('http://localhost:8080/results/v1/classes')
    .then( (response)=>{
      //console.log(response.data);
      setClassNameOptions(response.data)
    })
    .catch((error)=>{
      console.log(error);
    })

    

  })

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  function handleChange() {}

  const [columns, setColumns] = React.useState([
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
        <button onClick={() => handleDeleteRow(params.row.id)}>
          <AiTwotoneDelete />
        </button>
      ),
    },
  ]);
  // const [rows, setRows] = React.useState([
  //   {
  //     id: 1,
  //     code: "M101",
  //     name: "Mathematics",
  //     timing: randomCreatedDate(),
  //   },
  //   {
  //     id: 2,
  //     code: "Ph101",
  //     name: "Physics",
  //     timing: randomCreatedDate(),
  //   },
  //   { id: 3, code: "Ch101", name: "Chemistry", timing: randomCreatedDate() },
  //   {
  //     id: 4,
  //     code: "Co101",
  //     name: "Computer Science",
  //     timing: randomCreatedDate(),
  //   },
  // ]);

  const handleAddRow = () => {

    
    const newRow = {
      id: rows.length + 1,
      code: '',
      name: '',
      timing: null,
    };
    setRows((prevRows) => [...prevRows, newRow]);
    // const newRow = { id: "", name: "", timing: "" };
    // setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleCellEditCommit = (params) => {


    // const newRow = {
    //   id: rows.length + 1,
    //   code: '',
    //   name: '',
    //   timing: null,
    // };
    // setRows((prevRows) => [...prevRows, newRow]);

    // setRows((prevRows) =>{
    //   prevRows.map((row) =>(
    //     row.id === params.id ? {...row, [params.field]:params.value} : row
    //   ))
    // })

    // console.log(rows)
    // const { id, field, value } = params;

    // setRows((prevRows) =>
    //   prevRows.map((row) => {
    //     if (row.id === id) {
    //       return { ...row, [field]: value };
    //     }
    //     return row;
    //   })
    // );
  };
  const handleDeleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleClassNameSelect = (event) =>{
    setClassNameSelect(event.target.value)
    //console.log(classNameSelect)
  }
  const handleScheduleNameSelect = (event) =>{
    setScheduleNameSelect(event.target.value)
    const scName = scheduleNameSelect;
    if(scName === "Test 1" || scName === "Test 2"|| scName === "Test 3"|| scName === "Test 4"){
      setScheduleType("Test")
    }
    else{
      setScheduleType("Exam")
    }
  }
  const handleSaveToJSON = () => {
    console.log("rows " + rows)
    const jsonData = JSON.stringify(rows);
    console.log(jsonData); // You can do whatever you want with jsonData, e.g., send it to a server.
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
                      <Select className="classForAdmin" value={classNameSelect} onChange={handleClassNameSelect}>
                        {/* <MenuItem value={10}>10th</MenuItem>
                        <MenuItem value={9}>9th</MenuItem>
                        <MenuItem value={8}>8th</MenuItem> */}
                        {
                          classNameoptions.map(option =>(
                            <MenuItem key={option.name} value={option.code}>{option.name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box className="dd3">
                    <FormControl fullWidth variant="filled" sx={{ m: 1 }}>
                      <InputLabel>Schedule Name</InputLabel>
                      <Select value={scheduleNameSelect} onChange={handleScheduleNameSelect}>
                        <MenuItem value={"Test 1"}>Test 1</MenuItem>
                        <MenuItem value={"Test 2"}>Test 2</MenuItem>
                        <MenuItem value={"Mid-Term"}>Mid-Term</MenuItem>
                        <MenuItem value={"Test 3"}>Test 3</MenuItem>
                        <MenuItem value={"Test 4"}>Test 4</MenuItem>
                        <MenuItem value={"Pre-Preparatory"}>Pre-Preparatory</MenuItem>
                        <MenuItem value={"Preparatory"}>Preparatory</MenuItem>
                        <MenuItem value={"Final"}>Final</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="dd2">
                    <FormControl fullWidth variant="filled" sx={{ m: 1 }}>
                      <InputLabel>Schedule Type</InputLabel>
                      <Input value={scheduleNameSelect} readOnly />
                    </FormControl>
                  </Box>
                </div>
                <div class="Table">
                  <DataGrid
                    editMode="row"
                    rows={rows}
                    columns={columns}
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    hideFooter
                    //onCellEditCommit={handleCellEditCommit}
                    onCellEditCommit={({ id, field, value }) => {
                      const updatedRows = rows.map((row) => (row.id === id ? { ...row, [field]: value } : row));
                      setRows(updatedRows);
                    }}
                  />
                </div>
                <div className="add">
                  <button onClick={handleAddRow}><GrAdd/> Subject </button>
                  
                </div>
                <div className="buttons-right-align">
                  <button type="cancel">Cancel {<GiCancel />}</button>
                  <button type="submit" onClick={handleSaveToJSON}>Save Schedule {<AiTwotoneSave />}</button></div>
              </div>
            </Typography>
          </Popover>
        </div>
        <div className="drop-down">
          <Box className="label">
            <FormControl fullWidth variant="filled">
              <InputLabel>Class</InputLabel>
              <Select className="dropdown-class-main" value={classNameSelect}>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={8}>8</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>    
    </div>
    
        <div className="table">
        <BasicTable/>
        </div>
      </>
  );
};

export default SchedulePage;
