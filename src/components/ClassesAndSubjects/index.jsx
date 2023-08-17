import { Box, Grid, Paper,Select,Button,MenuItem, Stack, Table, Divider,TableHead, TableCell ,TableRow,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle, TableContainer} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon  from '@mui/icons-material/Edit'
import DeleteIcon  from '@mui/icons-material/Delete'
import axios from "axios";
import swal from "sweetalert";
import "./index.css";
import React, { useState } from "react";


const ClassesAndSubjects = () => {
     let  x=0;
    const[classes,setClasses]=new useState()
    const [button,setButton]=useState("classes");
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [sopen, setSopen] = React.useState(false);
    const [sopen1, setSopen1] = React.useState(false);
    const [sopen2, setSopen2] = React.useState(false);
    const [code,setCode]=React.useState('');
    const [name,setName]=React.useState('');
    const[subjects,setSubjects]=React.useState([]);
    const [class1,setClass1]=React.useState({
      code:'',
      name:'',
      subjects:[]
    })
    const [exist,setExist]=useState(0);
    const [classNames,setClassNames]=React.useState([]);
    const [subjects1,setSubjects1]=React.useState([]);
    const [subjectCode,setSubjectCode]=React.useState("");
    const [subjectName,setSubjectName]=React.useState("");
    const [credits,setCredits]=React.useState("");
    const [maxTestMarks,setMaxTestMarks]=React.useState("");
    const [maxExamMarks,setMaxExamMarks]=React.useState("");
    const [classCode,setClassCode]=React.useState("");
    const [subject,setSubject]=React.useState({
      subjectCode:"",
      subjectName:"",
      credits:"",
      classCode:"",
      maxTestMarks:"", 
      maxExamMarks:""
    })
    const [classError, setClassError] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [creditError, setCreditError] = useState('');
    const [subjectClassError, setSubjectClassError] = useState('');
    const [testError,setTestError]=useState('');
    const[examError,setExamError]=useState('');
   
    const handleButton=(str)=>{
      setButton(str);
    

    }

    const handleClickOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
      setClassError('')
    };

    const handleClickOpen2 = () => {
   
      setOpen2(true);
    };
    
    const handleClose2 = () => {
      setOpen2(false);
    };


  const handleClickSopen = () => {
    setSopen(true);
  };
  
  const handleSclose = () => {
    setSopen(false);
    setSubjectError('');
    setCreditError('');
    setSubjectClassError('');
  };

  const handleClickSopen1 = () => {
 
    setSopen1(true);
  };
  
  const handleSclose1 = () => {
    setSopen1(false);
  };

  const handleClickSopen2 = () => {
 
    setSopen2(true);
  };
  
  const handleSclose2 = () => {
    setSopen2(false);
  };
    
React.useEffect(() => {  
  classDetailsHandle();
  subjectDetailsHandle();
 },[]) 

const classDetailsHandle=()=>{
  axios.get('http://localhost:8080/classes/v1/classes').then(result =>setClasses(result?.data))
  .catch(err=>{
    console.log(err.message)
  })


}

const subjectDetailsHandle=()=>{
  axios.get('http://localhost:8080/subjects/v1/subject').then(result =>setSubjects1(result?.data))
  .catch(err=>{
    console.log(err.message)
  })
}

const addClass = (e) => {

  const isClassValid = validateClassName();
  if(isClassValid){
    setOpen(false);
    axios.post("http://localhost:8080/classes/v1/classes",class1).then(result=> {
      swal({
        title: "Class Added Successfully",
        icon: "success",
        button: "OK",
      }); 
    classDetailsHandle();
    });
  }
  
  setClass1({
    code:'',
    name:'',
    subjects:[]
  })

}

const handleDelete=(class_id)=>{
  setOpen2(true);
  setCode(class_id);
}

const deleteClass=()=>{
  setOpen2(false);
  axios.delete('http://localhost:8080/classes/v1/classes/'+code).then((response) => {
    swal({
      title: "Class Deleted Successfully",
      icon: "success",
      button: "OK",
    });
    classDetailsHandle(); 
  });
 
}

const addSubject = (e) => {
  const isSubjectValid = validateSubject();
  const isCreditValid = validateCredit();
  const isSubjectClassValid = validateSubjectClass();
  const isTestMarksValid=validateTestMarks();
  const isExamMarksValid=validateExamMarks();

  if(isSubjectValid && isCreditValid && isSubjectClassValid && isTestMarksValid && isExamMarksValid){
  setSopen(false);
    axios.post("http://localhost:8080/subjects/v1/subject",subject).then(result=> {
      swal({
        title: "Subject Added Successfully",
        icon: "success",
        button: "OK",
      }); 
    subjectDetailsHandle();
    });

  }
  setSubject({
    subjectCode:"",
    subjectName:"",
    credits:"",
    classCode:"",
    maxExamMarks:"",
    maxTestMarks:""
  })
}
  const handleSupdate=(sub_id,itr)=>{
    setSopen1(true);
    setSubject(itr);
    setSubjectCode(sub_id);
}

const updateSubject=(e)=>{
    setSopen1(false);
    axios.put('http://localhost:8080/subjects/v1/subject/'+subjectCode,subject).then((response) => {
      swal({
        title: "Subject Updated Successfully",
        icon: "success",
        button: "OK",
      });
      subjectDetailsHandle(); 
    });
    
  }



  const handleSdelete=(sub_id)=>{
    setSopen2(true);
    setSubjectCode(sub_id);
  }
  
  const deleteSubject=()=>{
    setSopen2(false);
    axios.delete('http://localhost:8080/subjects/v1/subject/'+subjectCode).then((response) => {
      swal({
        title: "Subject Deleted Successfully",
        icon: "success",
        button: "OK",
      });
      subjectDetailsHandle(); 
    });
   
  }

  const handleClassSearch=(className)=>{
    
   
    axios.get('http://localhost:8080/classes/v1/classes/search',{params:{className}}).then(result =>setClasses(result?.data))
    .catch(err=>{
      console.log(err.message)
    })
  }

  const handleSubjectSearch=(subjectName)=>{
    
   
    axios.get('http://localhost:8080/subjects/v1/search',{params:{subjectName}}).then(result =>setSubjects1(result?.data))
    .catch(err=>{
      console.log(err.message)
    })
  }

  const validateClassName= () => {
    setExist(0)
    x=0;
    const classRegex =  /^[0-9]*[A-Za-z]*$/;
    console.log(class1.name);

    if(class1.name === ''){
      setClassError('*Class Name is required.*')
      return false;
  }
  else if(!classRegex.test(class1.name)){
    setClassError('*Class Name must start with number.*');
    return false;
  } 
  else{
    classes.forEach((class2) => {
      console.log(class2.name)
        if(class1.name===class2.name){
          console.log(class2.name)
          setClassError('*Class Name already exists.*')
          setExist(1)
          x=1;
          return false;
        }
        console.log(exist)
      })

   if(x===0){
        console.log("add")
        setClassError('')
        return true;
      }   
  }
};

const validateSubject= () => {
  const subjectRegex =  /^[A-Za-z]*$/;
  
  if(subject.subjectName === ''){
    setSubjectError('*Subject Name is required.*')
    return false;
}
else if(!subjectRegex.test(subject.subjectName)){
  setSubjectError('*Subject Name must start with alphabet.*');
  return false;
} 
else{
  setSubjectError('')
  return true;
}

};

const validateCredit= () => {
  const creditRegex =  /^[0-9]*$/;
  

  if(subject.credits === ''){
    setCreditError('*Credits is required.*')
    return false;
}
else if(!creditRegex.test(subject.credits)){
  setCreditError('*Credits must be a number.*');
  return false;
} 
else{
  setCreditError('')
  return true;
}

};
const validateSubjectClass= () => {
 

  if(subject.classCode === ''){
    setSubjectClassError('*Class Name is required.*')
    return false;
}
else {
  setSubjectClassError('')
  return true;
} 

};

const validateTestMarks= () => {
 

  if(subject.maxTestMarks === ''){
    setTestError('*Max Test Marks is required.*')
    return false;
}
else {
  setTestError('')
  return true;
} 

};

const validateExamMarks= () => {
 

  if(subject.maxExamMarks === ''){
    setExamError('*Max Exam Marks is required.*')
    return false;
}
else {
  setExamError('')
  return true;
} 

};




    return (
       <>
       <Grid>
       {/* Add class */}
      <div >
      <Dialog open={open} onClose={handleClose} className="Dialog" >
     
        <DialogTitle className="DialogTitle">New Class</DialogTitle>
       
        <DialogContent>
          <div>
        
                    <label className="input-label"> Class Name </label>
                  
                  <input className="input"
                  onChange={(event)=>setClass1({...class1,name:event.target.value})}
                  >
                   </input>
                  
                   <br></br>
                   {classError && (
                                <tr style={{paddingTop:"2px"}}>
                                    <td></td>
                                    <td>
                                        <span style={{ color: 'red' }}>{classError}</span>
                                    </td>
                                </tr>
                            )}
            
        
          </div>

        </DialogContent>
        <DialogActions>
        
          <button onClick={handleClose}>Close</button>
          <button  onClick={()=>addClass()} >Add</button>
         
        </DialogActions>
      </Dialog>
    </div>

   {/* Add Subject */}
    <div >
      <Dialog open={sopen} onClose={handleSclose} className="Dialog" >
     
        <DialogTitle className="DialogTitle">New Subject</DialogTitle>
       
        <DialogContent>
          <div>
                
                  <label className="input-label">  Subject Name  </label>
             
                  <input className="input"
                  onChange={(event)=>setSubject({...subject,subjectName:event.target.value})}>
                  </input>
                  <br/> 
                  <br></br>

                  {subjectError && (
                                <tr style={{paddingTop:"2px"}}>
                                    
                                    <td>
                                        <span style={{ color: 'red' }}>{subjectError}</span>
                                    </td>
                                </tr>
                            )}
                            <br></br>
                  <label className="input-label">Subject Credit</label>
                  <input className="input"
                   onChange={(event)=>setSubject({...subject,credits:event.target.value})}></input>
                   <br />
                   <br></br>
                   {creditError && (
                                <tr style={{paddingTop:"2px"}}>
                                    <td></td>
                                    <td>
                                        <span style={{ color: 'red' }}>{creditError}</span>
                                    </td>
                                </tr>
                            )}
                            <br></br>
                            <label className="input-label"> Max Test Marks </label>
                  <input className="input"
                  onChange={(event)=>setSubject({...subject,maxTestMarks:event.target.value})}></input>
                  <br/>
                  <br></br>
                  {subjectError && (
                                <tr style={{paddingTop:"2px"}}>
                                    <td></td>
                                    <td>
                                        <span style={{ color: 'red' }}>{testError}</span>
                                    </td>
                                </tr>
                            )}
                  <br></br>
                 
                   <label className="input-label"> Max Exam Marks </label>
                  <input className="input"
                  onChange={(event)=>setSubject({...subject,maxExamMarks:event.target.value})}></input>
                  <br/>
                  <br></br>
                  {subjectError && (
                                <tr style={{paddingTop:"2px"}}>
                                    <td></td>
                                    <td>
                                        <span style={{ color: 'red' }}>{examError}</span>
                                    </td>
                                </tr>
                            )}
                       <br></br>
                  <label className="input-label">  Class Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </label>
                  <select className="select"
                  onChange={(event)=>setSubject({...subject,classCode:event.target.value})}
                 
                   >
                    <option value="Select">Select</option>
                    {classes?.map((classes,id) => (
                      
                        <option key={id} value={classes.code}>{classes.name}</option>
                        ))}
                   </select>
                    <br/>
                   <br></br>
                   {subjectClassError && (
                                <tr style={{paddingTop:"2px"}}>
                                    <td></td>
                                    <td>
                                        <span style={{ color: 'red' }}>{subjectClassError}</span>
                                    </td>
                                </tr>
                            )}
                            <br></br>
                  
                        
                  
        
          </div>

        </DialogContent>
        <DialogActions>
        
          <button onClick={handleSclose}>Close</button>
          <button   onClick={()=>addSubject()}>Add</button>
         
        </DialogActions>
      </Dialog>
    </div>

    

    {/* Update subject */}
    <div >
      <Dialog open={sopen1} onClose={handleSclose1} className="Dialog">
      
        <DialogTitle className="DialogTitle"><b>Update Subject</b></DialogTitle>
  
        <DialogContent>
         
    
        
          <div>
          <label className="input-label" >Name</label>
                  
                    <input className="input"
                    defaultValue={subject.subjectName}
                    onChange={(event)=>setSubject({...subject,subjectName:event.target.value})}>

                    </input>
                    <br></br>
                    <br></br>
                    <br></br>
                    <label className="input-label" >Credit</label>
                  
                  <input 
                 className="input"
                 defaultValue={subject.credits}
                 onChange={(event)=>setSubject({...subject,credits:event.target.value})}
                  ></input>
                  <br></br>
                  <br></br>
                    <br></br>
                  <label className="input-label" >Max Test Marks</label>
                  
                  <input 
                 className="input"
                 defaultValue={subject.maxTestMarks}
                 onChange={(event)=>setSubject({...subject,maxTestMarks:event.target.value})}
                  ></input>
                  <br></br>
                  <br></br>
                    <br></br>
                  <label className="input-label" >Max Exam Marks</label>
                  
                  <input 
                 className="input"
                 defaultValue={subject.maxExamMarks}
                 onChange={(event)=>setSubject({...subject,maxExamMarks:event.target.value})}
                  ></input>
                  <br></br>
                  <br></br>
                    <br></br>
                  <label className="input-label" > Class</label>
                  
                 <select className="select"
                 defaultValue={subject.classCode}
                  onChange={(event)=>setSubject({...subject,classCode:event.target.value})}>
                    <option value="Select">Select</option>
                    {classes?.map((classes,id) => (
                      
                        <option key={id} value={classes.code}>{classes.name}</option>
                        ))}

                  </select>
        
          </div>

      
        </DialogContent>
        <DialogActions>
          <button onClick={handleSclose1} >Close</button>
          <button  onClick={()=>updateSubject()} >Update</button>
         
        </DialogActions>
      </Dialog>
    </div>
    {/*End of Update subject */}

   {/* delete class */}
   <div>
    <Dialog
    open={open2}
    onClose={handleClose2}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    className="Dialog"
  >
    
    <DialogTitle id="alert-dialog-title" className="DialogTitle">
        <b>
      {"Are you sure?"}
      </b>
    </DialogTitle>
  
    <DialogContent style={{color:"black"}}>
      <DialogContentText id="alert-dialog-description">
       Do you really want to delete this Class? This process cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
    <button onClick={handleClose2} variant="contained" >Cancel</button>
    <button  variant="contained" color="error"autoFocus  onClick={()=>deleteClass()}>Delete</button>
    
      
    </DialogActions>
  </Dialog>
  </div>
  {/* end of delete class */}

  {/* Delete Subject */}
  <div>
    <Dialog
    open={sopen2}
    onClose={handleSclose2}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    className="Dialog"
  >
    
    <DialogTitle id="alert-dialog-title" className="DialogTitle">
        <b>
      {"Are you sure?"}
      </b>
    </DialogTitle>
  
    <DialogContent style={{color:"black"}}>
      <DialogContentText id="alert-dialog-description">
       Do you really want to delete this Subject? This process cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
    <button onClick={handleSclose2} variant="contained" >Cancel</button>
    <button  variant="contained" color="error"autoFocus onClick={()=>deleteSubject()}>Delete</button>
   </DialogActions>
  </Dialog>
  </div>

    <Grid container  className="Grid-container"> 
        <Grid item lg={2} >
        <Box className="box" >
        <Paper className="paper1">
           <Stack direction="column">
            <button onClick={() =>{handleButton("classes")}}>Classes</button>
            <br></br>
            <br></br>
            <button onClick={() =>{handleButton("subjects")}}>Subjects</button>
            </Stack>
        </Paper>
        </Box>
        </Grid>

        {button=="classes"?
         <Grid item lg={10}>
          {/* classes */}
         <Box >
         <Paper className="paper2">
         <Stack direction="column">
        <div>
         <div>
             <button className="button-style"onClick={handleClickOpen} >Add Class</button>
             </div>
             <div className="nosubmit"   >
                
           <input type="search" placeholder="Search..."
           onChange={(event)=>{handleClassSearch(event.target.value)}}>
          </input>
        
         </div>
         </div>
         <br></br>
         <TableContainer className="tableContainer">
         <Table className="Class-table">
             <TableHead className="Table-head">
             <Stack direction="row">
                 <TableCell className="Table-cell"><b>Class Name</b></TableCell>
                 <TableCell className="Table-cell"><b>Subjects</b></TableCell>
                 <TableCell className="Table-cell"><b>Delete</b></TableCell>
 
                 </Stack>
             </TableHead>
             <TableRow>
                     {classes?.length===0 ?
                       <TableCell style={{width:'100%'}} >  
                         <h5>No  Data Available!!!</h5>
                       </TableCell> :
                         classes?.map((itr,index) => (
                       <TableRow key={index}>          
                         <Stack  direction="row">
                           <TableCell className="Table-cell" >{itr.name}</TableCell> 
                          <TableCell className="Table-cell" >
                          
                            {itr.subjects?.map((sub,index)=>(
                             
                            <div className="Table-cell" type="index">
                              
                              {sub}
                              
                              </div> 
                               
                            ),
                            
                            ) 
                            
                            }
                             </TableCell>
                           <TableCell className="Table-cell">          
                             <button variant="contained" color="error" onClick={() =>{handleDelete(itr.code)}} >
                               <DeleteIcon/>
                             </button>
                           </TableCell>
                         </Stack>
                       </TableRow>
                     ),) }
                   </TableRow>
                  
         </Table>
         </TableContainer>
 

             </Stack>
            
         </Paper>
         </Box>
          </Grid>



        :
        <Grid item lg={10}>
        <Box >

          {/* Subjects */}
        <Paper className="paper2">
        <Stack direction="column">
       <div>
        <div>
            <button className="button-style"onClick={handleClickSopen}>Add Subject</button>
            </div>
            <div className="nosubmit"   >
               
          <input type="search" placeholder="Search..."
           onChange={(event)=>{handleSubjectSearch(event.target.value)}}>
            </input>
       
        </div>
        </div>
        <br></br>
        <TableContainer className="tableContainer">
        <Table className="Subject-table">
            <TableHead className="Table-head">
            <Stack direction="row">
                <TableCell className="Head-Table-cell">Name</TableCell>
                <TableCell className="Head-Table-cell">Credit</TableCell>
                <TableCell className="Head-Table-cell">Max Test Marks</TableCell>
                <TableCell className="Head-Table-cell">Max Exam Marks</TableCell>
                <TableCell className="Head-Table-cell">Class</TableCell>
                <TableCell className="Head-Table-cell">Update</TableCell>
                <TableCell className="Head-Table-cell">Delete </TableCell>
            </Stack>
            </TableHead>
            <TableRow>
                    {subjects1?.length===0 ?
                      <TableCell style={{width:'100%'}} >  
                        <h5>No  Data Available!!!</h5>
                      </TableCell> :
                        subjects1?.map((itr,index) => (
                      <TableRow key={index}>          
                        <Stack  direction="row">
                          <TableCell className="Table-cell" >{itr.subjectName}</TableCell> 
                          <TableCell className="Table-cell" >{itr.credits}</TableCell> 
                          <TableCell className="Table-cell" >{itr.maxTestMarks}</TableCell> 
                          <TableCell className="Table-cell" >{itr.maxExamMarks}</TableCell> 
                          <TableCell className="Table-cell" >{itr.classCode}</TableCell> 
                          <TableCell className="Table-cell">
                            <button variant="outlined" onClick={()=>handleSupdate(itr.subjectCode,itr)} >
                              <EditIcon/>  
                            </button>  
                          </TableCell>
                          <TableCell className="Table-cell">          
                            <button variant="contained" color="error" onClick={()=>handleSdelete(itr.subjectCode)}>
                              <DeleteIcon/>
                            </button>
                          </TableCell>
                        </Stack>
                      </TableRow>
                      
                    ),) }
                  </TableRow>
                  
        </Table>
        </TableContainer>
            </Stack>
        </Paper>
        </Box>
         </Grid>

        }

       
    </Grid>
    </Grid>
    </>
    )
}
export default ClassesAndSubjects;