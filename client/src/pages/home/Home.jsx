import { NavLink, useNavigate } from 'react-router-dom';
import './home.css';
import { useEffect } from 'react';


const Home = () => {
  const navigate = useNavigate()
  
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };


  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/signin'); 
  };
  useEffect(() => {
    if (!user) {
      navigate('/signin')
    }
  }, [navigate, user])
  return (
    <div className="home-container">
      <nav className="navbar">
        <NavLink to="/" exact activeClassName="active-link" className="nav-link">Home</NavLink>
        <div className="nav-right">
          <NavLink to="/profile" activeClassName="active-link" className="nav-link">Profile</NavLink>
          <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
        </div>
      </nav>
      <div className="content">
        <h1>Welcome, {user.name}!</h1>
        <p>Here is some random text to welcome you to the homepage. Enjoy exploring our application!</p>
      </div>
    </div>
  );
};

export default Home;
