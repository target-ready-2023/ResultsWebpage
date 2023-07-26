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
  //for User Persona Selection
  const [userPersona, setUserPersona] = React.useState('');
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
    navigate('/classes+subjects')
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
  
   
  return (
    <>
     {/* < className="persona-drop-down"> */}
        <Box className="dd">
          <FormControl  className="label-persona" fullWidth variant="filled" sx={{ m: 1  }}>
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
        <MenuItem onClick={handleSchedule}>Exam Schedule</MenuItem>
      </Menu>
    </>
  );
};
export default SideNavigation;
