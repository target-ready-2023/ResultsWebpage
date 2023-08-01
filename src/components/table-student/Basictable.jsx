import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import './Basictable.css';

const BasicTable = ({ handleClassNameSelect, classNameSelect }) => {
  const handleClick = () => {
    // Execute the handleClassNameSelect function to test it
    if (typeof handleClassNameSelect === "function") {
      handleClassNameSelect({ target: { value: classNameSelect } });
    } else {
      console.log("handleClassNameSelect is not a function");
    }

    // Print the current value of classNameSelect
    console.log("Current classNameSelect value:", classNameSelect);
    
  };
  const handleSubData = (rowData) => {
    
    const subData = rowData.subjectSchedule.map((subjectSchedule) => ({
      ...subjectSchedule,
      id: subjectSchedule.subjectCode,
    }))
    return subData;
    
  };

  const columns = [
    {
      field: "id",
      headerName: "Subject Code",
      headerAlign: "center",
      align: "center",
      width: "200",
    },
    {
      field: "subjectName",
      headerName: "Subject Name",
      headerAlign: "center",
      align: "center",
      width: "200",
    },
    {
      field: "date",
      headerName: "Date",
      headerAlign: "center",
      align: "center",
      width: "200",
    },
    {
      field: "time",
      headerName: "Time",
      headerAlign: "center",
      align: "center",
      width: "200",
    },
  ];

  const [rows, setRows] = useState([]);
  const [sCode, setSCode] = useState([]);

  const [subjectNames, setSubjectNames] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (classNameSelect) {
        try {
          const response = await axios.get(
            `http://localhost:8080/schedule/v1/${classNameSelect}/active`
          );
  
          const subjectCodes = response.data.map((item) =>
            item.subjectSchedule.map((subjectSchedule) => subjectSchedule.subjectCode)
          ).flat();
  
          const subjectPromises = subjectCodes.map((subjectCode) =>
            axios.get(`http://localhost:8080/subjects/v1/subject/${subjectCode}`)
          );

  
          const subjectResponses = await Promise.all(subjectPromises);
          
  
          const subjectNameMap = {};
          subjectResponses.forEach((subjectResponse, index) => {
            const subjectCode = subjectCodes[index];
            const subjectName = subjectResponse.data.subjectName;
            console.log(subjectName);
            subjectNameMap[subjectCode] = subjectName;
          });
  
          const modifiedData = [];
          response.data.forEach((item) => {
            item.subjectSchedule.forEach((subjectSchedule) => {
              modifiedData.push({
                id: subjectSchedule.subjectCode,
                date: subjectSchedule.date,
                time: subjectSchedule.time,
                subjectName: subjectNameMap[subjectSchedule.subjectCode],
              });
            });
          });
  
          setRows(modifiedData);
          setSCode(response.data.map((item) => item.scheduleCode));
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [classNameSelect]);
  return (
    <div className="content">
      {rows.length > 0 ? (
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
          autoHeight
          
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BasicTable;