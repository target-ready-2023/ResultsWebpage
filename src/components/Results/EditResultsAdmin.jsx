import React from "react";
import "./EditResultsAdmin.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Grid,Button, Stack, Table,TableHead, TableCell ,TableRow,Dialog,DialogActions,DialogContent,DialogTitle, Typography} from "@mui/material";
import EditIcon  from '@mui/icons-material/Edit';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const EditResultsAdmin=()=>{
    const [testNames,setTestNames] =React.useState([]);
    const [result, setResult] =React.useState([]);
    const [test,setTest] =React.useState([]);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [displayStudent,setDisplayStudent] =React.useState([]);
    const navigate = useNavigate()

    React.useEffect(()=>{
        getStudents();
        getTestOrExam();
    },[]);

    const getStudents = async() =>{ 
    await axios.get('http://localhost:8080/student/v1/student/C4')
    .then(res => setDisplayStudent(res?.data))
    .catch(err => {console.log(err.message)})
    
     
}

    const getTestOrExam = async() =>{
        await axios.get('http://localhost:8080/schedule/v1/C4/all')
    .then(res => setTestNames(res?.data))
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
    const handleClickOpenAdd = () => {
        setOpenAdd(true);
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
        <Dialog open={openAdd} onClose={handleCloseAdd}>
            <DialogTitle>Add Result</DialogTitle>
            <DialogContent>

            </DialogContent>
            <DialogActions>
          <button onClick={handleCloseAdd}>Close</button>
          <button   >Add</button>
        </DialogActions>
        </Dialog>
        <Dialog open={openUpdate} onClose={handleCloseUpdate}>
            <DialogTitle>Update Result</DialogTitle>
            <DialogContent>

            </DialogContent>
            <DialogActions>
          <button onClick={handleCloseUpdate}>Close</button>
          <button   >Update</button>
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
                                        <Typography className="text1">Class:  4 </Typography>
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
                                {displayStudent?.map((student,index) =>(
                                <TableRow key={index}>
                                    <TableCell className="Table-cell">{student.rollNumber}</TableCell>
                                    <TableCell className="Table-cell">{student.name}</TableCell>
                                    <TableCell className="Table-cell">
                                     {   (result.length==0)?
                                     <button  className="table-button" onClick={handleClickOpenAdd}>Add</button>
                                     :
                                     <button  className="table-button" onClick={handleClickOpenUpdate}><EditIcon/></button>
                                     }
                                     </TableCell>
                                    <TableCell className="Table-cell"><Button className="table-button" onClick={handleClickOpenView}><VisibilityOutlinedIcon style={{ color: "black" }}/></Button></TableCell>
                                    </TableRow> 
                                ))}
                                {displayStudent?.map((student,index) =>(
                                <TableRow key={index}>
                                    <TableCell className="Table-cell">{student.rollNumber}</TableCell>
                                    <TableCell className="Table-cell">{student.name}</TableCell>
                                    <TableCell className="Table-cell">
                                     {   (result.length==0)?
                                     <button  className="table-button" onClick={handleClickOpenAdd}>Add</button>
                                     :
                                     <button  className="table-button" onClick={handleClickOpenUpdate}><EditIcon/></button>
                                     }
                                     </TableCell>
                                    <TableCell className="Table-cell"><Button className="table-button" onClick={handleClickOpenView}><VisibilityOutlinedIcon style={{ color: "black" }}/></Button></TableCell>
                                    </TableRow> 
                                ))}
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