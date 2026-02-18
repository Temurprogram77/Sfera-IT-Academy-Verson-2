import React from "react";
import PageMeta from "../components/common/PageMeta";
import MonthlyRevenueChart from "../components/dashboard/MonthlyRevenueChart";
import Statistics from "../components/teacherDashboard/Statistics";
import TopStudents from "../components/teacherDashboard/TopStudents";

const Teacher = () => {
  return (
    <div>
      <PageMeta
        title="Sfera IT Academy Teacher"
        description="Teacher Dashboard"
      />
      <div className="space-y-6 max-w-7xl mx-auto">
        <Statistics />
    
        <MonthlyRevenueChart />
        <TopStudents/>
      </div>
    </div>
  );
};

export default Teacher;
