//End point ver......

// import React from "react";
// import PropTypes from "prop-types";

// const Modal = ({ show, onClose, links, title, loading, error }) => {
//   if (!show) {
//     return null;
//   }

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h4>{title}</h4>
//         </div>
//         <div className="modal-body">
//           {loading ? (
//             <p>Loading...</p>
//           ) : error ? (
//             <p>{error}</p>
//           ) : (
//             <ul className="modal-links">
//               {links.map((link, index) => (
//                 <li key={index}>
//                   <a href={link.url} target="_blank" rel="noopener noreferrer">
//                     {link.text}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <button className="modal-close-button" onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// Modal.propTypes = {
//   show: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   links: PropTypes.arrayOf(
//     PropTypes.shape({
//       text: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   title: PropTypes.string.isRequired,
//   loading: PropTypes.bool.isRequired,
//   error: PropTypes.string.isRequired,
// };

// export default Modal;

import React from "react";
import PropTypes from "prop-types";

const Modal = ({ show, onClose, links, title }) => {
  if (!show) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "5px",
          maxWidth: "600px",
          width: "100%",
          border: "2px solid #0c8195",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h4 style={{ margin: 0 }}>{title}</h4>
        </div>
        <div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {links.map((link, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#0c8195",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#f1c111")}
                  onMouseOut={(e) => (e.target.style.color = "#0c8195")}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#0c8195",
            color: "white",
            border: "none",
            borderRadius: "25px",
            padding: "10px 20px",
            cursor: "pointer",
            alignSelf: "center",
            marginTop: "20px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f1c111")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0c8195")}
        >
          Close
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Modal;
