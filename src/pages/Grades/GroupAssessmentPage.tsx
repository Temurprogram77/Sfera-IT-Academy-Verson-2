// pages/Grades/GroupAssessmentPage.tsx
import { useParams } from "react-router-dom";
import AssessmentDetail from "./AssessmentDetail";

const GroupAssessmentPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AssessmentDetail
      groupId={id ?? ""}
      groupName="Guruh baholash"
    />
  );
};

export default GroupAssessmentPage;