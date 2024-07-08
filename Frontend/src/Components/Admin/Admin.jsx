import React from "react";
import { useNavigate } from "react-router-dom";
import "./../../Styles/AdminPage.css"; // Import the new CSS file

const Admin = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const rows = [
    { id: 1, name: "Add Quiz", path: "/add-quiz" },
    { id: 2, name: "Add Questions", path: "/add-questions" },
    { id: 3, name: "Get All Users", path: "/get-all-users" },
    { id: 4, name: "Delete Users", path: "/delete-users" },
    { id: 5, name: "Add Course", path: "/add-course" },
    { id: 6, name: "Delete Course", path: "/delete-course" },
    { id: 7, name: "Update Resource", path: "/update-resourse" },
    { id: 8, name: "Add Job Offer", path: "/add-job-offer" },
    { id: 9, name: "Add Skill To Roadmap", path: "/add-skill-to-roadmap" },
    {
      id: 10,
      name: "Delete Skill From Roadmap",
      path: "/delete-skill-from-roadmap",
    },
    { id: 11, name: "Delete Job Offer", path: "/delete-job-offer" },
    { id: 12, name: "Update Job Offer", path: "/update-job-offer" },
    { id: 13, name: "Update Course", path: "/update-course" },
    { id: 14, name: "Approve Course", path: "/approve-course" },
  ];

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Page</h1>
      <table className="admin-table">
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
                <button
                  className="admin-button"
                  onClick={() => handleNavigation(row.path)}
                >
                  Go to {row.name}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
