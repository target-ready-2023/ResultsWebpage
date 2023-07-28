import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import "./index.css"
import Stack from '@mui/material/Stack';
import DeleteIcon from "@mui/icons-material/Delete";
import "./index.jsx"

 function DltPop() {
    const [anchor, setAnchor] = React.useState(null);

    const handleClick = (event) => {
      setAnchor(event.currentTarget);
    };

   const handleConfirmClick = (event) => {
        
   };

  return (
    <div>
        <Button variant="outlined" startIcon={<DeleteIcon /> } onClick={handleClick}>
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
        <Button className="dlt-button" variant="contained" onClick={handleClick}> Confirm
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