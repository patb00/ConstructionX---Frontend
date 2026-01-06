import type { VehicleRegistrationEmployee } from "../..";

export type StatusTag = {
  label: string;
  color: "default" | "success" | "warning";
};

export type TaskView = {
  task: VehicleRegistrationEmployee;
  title: string;
  subtitle?: string | null;
  deadline: string;
  projectName: string;
  regNumber?: string | null;
  statusTag: StatusTag;
  disabled: boolean;
  isCompleted: boolean;
};

export type TaskSection = {
  key: string;
  title: string;
  items: TaskView[];
};

export type KanbanColumn = {
  key: string;
  title: string;
  items: TaskView[];
};

export type CalendarDay = {
  key: string;
  label: string;
  dateLabel: string;
  tasks: TaskView[];
};
