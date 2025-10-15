import {
  FaTachometerAlt,
  FaKey,
  FaUserShield,
  FaIdBadge,
  FaBriefcase,
  FaHardHat,
} from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";
import { HiUsers } from "react-icons/hi";
import type { ReactNode } from "react";

export type NavItem = {
  label: string;
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
    label: "Nadzorna ploča",
    to: "/app/dashboard",
    icon: <FaTachometerAlt />,
    section: "MANAGEMENT",
  },

  {
    label: "Gradilišta",
    to: "/app/constructionSites",
    icon: <FaHardHat />,
    section: "MANAGEMENT",
    guard: { permission: "Permission.ConstructionSites.Read" },
  },

  {
    label: "Tenanti",
    to: "/app/administration/tenants",
    icon: <FaKey />,
    section: "SYSTEM",
    guard: { tenant: "root" },
  },
  {
    label: "Tvrtke",
    to: "/app/administration/companies",
    icon: <IoIosBusiness />,
    section: "SYSTEM",
    guard: { permission: "Permission.Companies.Read" },
  },
  {
    label: "Uloge",
    to: "/app/administration/roles",
    icon: <FaUserShield />,
    section: "SYSTEM",
    guard: { permission: "Permission.Roles.Read" },
  },
  {
    label: "Korisnici",
    to: "/app/administration/users",
    icon: <HiUsers />,
    section: "SYSTEM",
    guard: { permission: "Permission.Users.Read" },
  },
  {
    label: "Zaposlenici",
    to: "/app/administration/employees",
    icon: <FaIdBadge />,
    section: "SYSTEM",
    guard: { permission: "Permission.Employees.Read" },
  },
  {
    label: "Radna mjesta",
    to: "/app/administration/jobPositions",
    icon: <FaBriefcase />,
    section: "SYSTEM",
    guard: { permission: "Permission.JobPositions.Read" },
  },
];
