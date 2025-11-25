export type UserGender = 'male' | 'female';
export type UserStatus = 'active' | 'inactive';

export interface UserData {
  name: string;
  email: string;
  gender: UserGender;
  status: UserStatus;
}

export interface User extends UserData {
  id: number;
}

export type CreateUserRequest = UserData;
export type UpdateUserRequest = Partial<UserData>;

export interface ErrorResponse {
  field: string;
  message: string;
}