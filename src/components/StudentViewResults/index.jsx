import React, { useState, useRef } from "react";
import "./index.css";
import {
  FormControl,
  MenuItem,
  Select,
  NativeSelect,
  InputLabel,
  Box,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Button,
  Grid,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";

const StudentViewResults = () => {
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [year, setYear] = useState("");
  const [view, setView] = useState("");
  const [classNameoptions, setClassNameOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [studentRollNo, setStudentRollNo] = useState("");
  const [classAcademiYears, setClassAcademicYears] = useState([]);
  const [disableStudent, setDisableStudent] = useState(true);
  const [disableAcYear, setDisableAcYear] = useState(true);
  const [subjects, setSubjects] = useState("");
  const [results, setResults] = useState([]);
  const [maxMarksTest, setMaxMarksTest] = useState([]);
  const [maxMarksExam, setMaxMarksExam] = useState([]);
  const [testExamNames, setTestExamNames] = useState([]);
  const [testType, setTestType] = useState([]);
  let studRN = "";
  let classNameSelect = "";
  let academicYear = "";
  let classCodeSelect = "";
  let resultsR = "";
  let scheduleCodes = "";

  const [classError, setClassError] = useState("");
  const [rollNoError, setRollNoError] = useState("");
  const [yearError, setYearError] = useState("");
  //Class Name Options fetching
  useEffect(() => {
    axios
      .get("http://localhost:8080/classes/v1/classes")
      .then((response) => {
        setClassNameOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [classNameoptions]);

  const getStudentbyClassCode = (classCode) => {
    console.log("Class Code : " + classCode);
    axios
      .get(`http://localhost:8080/student/v1/student/${classCode}`)
      .then((response) => {
        console.log("response : ", response.data);
        setStudentOptions(response.data);
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  const getAcademicYears = (classCode) => {
    axios
      .get(`http://localhost:8080/schedule/v1/${classCode}/acYears`)
      .then((response) => {
        setClassAcademicYears(response.data);
        console.log("acYear : " + response.data);
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  const getMaxMarks = (classCodeSelect) => {
    axios
      .get(`http://localhost:8080/subjects/v1/subject/class/${classCodeSelect}`)
      .then((response) => {
        console.log(" marks : ", response.data);
        const data = response.data;
        const maxTestMarksArray = data.map((item) => item.maxTestMarks);
        const maxExamMarksArray = data.map((item) => item.maxExamMarks);
        console.log("Max test : ", maxTestMarksArray);
        console.log("Max exam : ", maxExamMarksArray);
        setMaxMarksTest(maxTestMarksArray);
        setMaxMarksExam(maxExamMarksArray);
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  const getScheduleNames = () => {
    scheduleCodes = Array.from(
      new Set(resultsR.map((result) => result.scheduleCode))
    );

    getTestorExamNames();
  };

  const getTestorExamNames = () => {
    //  setTestType([])
    // setTestExamNames([])
    let tempTestExamNames = [];
    let tempTestType = [];
    for (let i = 0; i < scheduleCodes.length; i++) {
      axios
        .get(`http://localhost:8080/schedule/v1/${scheduleCodes[i]}`)
        .then((response) => {
          const name = response.data;

          tempTestExamNames.push(name.scheduleName);
          tempTestType.push(name.scheduleType);

          if (i === scheduleCodes.length - 1) {
            setTestExamNames(tempTestExamNames);
            setTestType(tempTestType);
          }
        })
        .catch((error) => {
          console.error("Error ", error);
        });
    }
  };

  const getSubjectsByClassCode = (classCode) => {
    axios
      .get(`http://localhost:8080/classes/v1/classes/${classCode}`)
      .then((res) => {
        console.log("Subjects : ", res.data.subjects);
        setSubjects(res.data.subjects);
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };
  const getResults = () => {
    axios
      .get(
        `http://localhost:8080/results/v1/student?rollNumber=${studentRollNo}&className=${className}&academicYear=${year}`
      )
      .then((res) => {
        console.log("Res ", res.data);
        setResults(res.data);
        console.log("Results : ", results);
        resultsR = res.data;
        getScheduleNames();
      })
      .catch((error) => {
        console.log("Error ", error);
      });
  };
  const handleClassNameSelect = (event) => {
    classCodeSelect = event.target.value;
    setClassCode(event.target.value);
    classNameSelect = classNameoptions.find(
      (item) => item.code === classCodeSelect
    );
    classNameSelect = classNameSelect.name;
    console.log("code ", classNameSelect);
    getStudentbyClassCode(classCodeSelect);
    getAcademicYears(classCodeSelect);
    getSubjectsByClassCode(classCodeSelect);
    getMaxMarks(classCodeSelect);
    setClassName(classNameSelect);

    setDisableStudent(false);
    setDisableAcYear(false);
  };
  const handleStudentRollNo = (event) => {
    setStudentRollNo(event.target.value);
    console.log("value ", studentRollNo);
    studRN = event.target.value;
    console.log("let : ", studRN);
  };
  const handleYearSelect = (event) => {
    setYear(event.target.value);
    academicYear = event.target.value;
    console.log("let : ", academicYear);
  };

  const validateClass = () => {
    if (classCode === "") {
      setClassError("Please select a class");
      return true;
    } else {
      setClassError("");
      return false;
    }
  };
  const validateYear = () => {
    if (year === "") {
      setYearError("Please select a year");
      return true;
    } else {
      setYearError("");
      return false;
    }
  };
  const validateRollNo = () => {
    if (studentRollNo === "") {
      setRollNoError("Please select a roll number");
      return true;
    } else {
      setRollNoError("");
      return false;
    }
  };

  const handleView = () => {
    const classNameValidation = validateClass();
    const yearValidation = validateYear();
    const RollNoValidation = validateRollNo();
    console.log(
      "class : ",
      classNameValidation,
      " year : ",
      yearValidation,
      " roll no ",
      RollNoValidation
    );

    if (classNameValidation || yearValidation || RollNoValidation) {
      if (
        classNameValidation === yearValidation &&
        yearValidation === RollNoValidation
      ) {
        setClassError(
          "Please select class, roll number and accademic year to view results"
        );
        setYearError("");
        setRollNoError("");
      } else if (
        classNameValidation === RollNoValidation &&
        classNameValidation === true
      ) {
        setClassError("Please select class and roll number");
        setRollNoError("");
      } else if (
        yearValidation === RollNoValidation &&
        yearValidation === true
      ) {
        setYearError("Please select roll number and accademic year");
        setRollNoError("");
      }
    } else {
      getResults();
      setView("yes");
    }
  };
  return (
    <div>
      <div className="top-part">
        <h2>RESULTS</h2>
      </div>

      <div className="drop-downs-block">
        <Box className="drop-down">
          <FormControl sx={{ m: 1 }}>
            <InputLabel style={{color:"black"}}>Class Name</InputLabel>
            <Select value={classCode} onChange={handleClassNameSelect} className="resultdrop-down">
              {classNameoptions.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className="drop-down">
          <FormControl  sx={{ m: 1 }}>
            <InputLabel style={{color:"black"}}>Roll No</InputLabel>
            <Select
              disabled={disableStudent}
              value={studentRollNo}
              onChange={handleStudentRollNo}
              className="resultdrop-down"
            >
              {studentOptions?.map((option, id) => (
                <MenuItem key={id} value={option.rollNumber}>
                  {option.rollNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className="drop-down">
          <FormControl sx={{ m: 1 }}>
            <InputLabel style={{color:"black"}}>Academic Year</InputLabel>
            <Select
            className="resultdrop-down"
              value={year}
              onChange={handleYearSelect}
              disabled={disableAcYear}
            >
              {classAcademiYears.map((years, index) => (
                <MenuItem value={years}>{years}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <div className="view-results-button">
          <FormControl  >
            <button variant="contained" onClick={handleView} className="view-buttonresult"  >
              view
            </button>
          </FormControl>
        </div>
      </div>

      <div>
        <div>
          {classError && <span style={{ color: "red" }}>{classError}</span>}
        </div>
        <div>
          {yearError && <span style={{ color: "red" }}>{yearError}</span>}
        </div>
        <div>
          {rollNoError && <span style={{ color: "red" }}>{rollNoError}</span>}
        </div>
      </div>
      
      <div>
        {view === "yes" ? (
          <div className="student-results-table">
            <Box>
              <Table className="Results-table">
                <TableHead className="Table-head">
                  <TableRow>
                    <TableCell className="Head-Table-cell" rowSpan={2}>
                      Test/Exam Name
                    </TableCell>
                    {subjects?.map((sub, index) => (
                      <TableCell className="Head-Table-cell" colSpan={2}>
                        {sub}
                      </TableCell>
                    ))}
                    <TableCell className="Head-Table-cell" rowSpan={2}>
                      Total
                    </TableCell>
                    <TableCell className="Head-Table-cell" rowSpan={2}>
                      Percentage
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {subjects.map((subject, index) => (
                      <React.Fragment key={index}>
                        <TableCell className="Head-Table-cell">
                          Obtained Marks
                        </TableCell>
                        <TableCell className="Head-Table-cell">
                          Max Marks
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result, i) => (
                    <TableRow>
                      <TableCell>{testExamNames.at(i)}</TableCell>
                      {result.marksList.map((mark, index) => (
                        <React.Fragment key={index}>
                          <TableCell>
                            {testType[i] === "Test"
                              ? mark.internalMarks
                              : mark.externalMarks}
                          </TableCell>

                          <TableCell>
                            {testType[i] === "Test"
                              ? maxMarksTest[index]
                              : maxMarksExam[index]}
                          </TableCell>
                        </React.Fragment>
                      ))}
                      <TableCell>{result.totalMarks}</TableCell>
                      <TableCell>{result.totalPercentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default StudentViewResults;
