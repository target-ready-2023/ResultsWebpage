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
    
   if (user=="student") {
      navigate('/schedule+student')
   }
   else{
      navigate('/schedule')
   }
  
  }
  const handleResults=()=>{
    if(user=="student"){
      navigate('/student+results')
    }
    else{
      navigate('/admin+result')
    }

  }

    const card1 = (
        <React.Fragment>
          <CardContent>
            
            <Typography variant="h5" component="div">
            <br></br><br></br>
            <CalendarTodayIcon className="calender" style={{height:"130px",width: "130px", marginTop: "30px",marginBottom: "20px"}} ></CalendarTodayIcon>
            </Typography>
           
            <Typography variant="body2">
            All Examination schedules 
            </Typography>
            <br></br>
            <br></br>
           
            <Button size="small" className="view-button" style={{backgroundColor:"black",color:"white",width:80,height:30,marginLeft:30}} onClick={()=>handleSchedule()}>View</Button>
       
          </CardContent>
          
        </React.Fragment>
      );

      const card2 = (
        <React.Fragment>
          <CardContent>
            
            <Typography variant="h5" component="div">
            <br></br><br></br>
            <EditNoteIcon className="result" style={{height:"170px",width: "160px", marginTop: "0px",marginBottom: "20px"}} ></EditNoteIcon>
            </Typography>
            
            <Typography variant="body2">
            All Examination Results
            </Typography>
            <br></br>
            <br></br>
            <Button size="small" className="view-buttoncard" style={{backgroundColor:"black",color:"white",width:70,height:28,marginLeft:30}}onClick={()=>handleResults()}>View</Button>
          </CardContent>
          
            
       
        </React.Fragment>
      );
    return(
        <>
        <Grid>
          <div className="Exam-Home" >
          <center><h1>Exam Home </h1></center>
          </div>
       
        
        <Box className="box1">
            {/* <Paper className="paper"> */}
           
            {/* <Stack direction="column"> */}
                <Stack direction="row" justifyContent={"space-evenly"} >
                
                <div>
                <Card variant="outlined" className="card">{card1}</Card>
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div>
                    <Card variant="outlined" className="card">{card2}</Card>
                    </div>
                    </Stack>
               
            
    
                {/* </Stack> */}
            {/* </Paper> */}
        </Box>
        </Grid>
        </>
    )
}
export default ExamMainPage;