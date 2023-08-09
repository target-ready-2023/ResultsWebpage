import React from "react";
import "./EditResultsAdmin.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box,Stack,Input, Grid,Button,Table,TableHead, TableCell ,TableRow,Dialog,DialogActions,DialogContent,DialogTitle, Typography, TextField} from "@mui/material";
import EditIcon  from '@mui/icons-material/Edit';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import swal from "sweetalert";
import { gridClasses } from "@mui/x-data-grid";

const EditResultsAdmin=()=>{
    const [testNames,setTestNames] =React.useState([]);
    const [test,setTest] =React.useState("");
    const [classNames,setClassNames] = React.useState([]);
    const [classes, setClasses] = React.useState("");
    let classLevel;
    let shCode;
    let uniqueMarks;
    let year;
    const [openAdd, setOpenAdd] = React.useState(false);
    const [studentName,setStudentName] =React.useState("");
    const [studentClass,setStudentClass] =React.useState("");
    const [st_roll,setSt_roll] =React.useState("");
    const [st_id ,setSt_id] =React.useState("");
    const [subjects,setSubjects] = React.useState([]);
    const [schedules,setSchedules] = React.useState([]);
    const [claName,setClaName] = React.useState("");
    const [acYear,setAcYear] = React.useState([]);
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [displayStudent,setDisplayStudent] =React.useState([]);
    const navigate = useNavigate();
    const [subjectCode, setSubjectCode] = React.useState("");
    const [internalMarks,setInternalMarks] = React.useState(0);
    const [externalMarks,setExternalMarks] = React.useState(0);
    const [marks, setMarks] =React.useState([{
        subjectCode: "",
        internalMarks: 0,
        externalMarks: 0
    }]);
    const [studentId,setStudentId] = React.useState("");
    const [ scheduleCode,setScheduleCode] = React.useState("");
    const [marksList,setMarksList] = React.useState([]);
    const [result, setResult] =React.useState({
        studentId: "",
        scheduleCode: "",
        marksList:[]
    });
    React.useEffect(()=>{
        getClasses();
    },[]);

    const getStudents = async(classLevel) =>{ 
    await axios.get('http://localhost:8080/student/v1/student/'+classLevel)
    .then(res => setDisplayStudent(res?.data))
    .catch(err => {console.log(err.message)})
}

    const getTestOrExam = async(year) =>{
        await axios.get('http://localhost:8080/schedule/v1/'+classes+'/'+year+'/all')
    .then(res => setTestNames(res?.data))
    .catch(err => {console.log(err.message)})
    }

    const getClasses= async() =>{
        await axios.get('http://localhost:8080/classes/v1/classes')
    .then(res => setClassNames(res?.data))
    .catch(err => {console.log(err.message)})
    }
    const getAcYear= async()=>{
        await axios.get('http://localhost:8080/schedule/v1/'+classLevel+'/acYears')
        .then(res=>setAcYear(res?.data))
        .catch(err=>console.log(err.message))
    }
    const getSubjectsByclass= async() =>{
        await axios.get('http://localhost:8080/subjects/v1/subject/class/'+classes)
    .then(res => setSubjects(res?.data))
    .catch(err => {console.log(err.message)})
    }

    const getSchedule= async(scheduleCode) =>{
        await axios.get('http://localhost:8080/schedule/v1/'+scheduleCode)
    .then(res => setSchedules(res?.data))
    .catch(err => {console.log(err.message)})
    }

    const addResult = async() =>{
        const requestBody={...result,marksList:uniqueMarks};
        await axios.post('http://localhost:8080/results/v1',requestBody)
        .then(res => {swal({
            title: "Result Added Successfully",
            icon: "success",
            button: "OK",
          })})
    }
    // const getAllResults= async(shCode,claName,acYear) =>{
    //     await axios.get('http://localhost:8080/results/v1/classTest',{Params:{className:claName,academicYear:acYear,scheduleName:}})
    // .then(res => console.log(res))
    // .catch(err => {console.log(err.message)})
    // }

    const OpenAllResults=()=>{
        navigate('/student+scchedule')
    }
    const OpenLeaderboard=()=>{
        navigate('/Leaderboard')
    }

    const keepLatestInternalMarks = (array) => {
        const uniqueMarksMap = new Map();
        
        array.forEach(obj => {
            if (obj.subjectCode &&(!uniqueMarksMap.has(obj.subjectCode) || obj.internalMarks !== '')) {
                uniqueMarksMap.set(obj.subjectCode, obj);
            }
        });
        return Array.from(uniqueMarksMap.values());
    };

    const handleTestNameChange=(event)=>{
        shCode=event.target.value;
        setTest(event.target.value);
        getSchedule(shCode);
        // getAllResults(shCode,claName,schedules?.year);
        setResult({...result,scheduleCode:shCode})
    }

    const handleAcYearChange=(e)=>{
        year=e.target.value;
        getTestOrExam(year);
    }

    const handleClassNameChange=(event)=>{
        classLevel=event.target.value;
        var index = event.nativeEvent.target.selectedIndex;
        var clname =event.nativeEvent.target[index].text
        setClaName(clname);
        getAcYear();
        setClasses(event.target.value);
        setDisplayStudent([]);
        getStudents(classLevel);
    }
    const handleMarks=(e)=>{
        const r = {subjectCode:e.target.id, internalMarks:e.target.value};
        setMarks(marks => [...marks, r]);
    }
    const handleClickOpenAdd = (stRoll,student) => {
        setSt_roll(stRoll);
        setStudentName(student.name);
        setStudentClass(student.classCode);
        setResult({...result,studentId:student.studentId});
        setOpenAdd(true);
        getSubjectsByclass(classLevel);
      }
    const handleAddAndClose = () =>{
        uniqueMarks = keepLatestInternalMarks(marks);
        setOpenAdd(false);
        addResult();
    }
    
      const handleCloseAdd=()=>{
        setMarks([]);
        uniqueMarks=0;
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
            <DialogTitle className="DialogTitle">Add Result</DialogTitle>
            <DialogContent>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <Typography className="text"><b>SID: </b>{st_roll}</Typography>    
            <Typography className="text"><b>Name: </b>{studentName}</Typography>
            <Typography variant="body1" className="text"><b>Class: </b>{claName}</Typography>
            <Typography variant="body1" className="text"><b>Type: </b>{schedules.scheduleName}</Typography>
            </div>
            <br/>
            {subjects?.map((subject,index) => (
                <><br/>
                <div style={{ display: 'flex'}} key={index}>
                <Typography variant="body1"  className="text"  width="25%">{subject?.subjectName}</Typography>
                <Typography className="txt">:</Typography>
                {schedules.scheduleType === "Test"? 
                <><input className="text-add" id={subject?.subjectCode} onChange={(e) => handleMarks(e)}/>
                <Typography variant="body1" className="text">&nbsp;  / {subject?.maxTestMarks}</Typography></>
                :<><input className="text-add" id={subject?.subjectCode} onChange={(e) => handleMarks(e)}/>
                <Typography variant="body1"  className="text">&nbsp;  / {subject?.maxExamMarks}</Typography></>}
                </div>
                </>
            ))}
            <br/> 
            </DialogContent>
          <DialogActions>
             <button className="button-dialog" onClick={handleCloseAdd}>Close</button>
              <button className="button-dialog" onClick={handleAddAndClose}>Add</button>
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
                                <TableCell><Typography className="text1">Class: &nbsp; &nbsp;
                                    <select id="classes" className="select" value={classes} onChange={(event)=>{handleClassNameChange( event)}}>
                                        <option className="text4" disabled selected value="">--select--</option>
                                        {classNames.map((classes,index) =>(
                                        <option id={index} className="text3" value={classes.code}>{classes?.name}</option>
                                        ) )}
                                    </select>
                                    </Typography>
                                    </TableCell>
                                    <TableCell>
                                    <Typography className="text2">Academic Year: &nbsp; &nbsp;
                                    <select id="year" className="select" value={year} onChange={handleAcYearChange}>
                                        <option className="text4" disabled selected value="">--select--</option>
                                        {acYear.map((year,index) =>(
                                        <option id={index} className="text3" value={year}>{year}</option>
                                        ) )}
                                    </select>
                                    </Typography>
                                    </TableCell>
                                    <TableCell>
                                    <Typography className="text2">Test/Exam: &nbsp; &nbsp;
                                    <select id="test" className="select" value={test} onChange={handleTestNameChange}>
                                        <option className="text4" disabled selected value="">--select--</option>
                                        {testNames.map((test,index) =>(
                                        <option id={index} className="text3" value={test.scheduleCode}>{test?.scheduleName}</option>
                                        ) )}
                                    </select>
                                    </Typography>
                                    </TableCell>
                                        <TableCell><button className="button-design" onClick={OpenAllResults}>View all results</button></TableCell>
                                        <TableCell width="1%"><button className="button-design" onClick={OpenLeaderboard}>Leaderboard</button></TableCell>
                                        
                                </TableRow>
                                {/* <TableRow className="table-row1">
                                    <Typography className="text2">Test/Exam: &nbsp; &nbsp;
                                    <select id="test" className="select" value={test} onChange={handleTestNameChange}>
                                        <option className="text4" disabled selected value="">--select--</option>
                                        {testNames.map((test,index) =>(
                                        <option id={index} className="text3" value={test.scheduleCode}>{test?.scheduleName}</option>
                                        ) )}
                                    </select>
                                    </Typography>
                                </TableRow> */}
                            </Table>
                        </div>
                        </Stack>
                        <Stack>
                       
                            <div className="div-design">
                            <Table className="Class-table">
                                <TableHead className="Table-head">
                                    
                                        <TableCell className="Head-Table-cell">Student ID</TableCell>
                                        <TableCell className="Head-Table-cell">Student Name</TableCell>
                                        <TableCell className="Head-Table-cell">Add</TableCell>
                                        <TableCell className="Head-Table-cell">View/Update</TableCell>
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
                                     
                                     <button  className="table-button" onClick={ () =>{handleClickOpenAdd(student.rollNumber,student)}}>Add</button>
                                     
                                     <button  className="table-button" onClick={handleClickOpenUpdate}><EditIcon/></button>
                                     
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