import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { adminLogout } from '../../features/admin/adminSlice.js'; 
import UserTable from '../../components/UserTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/adminlogin')
  };
  const handleCreateUser = () => {
    navigate('/createuser')
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="dashboard-actions">
          <button className="action-button" onClick={handleCreateUser}>Create User</button>
          <button className="action-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="user-table-container">
        <UserTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
