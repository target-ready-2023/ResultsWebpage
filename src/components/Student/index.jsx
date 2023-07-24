import { Card } from "@mui/material"
import { useEffect } from "react";
import axios from "axios";

const Student = () => {
    const apiUrl = "http://localhost:8080/results/v1/student?roll_no=20"
    useEffect(() => {
        axios.get(apiUrl).then((response) => {
           console.log(response)
        });
      });
    return (
        <Card className="App-Card">
            <h3>Student</h3>

        </Card>
    )
}
export default Student;