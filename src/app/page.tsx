import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-xl">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
         <a href="/dashboard">
          <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">
          ADmyBRAND Insights &mdash; Analytics Dashboard - Click Here to navigate to the dashboard
        </h1>
        </a>
        <p className="text-base text-muted-foreground text-center sm:text-left">
          Welcome to your modern marketing analytics platform. <br />
          Monitor campaign performance, visualize trends, and manage digital initiatives with ease.
        </p>

        <section className="w-full mt-6">
          <h2 className="font-semibold mb-2 text-lg">🚀 Key Features</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Instant Dashboard Overview:</span>{" "}
              View real-time key metrics like Revenue, Users, Conversions, and Growth Rate.
            </li>
            <li>
              <span className="font-medium text-foreground">Interactive Data Visualizations:</span>{" "}
              Explore dynamic charts &mdash; line, bar, and donut &mdash; for a clear business perspective.
            </li>
            <li>
              <span className="font-medium text-foreground">Campaign Management:</span>{" "}
              List, create, update, and delete marketing campaigns via a sortable, filterable table.
            </li>
            <li>
              <span className="font-medium text-foreground">Responsive & Accessible:</span>{" "}
              Looks beautiful on desktop, tablet, and mobile. Dark/Light mode supported.
            </li>
            <li>
              <span className="font-medium text-foreground">Export Data:</span> Download campaign data as CSV or PDF for sharing or offline analysis.
            </li>
            <li>
              <span className="font-medium text-foreground">Personalized Profile & Settings:</span> Manage your profile, update your password, and customize dashboard preferences.
            </li>
          </ul>
        </section>

        <section className="w-full mt-8">
          <h2 className="font-semibold mb-2 text-lg">🧑‍💼 User Guide</h2>
          <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left space-y-1">
            <li>
              <span className="font-medium">Sign In or Register:</span> Create or log in to your account to access personalized analytics and manage campaigns.
            </li>
            <li>
              <span className="font-medium">Navigate:</span> Use the sidebar to switch between the Dashboard, Analytics, Campaigns, and Settings.
            </li>
            <li>
              <span className="font-medium">Analyze Data:</span> Filter data, view key metrics, and interact with charts to understand trends.
            </li>
            <li>
              <span className="font-medium">Manage Campaigns:</span> Add, edit, or delete campaigns. Sort and filter to quickly find relevant information.
            </li>
            <li>
              <span className="font-medium">Download Reports:</span> Click "Export CSV" or "Export PDF" in the Campaigns section to download your data.
            </li>
            <li>
              <span className="font-medium">Customize:</span> Toggle between light/dark mode, and update your profile in Settings.
            </li>
          </ol>
        </section>

        <section className="w-full mt-8">
          <h2 className="font-semibold mb-2 text-lg">📄 Documentation & Tech Overview</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Stack:</span> Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM.
            </li>
            <li>
              <span className="font-medium text-foreground">Authentication:</span> Powered by NextAuth.js with session-secured API endpoints.
            </li>
            <li>
              <span className="font-medium text-foreground">API/DB:</span> PostgreSQL via Prisma, with robust CRUD support and real-time metric simulation.
            </li>
            <li>
              <span className="font-medium text-foreground">Testing & Deployment:</span> Code quality via ESLint & Prettier. Easily deployable to Vercel/Netlify.
            </li>
          </ul>
        </section>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center mt-8 opacity-60 text-xs">
        <span>&copy; {new Date().getFullYear()} ADmyBRAND Insights | Modern marketing dashboard template</span>
      </footer>
    </div>
  );
}
