import React from "react";
import {Box,Divider,FormControl,InputLabel,MenuItem,NativeSelect,Paper,Select,Stack,Grid, Card,CardContent,CardActions,Button,Typography} from "@mui/material";
import "./index.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditNoteIcon from '@mui/icons-material/EditNote';

const ExamMainPage = () => {
    const card1 = (
        <React.Fragment>
          <CardContent>
            
            <Typography variant="h5" component="div">
            <CalendarTodayIcon className="calender" ></CalendarTodayIcon>
            </Typography>
           
            <Typography variant="body2">
            All Examination schedules 
            </Typography>
            <br></br>
            <Button size="small" className="view-button">View</Button>
          </CardContent>
          
        </React.Fragment>
      );

      const card2 = (
        <React.Fragment>
          <CardContent>
            
            <Typography variant="h5" component="div">
            <EditNoteIcon className="result"></EditNoteIcon>
            </Typography>
            
            <Typography variant="body2">
            All Examination Results
            </Typography>
            <br></br>
            <Button size="small" className="view-button">View</Button>
          </CardContent>
          
            
       
        </React.Fragment>
      );
    return(
        <>
        <Grid>
        
        <Box className="box1">
            <Paper className="paper">
           
            <Stack direction="column">
                <div>
            <Card className="Exam-Home">
            <h3>Exam Home </h3>
        </Card>
        </div>
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
                <Stack direction="row">
                <div>
                <Card variant="outlined" className="card">{card1}</Card>
                </div>
                    <div>
                    <Card variant="outlined" className="card">{card2}</Card>
                    </div>
                    </Stack>
               
            
    
                </Stack>
            </Paper>
        </Box>
        </Grid>
        </>
    )
}
export default ExamMainPage;