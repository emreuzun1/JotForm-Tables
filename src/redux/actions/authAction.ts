import * as type from '../actionTypes';

export function requestLogin(email: string, password: string) {
  return {
    type: type.USER_LOGIN_REQUEST,
    payload: {
      email,
      password,
    },
  };
}

export function requestLogout() {
  return {
    type: type.USER_LOGOUT_REQUEST,
  };
}

export function requestRegister(
  username: string,
  email: string,
  password: string,
) {
  return {
    type: type.USER_REGISTER_REQUEST,
    payload: {
      username: username,
      password: password,
      email: email,
    },
  };
}
