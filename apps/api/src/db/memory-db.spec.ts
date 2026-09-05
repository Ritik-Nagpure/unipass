import { eq, and, isNull, gt, lt } from 'drizzle-orm';
import {
  users,
  sessions,
  applications,
  auditLogs,
} from './schema';
import { MemoryDb } from './memory-db';

describe('memory-db', () => {
  let db: MemoryDb;

  beforeEach(() => {
    db = new MemoryDb();
  });

  it('inserts a row applying column defaults (uuid + timestamps + literals)', async () => {
    const [row] = await db
      .insert(users)
      .values({
        email: 'a@example.com',
        passwordHash: 'hash',
        name: 'Alice',
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      });

    expect(row.email).toBe('a@example.com');
    expect(row.name).toBe('Alice');
    expect(row.role).toBe('user'); // literal default
    expect(row.id).toMatch(/^[0-9a-f-]{36}$/); // gen_random_uuid()
    expect(row.createdAt).toBeInstanceOf(Date); // now()
  });

  it('filters rows with eq', async () => {
    await db.insert(users).values({ email: 'a@example.com', passwordHash: 'h', name: 'A' });
    await db.insert(users).values({ email: 'b@example.com', passwordHash: 'h', name: 'B' });

    const found = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, 'a@example.com'));

    expect(found).toHaveLength(1);
    expect(found[0].email).toBe('a@example.com');
  });

  it('combines eq + isNull + gt in an and() condition', async () => {
    await db.insert(sessions).values({
      userId: 'u1',
      refreshTokenHash: 'hash1',
      expiresAt: new Date(Date.now() + 60_000), // future
    });
    await db.insert(sessions).values({
      userId: 'u1',
      refreshTokenHash: 'hash2',
      expiresAt: new Date(Date.now() - 60_000), // expired
      revokedAt: new Date(), // revoked
    });

    const valid = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, 'u1'),
          isNull(sessions.revokedAt),
          gt(sessions.expiresAt, new Date())
        )
      );

    expect(valid).toHaveLength(1);
    expect(valid[0].refreshTokenHash).toBe('hash1');
  });

  it('supports lt for timestamps', async () => {
    await db.insert(sessions).values({
      userId: 'u1',
      refreshTokenHash: 'h',
      expiresAt: new Date(Date.now() + 60_000),
    });

    const old = await db
      .select()
      .from(sessions)
      .where(lt(sessions.expiresAt, new Date()));

    expect(old).toHaveLength(0);
  });

  it('updates rows matching a condition and returns projected columns', async () => {
    const [app] = await db
      .insert(applications)
      .values({
        ownerId: 'owner-1',
        name: 'App One',
        clientId: 'up_123',
        clientSecretHash: 'sh',
        redirectUris: ['https://a.com/cb'],
      })
      .returning({ id: applications.id, name: applications.name });

    const [updated] = await db
      .update(applications)
      .set({ name: 'Renamed', updatedAt: new Date() })
      .where(eq(applications.id, app.id))
      .returning({ id: applications.id, name: applications.name });

    expect(updated.name).toBe('Renamed');
  });

  it('deletes rows matching a condition', async () => {
    await db.insert(users).values({ email: 'a@example.com', passwordHash: 'h', name: 'A' });
    await db.insert(users).values({ email: 'b@example.com', passwordHash: 'h', name: 'B' });

    await db.delete(users).where(eq(users.email, 'a@example.com'));

    const all = await db.select().from(users);
    expect(all).toHaveLength(1);
    expect(all[0].email).toBe('b@example.com');
  });

  it('orders results ascending by createdAt', async () => {
    await db.insert(applications).values({
      ownerId: 'o1',
      name: 'Older',
      clientId: 'up_1',
      clientSecretHash: 'h',
      redirectUris: [],
      createdAt: new Date('2024-01-02T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
    });
    await db.insert(applications).values({
      ownerId: 'o1',
      name: 'Newer',
      clientId: 'up_2',
      clientSecretHash: 'h',
      redirectUris: [],
      createdAt: new Date('2024-06-01T00:00:00Z'),
      updatedAt: new Date('2024-06-01T00:00:00Z'),
    });

    const rows = await db
      .select({ name: applications.name })
      .from(applications)
      .where(eq(applications.ownerId, 'o1'))
      .orderBy(applications.createdAt);

    expect(rows.map((r) => r.name)).toEqual(['Older', 'Newer']);
  });

  it('isolates data per table', async () => {
    await db.insert(users).values({ email: 'a@example.com', passwordHash: 'h', name: 'A' });
    await db.insert(auditLogs).values({ eventType: 'test' });

    expect(await db.select().from(users)).toHaveLength(1);
    expect(await db.select().from(auditLogs)).toHaveLength(1);
  });

  it('reset() clears all tables', async () => {
    await db.insert(users).values({ email: 'a@example.com', passwordHash: 'h', name: 'A' });
    db.reset();
    expect(await db.select().from(users)).toHaveLength(0);
  });

  it('mutating a returned row does not corrupt the store (deep clone)', async () => {
    const [row] = await db
      .insert(applications)
      .values({
        ownerId: 'o1',
        name: 'App',
        clientId: 'up_x',
        clientSecretHash: 'h',
        redirectUris: ['https://a.com'],
      })
      .returning();

    (row.redirectUris as string[]).push('https://evil.com');

    const [stored] = await db
      .select()
      .from(applications)
      .where(eq(applications.clientId, 'up_x'));

    expect(stored.redirectUris).toEqual(['https://a.com']);
  });
});