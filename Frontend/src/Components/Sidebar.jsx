import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo">
          <img src="./Logo1.png" alt="Logo" className="logo-image" />
        </div>
        <p className="company-name">
          CAREER<span style={{ color: "rgba(241, 193, 17, 1)" }}>-</span>Y
        </p>
        <div className="separator"></div>
      </div>
      <ListWithIcon />
    </div>
  );
};

const ListWithIcon = () => {
  const items = [
    "Roadmaps for your desired path",
    "Roadmaps matching your skills",
    "Online resources for you to complete your Roadmap",
    "Job interview questions to test yourself",
  ];

  return (
    <>
      <p className="slogan">
        Unsure of your future path? We can help you decide.
      </p>
      {items.map((text, index) => (
        <span className="span-with-icon" key={index}>
          <CheckCircleOutlineIcon
            sx={{ marginRight: "5px", alignSelf: "flex-start" }}
          />
          {text}
        </span>
      ))}
    </>
  );
};

export default Sidebar;
