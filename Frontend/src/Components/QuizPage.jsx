import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { httpGet } from '../axios/axiosUtils'; // Ensure the correct import path
import '../Styles/QuizPage.css';

// Import your quiz images

import CSSLogo from '../../images/SkillsLogo/CSS.png';
import JavaScriptLogo from '../../images/SkillsLogo/JavaScript.png';
import ReactLogo from '../../images/SkillsLogo/React Native.png';
import NetworkingLogo from '../../images/SkillsLogo/Networking_Android.png';
import SecurityTestingLogo from '../../images/SkillsLogo/Security Testing.png';
import CloudSecurityLogo from '../../images/SkillsLogo/Cloud Security.png';
import CSharpLogo from '../../images/SkillsLogo/Csharp.png';
import PHPLogo from '../../images/SkillsLogo/PHP.png';
import RubyLogo from '../../images/SkillsLogo/Ruby.png';
import JavaLogo from '../../images/SkillsLogo/Java.png';
import PythonLogo from '../../images/SkillsLogo/Python.png';
import PostgreSQLLogo from '../../images/SkillsLogo/PostgreSQL.png';
import MySQLLogo from '../../images/SkillsLogo/mysql.png';
import MariaDBLogo from '../../images/SkillsLogo/MariaDB.png';
import MSSQLLogo from '../../images/SkillsLogo/mysql.png';
import OracleLogo from '../../images/SkillsLogo/oracle.png';
import RESTLogo from '../../images/SkillsLogo/REST.png';
import JSONAPILogo from '../../images/SkillsLogo/JSON APIs.png';
import SOAPLogo from '../../images/SkillsLogo/SOAP.png';
import GRPCLogo from '../../images/SkillsLogo/gRPC.png';
import GraphQLLogo from '../../images/SkillsLogo/GraphQL.png';
import ASPNETCoreLogo from '../../images/SkillsLogo/ASP.NET Core.png';
import FlaskLogo from '../../images/SkillsLogo/Flask.png';
import HibernateLogo from '../../images/SkillsLogo/Hibernate.png';
import KoaJSLogo from '../../images/SkillsLogo/Koa.js.png';
import LaravelLogo from '../../images/SkillsLogo/laravel.png';
import NestJSLogo from '../../images/SkillsLogo/NestJS.png';
import PhoenixLogo from '../../images/SkillsLogo/Phoenix.png';
import RubyOnRailsLogo from '../../images/SkillsLogo/Ruby on Rails.png';
import NodeJSLogo from '../../images/SkillsLogo/Node.js.png';
import GameDevelopmentFCLogo from '../../images/SkillsLogo/Node.js.png';
import ReactNativeFCLogo from '../../images/SkillsLogo/React Native.png';
import SecurityLogo from '../../images/SkillsLogo/Security Testing.png';
import TestingLogo from '../../images/SkillsLogo/Testing_Android.png';
import CyberSecurityLogo from '../../images/SkillsLogo/Networking_Cyber Security.png';
import OperatingSystemsLogo from '../../images/SkillsLogo/Operating Systems.png';
import MathLogo from '../../images/SkillsLogo/Math.png';
import GamePhysicsLogo from '../../images/SkillsLogo/Game Physics.png';
import ComputerGraphicsLogo from '../../images/SkillsLogo/Computer Graphics.png';
import MachineLearningLogo from '../../images/SkillsLogo/Machine Learning.png';
import AnimationLogo from '../../images/SkillsLogo/Animation.png';
import ExcelLogo from '../../images/SkillsLogo/Excel.png';
import TableauLogo from '../../images/SkillsLogo/Tableau.png';
import PowerBILogo from '../../images/SkillsLogo/Power BI.png';
import SQLLogo from '../../images/SkillsLogo/SQL.png';
import DataCleaningLogo from '../../images/SkillsLogo/Data Cleaning.png';
import DataCollectionLogo from '../../images/SkillsLogo/Data Collection.png';
import DescriptiveAnalysisLogo from '../../images/SkillsLogo/Descriptive Analysis.png';
import DataVisualizationLogo from '../../images/SkillsLogo/Data Visualization.png';
import StatisticalAnalysisLogo from '../../images/SkillsLogo/Statistical Analysis.png';
import BigDataLogo from '../../images/SkillsLogo/Big Data.png';
import KotlinLogo from '../../images/SkillsLogo/Kotlin.png';
import GitHubLogo from '../../images/SkillsLogo/GitHub.png';
import ArchitectureAndDesignPatternsLogo from '../../images/SkillsLogo/Architecture and Design Patterns.png';
import GitLogo from '../../images/SkillsLogo/Git.png';
import MathematicsMLLogo from '../../images/SkillsLogo/Mathematics for Machine Learning Specialization.png';
import StatisticsMLLogo from '../../images/SkillsLogo/statistics for Machine Learning Specialization.png';
import EconometricsLogo from '../../images/SkillsLogo/Econometrics.png';
import ExploratoryDataAnalysisLogo from '../../images/SkillsLogo/exploratory data analysis.png';
import DeepLearningLogo from '../../images/SkillsLogo/Deep learning.png';
import MLOpsLogo from '../../images/SkillsLogo/MLOps.png';
import BasicsSoftwareTestingFCLogo from '../../images/SkillsLogo/Security Testing.png';
import SDLCModelsLogo from '../../images/SkillsLogo/SDLC Models.png';
import ManualTestingLogo from '../../images/SkillsLogo/QA Manual Testing.png';
import AutomatedTestingLogo from '../../images/SkillsLogo/Automated Testing.png';
import NonFunctionalTestingLogo from '../../images/SkillsLogo/Non Functional Testing.png';
import EmailTestingLogo from '../../images/SkillsLogo/Email Testing.png';
import HeadlessTestingLogo from '../../images/SkillsLogo/Headless Testing.png';
import DataScienceFCLogo from '../../images/SkillsLogo/Headless Testing.png';
import HTMLLogo from '../../images/SkillsLogo/HTML.png';
import VueLogo from '../../images/SkillsLogo/vue.png';
import AngularLogo from '../../images/SkillsLogo/Angular.png';
import CLogo from '../../images/SkillsLogo/C.png';

// Mapping quiz names to their respective images
const quizImageMap = {
  'css': CSSLogo,
  'javascript': JavaScriptLogo,
  'react': ReactLogo,
  'networking': NetworkingLogo,
  'security testing': SecurityTestingLogo,
  'cloud security': CloudSecurityLogo,
  'c#': CSharpLogo,
  'php': PHPLogo,
  'ruby': RubyLogo,
  'java': JavaLogo,
  'python': PythonLogo,
  'postgresql': PostgreSQLLogo,
  'mysql': MySQLLogo,
  'mariadb': MariaDBLogo,
  'ms sql': MSSQLLogo,
  'oracle': OracleLogo,
  'rest': RESTLogo,
  'json apis': JSONAPILogo,
  'soap': SOAPLogo,
  'grpc': GRPCLogo,
  'graphql': GraphQLLogo,
  'asp.net core': ASPNETCoreLogo,
  'flask': FlaskLogo,
  'hibernate': HibernateLogo,
  'koa.js': KoaJSLogo,
  'laravel': LaravelLogo,
  'nestjs': NestJSLogo,
  'phoenix': PhoenixLogo,
  'ruby on rails': RubyOnRailsLogo,
  'nodejs': NodeJSLogo,
  'game development fc': GameDevelopmentFCLogo,
  'react native fc': ReactNativeFCLogo,
  'security': SecurityLogo,
  'testing': TestingLogo,
  'cyber security': CyberSecurityLogo,
  'operating systems': OperatingSystemsLogo,
  'math': MathLogo,
  'game physics': GamePhysicsLogo,
  'computer graphics': ComputerGraphicsLogo,
  'machine learning': MachineLearningLogo,
  'animation': AnimationLogo,
  'excel': ExcelLogo,
  'tableau': TableauLogo,
  'power bi': PowerBILogo,
  'sql': SQLLogo,
  'data cleaning': DataCleaningLogo,
  'data collection': DataCollectionLogo,
  'descriptive analysis': DescriptiveAnalysisLogo,
  'data visualization': DataVisualizationLogo,
  'statistical analysis': StatisticalAnalysisLogo,
  'big data': BigDataLogo,
  'kotlin': KotlinLogo,
  'github': GitHubLogo,
  'architecture and design patterns': ArchitectureAndDesignPatternsLogo,
  'git': GitLogo,
  'mathematics ml': MathematicsMLLogo,
  'statistics ml': StatisticsMLLogo,
  'econometrics': EconometricsLogo,
  'exploratory data analysis': ExploratoryDataAnalysisLogo,
  'deep learning': DeepLearningLogo,
  'mlops': MLOpsLogo,
  'basics software testing fc': BasicsSoftwareTestingFCLogo,
  'sdlc models': SDLCModelsLogo,
  'manual testing': ManualTestingLogo,
  'automated testing': AutomatedTestingLogo,
  'non functional testing': NonFunctionalTestingLogo,
  'email testing': EmailTestingLogo,
  'headless testing': HeadlessTestingLogo,
  'data science fc': DataScienceFCLogo,
  'html': HTMLLogo,
  'vue': VueLogo,
  'angular': AngularLogo,
  'c': CLogo,
};


const QuizPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await httpGet('/Quiz/AllQuizzes');
        console.log('Quizzes fetched:', response); // Debug log
        if (response && response.Quizzes) {
          setQuizzes(response.Quizzes);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuizImage = (quizName) => {
    return quizImageMap[quizName.toLowerCase()] || null; // Assuming you have a quizImageMap defined somewhere
  };

  return (
    <div className="quiz-page">
      <input
        type="text"
        placeholder="Search for quizzes..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="instruction-text">
        CHOOSE THE QUIZ TO START
      </div>
      <div className="quizzes-container">
        {filteredQuizzes.map((quiz) => (
          <Link key={quiz.id} to={`/quiz/${quiz.id}`} className="quiz-link">
            <img src={getQuizImage(quiz.name)} alt={`${quiz.name} logo`} className="quiz-logo" />
            <span>{quiz.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;