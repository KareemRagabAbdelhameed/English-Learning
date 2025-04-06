import { Route, Routes } from "react-router-dom"
import HomePage from "./HomePage"
import Register from "./Pages/Register"
import Login from "./Pages/Login"
import AdminPage from "./Admin/AdminPage"
import GradePage from "./Pages/GradePage"
import VerifyAccount from "./validation/VerifyAccount"

const App = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element = {<Register />} />
          <Route path="/login" element = {<Login />} />
          <Route path="/admin" element = {<AdminPage />} />
          <Route path="/verify-account" element = {<VerifyAccount />} />
          <Route path="/grade/:gradeId" element={<GradePage />} />
        </Routes>
    </div>
  )
}

export default App
