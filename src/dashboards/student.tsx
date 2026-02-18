import StudentInfoCard from "../components/dashboard/StudentInfoCard";
import StudentGradesChart from "../components/dashboard/StudentGradesChart";
import TopStudents from "../components/dashboard/TopStudents";
import PageMeta from "../components/common/PageMeta";

const Student = () => {
  return (
    <>
      <PageMeta title="Student Dashboard" description="My learning statistics" />

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Student info */}
        <StudentInfoCard />

        {/* Grades */}
        <StudentGradesChart />

        {/* Top students */}
        <TopStudents />
      </div>
    </>
  );
};

export default Student;
