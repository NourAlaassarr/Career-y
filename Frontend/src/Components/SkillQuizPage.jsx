// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import '../style/SkillQuizPage.css'; // Ensure you have the appropriate styles

// const SkillQuizPage = () => {
//   const { skillId } = useParams(); // Make sure to use skillId from URL parameters
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [grade, setGrade] = useState(null);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/Quiz/Quiz?SkillId=${skillId}`);
//         const data = await response.json();
//         console.log('Questions fetched:', data); // Debug log
//         if (data && data.Questions) {
//           setQuestions(data.Questions);
//         } else {
//           console.error('Unexpected response structure:', data);
//         }
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//       }
//     };

//     fetchQuestions();
//   }, [skillId]);

//   const handleOptionChange = (questionIndex, option) => {
//     setAnswers({
//       ...answers,
//       [questionIndex]: option
//     });
//   };

//   const handleNextQuestion = () => {
//     setCurrentQuestionIndex(currentQuestionIndex + 1);
//   };

//   const handlePreviousQuestion = () => {
//     setCurrentQuestionIndex(currentQuestionIndex - 1);
//   };

//   const handleSubmit = () => {
//     const correctAnswers = questions.map(q => q.correctAnswer);
//     let score = 0;
//     correctAnswers.forEach((answer, index) => {
//       if (answers[index] === answer) {
//         score += 1;
//       }
//     });
//     const calculatedGrade = (score / questions.length) * 100;
//     setGrade(calculatedGrade);
//     navigate(`/quiz/${skillId}/grade`, { state: { grade: calculatedGrade } });
//   };

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className="skill-quiz-page">
//       <h1>LET'S START</h1>
//       {currentQuestion ? (
//         <div className="question-container">
//           <h2>{currentQuestion.questionText}</h2>
//           <div className="options">
//             {currentQuestion.options.map(option => (
//               <label key={option.id}>
//                 <input
//                   type="radio"
//                   name={`question-${currentQuestionIndex}`}
//                   value={option.optionText}
//                   checked={answers[currentQuestionIndex] === option.optionText}
//                   onChange={() => handleOptionChange(currentQuestionIndex, option.optionText)}
//                 />
//                 {option.optionText}
//               </label>
//             ))}
//           </div>
//           <div className="navigation-buttons">
//             {currentQuestionIndex > 0 && (
//               <button onClick={handlePreviousQuestion}>Previous</button>
//             )}
//             {currentQuestionIndex < questions.length - 1 && (
//               <button onClick={handleNextQuestion}>Next</button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <p>Loading questions...</p>
//       )}
//       {currentQuestionIndex === questions.length - 1 && (
//         <button className="submit-button" onClick={handleSubmit}>
//           Submit
//         </button>
//       )}
//       {grade !== null && (
//         <div className="grade-container">
//           <p>Your Grade: {grade}%</p>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/SkillQuizPage.css"; // Ensure you have the appropriate styles
import { httpGet } from "../axios/axiosUtils"; // Assuming your service file is named httpService.js

const SkillQuizPage = () => {
  const { skillId } = useParams(); // Make sure to use skillId from URL parameters
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await httpGet(`Quiz/Quiz?SkillId=${skillId}`);
        console.log("Questions fetched:", data); // Debug log
        if (data && data.Questions) {
          setQuizName(data.QuizName || "Quiz");
          setQuestions(data.Questions);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [skillId]);

  const handleOptionChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmit = () => {
    const correctAnswers = questions.map((q) => q.correctAnswer);
    let score = 0;
    correctAnswers.forEach((answer, index) => {
      if (answers[questions[index].id] === answer) {
        score += 1;
      }
    });
    const calculatedGrade = (score / questions.length) * 100;
    setGrade(calculatedGrade);
    navigate(`/quiz/${skillId}/grade`, { state: { grade: calculatedGrade } });
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="skill-quiz-page">
      <h1>{quizName}</h1>
      {currentQuestion ? (
        <div className="question-container">
          <h2>{currentQuestion.questionText}</h2>
          <div className="options">
            {currentQuestion.options.map((option) => (
              <label key={option.id}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() =>
                    handleOptionChange(currentQuestion.id, option.id)
                  }
                />
                {option.optionText}
              </label>
            ))}
          </div>
          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
              <button onClick={handlePreviousQuestion}>Previous</button>
            )}
            {currentQuestionIndex < questions.length - 1 && (
              <button onClick={handleNextQuestion}>Next</button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading questionsddddds...</p>
      )}
      {currentQuestionIndex === questions.length - 1 && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      )}
      {grade !== null && (
        <div className="grade-container">
          <p>Your Grade: {grade}%</p>
        </div>
      )}
    </div>
  );
};

export default SkillQuizPage;
