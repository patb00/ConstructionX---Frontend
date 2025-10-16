import type { NewConstructionSiteRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<NewConstructionSiteRequest>;
  onSubmit: (values: NewConstructionSiteRequest) => void | Promise<void>;
  busy?: boolean;
  managerOptions: Option[];
};

export default function ConstructionSiteForm({
  defaultValues,
  onSubmit,
  busy,
  managerOptions,
}: Props) {
  const fields: FieldConfig<NewConstructionSiteRequest>[] = [
    { name: "name", label: "Naziv", required: true },
    { name: "location", label: "Lokacija", required: true },
    { name: "startDate", label: "Početak", type: "date", required: true },
    {
      name: "plannedEndDate",
      label: "Planirani završetak",
      type: "date",
      required: true,
    },
    {
      name: "siteManagerId",
      label: "Voditelj gradilišta",
      type: "select",
      required: false,
      options: managerOptions,
    },
    { name: "description", label: "Opis" },
  ];

  return (
    <SmartForm<NewConstructionSiteRequest>
      fields={fields}
      rows={[
        ["name", "location"],
        ["startDate", "plannedEndDate"],
        ["siteManagerId", "description"],
      ]}
      defaultValues={{
        name: "",
        location: "",
        startDate: "",
        plannedEndDate: "",
        siteManagerId: null,
        description: null,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel="Spremi"
      onSubmit={onSubmit}
    />
  );
}
