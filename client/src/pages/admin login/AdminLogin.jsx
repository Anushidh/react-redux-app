import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { adminLogin, reset } from "../../features/admin/adminSlice.js";
import "./adminlogin.css";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });



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
        const action = await dispatch(adminLogin(user));
        // console.log(action)
        if (adminLogin.fulfilled.match(action)) {
          navigate("/dashboard");
        } else {
          toast.error(message);
        }
      } catch (error) {
        toast.error(error.message);
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
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="form-control">
            <label htmlFor="password">Password:</label>
            <div className="password-field">
              <input
                id="password"
                type={"password"}
                value={user.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <div className="form-control">
            <button className="btn-sign-in" type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
