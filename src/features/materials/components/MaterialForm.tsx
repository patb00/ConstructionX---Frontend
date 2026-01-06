import { useTranslation } from "react-i18next";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import type { NewMaterialRequest } from "..";

type Props = {
  defaultValues?: Partial<NewMaterialRequest>;
  onSubmit: (values: NewMaterialRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function MaterialForm({ defaultValues, onSubmit, busy }: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewMaterialRequest>[] = [
    { name: "name", label: t("materials.form.field.name"), required: true },
    {
      name: "unitOfMeasure",
      label: t("materials.form.field.unitOfMeasure"),
      required: true,
    },
    {
      name: "quantity",
      label: t("materials.form.field.quantity"),
      type: "number",
      required: true,
    },
    {
      name: "unitPrice",
      label: t("materials.form.field.unitPrice"),
      type: "number",
      required: true,
    },
    {
      name: "articleCode",
      label: t("materials.form.field.articleCode"),
    },
    { name: "barcode", label: t("materials.form.field.barcode") },
    { name: "weight", label: t("materials.form.field.weight"), type: "number" },
    {
      name: "description",
      label: t("materials.form.field.description"),
      type: "textarea",
    },
  ];

  return (
    <SmartForm<NewMaterialRequest>
      fields={fields}
      rows={[
        ["name", "unitOfMeasure"],
        ["quantity", "unitPrice"],
        ["articleCode", "barcode"],
        ["weight"],
        ["description"],
      ]}
      defaultValues={defaultValues}
      busy={busy}
      submitLabel={t("materials.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
