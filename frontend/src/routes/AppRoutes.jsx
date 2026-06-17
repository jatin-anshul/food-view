import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserRegister from '../pages/UserRegister'
import UserLogin from '../pages/UserLogin'
import FoodPartnerRegister from '../pages/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/FoodPartnerLogin'
import Home from '../pages/general/Home'
import Saved from '../pages/general/Saved'
import Search from '../pages/general/Search'
import Profile from '../pages/food-partner/Profile'
import CreateFood from "../pages/food-partner/CreateFood";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<UserRegister />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/food-partner/:id" element={<Profile />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes