export interface AuthUser {
  id: string
}

export const verifySession = async (): Promise<AuthUser> => {
  'use server';
  const user = { id: 'test-user' }
  return user
}