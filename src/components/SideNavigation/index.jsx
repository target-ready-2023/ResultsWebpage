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

const SideNavigation = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate()
  const open = Boolean(anchorEl);
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
    navigate('/classes+subjects')
    handleClose()
  }
  const handleExamPage = () => {
    navigate('/exampage')
    handleClose()
  }
  const handleSchedule = () => {
    navigate('/exam')
    handleClose()
  }
  const handleScheduleStd = () => {
    navigate('/examstudent')
    handleClose()
  }
  
   //for User Persona Selection
   const [selectedOption, setSelectedOption] = React.useState('');
   const handleChange = (event) => {
     // setSelectedOption(event.target.value);
     const value = event.target.value;
     setSelectedOption(value);
     // onSelectionChange(value); 
   };
  return (
    <>
     {/* < className="persona-drop-down"> */}
        <Box className="dd">
          <FormControl  className="label" fullWidth variant="filled" sx={{ m: 1  }}>
            <InputLabel className="LabelName">User Persona</InputLabel>
              <Select  className="selectBox" value={selectedOption} onChange={handleChange} >
                  <MenuItem value={1}>Admin</MenuItem>
                  <MenuItem value={2}>Teacher</MenuItem>
                  <MenuItem value={3}>Coordinator</MenuItem>
                  <MenuItem value={4}>Student</MenuItem>
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
        <MenuItem onClick={handleExamPage}>Exam Main Page</MenuItem>
        <MenuItem onClick={handleSchedule}>Exam Schedule</MenuItem>
        <MenuItem onClick={handleScheduleStd}>Std Schedule</MenuItem>

      </Menu>
    </>
  );
};
export default SideNavigation;
