'use server';

import { createSession, deleteSession } from './session';

export const logout = async () => {
  deleteSession();
};

export const login = async (username: string, password: string) => {
  if (!process.env.STUDIO_USERNAME) {
    throw new Error('STUDIO_USERNAME is not defined');
  }
  if (!process.env.STUDIO_PASSWORD) {
    throw new Error('STUDIO_PASSWORD is not defined');
  }
  if (
    username === process.env.STUDIO_USERNAME &&
    password === process.env.STUDIO_PASSWORD
  ) {
    await createSession();
  } else {
    throw new Error('Invalid username or password');
  }
};
