import React, { useState } from "react";
import {Box,Divider,FormControl,InputLabel,MenuItem,NativeSelect,Paper,Select,Stack,Grid, Card,CardContent,CardActions,Button,Typography} from "@mui/material";
import "./index.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditNoteIcon from '@mui/icons-material/EditNote';
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ExamMainPage = () => {
  let navigate=useNavigate();
  const[classes,setClasses]=useState([])
  const user=window.sessionStorage.getItem("userPersona");
  React.useEffect(() => {  
    classDetailsHandle();
   },[]) 

   const classDetailsHandle=()=>{
    axios.get('http://localhost:8080/classes/v1/classes').then(result =>setClasses(result?.data))
    .catch(err=>{
      console.log(err.message)
    })
  }
   const handleSchedule=()=>{
    console.log(user)
    if(user==="admin"){
      navigate('/schedule')

    }
    else if (user=="student") {
      navigate('/schedule+student')
   }
  
  }
  const handleResults=()=>{

  }

    const card1 = (
        <React.Fragment>
          <CardContent>
            
            <Typography variant="h5" component="div">
            <CalendarTodayIcon className="calender" style={{height:"130px",width: "130px", marginTop: "30px",marginBottom: "20px"}} ></CalendarTodayIcon>
            </Typography>
           
            <Typography variant="body2">
            All Examination schedules 
            </Typography>
            <br></br>
            <Button size="small" className="view-button" onClick={()=>handleSchedule()}>View</Button>
          </CardContent>
          
        </React.Fragment>
      );

      const card2 = (
        <React.Fragment>
          <CardContent>
            
            <Typography variant="h5" component="div">
            <EditNoteIcon className="result" style={{height:"160px",width: "160px", marginTop: "0px",marginBottom: "20px"}} ></EditNoteIcon>
            </Typography>
            
            <Typography variant="body2">
            All Examination Results
            </Typography>
            <br></br>
            <Button size="small" className="view-button" onClick={()=>handleResults()}>View</Button>
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
          <MenuItem value="Select">Select</MenuItem>
                    {classes?.map((classes,id) => (
                      
                        <MenuItem key={id} value={classes.code}>{classes.name}</MenuItem>
                        ))}
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