import React, { useState,useRef } from "react";
import "./index.css";
import { FormControl,MenuItem,Select,NativeSelect,InputLabel,Box,Table, TableRow,TableHead,TableCell, TableBody,Button, Grid, Stack, Dialog, DialogContent,DialogActions, TableContainer, Divider} from "@mui/material";
import axios from "axios";


let testname;
let testcode;
let className;
let acYear;
let c_code;
let resultdetails=[];
const AdminViewAllResults=()=>
{
    const [classes, setClasses]=useState([]);
    const [classCode, setClassCode]=useState('');
    const [testList,setTestList]=useState([]);
    const [test,setTest]=useState("");
    const [testCode,setTestCode]=useState("");
    const [year,setYear]=useState('');
    const [results,setResults]=useState([]);
    const [selectedclass,setSelectedclass]=useState('');
    const [academicYears,setAcademicYears]=useState([]);
    const [maxExamMarks,setMaxExamMarks]=useState([]);
    const [maxTestMarks,setMaxTestMarks]=useState([]);
    const [view,setView]=useState('');
    const [subjects,setSubjects]=useState([]);
    const [classError, setClassError] = useState("");
    const [testError,setTestError]=useState("");
    const [yearError,setYearError]=useState("");
    const [disableClass,setDisableClass]=useState(true);
    const [disableYear,setDisableYear]=useState(true);
  
   
    
    let testType='';
    let subschedule;
    let subcode;
    let resultInfo=[];
    let students=[];
    React.useEffect(()=>{
      getClassList();
      setView('');
      
  },[]);
    const handleClassNameSelect=(event)=>
    { 
      setClassCode(event.target.value);
      c_code=event.target.value;
      const subjectarray=getSubjects(c_code);
      setDisableClass(false);
      getAcademicYears(c_code);
    }
    
    const handleTestNameSelect=(event)=>
    {
      setTest(event.target.value);
      testname=event.target.value;
     
        axios.get(`http://localhost:8080/schedule/v1/viewSchedule?scheduleName=${testname}&className=${className}&acYear=${acYear}`)
       .then(result =>
        {
          setTestCode(result?.data.scheduleCode)
          testcode=result?.data.scheduleCode
          testType=(result?.data.scheduleType).toLowerCase();
          subschedule=result?.data.subjectSchedule;
          getSubMaxMarks(subschedule,testType)
          console.log(testname+" "+testType,subschedule);
    } )
       .catch(err=>{
         console.log(err.message)
       })
    }
    const getSubMaxMarks=(subschedule,testType)=>
    {
      setMaxExamMarks([]);
      setMaxTestMarks([]);
      subschedule.map((subject,index)=>{
      subcode=subject.subjectCode
       axios.get(`http://localhost:8080/subjects/v1/subject/${subcode}`)
       .then(res=>{
         console.log(res?.data)
        if(testType==="exam")
        {
          setMaxTestMarks(current => [...current,0])
          setMaxExamMarks(current => [...current, res?.data.maxExamMarks]); 
        }
        else if(testType==="test")
        {
          setMaxTestMarks(current => [...current, res?.data.maxTestMarks]);
          setMaxExamMarks(current => [...current, 0]);
        }
        else if(testType==="final")
        {
          setMaxExamMarks(current => [...current, res?.data.maxExamMarks]); 
          setMaxTestMarks(current => [...current, res?.data.maxTestMarks]);
        }
        })
      }
      )
    }
    const handleYearSelect=(event)=>
    {
      setYear(event.target.value);
      acYear=event.target.value;
      getTestList(className,acYear);
      setDisableYear(false);
      console.log(acYear)
    }
    const addstudentInfo=(resultdetails)=>
    {
      
      axios.get(`http://localhost:8080/student/v1/student/${c_code}`)
        .then(res=>{
          students=res?.data;
          console.log(res?.data)
           resultdetails.map((result,index)=>
          {
             const studentDetails = students.find(student => student.studentId === result.studentId)
             result.studentName =studentDetails? studentDetails.name: null 
             result.rollNumber=studentDetails? studentDetails.rollNumber: null
             return result
          })
          resultInfo = [...resultdetails].sort((a, b) => a.rollNumber - b.rollNumber);
          setResults(resultInfo)
          console.log(resultInfo);
          console.log(resultdetails);
        })
        .catch(err=>{
          console.log(err.message)
        })
    }
    const getresultdetails=async()=>
     {
       const classNameValidation=validateclass();
       const yearValidation=validateYear();
       const testNameValidation=validateTest();

     if(classNameValidation||yearValidation||testNameValidation)
  {
    if(classNameValidation===yearValidation&&yearValidation===testNameValidation)
    {
      setClassError("Please select class, year and test to view results");
      setYearError("");
      setTestError("");
    }
    else if(classNameValidation===testNameValidation)
    {
      setClassError("Please select class and test")
      setTestError("");
    }
     else if(yearValidation===testNameValidation)
     {
      setYearError("Please select year and test")
      setTestError("");
     }
  }
     else
     {
     await axios.get(`http://localhost:8080/results/v1/classTest?classCode=${c_code}&academicYear=${acYear}&scheduleCode=${testcode}`)
    .then(res=>
      {
        resultdetails=res?.data;
        console.log(resultdetails);
        addstudentInfo(resultdetails)
      })
    .catch(err=>{
      console.log(err.message)
    })
    setView("yes")
  }
  
    }
    const getSubjects=async(classCode)=>
    {
      await axios.get(`http://localhost:8080/classes/v1/classes/${classCode}`)
      .then(
        result =>
        {
          setSubjects(result?.data.subjects)
          className=result?.data.name;
          setSelectedclass(className)
          console.log(result?.data.subjects)
          return result?.data.subjects;
        }
        
        )
      .catch(err=>{
        console.log(err.message)
      })
    }
   
    const getClassList = async()=>
    {
      await axios.get("http://localhost:8080/classes/v1/classes")
      .then(result =>setClasses(result?.data))
      .catch(err=>{
        console.log(err.message)
      })
    }

    const getTestList = async(className,acYear)=>
    {
      await axios.get(`http://localhost:8080/schedule/v1/scheduleNames?className=${className}&acYear=${acYear}`)
      .then(result =>{setTestList(result?.data)
        return  result?.data}
        )
      
      .catch(err=>{
        console.log(err.message)
      })
    }
    const getAcademicYears=async(classCode)=>
    {
      await axios.get(`http://localhost:8080/schedule/v1/${classCode}/acYears`)
      .then(result=>{setAcademicYears(result?.data)
      console.log(result?.data)})
      .catch(err=>{
        console.log(err.message)
      })
    }
    const validateclass = () => {
      if (selectedclass === "") {
        setClassError("Please select a class");
        return true;
      } else {
        setClassError("");
        return false;
      }
    };
    const validateTest = () => {
      if (test === "") {
        setTestError("Please select a test");
        return true;
      } else {
        setTestError("");
        return false;
      }
    };
    const validateYear=()=>
    {
      if(year==="")
      {
        setYearError("Please select a year");
        return true;
      }
      else
      {
        setYearError("");
        return false;
      }
    }
    return(
    <div >
      <div className="top-part">
        <h2> ALL RESULTS</h2>
      </div>
      <div >
        <div className="results-container">
       <Box >
        <Stack direction="row" justifyContent="space-between">
      <Box className="class-drop-down">
      <FormControl sx={{ m: 1 }}  size="small">
               <InputLabel style={{color:"black"}} className="label-result">Class Name</InputLabel>
               <Select required={true} onChange={handleClassNameSelect}
               className="selectresult">
                {classes?.map((classes,id) => (
                    <MenuItem key={id} value={classes.code}>{classes.name}</MenuItem>
                        ))}
                </Select>
            </FormControl>
         </Box>
         <Box className="year-drop-down">
               <FormControl sx={{ m: 1 }} size="small">
               <InputLabel style={{color:"black",marginLeft:"20px"}} className="label-result">Academic Year</InputLabel>
                <Select value={year} 
                className="selectresult"
                          onChange={handleYearSelect} disabled={disableClass}>
                            {academicYears.map((years,index)=>
                            (
                              <MenuItem value={years}>{years}</MenuItem>
                            ))}
                </Select>
               </FormControl>
         </Box>
         <Box className="test-drop-down">
               <FormControl sx={{ m: 1 }} size="small" >
               <InputLabel style={{color:"black",marginLeft:"30px"}} className="label-result">Test/Exam</InputLabel>
                <Select disabled={disableClass||disableYear} onChange={handleTestNameSelect}
                className="selectresult">
                            {testList?.map((test,id) => (
                      <MenuItem key={id} value={test}>{test}</MenuItem>
                      ))}

                </Select>
               </FormControl>
         </Box>
         <Box>
               <FormControl >
               <button variant="contained" className="view-button" onClick={getresultdetails} >view</button>
               </FormControl>
         </Box>
         </Stack>
         </Box>
         </div>
         <div>
                    {classError && (
                      <span style={{ color: "red" }}>{classError}</span>
                    )}
                    {yearError&&(
                      <span style={{color: "red"}}>{yearError}</span>
                    )}
                    {testError && (
                      <span style={{ color: "red" }}>{testError}</span>
                    )}
          </div>
       {view==="yes"?
       <div className="table-block">
        {resultdetails.length!=0?
       <Box>
        <div className="tableContainer">
       <Table className="Results-table">
           <TableHead className="Table-head">
               <TableCell className="Head-Table-cell" >Roll Number</TableCell>
               <TableCell className="Head-Table-cell"  >Student Name</TableCell>
               {subjects?.map((sub,index) => (
                      <TableCell className="Head-Table-cell"  >
                        <div style={{justifyContent:"centre"}}>
                        
                        {sub} 
                        <Divider style={{backgroundColor:"black"}}></Divider>
                        <Stack direction="row">
                        <div style={{padding:"5px",paddingLeft:"25px",justifyContent:"centre",paddingBottom:"10px"}} className="Head-Table-cell">
                          IM
                          <div> {maxTestMarks[index]}</div>
                        </div>
                      
                        <Divider orientation="vertical" flexItem style={{backgroundColor:"black", marginLeft:"0px", paddingBottom:"40px",paddingTop:"10px"}}></Divider>
                       
                        <div style={{padding:"5px",paddingLeft:"25px",justifyContent:"centre",paddingBottom:"10px"}} className="Head-Table-cell">
                          EM
                          <div> {maxExamMarks[index]}</div>
                          </div>
                        </Stack>
                        </div>
                      </TableCell>
                      ))}

               <TableCell className="Head-Table-cell"  >FinalMarks</TableCell>
               <TableCell className="Head-Table-cell"  >Percentage</TableCell>
           </TableHead>
           <TableBody>
  
           {results?.map((result, index) => {
  return (
    <TableRow key={index}>
      <TableCell className="Table-cell">{result.rollNumber}</TableCell>
      <TableCell className="Table-cell">{result.studentName}</TableCell>
      {result.marksList?.map((marks,index)=>
      {return(
        <TableCell style={{padding:"0px"}}>
          <Stack direction="row">
          <div style={{padding:"5px",paddingLeft:"40px"}} className="Table-cell">{marks.internalMarks}</div>
          <Divider orientation="vertical" flexItem style={{backgroundColor:"black", marginLeft:"0px"}}></Divider>
          <div style={{padding:"5px",paddingLeft:"25px"}} className="Table-cell">{marks.externalMarks}</div>
          </Stack>
        </TableCell>
           );})}
        <TableCell className="Table-cell">{result.totalMarks}</TableCell>
        <TableCell className="Table-cell">{result.totalPercentage}</TableCell>
    </TableRow>
  );
})}


           </TableBody>
       </Table>
       </div>
       </Box>
     :<p style={{textAlign:"center", color:"red"}}>Results not found</p>}
       </div>
       :
       <p style={{textAlign:"center"}}>Note: select classname, academic year and testname to view test results</p>
       }

       </div>
    </div>
    )
    ;
}

export default AdminViewAllResults;

