import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "./index.css";
import BasicTableStudent from "../table-student/Basictable";
import {
  randomCreatedDate,
} from "@mui/x-data-grid-generator";
import { useState, useEffect } from "react";
import axios from "axios";


const SchedulePageStudent = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [classNameSelect, setClassNameSelect] = useState();
  const [classNameoptions, setClassNameOptions] = useState([]);
  useEffect( ()=>{
    axios.get ('http://localhost:8080/classes/v1/classes')
    .then( (response)=>{
      //console.log(response.data);
      setClassNameOptions(response.data)
    })
    .catch((error)=>{
      console.log(error);
    })
  })
  const handleClassNameSelect = (event) =>{
    setClassNameSelect(event.target.value)
    setSelectedClass(event.target.value);
    //console.log(classNameSelect)
  }
 
  const [anchor, setAnchor] = React.useState(null);

  return (
    <>
    <div className="main-div">
      <div className="top-part">
        
        <div className="drop-down">
          <Box className="label">
            <FormControl fullWidth variant="filled">
              <InputLabel>Class</InputLabel>
              <Select className="dropdown"
               onChange={handleClassNameSelect}
              value={classNameSelect} >
                {
                          classNameoptions.map(option =>(
                            <MenuItem key={option.name} value={option.code}>{option.name}</MenuItem>
                          ))
                        }
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>    
    </div>
    
        <div className="table">
        <BasicTableStudent
        handleClassNameSelect={handleClassNameSelect}
        classNameSelect={selectedClass}
        />
        </div>
      </>
  );
};

export default SchedulePageStudent;
