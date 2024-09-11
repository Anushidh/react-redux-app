import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../features/auth/authSlice.js'; 
import "./signup.css";

const Signup = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!user.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z]+$/.test(user.name)) {
      newErrors.name = "Name must contain only letters and no spaces";
    }

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!user.password.trim()) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!user.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
       const response =  await dispatch(register(user)).unwrap();
        console.log(response)
        navigate('/signin')
      } catch (error) {
        console.error('Error signing up:', message);
        toast.error(error.message)
      }
    }
  };

  return (
    <section className="section-sign-up">
      <div className="sign-up-card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={user.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
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
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={handleChange}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <div className="form-control">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              value={user.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          <div className="form-control">
            <button className="btn-sign-up" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
          <div className="more">
            <Link className="forget-password-link" to="#">
              Forget password
            </Link>
            <Link className="sign-in-link" to="/signin">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signup;
