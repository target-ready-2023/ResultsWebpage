import { Route, Routes } from "react-router-dom"
import Student from "./Student"
import Home from "./Home"
import About from "./About"
import Contact from "./Contact"
import ClassesAndSubjects from "./ClassesAndSubjects"
import NotFound from "./NotFound"


const PageRoutes = () => {
    return (
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/student" element={<Student />} />
          <Route exact path="/classes+subjects" element={<ClassesAndSubjects />} />

          <Route path='*' element={<NotFound />}/>
        </Routes>
    )
  }
  export default PageRoutes