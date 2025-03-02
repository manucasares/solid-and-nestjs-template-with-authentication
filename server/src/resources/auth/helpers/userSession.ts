import { Request, Response } from 'express';
import { SessionSchema, UserSessionData } from 'src/types/auth';
import * as crypto from 'crypto';
import { COOKIE_SESSION_KEY, SESSION_EXPIRATION_MS } from '../auth.constants';
import { Cache } from 'cache-manager';

export async function createUserSession(
  user: UserSessionData,
  response: Response,
  cacheManager: Cache,
) {
  const sessionId = crypto.randomBytes(512).toString('hex').normalize();

  // Set session in redis with expiration time
  await cacheManager.set(
    `session:${sessionId}`,
    JSON.stringify(SessionSchema.parse(user)),
    SESSION_EXPIRATION_MS,
  );

  // Set session in cookies
  setSessionCookie(sessionId, response);
}

export function getUserFromSession(request: Request, cacheManager: Cache) {
  const sessionId = request.cookies[COOKIE_SESSION_KEY] as string;
  if (!sessionId) return null;
  return getUserSessionById(sessionId, cacheManager);
}

async function getUserSessionById(sessionId: string, cacheManager: Cache) {
  const rawUser = (await cacheManager.get(`session:${sessionId}`)) as string;
  const { success, data: user } = SessionSchema.safeParse(JSON.parse(rawUser));
  return success ? user : null;
}

function setSessionCookie(sessionId: string, response: Response) {
  response.cookie(COOKIE_SESSION_KEY, sessionId, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + SESSION_EXPIRATION_MS),
  });
}

export async function removeUserSession(
  request: Request,
  response: Response,
  cacheManager: Cache,
) {
  const sessionId = request.cookies[COOKIE_SESSION_KEY] as string;
  if (!sessionId) return null;

  response.clearCookie(COOKIE_SESSION_KEY);
  await cacheManager.del(`session:${sessionId}`);
}
