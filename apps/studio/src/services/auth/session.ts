'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { RoutePath } from '../../utils/route_path';
import { redirect } from 'next/navigation';

export const verifySession = async (): Promise<void> => {
  if (isDevMode()) {
    return;
  }
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.role) {
    redirect(RoutePath.login());
  }
};

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  role: string;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export const createSession = async () => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ role: 'dashboard' });

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
};

export const deleteSession = () => {
  cookies().delete('session');
};

export const isDevMode = () => {
  return process.env.DEV_MODE === 'true';
};
