import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';

import type { SearchBarProps } from '@/typings/modules/administrative-check-in/administrative-check-in';
import { RhfCombobox } from '@/components/rhf/rhf-combobox';

export const SearchBar = (props: SearchBarProps) => {
  const { form } = props;

  const searchWatched = useWatch({ control: form.control, name: 'search' });

  useEffect(() => {
    if (searchWatched.length >= 3) {
      //
    }
  }, [searchWatched]);

  const options = [
    { label: 'Juan Pérez - Dr. Smith - Turno #123', value: '123' },
    { label: 'María Gómez - Dr. Johnson - Turno #456', value: '456' },
    { label: 'Carlos López - Dr. Brown - Turno #789', value: '789' },
  ];

  return (
    <RhfCombobox
      name="search"
      control={form.control}
      options={options}
      placeholder="Buscar por nombre del paciente, médico o N° de turno..."
    />
  );
};