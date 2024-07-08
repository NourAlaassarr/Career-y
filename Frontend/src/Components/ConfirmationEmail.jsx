import React from 'react';
import '../Styles/ConfirmationEmail.css';

const VerifiedMessage = () => {
    return (
        <div className="message-box">
            <div className="message-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                    <path d="M10 15L7 12L8.4 10.6L10 12.2L15.6 6.6L17 8L10 15Z" fill="white"/>
                </svg>
            </div>
            <h1>Verified!</h1>
            <p>You have successfully verified account.</p>
            <button className="ok-button">Ok</button>
        </div>
    );
}

export default VerifiedMessage;
