// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { httpGet } from "../axios/axiosUtils"; // Ensure the correct import path
// import "../Styles/TrackAssessmentPage.css";

// const TrackAssessmentPage = () => {
//   const { trackId } = useParams();
//   const session = JSON.parse(localStorage.getItem("session"));
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const response = await httpGet(`http://localhost:8000/Quiz/GetTrackQuiz?jobId=${trackId}`, {
//           headers: { 'token': session.token }
//         });
//         console.log("Quiz fetched:", response); // Debug log
//         if (response && response.Questions) {
//           setQuestions(response.Questions);
//         } else {
//           console.error("Unexpected response structure:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching quiz:", error);
//       }
//     };

//     fetchQuiz();
//   }, [trackId]);

//   return (
//     <div className="track-assessment-page">
//       <h1>Track Assessment</h1>
//       <div className="quiz-container">
//         {questions.map((question, index) => (
//           <div key={question.id} className="question-block">
//             <h2>Question {index + 1}</h2>
//             <p>{question.questionText}</p>
//             <ul>
//               {question.options.map((option) => (
//                 <li key={option.id}>{option.optionText}</li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TrackAssessmentPage;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpGet } from "../axios/axiosUtils"; // Ensure the correct import path
import "../Styles/TrackAssessmentPage.css";

const TrackAssessmentPage = () => {
  const { trackId } = useParams();
  const session = JSON.parse(localStorage.getItem("session"));
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(null); // State to store the timer
  const [timeLeft, setTimeLeft] = useState(600); // Initial time (in seconds)
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Construct the URL with the jobId
        
        // Fetch the quiz data from the backend
        const response = await httpGet(`http://localhost:8000/Quiz/GetTrackQuiz?jobId=${trackId}`, {
            headers: { 'token': session.token }
             });
        console.log("Quiz fetched:", response); // Debug log

        if (response && response.Questions) {
          setQuestions(response.Questions);
          startTimer(); // Start the timer once questions are fetched
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [trackId]);

  // Function to start the timer
  const startTimer = () => {
    setTimer(
      setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000)
    );
  };

  // Function to handle quiz submission
  const handleSubmit = () => {
    // Clear the timer when submitting
    clearInterval(timer);
    setIsSubmitting(true);

    // Logic to handle submission (e.g., sending answers to backend)
    // Replace with your submission logic
    console.log("Submitting quiz...");
  };

  // Format time left for display
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="track-assessment-page">
      <h1>Track Assessment</h1>
      <div className="timer-container">
        Time Left: {formatTime(timeLeft)}
      </div>
      <div className="quiz-container">
        {questions.map((question, index) => (
          <div key={question.id} className="question-block">
            <h2>Question {index + 1}</h2>
            <p>{question.questionText}</p>
            <ul>
              {question.options.map((option) => (
                <li key={option.id}>{option.optionText}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {!isSubmitting && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}
      {isSubmitting && <p>Submitting quiz...</p>}
    </div>
  );
};

export default TrackAssessmentPage;
