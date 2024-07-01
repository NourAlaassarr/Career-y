import React from "react";
import { useParams, Link } from "react-router-dom";
import "../Styles/TrackDetailPage.css";

const TrackDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="track-detail-page">
      <h1>Track Detail</h1>
      <div className="assessment-link-container">
        <p>READY FOR ASSESSMENT!</p>
        {id === "1" ? (
          <div className="assessment-options">
            <Link
              to={`/track/${id}/assessment/option1`}
              className="assessment-link"
            >
              React
            </Link>
            <Link
              to={`/track/${id}/assessment/option2`}
              className="assessment-link"
            >
              Angular
            </Link>
            <Link
              to={`/track/${id}/assessment/option3`}
              className="assessment-link"
            >
              Vue
            </Link>
          </div>
        ) : (
          <Link to={`/track/${id}/assessment`} className="assessment-link">
            Go to Track Assessment
          </Link>
        )}
      </div>
      <div className="course-link-container">
        <p>OR TAKE A COURSE</p>
        <Link to={`/track/${id}/course`} className="course-link">
          Go to Track Course
        </Link>
      </div>
    </div>
  );
};

export default TrackDetailPage;
