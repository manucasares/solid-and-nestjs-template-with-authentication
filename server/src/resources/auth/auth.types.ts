import { User } from '../users/users.entity';

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export type UserWithNoCredentials = Omit<User, 'password' | 'salt'>;
