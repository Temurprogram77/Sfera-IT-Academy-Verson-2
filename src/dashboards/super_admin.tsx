import AcademyMetrics from "../components/dashboard/AcademyMetrics";
import MonthlyRevenueChart from "../components/dashboard/MonthlyRevenueChart";
import StudentsGrowthChart from "../components/dashboard/StudentsGrowthChart";
import PageMeta from "../components/common/PageMeta";

export default function SuperAdmin() {
  return (
    <>
      <PageMeta title="Sfera IT Academy Admin" description="Dashboard" />

      <div className="space-y-6">
        <AcademyMetrics />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-7">
            <MonthlyRevenueChart />
          </div>

          <div className="col-span-12 xl:col-span-5">
            <StudentsGrowthChart />
          </div>
        </div>
      </div>
    </>
  );
}
