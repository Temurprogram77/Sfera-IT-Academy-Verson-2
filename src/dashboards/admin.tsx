import EcommerceMetrics from "../components/dashboard/AcademyMetrics";
import MonthlySalesChart from "../components/dashboard/MonthlyRevenueChart";
import StatisticsChart from "../components/dashboard/StudentsGrowthChart";
import MonthlyTarget from "../components/dashboard/MonthlyTarget";
import PageMeta from "../components/common/PageMeta";

export default function Admin() {
  return (
    <>
      <PageMeta title="Sfera IT Academy" description="Sfera IT Academy" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </div>
    </>
  );
}
