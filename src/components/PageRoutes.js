import { Route, Routes } from "react-router-dom"
import Student from "./Student"
import Home from "./Home"
import About from "./About"
import Contact from "./Contact"
import NotFound from "./NotFound"
import ClassesAndSubjects from "./ClassesAndSubjects"
import ExamMainPage1 from "./ExamMainPage1"
import BasicTable from "./table/BasicTable"
import BasicTableStudent from "./table-student/Basictable"
import ExamMainPageStudent from "./ExamMainPageStudent"
import ExamMainPage from "./ExamMainPage"


const PageRoutes = () => {
    return (
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/student" element={<Student />} />
          <Route exact path="/classes+subjects" element={<ClassesAndSubjects />} />
          <Route exact path="/exampage" element={<ExamMainPage/>}/>
          <Route exact path="/exam" element={<ExamMainPage1 />} />
          <Route exact path="/examstudent" element={<ExamMainPageStudent />} />
          <Route path='*' element={<NotFound />}/>
        </Routes>
    )
  }
  export default PageRoutes