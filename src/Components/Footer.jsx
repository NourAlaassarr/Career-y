// import React from "react";
// import { Box, Grid, Typography } from "@mui/material";
// import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
// import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
// import XIcon from '@mui/icons-material/X';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';

// const Footer = () => {
//   return (
//     <Grid container bgcolor="#000" minHeight="150px" marginTop={8}>
//       <Grid item xs={4} sm={4} md={4} textAlign="center">
//         <Typography
//           variant="h5"
//           textTransform="uppercase"
//           color="#fff"
//           padding="20px 16px"
//         >
//           we make your{" "}
//           <Typography variant="h5" color="#F1C111" display="inline">
//             career
//           </Typography>{" "}
//           choices easier
//         </Typography>
//         <Typography textTransform="uppercase" color="#7C7B82">
//           copyright &copy; 2024 career-y
//         </Typography>
//       </Grid>
//       <Grid item xs={4} sm={4} md={4} textAlign="center" padding="20px 16px">
//         <Typography variant="h5" textTransform="uppercase" color="#7C7B82">
//           contact info
//         </Typography>
//         <ul>
//           <li>
//             <Box display="inline-flex">
//               <LocalPhoneIcon sx={{mr: 1, color: "#7C7B82"}} />
//               <Typography color="#7C7B82">+22 123 456 789</Typography>
//             </Box>
//           </li>
//           <li>
//             <Box display="inline-flex">
//               <AlternateEmailIcon sx={{mr: 1, color: "#7C7B82"}} />
//               <Typography color="#7C7B82">Career_y@gmail.com</Typography>
//             </Box>
//           </li>
//         </ul>
//       </Grid>
//       <Grid item xs={4} sm={4} md={4} textAlign="center" padding="20px 16px">
//         <ul>
//           <li>
//             <Box display="inline-flex">
//               <XIcon sx={{mr: 1, color: "#7C7B82"}} />
//               <Typography color="#7C7B82">Career_y</Typography>
//             </Box>
//           </li>
//           <li>
//             <Box display="inline-flex">
//               <FacebookIcon sx={{mr: 1, color: "#7C7B82"}} />
//               <Typography color="#7C7B82">Career_y</Typography>
//             </Box>
//           </li>
//           <li>
//             <Box display="inline-flex">
//               <InstagramIcon sx={{mr: 1, color: "#7C7B82"}} />
//               <Typography color="#7C7B82">Career_y</Typography>
//             </Box>
//           </li>
//         </ul>
//       </Grid>
//     </Grid>
//   );
// };

// export default Footer;



import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Grid 
      container 
      bgcolor="#000" 
      color="#fff" 
      padding={{ xs: 2, sm: 4, md: 6 }} 
      spacing={2} 
      minHeight="150px"
      marginTop={8}
      textAlign="center"
    >
      <Grid item xs={12} sm={4}>
        <Typography
          variant="h5"
          textTransform="uppercase"
          color="#fff"
          padding="20px 0"
        >
          we make your{" "}
          <Typography variant="h5" color="#F1C111" display="inline">
            career
          </Typography>{" "}
          choices easier
        </Typography>
        <Typography textTransform="uppercase" color="#7C7B82">
          copyright &copy; 2024 career-y
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="h5" textTransform="uppercase" color="#7C7B82" padding="20px 0">
          contact info
        </Typography>
        <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
          <li style={{ marginBottom: '10px' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <LocalPhoneIcon sx={{ mr: 1, color: "#7C7B82" }} />
              <Typography color="#7C7B82">+22 123 456 789</Typography>
            </Box>
          </li>
          <li>
            <Box display="flex" alignItems="center" justifyContent="center">
              <AlternateEmailIcon sx={{ mr: 1, color: "#7C7B82" }} />
              <Typography color="#7C7B82">Career_y@gmail.com</Typography>
            </Box>
          </li>
        </ul>
      </Grid>
      <Grid item xs={12} sm={4}>
        <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
          <li style={{ marginBottom: '10px' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <XIcon sx={{ mr: 1, color: "#7C7B82" }} />
              <Typography color="#7C7B82">Career_y</Typography>
            </Box>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <FacebookIcon sx={{ mr: 1, color: "#7C7B82" }} />
              <Typography color="#7C7B82">Career_y</Typography>
            </Box>
          </li>
          <li>
            <Box display="flex" alignItems="center" justifyContent="center">
              <InstagramIcon sx={{ mr: 1, color: "#7C7B82" }} />
              <Typography color="#7C7B82">Career_y</Typography>
            </Box>
          </li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default Footer;
