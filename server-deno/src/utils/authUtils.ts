import * as encoding from "@std/encoding";
import type { Session, User } from "../db/schemas/auth.ts";

export function generateSessionToken(length = 20): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(length));
  const base32Encoded = encoding.encodeBase32(randomBytes);
  return base32Encoded;
}

export async function createSession(token: string, userId: number): Session {
  const textBuffer = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", textBuffer);
  const hash = encoding.encodeHex(hashBuffer);

  const session: Session = {
    id: hash,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  // await db.insert(sessionTable).values(session);
  return session;
}

// export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
// 	const result = await db
// 		.select({ user: userTable, session: sessionTable })
// 		.from(sessionTable)
// 		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
// 		.where(eq(sessionTable.id, sessionId));
// 	if (result.length < 1) {
// 		return { session: null, user: null };
// 	}

// 	const { user, session } = result[0];

// 	if (Date.now() >= session.expiresAt.getTime()) {
// 		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
// 		return { session: null, user: null };
// 	}

// 	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
// 		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
// 		await db
// 			.update(sessionTable)
// 			.set({
// 				expiresAt: session.expiresAt
// 			})
// 			.where(eq(sessionTable.id, session.id));
// 	}

// 	return { session, user };
// }

// export async function invalidateSession(sessionId: string): Promise<void> {
// 	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
// }

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
