// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import '../Styles/QuizGradePage.css';

// const QuizGradePage = () => {
//   const location = useLocation();
//   const { grade, totalQuestions } = location.state;

//   const pass = grade > totalQuestions / 2;

//   return (
//     <div className="quiz-grade-page">
//       <h1>Your Quiz Grade</h1>
//       <p>Your grade is: {grade}%</p>
//       {pass ? (
//         <p>Congratulations! You passed!</p>
//       ) : (
//         <p>Sorry, you did not pass. Better luck next time!</p>
//       )}
//     </div>
//   );
// };

// export default QuizGradePage;

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Styles/QuizGradePage.css';

const QuizGradePage = () => {
  const location = useLocation();
  const { grade, totalQuestions } = location.state;
  const navigate = useNavigate();

  const pass = grade > totalQuestions / 2;

  useEffect(() => {
    const timer = setTimeout(() => navigate('/quiz'), 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="quiz-grade-page">
      <h1>Your Quiz Grade</h1>
      <p>Your grade is: {grade} / {totalQuestions}</p>
      {pass ? (
        <p>Congratulations! You passed!</p>
      ) : (
        <p>Sorry, you did not pass. Better luck next time!</p>
      )}
    </div>
  );
};

export default QuizGradePage;

