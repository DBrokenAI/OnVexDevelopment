export type NavItem = {
  href: string;
  label: string;
  badge?: string;
  section?: string;
};

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", section: "Workspace" },
  { href: "/admin/sites", label: "Sites", section: "Workspace" },
  { href: "/admin/clients", label: "Clients", section: "Workspace" },
  { href: "/admin/leads", label: "Leads", section: "Workspace" },
  { href: "/admin/messages", label: "Messages", section: "Workspace" },
  { href: "/admin/field", label: "Field Mode", section: "Workspace" },

  { href: "/admin/billing", label: "Billing", section: "Operations" },
  { href: "/admin/reports", label: "Reports", section: "Operations" },
  { href: "/admin/campaigns", label: "Campaigns", section: "Operations" },
  { href: "/admin/time", label: "Time", section: "Operations" },
  { href: "/admin/tasks", label: "Tasks", section: "Operations" },

  { href: "/admin/team", label: "Team", section: "Account" },
  { href: "/admin/docs", label: "Docs / SOPs", section: "Account" },
  { href: "/admin/notifications", label: "Notifications", section: "Account" },
  { href: "/admin/settings", label: "Settings", section: "Account" },
];

export const PORTAL_NAV: NavItem[] = [
  { href: "/portal", label: "Home" },
  { href: "/portal/project", label: "Project" },
  { href: "/portal/messages", label: "Messages" },
  { href: "/portal/billing", label: "Billing" },
  { href: "/portal/updates", label: "Updates" },
  { href: "/portal/requests", label: "Requests" },
  { href: "/portal/reports", label: "Reports" },
  { href: "/portal/referrals", label: "Referrals" },
  { href: "/portal/help", label: "Help" },
];
