import React from "react";
import {Box,Divider,FormControl,InputLabel,MenuItem,NativeSelect,Paper,Select,Stack} from "@mui/material";
import "./index.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditNoteIcon from '@mui/icons-material/EditNote';

const ExamMainPage = () => {
    return(
        <>
        <Box className="box1">
            <Paper className="paper">
            <Stack direction="column">
                <div>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className="form">
      <InputLabel  id="demo-select-small-label" className="label1">Class Name</InputLabel>
                <Select className="select1" label="Class name"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
        >
        </Select>
                </FormControl>
               
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" className="form">
      <InputLabel  id="demo-select-small-label" className="label1">Student Name</InputLabel>
                <Select className="select1" label="Student name"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
        >
        </Select>
                </FormControl>
                </div>
                <br></br>
                <br></br>
             <Divider></Divider>

                <div >
                <CalendarTodayIcon className="calender" ></CalendarTodayIcon>
                <EditNoteIcon className="result"></EditNoteIcon>
                </div>
                </Stack>
            </Paper>
        </Box>
        </>
    )
}
export default ExamMainPage;