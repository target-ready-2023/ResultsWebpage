import React from "react";
import "./EditResultsAdmin.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box,Stack, Grid,Button,Table,TableHead, TableCell ,TableRow,Dialog,DialogActions,DialogContent,DialogTitle, Typography, TextField} from "@mui/material";
import EditIcon  from '@mui/icons-material/Edit';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import swal from "sweetalert";

const EditResultsAdmin=()=>{
    const [testNames,setTestNames] =React.useState([]);
    const [test,setTest] =React.useState("");
    const [classNames,setClassNames] = React.useState([]);
    const [classes, setClasses] = React.useState("");
    const [stResults,setStResults] = React.useState([]);
    var classLevel;
    var shCode;
    var uniqueMarks;
    const [disMarks,setDisMarks] =React.useState([]);
    const [year,setYear] = React.useState("");
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
    const [marks, setMarks] =React.useState([{
        subjectCode: "",
        internalMarks: 0,
        externalMarks: 0
    }]);
    const [resultCode,setResultCode] = React.useState("");
    const [result, setResult] =React.useState({
        resultsCode:"",
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
          getAllResults(test);
    }

    const updateResult= async() => {
        const requestBody = {...result,resultsCode:resultCode,marksList:uniqueMarks};
        await axios.put('http://localhost:8080/results/v1/'+resultCode,requestBody)
        .then(res => {swal({
            title: "Result Updated Successfully",
            icon: "success",
            button: "OK",
          })})
        .catch(err => console.log(err.message))
        getAllResults(test)
    }
    const getAllResults= async(test) =>{
        await axios.get('http://localhost:8080/results/v1/classTest',{params:{classCode:classes,academicYear:year,scheduleCode:test}})
    .then(res => setStResults(res?.data))
    .catch(err => {console.log(err.message)})
    getStudents(classes);
    }

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
        setStResults([]);
        getAllResults(shCode);
        setResult({...result,scheduleCode:shCode})
    }

    const handleAcYearChange=(e)=>{
        setYear(e.target.value);
        getTestOrExam(e.target.value);
    }

    const handleClassNameChange=(event)=>{
        classLevel=event.target.value;
        var index = event.nativeEvent.target.selectedIndex;
        var clname =event.nativeEvent.target[index].text
        setClaName(clname);
        setClasses(event.target.value);
        getAcYear();
        setDisplayStudent([]);
        getStudents(classLevel);
    }
    const handleInMarks=(e)=>{
        let inMark=e.target.value;
        if (inMark ===''){
            inMark = 0;
        }
        const r = {subjectCode:e.target.id, internalMarks:inMark};
        setMarks(marks => [...marks, r]);
    }
    const handleExMarks=(e)=>{
        let exMark=e.target.value;
        if (exMark ===''){
            exMark = 0;
        }
        const r = {subjectCode:e.target.id, externalMarks:exMark};
        setMarks(marks => [...marks, r]);
    }
    const handleClickOpenAddOrUpdate = (stRoll,student) => {
        getSubjectsByclass(classLevel);
        setSt_roll(stRoll);
        setStudentName(student.name);
        setStudentClass(student.classCode);
        setResult({...result,studentId:student.studentId});
        let re =(stResults.find(x=> x.studentId === student.studentId ));
        if(re?.length === 0 || re === undefined){
            setOpenAdd(true);
        }
        else{
            let reMarks=[];
            reMarks=re?re.marksList:null;
            setDisMarks(reMarks);
            setMarks(reMarks);
            setResultCode(re?re.resultsCode:null);
            setOpenUpdate(true);
        }
      }
    const handleAddAndClose = () =>{
        uniqueMarks = keepLatestInternalMarks(marks);
        addResult();
        handleCloseAdd();
    }
    
      const handleCloseAdd=()=>{
        setMarks([]);
        uniqueMarks=0;
        setOpenAdd(false);
     }

     const handleUpdateAndClose=()=>{
        uniqueMarks = keepLatestInternalMarks(marks);
        updateResult();
        handleCloseUpdate(); 
     }

    const handleCloseUpdate=()=>{
        setMarks([]);
        uniqueMarks=0;
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
            <Typography className="text"><b>Class: </b>{claName}</Typography>
            <Typography className="text"><b>Type: </b>{schedules.scheduleName}</Typography>
            </div>
            <br/>
            {subjects?.map((subject,index) => (
                <><br/>
                <div style={{ display: 'flex'}} key={index}>
                <Typography variant="body1"  className="text"  width="25%">{subject?.subjectName}</Typography>
                <Typography className="txt">:</Typography>
                {(schedules.scheduleType).toLowerCase() === "test"? 
                <><input className="text-add" id={subject?.subjectCode} onChange={(e) => handleInMarks(e)}/>
                <Typography variant="body1" className="text">&nbsp;  / {subject?.maxTestMarks}</Typography></>
                :<><input className="text-add" id={subject?.subjectCode} onChange={(e) => handleExMarks(e)}/>
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
        <Dialog open={openUpdate} onClose={handleCloseUpdate} fullWidth maxWidth="sm">
        <DialogTitle className="DialogTitle">Update Result</DialogTitle>
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
                {(schedules.scheduleType).toLowerCase() === "test"? 
                <><input className="text-add" id={subject?.subjectCode} defaultValue={disMarks[index]?.internalMarks} onChange={(e) => handleInMarks(e)}/>
                <Typography variant="body1" className="text">&nbsp;  / {subject?.maxTestMarks}</Typography></>
                :<><input className="text-add" id={subject?.subjectCode} defaultValue={disMarks[index]?.externalMarks} onChange={(e) => handleExMarks(e)}/>
                <Typography variant="body1"  className="text">&nbsp;  / {subject?.maxExamMarks}</Typography></>}
                </div>
                </>
            ))}
            <br/> 
            </DialogContent>
            <DialogActions>
          <button className="button-dialog" onClick={handleCloseUpdate}>Close</button>
          <button className="button-dialog" onClick={handleUpdateAndClose}>Update</button>
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
                            </Table>
                        </div>
                        </Stack>
                        <Stack>
                       
                            <div className="div-design">
                            <Table className="Class-table">
                                <TableHead className="Table-head">
                                    
                                        <TableCell className="Head-Table-cell">Roll Number</TableCell>
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
                                        <button  className="table-button" onClick={ () =>{handleClickOpenAddOrUpdate(student.rollNumber,student)}}><EditIcon/></button>
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