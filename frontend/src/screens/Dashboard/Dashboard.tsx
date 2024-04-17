import React, { useContext } from 'react';
import { Typography, Card, CardContent, Button } from "@mui/material";
import AssignmentDisplay from "../../components/Assignments/AssignmentDisplay/AssignmentDisplay";
import { AuthContext } from "../../context/AuthContextProvider";
import { AssignmentContext } from "../../context/AssignmentContextProvider";
import { SubjectContext } from '../../context/SubjectsContextProvider';
import { Link } from "react-router-dom"; 

const Dashboard = () => {
  const { overdue_assignments,pending_assignments } = useContext(AssignmentContext);
  const { user } = React.useContext(AuthContext);
  const { subjects } = useContext(SubjectContext);
  const numberOfSubjectsEnrolled = subjects.length;
    console.log(overdue_assignments)
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Welcome {user ? user.username : ""}!
          
      </Typography>
      <Card variant="outlined" style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h6" component="h4">
            Number of Subjects Enrolled: { numberOfSubjectsEnrolled }
          </Typography>
          <Button component={Link} to="/subjects" variant="contained" style={{ marginTop: '10px' }}>
            View Subjects
          </Button>
        </CardContent>
      </Card>
      <Card variant="outlined" style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h6" component="h4">
          </Typography>
          <AssignmentDisplay title="Due Assignments" assignments={pending_assignments} />
          <Button component={Link} to="/assignments" variant="contained" style={{ marginTop: '10px' }}>
            View Assignments
          </Button>
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h4">
            Recommended Video:
          </Typography>
          <div style={{ marginTop: '20px' }}>
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/M988_fsOSWo`}
              title="Subject Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
