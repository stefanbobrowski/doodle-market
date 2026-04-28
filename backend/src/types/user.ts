export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: 'admin' | 'user';
  balance: number;
}

export interface PublicUser {
  id: number;
  username: string;
  role: 'admin' | 'user';
  balance: number;
}
