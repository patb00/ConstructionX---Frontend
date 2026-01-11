import {
  FaTachometerAlt,
  FaKey,
  FaIdBadge,
  FaBriefcase,
  FaTools,
  FaBoxes,
  FaCarSide,
  FaListUl,
  FaBell,
  FaClipboardList,
  FaFileInvoice,
  FaShieldAlt,
  FaUserCog,
  FaTags,
  FaStethoscope,
  FaInbox,
  FaWrench,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";

import { LuConstruction } from "react-icons/lu";
import { MdCategory, MdVerified } from "react-icons/md";
import { BiTrip, BiIdCard, BiBuildingHouse } from "react-icons/bi";
import { RiFileList3Line } from "react-icons/ri";
import type { ReactNode } from "react";

export type NavCategory =
  | "CODEBOOK"
  | "CONSTRUCTION"
  | "IDENTITY"
  | "VEHICLES"
  | "TOOLS";

export type ModuleId =
  | "dashboard"
  | "assignments"
  | "constructionSites"
  | "companies"
  | "medicalExaminations"
  | "examinationTypes"
  | "certifications"
  | "certificationTypes"
  | "employees"
  | "jobPositions"
  | "tools"
  | "toolCategories"
  | "materials"
  | "vehicles"
  | "vehicleRegistrations"
  | "vehicleInsurances"
  | "vehicleBusinessTrips"
  | "vehicleRepairs"
  | "toolRepairs"
  | "condos"
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
    icon: <FaClipboardList />,
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
    icon: <RiFileList3Line />,
    section: "MANAGEMENT",
    category: "CONSTRUCTION",
  },
  {
    labelKey: "nav.notifications",
    to: "/app/notifications",
    icon: <FaBell />,
    section: "MANAGEMENT",
    category: "CONSTRUCTION",
  },
  {
    labelKey: "nav.tasks",
    to: "/app/tasks",
    icon: <FaInbox />,
    section: "MANAGEMENT",
    category: "CONSTRUCTION",
  },
  {
    labelKey: "nav.map",
    to: "/app/map",
    icon: <FaMapMarkedAlt />,
    section: "MANAGEMENT",
    category: "CONSTRUCTION",
  },

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
    icon: <FaStethoscope />,
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
    labelKey: "nav.certifications",
    to: "/app/certifications",
    icon: <MdVerified />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.Certifications.Read" },
  },
  {
    labelKey: "nav.certificationTypes",
    to: "/app/certificationTypes",
    icon: <FaTags />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.CertificationTypes.Read" },
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
    labelKey: "nav.condos",
    to: "/app/condos",
    icon: <BiBuildingHouse />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.Condos.Read" },
  },

  {
    labelKey: "nav.tools",
    to: "/app/tools",
    icon: <FaTools />,
    section: "SYSTEM",
    category: "TOOLS",
    guard: { permission: "Permission.Tools.Read" },
  },
  {
    labelKey: "nav.toolCategories",
    to: "/app/tool-categories",
    icon: <MdCategory />,
    section: "SYSTEM",
    category: "TOOLS",
    guard: { permission: "Permission.ToolCategories.Read" },
  },
  {
    labelKey: "nav.toolRepairs",
    to: "/app/tool-repairs",
    icon: <FaWrench />,
    section: "SYSTEM",
    category: "TOOLS",
    guard: { permission: "Permission.ToolCategories.Read" },
  },
  {
    labelKey: "nav.materials",
    to: "/app/materials",
    icon: <FaBoxes />,
    section: "SYSTEM",
    category: "CODEBOOK",
    guard: { permission: "Permission.Materials.Read" },
  },

  {
    labelKey: "nav.vehicles",
    to: "/app/vehicles",
    icon: <FaCarSide />,
    section: "SYSTEM",
    category: "VEHICLES",
    guard: { permission: "Permission.Vehicles.Read" },
  },
  {
    labelKey: "nav.vehicleRepairs",
    to: "/app/vehicle-repairs",
    icon: <FaWrench />,
    section: "SYSTEM",
    category: "VEHICLES",
    guard: { permission: "Permission.Vehicles.Read" },
  },
  {
    labelKey: "nav.vehicleRegistrations",
    to: "/app/vehicle-registrations",
    icon: <BiIdCard />,
    section: "SYSTEM",
    category: "VEHICLES",
    guard: { permission: "Permission.Vehicles.Read" },
  },

  {
    labelKey: "nav.vehicleInsurances",
    to: "/app/vehicle-insurances",
    icon: <FaFileInvoice />,
    section: "SYSTEM",
    category: "VEHICLES",
    guard: { permission: "Permission.Vehicles.Read" },
  },
  {
    labelKey: "nav.vehicleBusinessTrips",
    to: "/app/vehicle-business-trips",
    icon: <BiTrip />,
    section: "SYSTEM",
    category: "VEHICLES",
    guard: { permission: "Permission.Vehicles.Read" },
  },

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
    icon: <FaShieldAlt />,
    section: "SYSTEM",
    category: "IDENTITY",
    guard: { permission: "Permission.Roles.Read" },
  },
  {
    labelKey: "nav.users",
    to: "/app/administration/users",
    icon: <FaUserCog />,
    section: "SYSTEM",
    category: "IDENTITY",
    guard: { permission: "Permission.Users.Read" },
  },
];
