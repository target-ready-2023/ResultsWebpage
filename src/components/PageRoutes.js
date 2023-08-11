import { Route, Routes } from "react-router-dom"
import Student from "./Student"
import Home from "./Home"
import About from "./About"
import Contact from "./Contact"
import NotFound from "./NotFound"
import ClassesAndSubjects from "./ClassesAndSubjects"
import BasicTable from "./table/BasicTable"
import BasicTableStudent from "./table-student/Basictable"
import SchedulePage from "./SchedulePage"
import SchedulePageStudent from "./SchedulePageStudent"
import ExamMainPage from "./ExamMainPage"
import EditResultsAdmin from "./Results/EditResultsAdmin"
import Leaderboard from "./Results/Leaderboard"
import AdminViewAllResults from "./AdminViewAllResults"
import StudentViewResults from "./StudentViewResults"

const PageRoutes = () => {
    return (
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/student" element={<Student />} />
          <Route exact path="/classes+subjects" element={<ClassesAndSubjects />} />
          <Route exact path="/ExamMainPage" element={<ExamMainPage/>}/>
          <Route exact path="/schedule" element={<SchedulePage />} />
          <Route exact path="/schedule+student" element={<SchedulePageStudent />} />
          <Route exact path="/admin+result" element={<EditResultsAdmin/>} />
          <Route exact path="/leaderboard" element={<Leaderboard/>}/>
          <Route exact path="/admin+all" element={<AdminViewAllResults/>}/>
          <Route exact path="/student+results" element={<StudentViewResults/>}/>
          <Route path='*' element={<NotFound />}/>
         
        </Routes>
    )
  }
  export default PageRoutes