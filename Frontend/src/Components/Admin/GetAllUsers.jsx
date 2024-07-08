import React, { useState } from 'react';
import { httpGet } from "../../axios/axiosUtils";
//import '../Styles/GetAllUsers.css';

const GetAllUsers = () => {
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const session = JSON.parse(sessionStorage.getItem("session"));

    

    const handleError = (error) => {
        if (error.response) {
            setMessage('Error: ' + (error.response.data.message || error.message));
        } else if (error.request) {
            setMessage('Error: No response from server.');
        } else {
            setMessage('Error: ' + error.message);
        }
    };

    const getAllUsers = async () => {
        try {
            const response = await httpGet('Admin/GetAllUsers', { headers: { 'token': session.token } });
            console.log('Response:', response); // Debugging line to check the full response
            setUsers(response);
            console.log('Fetched Users:', response); // Debugging line to check the fetched data
            setShowUsers(true); // Set the flag to true after fetching users
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div>
            <h1>All Users</h1>
            <button onClick={getAllUsers}>Get All Users</button>
            {showUsers && users.length > 0 && (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <p><strong>Username:</strong> {user.UserName}</p>
                            <p><strong>Email:</strong> {user.Email}</p>
                            
                        </li>
                    ))}
                </ul>
            )}
            {showUsers && users.length === 0 && (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default GetAllUsers;