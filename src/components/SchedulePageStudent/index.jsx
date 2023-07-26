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

const SchedulePageStudent = () => {
 
  const [anchor, setAnchor] = React.useState(null);

  return (
    <>
    <div className="main-div">
      <div className="top-part">
        
        <div className="drop-down">
          <Box className="label">
            <FormControl fullWidth variant="filled">
              <InputLabel>Class</InputLabel>
              <Select className="dropdown">
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
        <BasicTableStudent/>
        </div>
      </>
  );
};

export default SchedulePageStudent;