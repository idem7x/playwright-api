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

export type RequestParams = Record<string, string | number | boolean>;
export type RequestBody = Record<string, unknown> | unknown[] | string | null;
export type RequestHeaders = Record<string, string>;
