import {
  FaTachometerAlt,
  FaKey,
  FaUserShield,
  FaIdBadge,
  FaBriefcase,
  FaTools,
  FaCarSide,
  FaTasks,
  FaRegFileAlt,
  FaListUl,
} from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";
import { HiUsers } from "react-icons/hi";
import { LuConstruction } from "react-icons/lu";
import { MdCategory, MdMedicalServices } from "react-icons/md";
import type { ReactNode } from "react";

export type NavCategory = "CODEBOOK" | "CONSTRUCTION" | "IDENTITY";

export type ModuleId =
  | "dashboard"
  | "assignments"
  | "constructionSites"
  | "companies"
  | "medicalExaminations"
  | "examinationTypes"
  | "employees"
  | "jobPositions"
  | "tools"
  | "toolCategories"
  | "vehicles"
  | "tenants"
  | "roles"
  | "users";

export type NavItem = {
  labelKey: string;
  to: string;
  icon: ReactNode;
  section: "MANAGEMENT" | "SYSTEM";
  category?: NavCategory;
  guard?: {
    tenant?: "root" | "any";
    permission?: string;
  };
};

export const NAV_ITEMS: NavItem[] = [
  // CONSTRUCTION group
  {
    labelKey: "nav.dashboard",
    to: "/app/dashboard",
    icon: <FaTachometerAlt />,
    section: "MANAGEMENT",
    category: "CONSTRUCTION",
  },
  {
    labelKey: "nav.assignments",
    to: "/app/assignments",
    icon: <FaTasks />,
    section: "MANAGEMENT",
    category: "CONSTRUCTION",
  },
  {
    labelKey: "nav.constructionSites",
    to: "/app/constructionSites",
    icon: <LuConstruction />,
    section: "MANAGEMENT",
    category: "CONSTRUCTION",
    guard: { permission: "Permission.ConstructionSites.Read" },
  },
  {
    labelKey: "nav.reports",
    to: "/app/izvjestaji",
    icon: <FaRegFileAlt />,
    section: "MANAGEMENT",
    category: "CONSTRUCTION",
  },

  // CODEBOOK group
  {
    labelKey: "nav.companies",
    to: "/app/administration/companies",
    icon: <IoIosBusiness />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.Companies.Read" },
  },
  {
    labelKey: "nav.medicalExaminations",
    to: "/app/medicalExaminations",
    icon: <MdMedicalServices />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.MedicalExaminations.Read" },
  },
  {
    labelKey: "nav.examinationTypes",
    to: "/app/examinationTypes",
    icon: <FaListUl />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.ExaminationTypes.Read" },
  },
  {
    labelKey: "nav.employees",
    to: "/app/administration/employees",
    icon: <FaIdBadge />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.Employees.Read" },
  },
  {
    labelKey: "nav.jobPositions",
    to: "/app/administration/jobPositions",
    icon: <FaBriefcase />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.JobPositions.Read" },
  },
  {
    labelKey: "nav.tools",
    to: "/app/tools",
    icon: <FaTools />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.Tools.Read" },
  },
  {
    labelKey: "nav.toolCategories",
    to: "/app/tool-categories",
    icon: <MdCategory />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.ToolCategories.Read" },
  },
  {
    labelKey: "nav.vehicles",
    to: "/app/vehicles",
    icon: <FaCarSide />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.Vehicles.Read" },
  },

  // IDENTITY group
  {
    labelKey: "nav.tenants",
    to: "/app/administration/tenants",
    icon: <FaKey />,
    section: "SYSTEM",
    category: "IDENTITY",
    guard: { tenant: "root" },
  },
  {
    labelKey: "nav.roles",
    to: "/app/administration/roles",
    icon: <FaUserShield />,
    section: "SYSTEM",
    category: "IDENTITY",
    guard: { permission: "Permission.Roles.Read" },
  },
  {
    labelKey: "nav.users",
    to: "/app/administration/users",
    icon: <HiUsers />,
    section: "SYSTEM",
    category: "IDENTITY",
    guard: { permission: "Permission.Users.Read" },
  },
];
