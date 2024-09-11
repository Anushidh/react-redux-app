import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, reset } from "../../features/auth/authSlice.js"; 
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"

const Profile = () => {
  const dispatch = useDispatch();

 
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePicture: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });

  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profilePicture: null, 
      });
    }
  }, [user]);

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
    } else if (!/^[a-zA-Z]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only letters and no spaces";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
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
      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("email", formData.email);
      if (formData.profilePicture) {
        updatedData.append("profilePicture", formData.profilePicture);
      }
      console.log(updatedData);
      for (let [key, value] of updatedData.entries()) {
        console.log(key, value);
      }
      console.log(formData);
     
      dispatch(updateUser(updatedData));
      navigate('/')
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("Profile updated successfully!");
      dispatch(reset());
    }
    if (isError) {
      console.error(message);
      toast.error(message)
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  return (
    <section className="section-profile">
      <div className="profile-card">
        <img
          src={
            formData.profilePicture
              ? URL.createObjectURL(formData.profilePicture)
              : user?.profilePic || "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="profile-picture"
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
            <button className="btn-submit" type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
          <div className="form-control">
            <button
              className="btn-cancel"
              type="button"
              onClick={() => navigate("/home")} 
            >
              Cancel
            </button>
          </div>
          {isError && <div className="error-message">{message}</div>}
        </form>
      </div>
    </section>
  );
};

export default Profile;
