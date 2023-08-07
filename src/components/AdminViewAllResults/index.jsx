import React, { useState,useRef } from "react";
import "./index.css";
import { FormControl,MenuItem,Select,NativeSelect,InputLabel,Box,Table, TableRow,TableHead,TableCell, TableBody,Button, Grid, Stack} from "@mui/material";




const AdminViewAllResults=()=>
{
    const [classCode, setClassCode]=useState('');
    const [test,setTest]=useState("");
    const [year,setYear]=useState('');
    const [view,setView]=useState('');
    
   
   
    const handleClassNameSelect=(event)=>
    { 
      setClassCode(event.target.value);
    }
    const handleTestNameSelect=(event)=>
    {
      setTest(event.target.value);
    }
    const handleYearSelect=(event)=>
    {
      setYear(event.target.value);
    }
    const handleView=(str)=>
    {
      setView(str)
    }
    return(
    <div>
      <div className="top-part">
        <h3>RESULTS</h3>
      </div>
      <div>
       <Box >
        <Stack direction="row" justifyContent="space-between">
      <Box className="class-drop-down">
      <FormControl fullWidth variant="filled" sx={{ m: 1 }} >
               <InputLabel >Class Name</InputLabel>
               <Select onChange={handleClassNameSelect}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                </Select>
            </FormControl>
         </Box>
         <Box className="year-drop-down">
               <FormControl fullWidth variant="filled" >
               <InputLabel>Academic Year</InputLabel>
                <Select onChange={handleYearSelect}>
                    <MenuItem value={"2023-2024"}>2023-2024</MenuItem>
                    <MenuItem value={"2022-2023"}>2022-2023</MenuItem>
                    <MenuItem value={"2021-2022"}>2021-2022</MenuItem>
                    <MenuItem value={"2020-2021"}>2020-2021</MenuItem>
                    <MenuItem value={"2019-2020"}>2019-2020</MenuItem>
                    <MenuItem value={"2018-2019"}>2018-2019</MenuItem>
         
                </Select>
               </FormControl>
         </Box>
         <Box className="test-drop-down">
               <FormControl fullWidth variant="filled" >
               <InputLabel>Test/Exam Name</InputLabel>
               <Select  onChange={handleTestNameSelect}>
                    <MenuItem value={"Test 1"}>Test 1</MenuItem>
                    <MenuItem value={"Test 2"}>Test 2</MenuItem>
                    <MenuItem value={"Test 3"}>Test 3</MenuItem>
                    <MenuItem value={"Test 4"}>Test 4</MenuItem>
                    <MenuItem value={"Exam 1"}>Exam 1</MenuItem>
                    <MenuItem value={"Exam 2"}>Exam 2</MenuItem>
                </Select>
               </FormControl>
         </Box>
         <Box>
               <FormControl  variant="filled" >
               <Button variant="contained" className="view-button" onClick={()=>handleView("yes")} >view</Button>
               </FormControl>
         </Box>
         </Stack>
         </Box>
       {view==="yes"?
       <Box>
       <Table className="Results-table">
           <TableHead className="Table-head">
           <TableRow>
           <TableCell className="Head-Table-cell" rowSpan={2}  >Student ID</TableCell>
                 <TableCell className="Head-Table-cell" rowSpan={2} >Student Name</TableCell>
                 <TableCell className="Head-Table-cell" colSpan={2}>Subject1</TableCell>
                 <TableCell className="Head-Table-cell" colSpan={2}>Subject2</TableCell>
                 <TableCell className="Head-Table-cell" colSpan={2}>Subject3</TableCell>
                 <TableCell className="Head-Table-cell" rowSpan={2} >FinalMarks</TableCell>
                 <TableCell className="Head-Table-cell" rowSpan={2}>Percentage</TableCell>
           </TableRow>
           <TableRow>
             <TableCell className="Head-Table-cell">IM</TableCell>
               <TableCell className="Head-Table-cell">EM</TableCell>
               <TableCell className="Head-Table-cell">IM</TableCell>
               <TableCell className="Head-Table-cell">EM</TableCell>
               <TableCell className="Head-Table-cell">IM</TableCell>
               <TableCell className="Head-Table-cell">EM</TableCell>
               </TableRow>
           </TableHead>
           <TableBody>
           <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Ravi</TableCell>
              <TableCell>20</TableCell>
              <TableCell>75</TableCell>
              <TableCell>18</TableCell>
              <TableCell>60</TableCell>
              <TableCell>20</TableCell>
              <TableCell>75</TableCell>
              <TableCell>356</TableCell>
              <TableCell>89</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Krishna</TableCell>
              <TableCell>20</TableCell>
              <TableCell>75</TableCell>
              <TableCell>18</TableCell>
              <TableCell>60</TableCell>
              <TableCell>20</TableCell>
              <TableCell>75</TableCell>
              <TableCell>356</TableCell>
              <TableCell>89</TableCell>
            </TableRow>
           </TableBody>
       </Table>
       </Box>
       :
       <p>Note: select classname, testname, academic year to view test results</p>
       }
        

       </div>
    </div>
    )
    ;
}

export default AdminViewAllResults;