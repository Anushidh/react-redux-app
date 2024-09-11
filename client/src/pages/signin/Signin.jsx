import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../features/auth/authSlice.js";
import "./signin.css";

const Signin = () => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };


  const validate = () => {
    const newErrors = {};

  
    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email address is invalid";
    }

  
    if (!user.password.trim()) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (/\s/.test(user.password)) {
      newErrors.password = "Password should not contain spaces";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
       
        const action = await dispatch(login(user));

        if (login.fulfilled.match(action)) {
          
          console.log("Login successful");
          navigate("/");
        } 
        else if(login.rejected.match(action)) {
          console.log(action.payload)
          const errorMessage = action.payload || "An error occurred during sign in"; 
          console.error("Error signing in:", errorMessage);
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };


  
  return (
    <section className="section-sign-in">
      <div className="sign-in-card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>
          <div className="form-control">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          <div className="form-control">
            <button className="btn-sign-in" type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
          <div className="more">
            <Link className="forgot-password-link" to="/adminlogin">
              Admin Sign In
            </Link>
            <Link className="sign-up-link" to="/signup">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signin;
