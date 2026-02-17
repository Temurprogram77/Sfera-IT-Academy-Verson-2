import AcademyMetrics from "../components/dashboard/AcademyMetrics";
import MonthlyRevenueChart from "../components/dashboard/MonthlyRevenueChart";
import PageMeta from "../components/common/PageMeta";

export default function Admin() {
  return (
    <>
      <PageMeta title="Sfera IT Academy Admin" description="AdminDashboard" />

      <div className="space-y-6">
        <AcademyMetrics />

        <MonthlyRevenueChart />
      </div>
    </>
  );
}
