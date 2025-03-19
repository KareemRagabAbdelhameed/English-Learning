import { Route, Routes } from "react-router-dom"
import HomePage from "./HomePage"
import Register from "./Pages/Register"
import Login from "./Pages/Login"
import AdminPage from "./Admin/AdminPage"

const App = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element = {<Register />} />
          <Route path="/login" element = {<Login />} />
          <Route path="/admin" element = {<AdminPage />} />
        </Routes>
    </div>
  )
}

export default App
