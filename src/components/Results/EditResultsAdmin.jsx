import React from "react";
import "./EditResultsAdmin.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box,Stack, Grid,Button,Table,TableHead,TableCell ,TableBody,TableRow,Dialog,DialogActions,DialogContent,DialogTitle, Typography, TextField, Select, FormControl, InputLabel, MenuItem} from "@mui/material";
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
    var uniqueMarks=[];
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
    const [disableClass,setDisableClass]=React.useState(true);
    const [disableYear,setDisableYear] =React.useState(true);
    const [disableType,setDisableType] =React.useState(true);
    const [markError,setMarkError] = React.useState("");
    const [maxMark,setMaxMark] = React.useState(0);
    const [viewRes,setViewRes] = React.useState([]);
    const [viewResMarks,setViewResMarks] = React.useState([]);
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
        if((schedules.scheduleType).toLowerCase() === "test"){
            if(validateInMarks()){
                const requestBody={...result,marksList:uniqueMarks};
                await axios.post('http://localhost:8080/results/v1',requestBody)
                .then(res => {swal({
                    title: "Result Added Successfully",
                    icon: "success",
                    button: "OK",
                  })})
                  handleCloseAdd();
                  getAllResults(test);
                }
        }
        else if(validateExMarks()){
        const requestBody={...result,marksList:uniqueMarks};
        await axios.post('http://localhost:8080/results/v1',requestBody)
        .then(res => {swal({
            title: "Result Added Successfully",
            icon: "success",
            button: "OK",
          })})
          handleCloseAdd();
          getAllResults(test);
        }
    }
    const updateResult= async() => {

        if((schedules.scheduleType).toLowerCase() === "test"){
        if(validateInMarks()){
        const requestBody = {...result,resultsCode:resultCode,marksList:uniqueMarks};
        await axios.put('http://localhost:8080/results/v1/'+resultCode,requestBody)
        .then(res => {swal({
            title: "Result Updated Successfully",
            icon: "success",
            button: "OK",
          })})
        getAllResults(test);
        handleCloseUpdate(); 
      }
    }
    else if(validateExMarks()){
        const requestBody = {...result,resultsCode:resultCode,marksList:uniqueMarks};
        await axios.put('http://localhost:8080/results/v1/'+resultCode,requestBody)
        .then(res => {swal({
            title: "Result Updated Successfully",
            icon: "success",
            button: "OK",
          })})
        handleCloseUpdate();
        getAllResults(test); 
      }

    }
    const getAllResults= async(test) =>{
        await axios.get('http://localhost:8080/results/v1/classTest',{params:{classCode:classes,academicYear:year,scheduleCode:test}})
    .then(res => setStResults(res?.data))
    .catch(err => {console.log(err.message)})
    getStudents(classes);
    }

    const OpenAllResults=()=>{
        navigate('/admin+all')
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
        setDisableType(false);
    }

    const handleAcYearChange=(e)=>{
        setYear(e.target.value);
        getTestOrExam(e.target.value);
        setDisableYear(false);
    }
    const handleClassNameChange=(event)=>{
        classLevel=event.target.value;
        const clname = classNames.find((cls) => cls.code === classLevel);
        setClaName(clname.name);
        setClasses(event.target.value);
        getAcYear();
        setDisplayStudent([]);
        getStudents(classLevel);
        setDisableClass(false);
    }

    const validateInMarks=()=>{
        const markRegex =  /^[0-9]*$/;
        let flag=0;
        if(uniqueMarks.length===0 || uniqueMarks.length < subjects.length){
            setMarkError("Marks are required");
            return false;
        }
        else{
            for(let i=0;i<marks.length;i++){
                let inMark=marks[i].internalMarks;
                if(inMark ===''){
                    setMarkError("Marks are required");
                    return false;
                }
                else if(!markRegex.test(inMark)){
                    setMarkError("Marks must be Number");
                    return false;
                }
                else if(inMark > maxMark){
                    setMarkError("Marks cannot be greater than Max marks");
                    return false;
                }
                else if(inMark < 0){
                    setMarkError("Marks cannot be less than 0");
                    return false;
                }
                else{
                    setMarkError('');
                    flag=1;     
                }
            }
            if(flag === 1)
            return true;
            else
            return false;
        }
    }
    const validateExMarks=()=>{
        const markRegex =  /^[0-9]*$/;
        let flag=0;
        if(uniqueMarks.length===0 || uniqueMarks.length < subjects.length){
            setMarkError("Marks are required");
            return false;
        }
        else{
            for(let i=0;i<marks.length;i++){
                let inMark=marks[i].externalMarks;
                if(inMark ===''){
                    setMarkError("Marks are required");
                    return false;
                }
                else if(!markRegex.test(inMark)){
                    setMarkError("Marks must be Number");
                    return false;
                }
                else if(inMark > maxMark){
                    setMarkError("Marks cannot be greater than Max marks");
                    return false;
                }
                else if(inMark < 0){
                    setMarkError("Marks cannot be less than 0");
                    return false;
                }
                else{
                    setMarkError(''); 
                    flag=1;    
                }
            }
            if(flag ===1)
            return true;
            else
            return false;
        }
    }

    const handleInMarks=(e,maxTestMarks)=>{
        setMaxMark(maxTestMarks);
        const r = {subjectCode:e.target.id, internalMarks:e.target.value};
        setMarks(marks => [...marks, r]);
    }
    const handleExMarks=(e,maxExamMarks)=>{
        setMaxMark(maxExamMarks);
        const r = {subjectCode:e.target.id, externalMarks:e.target.value};
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
        setMarks(uniqueMarks);
        addResult();
    }
    
      const handleCloseAdd=()=>{
        setMarks([]);
        uniqueMarks=[];
        setOpenAdd(false);
        setMarkError('');
     }

     const handleUpdateAndClose=()=>{
        uniqueMarks = keepLatestInternalMarks(marks);
        setMarks(uniqueMarks);
        updateResult();
     }

    const handleCloseUpdate=()=>{
        setMarks([]);
        uniqueMarks=[];
        setOpenUpdate(false); 
        setMarkError('');
    }
  
    const handleClickOpenView=(stRoll,student)=>{
        getSubjectsByclass(classLevel);
        setSt_roll(stRoll);
        setStudentName(student.name);
        setStudentClass(student.classCode);
        let re =(stResults.find(x=> x.studentId === student.studentId ));
        if(re === undefined || re?.length === 0 ){
            setViewRes([]);
        }
        else{
            const resMarks=(re?.marksList).map((marksDis,index) => {
                const subDetails = subjects.find(sub => sub.subjectCode === marksDis.subjectCode)
                marksDis.subjectName= subDetails? subDetails.subjectName:null
                marksDis.maxTestMarks=subDetails? subDetails.maxTestMarks:null
                marksDis.maxExamMarks=subDetails? subDetails.maxExamMarks:null
                return marksDis
            })
            setViewRes(re)
            setViewResMarks(resMarks);
        }
       setOpenView(true);
     }
     const handleCloseView=()=>{
        setViewRes([]);
        setViewResMarks([]);
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
            <Typography className="text"><b>Test/Exam: </b>{schedules.scheduleName}</Typography>
            </div>
            <br/>
            {subjects?.map((subject,index) => (
                <><br/>
                <div style={{ display: 'flex'}} key={index}>
                <Typography variant="body1"  className="text"  width="25%">{subject?.subjectName}</Typography>
                <Typography className="txt">:</Typography>
                {(schedules.scheduleType).toLowerCase() === "test"? 
                <><input className="text-add" id={subject?.subjectCode} onChange={(e) => handleInMarks(e,subject?.maxTestMarks)}/>
                <Typography variant="body1" className="text">&nbsp;  / {subject?.maxTestMarks}</Typography></>
                :<><input className="text-add" id={subject?.subjectCode} onChange={(e) => handleExMarks(e,subject?.maxExamMarks)}/>
                <Typography variant="body1"  className="text">&nbsp;  / {subject?.maxExamMarks}</Typography></>}
                </div>
                </>
            ))}
            <br/>
            {markError && (
                                <tr>
                                    <td></td>
                                    <td>
                                        <span style={{ color: 'red' }}>{markError}</span>
                                    </td>
                                </tr>
                            )} 
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
            <Typography className="text"><b>Class: </b>{claName}</Typography>
            <Typography className="text"><b>Test/Exam: </b>{schedules.scheduleName}</Typography>
            </div>
            <br/>
            {subjects?.map((subject,index) => (
                <><br/>
                <div style={{ display: 'flex'}} key={index}>
                <Typography variant="body1"  className="text"  width="25%">{subject?.subjectName}</Typography>
                <Typography className="txt">:</Typography>
                {(schedules.scheduleType).toLowerCase() === "test"? 
                <><input className="text-add" id={subject?.subjectCode} defaultValue={disMarks[index]?.internalMarks} onChange={(e) => handleInMarks(e,subject?.maxTestMarks)}/>
                <Typography variant="body1" className="text">&nbsp;  / {subject?.maxTestMarks}</Typography></>
                :<><input className="text-add" id={subject?.subjectCode} defaultValue={disMarks[index]?.externalMarks} onChange={(e) => handleExMarks(e,subject?.maxExamMarks)}/>
                <Typography variant="body1"  className="text">&nbsp;  / {subject?.maxExamMarks}</Typography></>}
                </div>
                </>
            ))}
            <br/> 
            { markError && (
                                <tr>
                                    <td></td>
                                    <td>
                                        <span style={{ color: 'red' }}>{markError}</span>
                                    </td>
                                </tr>
                            )} 
            </DialogContent>
            <DialogActions>
          <button className="button-dialog" onClick={handleCloseUpdate}>Close</button>
          <button className="button-dialog" onClick={handleUpdateAndClose}>Update</button>
        </DialogActions>
        </Dialog>
        {/* {view Result} */}
        <Dialog open={openView} onClose={handleCloseView} fullWidth>
            <DialogTitle className="DialogTitle">Result</DialogTitle>
            <DialogContent>
                <br/>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <Typography className="text"><b>SID: </b>{st_roll}</Typography>    
            <Typography className="text"><b>Name: </b>{studentName}</Typography>
            <Typography className="text"><b>Class: </b>{claName}</Typography>
            <Typography className="text"><b>Test/Exam: </b>{schedules.scheduleName}</Typography>
            </div>
            <br/>
            <Table style={{border:"1px solid"}}>
                <TableHead>
                    <TableCell className="Table-cell"><Typography className="text"><b>Subject Name</b></Typography></TableCell>
                    <TableCell className="Table-cell"><Typography className="text"><b>Max Marks</b></Typography></TableCell>
                    <TableCell className="Table-cell"><Typography className="text"><b>Obtained marks</b></Typography></TableCell>
                </TableHead>
                <TableBody>
                {viewRes?.length === 0 ?
                <TableRow>
                    <TableCell><Typography className="text4">No Result Found. Please add result to view</Typography></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
                :
                <>
                    {viewResMarks?.map((re, index) =>(
                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                        {(schedules.scheduleType).toLowerCase() === "test" ?<>
                    <TableRow key={index} >
                        <TableCell className="Table-cell"><Typography className="text">{re.subjectName}</Typography></TableCell>
                        <TableCell className="Table-cell"><Typography className="text">{re.maxTestMarks}</Typography></TableCell>
                        <TableCell className="Table-cell"><Typography className="text">{re.internalMarks}</Typography></TableCell>
                    </TableRow>
                    </>
                   :<>
                    <TableRow key={index}>
                        <TableCell className="Table-cell"><Typography className="text">{re.subjectName}</Typography></TableCell>
                        <TableCell className="Table-cell"><Typography className="text">{re.maxExamMarks}</Typography></TableCell>
                        <TableCell className="Table-cell"><Typography className="text">{re.externalMarks}</Typography></TableCell>
                    </TableRow>
                    </>
            } 
            </div>
        )    
        )}
            </>
        }</TableBody>
            </Table>
            <br/>
            {viewRes?.length === 0?
            <div></div>:
            <div>
            <Typography className="text"><b>Total: </b>{viewRes.totalMarks}</Typography>    
            <Typography className="text"><b>Percentage: </b>{viewRes.totalPercentage}</Typography>
            </div>}
            </DialogContent>
            <DialogActions>
            <button className="button-dialog" onClick={handleCloseView}>Close</button>
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
                                <TableCell>
                                    <FormControl>
                                    <InputLabel style={{top:"-8px",color:"black"}}>Class Name</InputLabel>
                                    <Select id="classes" className="selectstyle" value={classes} onChange={(event)=>{handleClassNameChange( event)}}>
                                        {classNames.map((classes,index) =>(
                                        <MenuItem id={index} className="text3" value={classes.code}>{classes?.name}</MenuItem>
                                        ) )}
                                    </Select>
                                    </FormControl>
                                    </TableCell>
                                    <TableCell>
                                    <FormControl>
                                    <InputLabel style={{top:"-8px",color:"black"}}>Academic Year</InputLabel>
                                    <Select id="year" className="selectstyle" value={year} disabled={disableClass} onChange={handleAcYearChange}>
                                        {acYear.map((year,index) =>(
                                        <MenuItem id={index} className="text3" value={year}>{year}</MenuItem>
                                        ) )}
                                    </Select>
                                    </FormControl>
                                    </TableCell>
                                    <TableCell>
                                    <FormControl>
                                    <InputLabel style={{top:"-8px",color:"black"}}>Test/Exam</InputLabel>
                                    <Select id="test" className="selectstyle" value={test} disabled={disableYear || disableClass} onChange={handleTestNameChange}>
                                        {testNames.map((test,index) =>(
                                        <MenuItem id={index} className="text3" value={test.scheduleCode}>{test?.scheduleName}</ MenuItem>
                                        ) )}
                                    </Select>
                                    </FormControl>
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
                                        <button  className="table-button" disabled={disableType} onClick={ () =>{handleClickOpenAddOrUpdate(student.rollNumber,student)}}><EditIcon/></button>
                                     </TableCell>
                                    <TableCell className="Table-cell"><button className="table-button" disabled={disableType} onClick={ () =>{handleClickOpenView(student.rollNumber,student)}}><VisibilityOutlinedIcon/></button></TableCell>
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