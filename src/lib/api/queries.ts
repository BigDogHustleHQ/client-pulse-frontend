export const GET_CURRENT_USER = `
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      firstName
      lastName
    }
  }
`;

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface GetCurrentUserResponse {
  getCurrentUser: CurrentUser;
}
