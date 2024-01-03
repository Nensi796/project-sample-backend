export enum USER_ROLE {
  MANAGER = 'MaNAGER',
  EMP = 'EMP',

}

export interface LooseObject {
  [key: string]: any;
}

export enum ListSortOrder {
  ASC = 1,
  DESC = -1,
}

export type ListSort = {
  fieldName: string;
  order: ListSortOrder;
};

export const ERROR_MESSAGE = {
  USERNAME_PASSWORD_INCORRECT: 'Username or Password is Incorrect',
  REQUIRED_PARAMETERS_MISSING: 'Required parameters are missing',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  USER_NOT_EXISTS: 'User not exist',
  USER_ALREADY_EXISTS: 'User already exists',
  REQUIRE_TOKEN: 'No token available, authorization denied!',
  INVALID_TOKEN: 'Invalid Token, authorization denied',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  GENERIC_AUTHENTICATION_CHECK_ERROR:
    'Failed to Complete the Authentication Check',
};
