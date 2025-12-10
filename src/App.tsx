import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Workout from "./pages/Workout";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workout/:workoutId" element={<Workout />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>

      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        closeButton={false}
        closeOnClick
      />
    </BrowserRouter>
  );
}

export default App;
