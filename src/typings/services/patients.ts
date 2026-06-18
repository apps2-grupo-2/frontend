import type { MockUser } from '@/mocks/auth-mock';

export type GetPatientsRequest = {
  dni?: string;
  name?: string;
  email?: string;
};

export type GetPatientsResponse = MockUser[];