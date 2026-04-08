import type { ReactNode } from 'react';
import type { Tabs } from 'radix-ui';

export type TabsProps = Tabs.TabsProps & CustomProps;

type CustomProps = {
  options: Options[];
};

type Options = {
  value: string;
  title: string;
  icon: ReactNode;
};
