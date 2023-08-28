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
        headerClassName:"leaderboard-head",
        align: "center", 
        headerName: "Rank", 
        width: 240 
    },
    { 
      field: "name", 
      headerAlign: "center",
      headerClassName:"leaderboard-head",
      align: "center", 
      headerName: "Name", 
      width: 340 
    },
    { 
      field: "aggregate", 
      headerAlign: "center",
      headerClassName:"leaderboard-head",
      align: "center", 
      headerName: "Aggregate %", 
      width: 285
  },
  ];

  const topperColumns =[
    {
      field: "id",  
        headerAlign: "center",
        headerClassName:"leaderboard-head",
        align: "center", 
        headerName: "Class", 
        width: 240 
    },
    { 
      field: "name", 
      headerAlign: "center",
      headerClassName:"leaderboard-head",
      align: "center", 
      headerName: "Name", 
      width: 340 
    },
    { 
      field: "aggregate", 
      headerAlign: "center",
      headerClassName:"leaderboard-head",
      align: "center",
      headerName: "Aggregate %", 
      width: 285
    },
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
    const [classDropdownDisabled, setClassDropdownDisabled] = useState(true);
    const [classDropdownErrorMessage, setClassDropdownErrorMessage] = useState('');
    const customLocaleText = {
      noRowsLabel: 'Select a YEAR to view our students who aced their year !',
      // Add other customized text here if needed
  };

  
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
      setClassDropdownDisabled(false); // Enable the class dropdown
      setClassDropdownErrorMessage(''); // Clear the error message
      };
  
    const handleClassNameSelect = (event) => {
      if (!yearSelect) {
        setClassDropdownErrorMessage('Please select a year first.'); // Set the error message
       } else {
        const selectedClass = classNameoptions.find(option => option.code === event.target.value);
        if (selectedClass) {
            setCVal(selectedClass.name);
        }
        setClassNameSelect(event.target.value);
        setClassDropdownErrorMessage(''); // Clear the error message
    }
    };

    useEffect(()=>{
      if(yearSelect){
        axios.get(`http://localhost:8080/results/v1/schoolToppers?academicYear=${yearSelect}`)
        .then((response)=>
        {
          // console.log(response.data)

          const updatedData = response.data.map((item) => ({
            id: item.className,
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
      <>

          <div className="heading">
            <h2>TOPPERS</h2>
          </div>
  
        <div className="dds">
          <div className="lb-year-dd">
            {/* <Box className="lb-box1"> */}
              <FormControl >
                <InputLabel className="year-label">Year</InputLabel>
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
              {/* <p className="error-message">{yearNotAvailableError}</p> */}
            {/* </Box> */}
          </div>

  
          <div className="lb-class-dd">
            {/* <Box className="lb-box1"> */}
              <FormControl >
                <InputLabel className="class-label">Class</InputLabel>
                <Select
                  className="dropdown-class-main"
                  onChange={handleClassNameSelect}
                  value={classNameSelect}
                  disabled={classDropdownDisabled} // Disable the dropdown if classDropdownDisabled is true
                  >
                  {classNameoptions.map((option) => (
                      <MenuItem key={option.name} value={option.code}>
                          {option.name}
                      </MenuItem>
                  ))}
                </Select>

              </FormControl>
            {/* </Box> */}
          </div>
        </div>
  
        <div className="error">
          <p className="error-message">{yearNotAvailableError}</p>
          {/* <p className="error-message">{classDropdownErrorMessage}</p>  */}
          {!yearSelect && (
              <p className="direction-message">Please select a year first</p>
          )}
         
            { yearSelect && !yearNotAvailableError && !classNameSelect ? 
            (<p className="direction-message">Select CLASS to see the Leaderboard</p>)
          : null }
          
        </div>

        <div className="lb-table">

              {((yearSelect && !classNameSelect)) ? (
                <h3 className="message-heading">Top Students Of Each Class</h3>
              ) : null}

              {(yearSelect && !classNameSelect) || (!yearSelect && !classNameSelect) ? (
                <DataGrid
                className="dt1"
                  rows={toppersData}
                  columns={topperColumns}
                  pageSize={5}
                  autoHeight={false}
                  hideFooter
                  height={200}
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  localeText={customLocaleText}
                />
                ) : (
                  <><h3 className="message-heading">Leader Board</h3>
                  <DataGrid
                  className="dt1"
                  rows={leaderboardData}
                  columns={columns}
                  pageSize={5}
                  // height={200}
                  // autoHeight={false}
                  hideFooter
                  hideFooterPagination
                  hideFooterSelectedRowCount
                />
                </>
                )}
        </div>
  
        <div className="footnote">
          <h1 className="msg">WE ARE PROUD OF OUR ACHIEVERS !!</h1>
        </div>
      </>
    );
  };
  
  export default Leaderboard;

  
  
  
  
  