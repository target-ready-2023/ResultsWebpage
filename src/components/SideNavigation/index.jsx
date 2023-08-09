import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "./index.css"
import { colors } from "@mui/material";
import swal from "sweetalert";

const SideNavigation = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate()
  const open = Boolean(anchorEl);
  //for User Persona Selection
  const [userPersona, setUserPersona] = React.useState('');
  window.sessionStorage.setItem("userPersona",userPersona);
  const handleUserPersonaChange = (event) => {
    // setSelectedOption(event.target.value);
    const value = event.target.value;
    setUserPersona(value);
    // onSelectionChange(value); 
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleHome = () => {
    
    navigate('/')
    handleClose()
  }
  const handleStudent = () => {
    navigate('/student')
    handleClose()
  }
  const handleClasses = () => {
    if(userPersona=="student"){
      swal({
        title: "Students have no access to this  page",
        icon: "error",
        button: "OK",
      });
      navigate('/')
    }
    else{
    navigate('/classes+subjects')
    handleClose()
    }
  }
  const handleExams=() => {
    navigate('/ExamMainPage')
    handleClose()
  }
  const handleSchedule = () => {
    if (userPersona=="student") {
      navigate('/schedule+student')
    }
    else {
    navigate('/schedule')}
    handleClose()
  }
  const handleResults=() => {
    navigate('/admin+result')
    handleClose()
  }
   
  return (
    <>
     {/* < className="persona-drop-down"> */}
        <Box className="dd">

          <FormControl  className="label-persona"   sx={{ m: 1, minWidth: 150 }} size="small">
            <InputLabel className="LabelName">User Persona</InputLabel>
            
              <Select  className="selectBox" value={userPersona} onChange={handleUserPersonaChange} >
                  <MenuItem className="menus" value="admin">Admin</MenuItem>
                  <MenuItem className="menus"  value="teacher">Teacher</MenuItem>
                  <MenuItem className="menus"  value="coordinator">Coordinator</MenuItem>
                  <MenuItem className="menus"  value="student">Student</MenuItem>
              </Select>
              
          </FormControl>
          </Box>
        
      <Button
        id="side-navigation"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleHome}>Home</MenuItem>
        <MenuItem onClick={handleStudent}>Student</MenuItem>
        <MenuItem onClick={handleClasses}>Classes and Subjects</MenuItem>
        <MenuItem onClick={handleExams}>Exam Main Page</MenuItem>
        {/* <MenuItem onClick={handleSchedule}>Exam Schedule</MenuItem>
        <MenuItem onClick={handleResults}>Exam Results</MenuItem> */}
      </Menu>
    </>
  );
};
export default SideNavigation;