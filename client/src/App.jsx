import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./pages/signup/Signup";
import Signin from "./pages/signin/Signin";
import Profile from "./pages/profile/Profile ";
import Home from "./pages/home/Home";
import AdminLogin from "./pages/admin login/AdminLogin";
import CreateUser from "./pages/createuser/CreateUser";
import AdminDashboard from "./pages/admin dashboard/AdminDashboard";
import NotFound from './pages/NotFound/NotFound'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/adminlogin",
    element: <AdminLogin />,
  },
  {
    path: "/createuser",
    element: <CreateUser />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

function App() {
  return (
    <div>
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
