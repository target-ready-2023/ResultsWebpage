import { TableHead } from "@mui/material";
import React from "react";

const AdminViewAllTestResults=()=>
{
return(
    <div>
        <Table>
            <TableHead>
            <TableRow>
                 <TableCell className="Head-Table-cell" rowSpan={2} >Student ID </TableCell>
                 <TableCell className="Head-Table-cell" rowSpan={2} >Student Name</TableCell>
                 <TableCell className="Head-Table-cell" colSpan={4} >Subjects </TableCell>
                 <TableCell className="Head-Table-cell" rowSpan={2} >FinalMarks</TableCell>
                 <TableCell className="Head-Table-cell" rowSpan={2} >Percentage</TableCell>
                 </TableRow>
                 <TableRow>
                 <TableCell className="Head-Table-cell"  >sub1 </TableCell>
                 <TableCell className="Head-Table-cell" >sub2</TableCell>
                 <TableCell className="Head-Table-cell"  >sub3 </TableCell>
                 <TableCell className="Head-Table-cell" >sub4</TableCell>
                 
                 </TableRow>
            </TableHead>
        </Table>
    </div>
)
}
export default AdminViewAllTestResults