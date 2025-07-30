// src/components/layout/sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart,
  Activity,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  // { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { label: 'Campaigns', href: '/dashboard/campaigns', icon: Activity },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={cn(
        'relative h-screen border-r bg-background transition-all duration-300',
        open ? 'w-64' : 'w-16'
      )}
    >
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="absolute right-2 top-2 z-20"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Brand */}
      <div className="flex items-center gap-2 px-6 py-5">
        <LayoutDashboard className="h-7 w-7 text-primary" />
        {open && <span className="text-lg font-semibold">ADmyBRAND</span>}
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100%-4rem)]">
        <nav className="mt-2 flex flex-col gap-1 px-2">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {open && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
