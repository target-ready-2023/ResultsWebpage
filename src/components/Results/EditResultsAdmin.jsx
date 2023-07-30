import React from "react";
import "./EditResultsAdmin.css";
import { useNavigate } from 'react-router-dom';
import { Box, Grid,Button, Paper,Select,MenuItem,Table, Divider,TableHead, TableCell ,TableRow,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle, Typography, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon  from '@mui/icons-material/Edit';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteIcon  from '@mui/icons-material/Delete';
import { Input } from "@mui/base";
import Stack from '@mui/material/Stack';
import { Height } from "@mui/icons-material";

const EditResultsAdmin=()=>{
    const [students, setStudents] = React.useState([]);
    const [result, setResult] =React.useState([]);
    const [testName,setTestName] =React.useState([]);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [studentsPerPage, setStudentsPerPage] = React.useState(7);
    const[currentPage,setCurrentPage] = React.useState(1);
    const lastIndex = currentPage * studentsPerPage;
    const firstIndex = lastIndex - studentsPerPage;
    const currentStudents = students && students.slice(firstIndex,lastIndex);
    const totalPages = Math.ceil(students?.length/studentsPerPage);
    const navigate = useNavigate()

    // React.useEffect=()=>{
    //     axios.get('')
    //     .then(result=>setStudents(result))
    //     .catch(error=> {console.log(error.message)})
    // }

    const OpenAllResults=()=>{
        navigate('/student+scchedule')
    }
    const OpenLeaderboard=()=>{
        navigate('/Leaderboard')
    }
    const handleTestNameChange=(event)=>{
        setTestName(event.target.value);
        console.log(testName);
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

     const PreviousPage= (event) =>{
        if(currentPage>1){
          setCurrentPage(currentPage-1);
        }
    }
    const NextPage = (event) =>{
      if(currentPage<totalPages){
      if(currentPage < currentPage+1){
        setCurrentPage(currentPage+1);
      }
    }
    }
     
    
  
    return(
        <>
        {/* Add Result */}
        <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="sm">
            <DialogTitle>Add Result</DialogTitle>
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
                            <Table>
                                <TableRow className="table-row1">
                                    <Typography className="text1">Class: &nbsp; &nbsp;
                                        <select id="test" className="select" value={testName} onChange={handleTestNameChange}>
                                        <option className="text4" disabled selected value="">--select--</option>
                                        <option className="text3" value="test1">1</option>
                                        <option className="text3" value="test2">2</option>
                                        </select>
                                    </Typography>
                                        <TableCell><button className="button-design" onClick={OpenAllResults}>View all results</button></TableCell>
                                        <TableCell width="1%"><button className="button-design" onClick={OpenLeaderboard}>Leaderboard</button></TableCell>
                                        
                                </TableRow>
                                <TableRow className="table-row1">
                                    <Typography className="text2">Test/Exam: &nbsp; &nbsp;
                                    <select id="test" className="select" value={testName} onChange={handleTestNameChange}>
                                        <option className="text4" disabled selected value="">--select--</option>
                                        <option className="text3" value="test1">Test1</option>
                                        <option className="text3" value="test2">Test2</option>
                                    </select>
                                    </Typography>
                                    <TableCell></TableCell>
                                    <TableCell width="1%"><input type="search" placeholder="Search..."/></TableCell>
                                </TableRow>
                            </Table>
                        </div>
                        </Stack>
                        <Stack>
                        <div className="div-table">
                            <Table className="Class-table">
                                <TableHead className="Table-head">
                                    
                                        <TableCell className="Head-Table-cell">Student ID</TableCell>
                                        <TableCell className="Head-Table-cell">Student Name</TableCell>
                                        <TableCell className="Head-Table-cell">Add/Update</TableCell>
                                        <TableCell className="Head-Table-cell">View</TableCell>
                                    
                                </TableHead>
                                {/* {(currentStudents?.map((students,index) =>(
                                <TableRow key={index}>
                                    <TableCell className="Table-cell">{students.studentId}</TableCell>
                                    <TableCell className="Table-cell">{students.studentName}</TableCell>
                                    <TableCell className="Table-cell">
                                     {   (result.length==0)?
                                     <button  className="table-button" onClick={handleClickOpenAdd}>Add</button>
                                     :
                                     <button  className="table-button" onClick={handleClickOpenUpdate}><EditIcon/></button>
                                     }
                                     </TableCell>
                                    <TableCell className="Table-cell"><Button className="table-button" onClick={handleClickOpenView}><VisibilityOutlinedIcon style={{ color: "black" }}/></Button></TableCell>
                                    </TableRow> 
                                )))} */}
                                <TableRow>
                                    <TableCell className="Table-cell">1</TableCell>
                                    <TableCell className="Table-cell">Jhon</TableCell>
                                    <TableCell className="Table-cell">
                                     {   (result.length==0)?
                                     <button  className="table-button" onClick={handleClickOpenAdd}>Add</button>
                                     :
                                     <button  className="table-button" onClick={handleClickOpenUpdate}><EditIcon/></button>
                                     }
                                     </TableCell>
                                    <TableCell className="Table-cell"><Button className="table-button" onClick={handleClickOpenView}><VisibilityOutlinedIcon style={{ color: "black" }}/></Button></TableCell>
                                    </TableRow> 
                            </Table>
                            <div className="page-design">
                                  {students?.length===0 ?
                                  <div style={{ float: "right" }}>
                                    <Button onClick={PreviousPage}>Prev</Button>
                                    Page {totalPages} 
                                    <Button onClick={NextPage}>Next</Button></div>
                                  :<div style={{ float: "right" }}>
                                    <Button onClick={PreviousPage}>Prev</Button>
                                    Page {currentPage} 
                                    <Button onClick={NextPage}>Next</Button></div>}
                                    </div>
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