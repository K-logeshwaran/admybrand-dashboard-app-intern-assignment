import { MainLayout } from '@/components/layout/main-layout';
import { MetricCard } from '@/components/dashboard/metric-card';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { UserAcquisitionChart } from '@/components/charts/user-acquisition-chart';
import { TrafficSourceChart } from '@/components/charts/traffic-source-chart';

async function getMetrics() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard/metrics`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

async function getRevenueData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard/revenue`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch revenue data');
  return res.json();
}

async function getUserAcquisitionData() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/dashboard/userAcquisition`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch user acquisition data');
  return res.json();
}

async function getTrafficSourceData() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/dashboard/trafficSources`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch traffic source data');
  return res.json();
}

export default async function DashboardPage() {
  const [metrics, revenueData, userAcquisitionData, trafficSourceData] =
    await Promise.all([
      getMetrics(),
      getRevenueData(),
      getUserAcquisitionData(),
      getTrafficSourceData(),
    ]);

  return (
    <MainLayout>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            change={12.5}
            changeType="increase"
            description="From last month"
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers.toLocaleString()}
            change={8.2}
            changeType="increase"
            description="From last month"
          />
          <MetricCard
            title="Conversions"
            value={metrics.conversions.toLocaleString()}
            change={-2.1}
            changeType="decrease"
            description="From last month"
          />
          <MetricCard
            title="Growth Rate"
            value={`${metrics.growthRate}%`}
            change={4.3}
            changeType="increase"
            description="Monthly growth"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RevenueChart data={revenueData} />
          <UserAcquisitionChart data={userAcquisitionData} />
          <TrafficSourceChart data={trafficSourceData} />
        </div>
      </div>
    </MainLayout>
  );
}
