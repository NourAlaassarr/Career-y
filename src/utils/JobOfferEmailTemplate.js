export const jobOfferEmailTemplate = ({ jobTitle, companyName, jobDescription }) => {
    return `<!DOCTYPE html>
      <html>
      <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
          <style type="text/css">
              body {
                  background-color: #88BDBF;
                  margin: 0;
              }
              .container {
                  width: 50%;
                  margin: auto;
                  padding: 30px;
                  background-color: #F3F3F3;
                  border: 1px solid #630E2B;
              }
              .header {
                  display: flex;
                  justify-content: space-between;
              }
              .logo {
                  width: 100px;
              }
              .view-website {
                  text-align: right;
              }
              .job-details {
                  text-align: center;
                  padding: 25px 0;
              }
              .job-title {
                  color: #630E2B;
              }
              .job-description {
                  padding: 0 50px;
              }
              .apply-button {
                  margin: 20px 0 30px;
                  border-radius: 4px;
                  padding: 10px 20px;
                  border: 0;
                  color: #fff;
                  background-color: #630E2B;
                  text-decoration: none;
                  display: inline-block;
              }
              .social-links {
                  margin-top: 20px;
                  text-align: center;
              }
              .social-link {
                  text-decoration: none;
                  padding: 10px 9px;
                  color: #fff;
                  border-radius: 50%;
              }
              .social-icon {
                  width: 50px;
                  height: 50px;
              }
          </style>
      </head>
      <body>
      <div class="container">
          <div class="header">
              <div class="logo">
                  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png" alt="Company Logo">
              </div>
              <div class="view-website">
                  <p><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
              </div>
          </div>
          <div class="job-details">
              <h1 class="job-title">${jobTitle}</h1>
              <div class="job-description">
                  <p>${jobDescription}</p>
              </div>
            //   <a href="" class="apply-button">${companyName} - Apply Now</a>
          </div>
          <div class="social-links">
              <a href="${process.env.facebookLink}" class="social-link">
                  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" alt="Facebook" class="social-icon">
              </a>
              <a href="${process.env.instagram}" class="social-link">
                  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" alt="Instagram" class="social-icon">
              </a>
              <a href="${process.env.twitterLink}" class="social-link">
                  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" alt="Twitter" class="social-icon">
              </a>
          </div>
      </div>
      </body>
      </html>`;
  };