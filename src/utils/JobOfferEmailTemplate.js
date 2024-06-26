export const jobOfferEmailTemplate = ({ jobTitle, companyName, jobDescription, salaryRange, employmentType }) => {
    return `<!DOCTYPE html>
      <html>
      <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
          <style type="text/css">
              body {
                  background-color: #001f3f; /* Dark Blue */
                  margin: 0;
              }
              .container {
                  width: 80%; /* Adjusted to make the container width smaller */
                  margin: auto;
                  padding: 20px;
                  background-color: #3e290c; /* Brown */
                  border: 1px solid  #fff;
                  color: #fff; /* White */
              }
              .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              }
              .logo {
                  width: 100px;
              }
              .view-website {
                  text-align: right;
              }
              .view-website a {
                  text-decoration: none;
                  color: #fff; /* White */
              }
              .job-details {
                  text-align: center;
                  padding: 15px 0;
              }
              .job-title {
                  color: #fff; /* White */
              }
              .job-description, .job-salary, .job-employment-type {
                  padding: 0 30px;
                  color: #fff; /* White */
              }
              .apply-button {
                  margin: 20px 0 30px;
                  border-radius: 4px;
                  padding: 10px 20px;
                  border: 0;
                  color: #3e290c; /* Brown */
                  background-color: #fff; /* White */
                  text-decoration: none;
                  display: inline-block;
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
                  <p><a href="http://localhost:4200/#/" target="_blank">View In Website</a></p>
              </div>
          </div>
          <div class="job-details">
              <h1 class="job-title">${jobTitle}</h1>
              <div class="job-description">
                  <p>${jobDescription}</p>
              </div>
              <div class="job-salary">
                  <p><strong>Salary Range:</strong> ${salaryRange}</p>
              </div>
              <div class="job-employment-type">
                  <p><strong>Employment Type:</strong> ${employmentType}</p>
              </div>
              <!-- <a href="" class="apply-button">${companyName} - Apply Now</a> -->
          </div>
      </div>
      </body>
      </html>`;
};
