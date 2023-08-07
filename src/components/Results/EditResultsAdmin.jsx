import React from "react";
import "./EditResultsAdmin.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box,Stack, Grid,Button,Table,TableHead, TableCell ,TableRow,Dialog,DialogActions,DialogContent,DialogTitle, Typography, TextField} from "@mui/material";
import EditIcon  from '@mui/icons-material/Edit';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const EditResultsAdmin=()=>{
    const [testNames,setTestNames] =React.useState([]);
    const [result, setResult] =React.useState([]);
    const [test,setTest] =React.useState("");
    const [classNames,setClassNames] = React.useState([]);
    const [classes, setClasses] = React.useState("");
    let classLevel;
    const [openAdd, setOpenAdd] = React.useState(false);
    const [studentName,setStudentName] =React.useState("");
    const [studentClass,setStudentClass] =React.useState("");
    const [st_roll,setSt_roll] =React.useState("");
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [displayStudent,setDisplayStudent] =React.useState([]);
    const navigate = useNavigate()

    React.useEffect(()=>{
        getClasses();
    },[]);

    const getStudents = async(classLevel) =>{ 
    await axios.get('http://localhost:8080/student/v1/student/'+classLevel)
    .then(res => setDisplayStudent(res?.data))
    .catch(err => {console.log(err.message)})
}

    const getTestOrExam = async() =>{
        await axios.get('http://localhost:8080/schedule/v1/'+classLevel+'/all')
    .then(res => setTestNames(res?.data))
    .catch(err => {console.log(err.message)})
    }

    const getClasses= async() =>{
        await axios.get('http://localhost:8080/classes/v1/classes')
    .then(res => setClassNames(res?.data))
    .catch(err => {console.log(err.message)})
    }

    const getSubjectsByclass= async() =>{
        console.log(classes);
        await axios.get('http://localhost:8080/classes/v1/classes/'+classes)
    .then(res => console.log(res))
    .catch(err => {console.log(err.message)})
    }

    const OpenAllResults=()=>{
        navigate('/student+scchedule')
    }
    const OpenLeaderboard=()=>{
        navigate('/Leaderboard')
    }
    const handleTestNameChange=(event)=>{
        setTest(event.target.value);
        console.log(test);
    }

    const handleClassNameChange=(event)=>{
        classLevel=event.target.value;
        getTestOrExam();
        setClasses(event.target.value);
        setDisplayStudent();
        getStudents(classLevel);
    }
    const handleClickOpenAdd = (st_id,student) => {
        setSt_roll(st_id);
        setStudentName(student.name);
        setStudentClass(student.classCode);
        setOpenAdd(true);
        getSubjectsByclass(classLevel);
      }
      const handleCloseAdd=()=>{
        setOpenAdd(false);
     }

    const handleClickOpenUpdate=()=>{
        setOpenUpdate(true);
      }
    const handleCloseUpdate=()=>{
        setOpenUpdate(false);
    }
  
    const handleClickOpenView=()=>{
      setOpenView(true);
     }
     const handleCloseView=()=>{
        setOpenView(false);
     }

    return(
        <>
        {/* Add Result */}
        <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="sm">
            <DialogTitle>Add Result</DialogTitle>
            <DialogContent>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="body1">SID: {st_roll}</Typography>    
            <Typography variant="body1">Name: {studentName}</Typography>
            <Typography variant="body1">Class: {studentClass}</Typography>
            <Typography variant="body1">Type: {test}</Typography>
            </div>
            <br/><br/>
            <div style={{ display: 'flex'}}>
            <Typography variant="body1">Subject 1:</Typography>    
            <TextField type="number" inputProps={{maxLength:3}}/>
            <Typography variant="body1">/ 100</Typography>
            </div>
            <br/>
            <div style={{ display: 'flex'}}>
            <Typography variant="body1">Subject 2:</Typography>    
            <TextField type="number" inputProps={{maxLength:3}}/>
            <Typography variant="body1">/ 100</Typography>
            <br/>
            </div> 
            </DialogContent>
          <DialogActions>
             <button onClick={handleCloseAdd}>Close</button>
              <button>Add</button>
           </DialogActions>
        </Dialog>

        {/* Update Result */}
        <Dialog open={openUpdate} onClose={handleCloseUpdate}>
            <DialogTitle>Update Result</DialogTitle>
            <DialogContent>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="body1">SID: 11</Typography>    
            <Typography variant="body1">Name: John</Typography>
            <Typography variant="body1">Class: 4</Typography>
            <Typography variant="body1">Type: Test1</Typography>
            </div>
            <br/><br/>
            <div style={{ display: 'flex'}}>
            <Typography variant="body1">Subject 1:</Typography>    
            <TextField type="number" inputProps={{maxLength:3}}/>
            <Typography variant="body1">/ 100</Typography>
            </div>
            <br/>
            <div style={{ display: 'flex'}}>
            <Typography variant="body1">Subject 2:</Typography>    
            <TextField type="number" inputProps={{maxLength:3}}/>
            <Typography variant="body1">/ 100</Typography>
            <br/>
            </div>
            </DialogContent>
            <DialogActions>
          <button onClick={handleCloseUpdate}>Close</button>
          <button>Update</button>
        </DialogActions>
        </Dialog>

        <Dialog open={openView} onClose={handleCloseView}>
            <DialogTitle>Result</DialogTitle>
            <DialogContent>

            </DialogContent>
            <DialogActions>
            <button onClick={handleCloseView}>Close</button>
            </DialogActions>
        </Dialog>


        <div>
        <Grid className="Grid-container">
            <Box>
                <Grid item lg={2}>
                    <Stack>
                        <div>
                            <Table className="table-design">
                                <TableRow className="table-row1">
                                <Typography className="text1">Class: &nbsp; &nbsp;
                                    <select id="classes" className="select" value={classes} onChange={handleClassNameChange}>
                                        <option className="text4" disabled selected value="">--select--</option>
                                        {classNames.map((classes,index) =>(
                                        <option id={index} className="text3" value={classes.code}>{classes?.name}</option>
                                        ) )}
                                    </select>
                                    </Typography>
                                        <TableCell><button className="button-design" onClick={OpenAllResults}>View all results</button></TableCell>
                                        <TableCell width="1%"><button className="button-design" onClick={OpenLeaderboard}>Leaderboard</button></TableCell>
                                        
                                </TableRow>
                                <TableRow className="table-row1">
                                    <Typography className="text2">Test/Exam: &nbsp; &nbsp;
                                    <select id="test" className="select" value={test} onChange={handleTestNameChange}>
                                        <option className="text4" disabled selected value="">--select--</option>
                                        {testNames.map((test,index) =>(
                                        <option id={index} className="text3" value={test.scheduleName}>{test?.scheduleName}</option>
                                        ) )}
                                    </select>
                                    </Typography>
                                </TableRow>
                            </Table>
                        </div>
                        </Stack>
                        <Stack>
                       
                            <div className="div-design">
                            <Table className="Class-table">
                                <TableHead className="Table-head">
                                    
                                        <TableCell className="Head-Table-cell">Student ID</TableCell>
                                        <TableCell className="Head-Table-cell">Student Name</TableCell>
                                        <TableCell className="Head-Table-cell">Add/Update</TableCell>
                                        <TableCell className="Head-Table-cell">View</TableCell>
                                </TableHead>
                                {classes?.length === 0?
                                <TableRow>
                                    <TableCell><Typography className="text4">Please Select Class to view students</Typography> </TableCell>
                                </TableRow>
                                : 
                                <>{displayStudent?.length === undefined || displayStudent?.length === 0?
                                    <TableRow>
                                    <TableCell><Typography className="text4">NO data available</Typography> </TableCell>
                                </TableRow>:
                                <>
                                {displayStudent?.map((student,index) =>(
                                <TableRow key={index}>
                                    <TableCell className="Table-cell">{student.rollNumber}</TableCell>
                                    <TableCell className="Table-cell">{student.name}</TableCell>
                                    <TableCell className="Table-cell">
                                     {   (result.length==0)?
                                     <button  className="table-button" onClick={ () =>{handleClickOpenAdd(student.rollNumber,student)}}>Add</button>
                                     :
                                     <button  className="table-button" onClick={handleClickOpenUpdate}><EditIcon/></button>
                                     }
                                     </TableCell>
                                    <TableCell className="Table-cell"><Button className="table-button" onClick={handleClickOpenView}><VisibilityOutlinedIcon style={{ color: "black" }}/></Button></TableCell>
                                    </TableRow> 
                                ))}
                                </>}
                                </>}
                                </Table>
                            </div>                        
                    </Stack>
                </Grid>
            </Box>
        </Grid>
        </div>
        </>

    )

}
export default EditResultsAdmin;