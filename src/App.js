import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Client from "./pages/Client";
import Admin from "./pages/Admin";
import Portfolio from "./pages/Portfolio";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgetPassword";
import AdminPortfolio from "./pages/AdminPortfolio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
<Route path="/admin/portfolio" element={<AdminPortfolio />} />
        <Route path="/" element={<Login />} />
        <Route path="/client" element={<Client />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
