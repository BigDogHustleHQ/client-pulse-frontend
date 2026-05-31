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

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface UserResponse {
  getCurrentUser: User;
}
