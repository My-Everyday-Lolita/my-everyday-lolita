export interface UserRegistrationDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserSignInDto {
  username: string;
  password: string;
}

export interface UserSignInResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface UserSignInInfos extends UserSignInResponse {
  datetime: number;
}

export interface User {
  preferred_username: string;
  email: string;
  sub: string;
  realm_access: {
    roles: string[]
  };
}
