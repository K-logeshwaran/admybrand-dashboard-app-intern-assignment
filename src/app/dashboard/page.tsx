import { MainLayout } from '@/components/layout/main-layout';
import { MetricCard } from '@/components/dashboard/metric-card';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { UserAcquisitionChart } from '@/components/charts/user-acquisition-chart';
import { TrafficSourceChart } from '@/components/charts/traffic-source-chart';
import { prisma } from '@/lib/db';

// SSR function: replace all fetch calls with direct DB calls
export default async function DashboardPage() {
  // Get metrics
  const [totalRevenue, activeUsers, totalConversions, campaigns] = await Promise.all([
    prisma.campaign.aggregate({
      _sum: { cost: true },
    }),
    prisma.user.count(),
    prisma.campaign.aggregate({
      _sum: { conversions: true },
    }),
    prisma.campaign.count(),
  ]);

  // Revenue chart data
  const rawRevenueData: any[] = await prisma.$queryRaw`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as month,
      SUM(cost) as revenue
    FROM campaigns 
    WHERE "createdAt" >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY DATE_TRUNC('month', "createdAt")
  `;
  const revenueData = rawRevenueData.map((item) => ({
    month: item.month,
    revenue: Number(item.revenue),
  }));

  

  // User acquisition — you’d replace this stub with your real logic:
  
  const userAcquisitionData =  [
  { channel: 'Organic', users: 6000 },
  { channel: 'Paid Social', users: 3000 },
  { channel: 'Email', users: 2000 },
  { channel: 'Direct', users: 1847 },
];

  // Traffic source — use static data or fetch from DB if needed.
  const trafficSourceData = [
    { source: 'Organic', value: 38, color: '#3b82f6' },
    { source: 'Paid Social', value: 25, color: '#10b981' },
    { source: 'Email', value: 20, color: '#f59e0b' },
    { source: 'Direct', value: 17, color: '#ef4444' },
  ];

  // Calculate growth rate (mock)
  const metrics = {
    totalRevenue: totalRevenue._sum.cost || 0,
    activeUsers,
    conversions: totalConversions._sum.conversions || 0,
    growthRate: 18.2, // You can calculate real value here
    totalCampaigns: campaigns,
  };

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
