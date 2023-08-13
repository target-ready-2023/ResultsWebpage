import * as React from "react";
import "./Leaderboard.css"
import { FormControl, InputLabel, MenuItem, Select, Box, TableContainer } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axios from "axios";
  
  const columns = [
    { 
        field: "id",  
        headerAlign: "center",
        align: "center", 
        headerName: "Rank", 
        width: 100 
    },
    { 
      field: "name", 
      headerAlign: "center",
      align: "center", 
      headerName: "Name", 
      width: 200 
    },
    { 
      field: "aggregate", 
      headerAlign: "center",
      align: "center", 
      headerName: "Aggregate %", 
      width: 100 
  },
  ];

  const topperColumns =[
    {
      field: "id",  
        headerAlign: "center",
        align: "center", 
        headerName: "Class", 
        width: 100 
    },
    { 
      field: "name", 
      headerAlign: "center",
      align: "center", 
      headerName: "Name", 
      width: 200 
    },
    { 
      field: "aggregate", 
      headerAlign: "center",
      align: "center",
      headerName: "Aggregate %", 
      width: 100 },
  ]

  const Leaderboard = () => {
    const [classNameSelect, setClassNameSelect] = useState();
    const [classNameoptions, setClassNameOptions] = useState([]);
    const [yearSelect, setYearSelect] = useState('');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [toppersData, setToppersData] = useState([]);
    const [cVal, setCVal] = useState('');
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
    const [yearNotAvailableError, setYearNotAvailableError] = useState('');


  
    useEffect(() => {
      axios
        .get("http://localhost:8080/classes/v1/classes")
        .then((response) => {
          setClassNameOptions(response.data);
          // console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);
  
    const handleYearSelect = (event) => {
        const selectedYear = event.target.value;
        setSelectedAcademicYear(selectedYear);
        setYearSelect(selectedYear);
      };
  
    const handleClassNameSelect = (event) => {
      const selectedClass = classNameoptions.find(option => option.code === event.target.value);
      if (selectedClass) {
        setCVal(selectedClass.name);
      }
      setClassNameSelect(event.target.value);
    };

    useEffect(()=>{
      if(yearSelect){
        axios.get(`http://localhost:8080/results/v1/schoolToppers?academicYear=${yearSelect}`)
        .then((response)=>
        {
          // console.log(response.data)

          const updatedData = response.data.map((item) => ({
            id: item.classCode,
            name: item.name,
            aggregate: item.totalMarks
          }));
          setToppersData(updatedData);
          setYearNotAvailableError('');
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setToppersData([]); // Clear any existing toppersData
            setYearNotAvailableError('Year not available. Please select another year.');
          } else {
            console.log(error);
          }
      })
        }  }
    )
  
    useEffect(() => {
      if (cVal && yearSelect) {
        axios
          .get(`http://localhost:8080/results/v1/leaderboard?className=${cVal}&academicYear=${yearSelect}`)
        //   .then((response) => {
        //     setLeaderboardData(response.data);
        //     console.log(response.data);
        //   })
        .then((response) => {
            // Adding the rank field to the response data and updating the IDs
            const updatedData = response.data.map((item, index) => ({
              ...item,
              rank: index + 1,
              id: index + 1,
              name: item.name,
              // class: item.classCode,
              // year: selectedAcademicYear,
              aggregate: item.totalMarks,
               // Set ID as well
            }));
            setLeaderboardData(updatedData);
          // console.log(updatedData);
        })
          .catch((error) => {
            console.log(error);
          });
      }
    }, [cVal, yearSelect]);
  
    const getCurrentAcademicYear = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // Month is zero-based
      return currentMonth >= 6
        ? `${currentYear}-${currentYear + 1}`
        : `${currentYear - 1}-${currentYear}`;
    };
  
    const generateAcademicYears = () => {
      const currentAcademicYear = getCurrentAcademicYear();
      const years = currentAcademicYear.split("-").map(Number);
      const academicYears = [];
  
      for (let i = 0; i < 4; i++) {
        const startYear = years[0] - i;
        const endYear = years[1] - i;
        academicYears.push(`${startYear}-${endYear}`);
      }
  
      return academicYears;
    };
  
    const academicYears = generateAcademicYears();
  
    return (
      <div>
        <div className="container">
          <div className="heading">
            <h2>TOPPERS</h2>
          </div>
        </div>
  
        <div>
          <div className="lb-year-dd">
            <Box className="lb-box1">
              <FormControl fullWidth variant="filled">
                <InputLabel>YEAR</InputLabel>
                <Select
                  className="dropdown-class-main"
                  value={yearSelect}
                  onChange={handleYearSelect}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <p className="error-message">{yearNotAvailableError}</p>
            </Box>
          </div>
  
          <div className="lb-class-dd">
            <Box className="lb-box1">
              <FormControl fullWidth variant="filled">
                <InputLabel>CLASS</InputLabel>
                <Select
                  className="dropdown-class-main"
                  onChange={handleClassNameSelect}
                  value={classNameSelect}
                >
                  {classNameoptions.map((option) => (
                    <MenuItem key={option.name} value={option.code}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
  
        <div className="lb-table">

        {((yearSelect && !classNameSelect)) ? (
          <h3 className="message-heading">Top Students Of Each Class</h3>
        ) : null}

        {(yearSelect && !classNameSelect) || (!yearSelect && !classNameSelect) ? (
          <DataGrid
            rows={toppersData}
            columns={topperColumns}
            pageSize={5}
            autoHeight
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
          ) : (
            <><h3 className="message-heading">Leader Board</h3>
            <DataGrid
            rows={leaderboardData}
            columns={columns}
            pageSize={5}
            autoHeight
            hideFooter
            hideFooterPagination
            hideFooterSelectedRowCount
          />
          </>
          )}
        </div>
  
        <div className="footnote">
          <h1>WE ARE PROUD OF OUR ACHIEVERS !!</h1>
        </div>
      </div>
    );
  };
  
  export default Leaderboard;

  
  
  
  
  