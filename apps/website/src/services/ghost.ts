'use server';
import GhostAdminAPI from '@tryghost/admin-api';

export const subscribeToBlog = async (email: string) => {
  const api = new GhostAdminAPI({
    url: process.env.GHOST_API_URL,
    key: process.env.GHOST_API_KEY,
    version: 'v5.0',
  });
  await api.members.add({
    email,
  });
};
