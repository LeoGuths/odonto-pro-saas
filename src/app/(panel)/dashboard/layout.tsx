import React from 'react';
import { SidebarDashboard } from '@/app/(panel)/dashboard/_components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarDashboard>{children}</SidebarDashboard>
    </>
  );
}
