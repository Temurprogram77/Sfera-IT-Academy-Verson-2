import AcademyMetrics from "../components/dashboard/AcademyMetrics";
import MonthlyRevenueChart from "../components/dashboard/MonthlyRevenueChart";
import PageMeta from "../components/common/PageMeta";

export default function SuperAdmin() {
  return (
    <>
      <PageMeta title="Sfera IT Academy Super Admin" description="Super Admin Dashboard" />

      <div className="space-y-6 max-w-7xl mx-auto">
        <AcademyMetrics />

        <MonthlyRevenueChart />
      </div>
    </>
  );
}
