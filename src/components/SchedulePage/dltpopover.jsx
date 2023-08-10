import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import "./index.css"
import Stack from '@mui/material/Stack';
import DeleteIcon from "@mui/icons-material/Delete";
import "./index.jsx"
import BasicTable from '../table/BasicTable';
import axios from 'axios';

 function DltPop({ scheduleCode, onDelete }) {
    const [anchor, setAnchor] = React.useState(null);
    const [schedule, setSchedule] = React.useState([]);

    const handleClick = (event) => {
      setAnchor(event.currentTarget);
    };
 

   const handleConfirmClick = (event) => {
    const deleteUrl = `http://localhost:8080/schedule/v1/${scheduleCode}`;
    console.log(scheduleCode);
    // Make the axios.delete call to delete the schedule
    axios
      .delete(deleteUrl)
      .then((response) => {
        console.log(response)
        // If deletion is successful, update the schedule state by removing the deleted row
        setSchedule((prevSchedule) =>
          prevSchedule.filter((item) => item.scheduleCode !== scheduleCode)
        );
        onDelete(scheduleCode);
        // Close the popover
        setAnchor(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }
    

  return (
    <div className='delete'>
        <Button variant="outlined" startIcon={<DeleteIcon /> } onClick={handleClick} className='gridDelete'>
                Delete
        </Button>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={()=>setAnchor(null)}
        anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'down',
            horizontal: 'right',
            }}
      >
        <Typography sx={{ p: 2 }}> 
        <h4>
            Are you sure want to delete this schedule?
            <br></br>
            This cannot be undone!
        </h4>
        <Stack spacing={2} direction="row">
        <Button className="dlt-button" variant="contained" onClick={handleConfirmClick}> Confirm
       </Button>
       <Button className="dlt-button" variant="outlined" onClick={()=>setAnchor(null)}> Cancel
       </Button>
        </Stack>
        
        </Typography>
      </Popover>
    </div>
  );

}

export default DltPop;