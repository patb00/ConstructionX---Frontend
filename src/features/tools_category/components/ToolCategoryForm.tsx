import { useTranslation } from "react-i18next";
import type { NewToolCategoryRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

type Props = {
  defaultValues?: Partial<NewToolCategoryRequest>;
  onSubmit: (values: NewToolCategoryRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function ToolCategoryForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewToolCategoryRequest>[] = [
    {
      name: "name",
      label: t("toolCategories.form.field.name"),
      required: true,
    },
    { name: "description", label: t("toolCategories.form.field.description") },
  ];

  return (
    <SmartForm<NewToolCategoryRequest>
      fields={fields}
      rows={[["name", "description"]]}
      defaultValues={{
        name: "",
        description: null,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("toolCategories.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
