import { useState } from 'react';

import type { SearchBarProps } from '@/typings/modules/administrative-check-in/administrative-check-in';
import { RhfAsyncCombobox } from '@/components/rhf/rhf-async-combobox';
import { useGetPatientsSearch } from '@/hooks/use-patients-data/use-patients-data';

export const SearchBar = (props: SearchBarProps) => {
  const { form } = props;
  const [search, setSearch] = useState('');
  const { data: patients, isLoading } = useGetPatientsSearch(search);
  return (
    <RhfAsyncCombobox
      name="patientId"
      control={form.control}
      options={patients || []}
      placeholder="Buscar paciente por nombre o email..."
      onValueChange={setSearch}
      search={search}
      isFetching={isLoading}
    />
  );
};