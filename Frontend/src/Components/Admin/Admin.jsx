import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin2 = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const rows = [
    { id: 1, name: 'Add Quiz', path: '/admin-add-quiz' },
    { id: 2, name: 'Add Questions', path: '/admin-add-questions' },
    { id: 3, name: 'Get All Users', path: '/get-all-users' },
    { id: 4, name: 'Delete Users', path: '/delete-users' },
    { id: 5, name: 'Add Course', path: '/add-course' },
    { id: 6, name: 'Delete Course', path: '/delete-course' },
  ];

  return (
    <div>
      <h1>Admin Page</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>
                <button onClick={() => handleNavigation(row.path)}>Go to {row.name}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin2;
