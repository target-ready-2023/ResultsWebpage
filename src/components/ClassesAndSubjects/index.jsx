import { Box, Grid, Paper,Select,Button, Stack, Table, Divider,TableHead, TableCell ,TableRow,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon  from '@mui/icons-material/Edit'
import DeleteIcon  from '@mui/icons-material/Delete'


import React, { useState } from "react";

const ClassesAndSubjects = () => {
    const[classes,setClasses]=new useState([])
    const [page, setPage] = React.useState(0);
    const [usersPerPage, setUsersPerPage] = React.useState(7);
    const[currentPage,setCurrentPage] = React.useState(1);
    const lastIndex = currentPage * usersPerPage;
    const firstIndex = lastIndex - usersPerPage;
    const classesPerPage = classes && classes.slice(firstIndex,lastIndex);
    const totalPages = Math.ceil(classes?.length/usersPerPage);
    const [button,setButton]=useState("classes");
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [sopen, setSopen] = React.useState(false);
    const [sopen1, setSopen1] = React.useState(false);
    const [sopen2, setSopen2] = React.useState(false);



    const handleButton=(str)=>{
      setButton(str);
      console.log(button);

    }

    const handleClickOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };

    const handleClickOpen1 = () => {
   
      setOpen1(true);
    };
    
    const handleClose1 = () => {
      setOpen1(false);
    };

    const handleClickOpen2 = () => {
   
      setOpen2(true);
    };
    
    const handleClose2 = () => {
      setOpen2(false);
    };

    const handleUpdate=()=>{
      setOpen1(true);
    
  }

  const handleDelete=()=>{
    setOpen2(true);
  }


  const handleClickSopen = () => {
    setSopen(true);
  };
  
  const handleSclose = () => {
    setSopen(false);
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

  const handleSupdate=()=>{
    setSopen1(true);
  
}

const handleSdelete=()=>{
  setSopen2(true);
}
    


    return (
       <>
      <div >
      <Dialog open={open} onClose={handleClose} className="Dialog" >
     
        <DialogTitle className="DialogTitle">New Class</DialogTitle>
       
        <DialogContent>
          <div>
         
                    <label className="input-label"> Class Name </label>
                  
                  <input className="input"
                  >

                   </input>
                  
        
          </div>

        </DialogContent>
        <DialogActions>
        
          <button onClick={handleClose}>Close</button>
          <button   >Add</button>
         
        </DialogActions>
      </Dialog>
    </div>

   
    <div >
      <Dialog open={sopen} onClose={handleSclose} className="Dialog" >
     
        <DialogTitle className="DialogTitle">New Subject</DialogTitle>
       
        <DialogContent>
          <div>
                  
                  <label className="input-label"> Name </label>
                  <input className="input"></input>
                  <br/>
                  <label className="input-label"> Credit </label>
                  <input className="input"></input>
                   <br />
                  <label className="input-label"> Class </label>
                  <select className="select"></select>
        
          </div>

        </DialogContent>
        <DialogActions>
        
          <button onClick={handleSclose}>Close</button>
          <button   >Add</button>
         
        </DialogActions>
      </Dialog>
    </div>

    <div >
      <Dialog open={open1} onClose={handleClose1} className="Dialog">
      
        <DialogTitle className="DialogTitle"><b>Update Class</b></DialogTitle>
  
        <DialogContent>
         
    
        
          <div>
          
                    <label className="input-label" > Class Name </label>
                  
                  <input 
                 className="input"
              
                  ></input>
                  
          </div>

      
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose1} >Close</button>
          <button   >Update</button>
         
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
                  
                    <input className="input">

                    </input>
                    <br></br>
                    <label className="input-label" >Credit</label>
                  
                  <input 
                 className="input"
              
                  ></input>
                  <br></br>
                  <label className="input-label" > Class</label>
                  
                 <select className="select"></select>
        
          </div>

      
        </DialogContent>
        <DialogActions>
          <button onClick={handleSclose1} >Close</button>
          <button   >Update</button>
         
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
    <button  variant="contained" color="error"autoFocus >Delete</button>
    
      
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
    <button  variant="contained" color="error"autoFocus >Delete</button>
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
         <Box >
         <Paper className="paper2">
         <Stack direction="column">
        <div>
         <div>
             <button className="button-style"onClick={handleClickOpen} >Add Class</button>
             </div>
             <div className="nosubmit"   >
                
           <input type="search" placeholder="Search..."/>
        
         </div>
         </div>
         <br></br>
         <Table className="Class-table">
             <TableHead className="Table-head">
             <Stack direction="row">
                 <TableCell className="Head-Table-cell">Class Code</TableCell>
                 <TableCell className="Head-Table-cell">Class Name</TableCell>
                 <TableCell className="Head-Table-cell">Subjects</TableCell>
                 <TableCell className="Head-Table-cell">Update</TableCell>
                 <TableCell className="Head-Table-cell">Delete</TableCell>
 
                 </Stack>
             </TableHead>
             {/* <TableRow>
                     {classes?.length===0 ?
                       <TableCell style={{width:'100%'}} >  
                         <h5>No  Data Available!!!</h5>
                       </TableCell> :
                         classesPerPage?.map((itr,index) => (
                       <TableRow key={index}>          
                         <Stack  direction="row">
                           <TableCell className="Table-cell" >{}</TableCell>
                           <TableCell className="Table-cell" >{}</TableCell> 
                           <TableCell className="Table-cell" >{}</TableCell> 
                           <TableCell className="Table-cell" >{}</TableCell> 
                           <TableCell className="Table-cell" >{}</TableCell>
                           <TableCell className="Table-cell">{}</TableCell>  
                           <TableCell className="Table-cell">
                             <button variant="outlined" s>
                               <EditIcon/>  
                             </button>  
                           </TableCell>
                           <TableCell className="Table-cell">          
                             <button variant="contained" color="error" >
                               <DeleteIcon/>
                             </button>
                           </TableCell>
                         </Stack>
                       </TableRow>
                     ),) }
                   </TableRow> */}
                   <TableRow>          
                         <Stack  direction="row">
                           <TableCell className="Table-cell" >C1</TableCell>
                           <TableCell className="Table-cell" >1</TableCell> 
                           <TableCell className="Table-cell" >
                        
                            Maths
                            <Divider style={{border:"0px"}}/>
                            Science
                            <Divider style={{border:"0px"}} />
                            English
                           </TableCell> 
                          
                           <TableCell className="Table-cell">
                             <button onClick={() =>{handleUpdate()}} >
                               <EditIcon/>  
                             </button>  
                           </TableCell>
                           <TableCell className="Table-cell">          
                             <button onClick={() =>{handleDelete()}}  >
                               <DeleteIcon/>
                             </button>
                           </TableCell>
                         </Stack>
                       </TableRow>
         </Table>
 
 
 
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
               
          <input type="search" placeholder="Search..."/>
       
        </div>
        </div>
        <br></br>
        <Table className="Subject-table">
            <TableHead className="Table-head">
            <Stack direction="row">
                <TableCell className="Head-Table-cell">Subject Code</TableCell>
                <TableCell className="Head-Table-cell">Name</TableCell>
                <TableCell className="Head-Table-cell">Credit</TableCell>
                <TableCell className="Head-Table-cell">Class</TableCell>
                <TableCell className="Head-Table-cell">Update</TableCell>
                <TableCell className="Head-Table-cell">Delete </TableCell>
            </Stack>
            </TableHead>
            {/* <TableRow>
                    {classes?.length===0 ?
                      <TableCell style={{width:'100%'}} >  
                        <h5>No  Data Available!!!</h5>
                      </TableCell> :
                        classesPerPage?.map((itr,index) => (
                      <TableRow key={index}>          
                        <Stack  direction="row">
                          <TableCell className="Table-cell" >{}</TableCell>
                          <TableCell className="Table-cell" >{}</TableCell> 
                          <TableCell className="Table-cell" >{}</TableCell> 
                          <TableCell className="Table-cell" >{}</TableCell> 
                          <TableCell className="Table-cell" >{}</TableCell>
                          <TableCell className="Table-cell">{}</TableCell>  
                          <TableCell className="Table-cell">
                            <button variant="outlined" s>
                              <EditIcon/>  
                            </button>  
                          </TableCell>
                          <TableCell className="Table-cell">          
                            <button variant="contained" color="error" >
                              <DeleteIcon/>
                            </button>
                          </TableCell>
                        </Stack>
                      </TableRow>
                      
                    ),) }
                  </TableRow> */}
                  <TableRow>          
                         <Stack  direction="row">
                         <TableCell className="Table-cell">SPh7</TableCell>
                           <TableCell className="Table-cell">Physics</TableCell> 
                           <TableCell className="Table-cell">3</TableCell> 
                           <TableCell className="Table-cell">7</TableCell> 
                           <TableCell className="Table-cell">
                             <button onClick={() =>{handleSupdate()}} >
                               <EditIcon/>  
                             </button>  
                           </TableCell>
                           <TableCell className="Table-cell">          
                             <button onClick={() =>{handleSdelete()}}  >
                               <DeleteIcon/>
                             </button>
                           </TableCell>
                         </Stack>
                       </TableRow>
        </Table>



            </Stack>
        </Paper>
        </Box>
         </Grid>

        }

       
    </Grid>
    </>
    )
}
export default ClassesAndSubjects;