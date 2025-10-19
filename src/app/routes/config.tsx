// nav.tsx (the file you showed)
import {
  FaTachometerAlt,
  FaKey,
  FaUserShield,
  FaIdBadge,
  FaBriefcase,
  FaTools, // ⬅️ NEW
} from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";
import { HiUsers } from "react-icons/hi";
import { LuConstruction } from "react-icons/lu";
import { MdCategory } from "react-icons/md"; // ⬅️ NEW
import type { ReactNode } from "react";

export type NavItem = {
  labelKey: string; // i18n key
  to: string;
  icon: ReactNode;
  section: "MANAGEMENT" | "SYSTEM";
  guard?: {
    tenant?: "root" | "any";
    permission?: string;
  };
};

export const NAV_ITEMS: NavItem[] = [
  {
    labelKey: "nav.dashboard",
    to: "/app/dashboard",
    icon: <FaTachometerAlt />,
    section: "MANAGEMENT",
  },
  {
    labelKey: "nav.constructionSites",
    to: "/app/constructionSites",
    icon: <LuConstruction />,
    section: "MANAGEMENT",
    guard: { permission: "Permission.ConstructionSites.Read" },
  },

  {
    labelKey: "nav.tools",
    to: "/app/tools",
    icon: <FaTools />,
    section: "MANAGEMENT",
    guard: { permission: "Permission.Tools.Read" },
  },

  {
    labelKey: "nav.toolCategories",
    to: "/app/tool-categories",
    icon: <MdCategory />,
    section: "MANAGEMENT",
    guard: { permission: "Permission.ToolCategories.Read" },
  },

  {
    labelKey: "nav.tenants",
    to: "/app/administration/tenants",
    icon: <FaKey />,
    section: "SYSTEM",
    guard: { tenant: "root" },
  },
  {
    labelKey: "nav.companies",
    to: "/app/administration/companies",
    icon: <IoIosBusiness />,
    section: "SYSTEM",
    guard: { permission: "Permission.Companies.Read" },
  },
  {
    labelKey: "nav.roles",
    to: "/app/administration/roles",
    icon: <FaUserShield />,
    section: "SYSTEM",
    guard: { permission: "Permission.Roles.Read" },
  },
  {
    labelKey: "nav.users",
    to: "/app/administration/users",
    icon: <HiUsers />,
    section: "SYSTEM",
    guard: { permission: "Permission.Users.Read" },
  },
  {
    labelKey: "nav.employees",
    to: "/app/administration/employees",
    icon: <FaIdBadge />,
    section: "SYSTEM",
    guard: { permission: "Permission.Employees.Read" },
  },
  {
    labelKey: "nav.jobPositions",
    to: "/app/administration/jobPositions",
    icon: <FaBriefcase />,
    section: "SYSTEM",
    guard: { permission: "Permission.JobPositions.Read" },
  },
];
