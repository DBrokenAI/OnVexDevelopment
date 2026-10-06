import {
  IconBell,
  IconBook,
  IconChartLine,
  IconCheckbox,
  IconClock,
  IconCreditCard,
  IconDeviceTablet,
  IconFileText,
  IconGift,
  IconHelpCircle,
  IconHome,
  IconLayoutDashboard,
  IconSpeakerphone,
  IconMessageCircle,
  IconReceipt,
  IconSettings,
  IconSparkles,
  IconTarget,
  IconTimeline,
  IconUsers,
  IconUsersGroup,
  IconWorld,
  type Icon,
} from "@tabler/icons-react";

export type NavItem = {
  href: string;
  label: string;
  icon: Icon;
  badge?: string;
  section?: string;
};

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: IconLayoutDashboard, section: "Workspace" },
  { href: "/admin/sites", label: "Sites", icon: IconWorld, section: "Workspace" },
  { href: "/admin/clients", label: "Clients", icon: IconUsers, section: "Workspace" },
  { href: "/admin/leads", label: "Leads", icon: IconTarget, section: "Workspace" },
  { href: "/admin/messages", label: "Messages", icon: IconMessageCircle, section: "Workspace" },
  { href: "/admin/field", label: "Field Mode", icon: IconDeviceTablet, section: "Workspace" },

  { href: "/admin/billing", label: "Billing", icon: IconReceipt, section: "Business" },
  { href: "/admin/reports", label: "Reports", icon: IconChartLine, section: "Business" },
  { href: "/admin/campaigns", label: "Campaigns", icon: IconSpeakerphone, section: "Business" },
  { href: "/admin/time", label: "Time", icon: IconClock, section: "Business" },
  { href: "/admin/tasks", label: "Tasks", icon: IconCheckbox, section: "Business" },

  { href: "/admin/team", label: "Team", icon: IconUsersGroup, section: "System" },
  { href: "/admin/docs", label: "Docs / SOPs", icon: IconBook, section: "System" },
  { href: "/admin/notifications", label: "Notifications", icon: IconBell, section: "System" },
  { href: "/admin/settings", label: "Settings", icon: IconSettings, section: "System" },
];

export const PORTAL_NAV: NavItem[] = [
  { href: "/portal", label: "Home", icon: IconHome },
  { href: "/portal/project", label: "Project", icon: IconTimeline },
  { href: "/portal/messages", label: "Messages", icon: IconMessageCircle },
  { href: "/portal/billing", label: "Billing", icon: IconCreditCard },
  { href: "/portal/updates", label: "Updates", icon: IconSparkles },
  { href: "/portal/requests", label: "Requests", icon: IconFileText },
  { href: "/portal/reports", label: "Reports", icon: IconChartLine },
  { href: "/portal/referrals", label: "Referrals", icon: IconGift },
  { href: "/portal/help", label: "Help", icon: IconHelpCircle },
];
