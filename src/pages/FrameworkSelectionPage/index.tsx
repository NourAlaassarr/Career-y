import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { httpGet } from "../../axios/axiosUtils"; // Ensure the correct import path
import { Box, Typography } from "@mui/material";
import ReactLogo from "../../../images/SkillsLogo/React Native.png";
import VueLogo from "../../../images/SkillsLogo/vue.png";
import AngularLogo from "../../../images/SkillsLogo/Angular.png";
import PythonLogo from "../../../images/SkillsLogo/Python.png";
import NodeJSLogo from "../../../images/SkillsLogo/Node.js.png";
import RubyLogo from "../../../images/SkillsLogo/Ruby.png";
import PhoenixLogo from "../../../images/SkillsLogo/Phoenix.png";
import NestJSLogo from "../../../images/SkillsLogo/NestJS.png";
import LaravelLogo from "../../../images/SkillsLogo/laravel.png";
import KoaJSLogo from "../../../images/SkillsLogo/Koa.js.png";
import HibernateLogo from "../../../images/SkillsLogo/Hibernate.png";
import FlaskLogo from "../../../images/SkillsLogo/Flask.png";
import * as S from "./styled";

const FrameworkSelectionPage = () => {
  const { jobId } = useParams(); // Ensure jobId is correctly retrieved from URL params
  const [frameworks, setFrameworks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const session = JSON.parse(sessionStorage.getItem("session")); // Retrieve session from localStorage
        const response = await httpGet(
          `Quiz/SpecificFramework?jobId=${jobId}`,
          {
            headers: { token: session?.token }, // Pass token in headers, ensure session is valid
          }
        );
        console.log("Frameworks fetched:", response); // Debug log

        if (response && response.Skills) {
          setFrameworks(response.Skills);
          localStorage.setItem('front-frameworks', JSON.stringify(response.Skills));
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching frameworks:", error);
      }
    };

    fetchFrameworks();
  }, [jobId]);

  const getFrameworkImage = (framework) => {
    // Adjust this switch statement to match each roadmap name with its corresponding image
    switch (framework.name.toLowerCase()) {
      case "react":
        return ReactLogo;
      case "vue":
        return VueLogo;
      case "angular":
        return AngularLogo;
      case "python development":
        return PythonLogo;
      case "nodejs":
        return NodeJSLogo;
      case "ruby on rails":
        return RubyLogo;
      case "phoenix":
        return PhoenixLogo;
      case "nestjs":
        return NestJSLogo;
      case "laravel":
        return LaravelLogo;
      case "koa.js":
        return KoaJSLogo;
      case "hibernate":
        return HibernateLogo;
      case "flask":
        return FlaskLogo;
    }
  };

  return (
    <Box height="100vh">
      <Typography variant="h2" textAlign="center" color="#0c8195" paddingY={4}>
        Select Framework
      </Typography>
      <Box
        display="flex"
        flexWrap="wrap"
        gap="20px"
        justifyContent="center"
        marginX={2}
      >
        {frameworks.map((framework) => (
          <div key={framework.SkillId} className="framework-link">
            {/* Use onClick to fetch quiz for backend frameworks */}
            {framework.name.toLowerCase() === "frontend" ||
            framework.name.toLowerCase() === "backend" ? (
              <Link
                to={`/track/${framework.Nodeid}/framework`}
                className="framework-link"
              >
                <div className="framework-name">{framework.name}</div>
                <div className="framework-description">
                  {framework.description}
                </div>
              </Link>
            ) : (
              <S.StyledBox
                key={framework.Nodeid}
                onClick={() =>
                  navigate(
                    `../track/${jobId}/skill/${framework.Nodeid}/assessment`
                  )
                }
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  sx={{
                    hover: {
                      transform: "translateY(-5px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      backgroundColor: " #0c8195",
                      color: "#f1c111",
                    },
                  }}
                >
                  <img
                    src={getFrameworkImage(framework)}
                    alt={`${framework.name} logo`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      marginBottom: "10px",
                    }}
                  />
                  <Typography
                    color="#0c8195"
                    fontSize="18px"
                    fontWeight="500"
                    sx={{
                      hover: { color: "#f1c111" },
                    }}
                  >
                    {framework.name}
                  </Typography>
                </Box>
              </S.StyledBox>
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default FrameworkSelectionPage;
