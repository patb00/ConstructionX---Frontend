import type { NewConstructionSiteRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

type Props = {
  defaultValues?: Partial<NewConstructionSiteRequest>;
  onSubmit: (values: NewConstructionSiteRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function ConstructionSiteForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const fields: FieldConfig<NewConstructionSiteRequest>[] = [
    { name: "name", label: "Naziv", required: true },
    { name: "location", label: "Lokacija", required: true },
    {
      name: "startDate",
      label: "Početak",
      type: "date",
      required: true,
    },
    {
      name: "plannedEndDate",
      label: "Planirani završetak",
      type: "date",
      required: true,
    },
    {
      name: "siteManagerId",
      label: "Voditelj gradilišta (ID)",
      type: "number",
      required: true,
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
        siteManagerId: 0,
        description: null,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel="Spremi"
      onSubmit={onSubmit}
    />
  );
}
