import type { UseFormReturn } from "react-hook-form";

export type AdministrativeCheckInFormProps = {
  search: string;
};

export type SearchBarProps = {
  form: UseFormReturn<AdministrativeCheckInFormProps>;
};