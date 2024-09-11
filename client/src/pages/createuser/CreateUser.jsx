import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../features/admin/adminSlice.js";
import "./createuser.css";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        [id]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (
      formData.profilePicture &&
      !["image/jpeg", "image/png"].includes(formData.profilePicture.type)
    ) {
      newErrors.profilePicture = "Profile picture must be a JPEG or PNG image";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const newUser = new FormData();
      newUser.append("name", formData.name);
      newUser.append("email", formData.email);
      newUser.append("password", formData.password);
      if (formData.profilePicture) {
        newUser.append("profilePicture", formData.profilePicture);
      }

      dispatch(createUser(newUser))
        .unwrap()
        .then(() => {
         
          navigate("/dashboard");
        })
        .catch((error) => {
      
          console.error("Error creating user:", error.message);
          
        });
    }
  };

  return (
    <section className="section-profile">
      <div className="profile-card">
        <img
          src={
            formData.profilePicture
              ? URL.createObjectURL(formData.profilePicture)
              : "https://via.placeholder.com/150"
          }
          alt="Profile Preview"
          className="profile-preview"
        />
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          <div className="form-control">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          <div className="form-control">
            <label htmlFor="profilePicture">Profile Picture:</label>
            <input
              id="profilePicture"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleChange}
            />
            {errors.profilePicture && (
              <div className="error-message">{errors.profilePicture}</div>
            )}
          </div>
          <div className="form-control">
            <button className="btn-submit" type="submit">
              Create User
            </button>
          </div>
          <div className="form-control">
            <button
              className="btn-cancel"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateUser;
