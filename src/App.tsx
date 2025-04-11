import { Route, Routes } from "react-router-dom"
import HomePage from "./HomePage"
import Register from "./Pages/Register"
import Login from "./Pages/Login"
import AdminPage from "./Admin/AdminPage"
import GradePage from "./Pages/GradePage"
import VerifyAccount from "./validation/VerifyAccount"
import { UserProvider } from "./context/Context"
import ProfilePage from "./Pages/ProfilePage"
import ContactPage from "./Pages/Contact"

const App = () => {
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element = {<Register />} />
          <Route path="/login" element = {<Login />} />
          <Route path="/contact" element = {<ContactPage />} />
          <Route path="/admin" element = {<AdminPage />} />
          <Route path="/verify-account" element = {<VerifyAccount />} />
          <Route path="/grade/:gradeId" element={<GradePage />} />
          <Route path="/profile" element = {<ProfilePage />} />
        </Routes>
        </UserProvider>
    </div>
  )
}

export default App
