import { useDispatch } from 'react-redux';
import { adminBlockUser, adminUnblockUser } from '../features/admin/adminSlice.js'; 

export const COLUMNS = [
  {
    Header: 'No.', 
    Cell: ({ row }) => row.index + 1, 
  },
  // {
  //   Header: 'Id',
  //   accessor: '_id',
  // },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ row }) => {
      const dispatch = useDispatch();
      const { isBlocked, email } = row.original; 

      const handleButtonClick = () => {
        if (isBlocked) {
          dispatch(adminUnblockUser(email)); 
        } else {
          dispatch(adminBlockUser(email)); 
        }
      };

      return (
        <button
          className={`status-button ${isBlocked ? 'unblock' : 'block'}`}
          onClick={handleButtonClick}
        >
          {isBlocked ? 'Unblock' : 'Block'}
        </button>
      );
    },
  },
];
