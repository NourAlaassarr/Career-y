// import {
//   MDBCol,
//   MDBContainer,
//   MDBRow,
//   MDBCard,
//   MDBCardText,
//   MDBCardBody,
//   MDBCardImage,
//   MDBProgress,
//   MDBProgressBar,
//   MDBListGroup,
//   MDBListGroupItem,
// } from "mdb-react-ui-kit";

// export default function ProfilePage() {
//   return (
//     <section style={{ backgroundColor: "#eee" }}>
//       <MDBContainer className="py-5">
//         <MDBRow>
//           <MDBCol lg="4">
//             <MDBCard className="mb-4">
//               <MDBCardBody className="text-center">
//                 <MDBCardImage
//                   src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
//                   alt="avatar"
//                   className="rounded-circle"
//                   style={{ width: "150px" }}
//                   fluid
//                 />
//                 <p className="text-muted mb-1">Full Stack Developer</p>
//                 {/* career goal of the user  */}
//               </MDBCardBody>
//             </MDBCard>

//             <MDBCard className="mb-4 mb-lg-0">
//               <MDBCardBody className="p-0">
//                 <MDBListGroup flush className="rounded-3">
//                   {/**
//                    * set of skills of the user from the database
//                    */}
//                   <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
//                     <MDBCardText>html</MDBCardText>
//                   </MDBListGroupItem>
//                   <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
//                     <MDBCardText>css</MDBCardText>
//                   </MDBListGroupItem>
//                   <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
//                     <MDBCardText>python</MDBCardText>
//                   </MDBListGroupItem>
//                   <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
//                     <MDBCardText>java</MDBCardText>
//                   </MDBListGroupItem>
//                   <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
//                     <MDBCardText>c++</MDBCardText>
//                   </MDBListGroupItem>
//                 </MDBListGroup>
//               </MDBCardBody>
//             </MDBCard>
//           </MDBCol>

//           <MDBCol lg="8">
//             <MDBCard className="mb-4">
//               <MDBCardBody>
//                 <MDBRow>
//                   <MDBCol sm="3">
//                     <MDBCardText>Username</MDBCardText>
//                   </MDBCol>
//                   <MDBCol sm="9">
//                     <MDBCardText className="text-muted">john22</MDBCardText>
//                     {/** username from the database  */}
//                   </MDBCol>
//                 </MDBRow>
//                 <hr />
//                 <MDBRow>
//                   <MDBCol sm="3">
//                     <MDBCardText>Email</MDBCardText>
//                   </MDBCol>
//                   <MDBCol sm="9">
//                     <MDBCardText className="text-muted">
//                       example@example.com
//                     </MDBCardText>
//                     {/**email from the database */}
//                   </MDBCol>
//                 </MDBRow>
//                 <hr />
//               </MDBCardBody>
//             </MDBCard>

//             <MDBRow>
//               <MDBCol md="6">
//                 <MDBCard className="mb-4 mb-md-0">
//                   <MDBCardBody>
//                     <MDBCardText className="mb-4">
//                       <span className="text-primary font-italic me-1">
//                         Career Goal
//                       </span>{" "}
//                       Progress
//                     </MDBCardText>
//                     <MDBCardText
//                       className="mb-1"
//                       style={{ fontSize: ".77rem" }}
//                     >
//                       Web Design
//                     </MDBCardText>
//                     {/**user career goal from the data base */}
//                     <MDBProgress className="rounded">
//                       <MDBProgressBar width={80} valuemin={0} valuemax={100} />
//                     </MDBProgress>
//                   </MDBCardBody>
//                 </MDBCard>
//               </MDBCol>
//             </MDBRow>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </section>
//   );
// }

import { useEffect, useState } from "react";
import { httpGet } from '../axios/axiosUtils.tsx';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBProgress,
  MDBProgressBar,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          throw new Error("No token found");
        }

        const data = await httpGet("http://localhost:3000/User/GetUserDetails", token); 
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <section
      style={{
        backgroundColor: "#eee",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={
                    user.avatar ||
                    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  }
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />
                <p className="text-muted mb-1">
                  {user.title || "Full Stack Developer"}
                </p>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  {user.skills.map((skill, index) => (
                    <MDBListGroupItem
                      key={index}
                      className="d-flex justify-content-between align-items-center p-3"
                    >
                      <MDBCardText>{skill}</MDBCardText>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Username</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {user.username}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {user.email}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">
                      <span className="text-primary font-italic me-1">
                        Career Goal
                      </span>{" "}
                      Progress
                    </MDBCardText>
                    <MDBCardText
                      className="mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      {user.careerGoal.title}
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar
                        width={user.careerGoal.progress}
                        valuemin={0}
                        valuemax={100}
                      />
                    </MDBProgress>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
