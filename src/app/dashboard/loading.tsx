// src/app/dashboard/loading.tsx

export default function DashboardLoading() {
  return (
    <div className="p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded bg-muted animate-pulse" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[300px] rounded bg-muted animate-pulse col-span-3" />
        ))}
      </div>
    </div>
  );
}
