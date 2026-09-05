import { setAuthCookies, clearAuthCookies, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './cookies';

const createRes = () => {
  const cookies: Record<string, { value: string; options?: Record<string, unknown> }> = {};
  const res = {
    cookie: jest.fn((name: string, value: string, options?: Record<string, unknown>) => {
      cookies[name] = { value, options };
    }),
    clearCookie: jest.fn((name: string, options?: Record<string, unknown>) => {
      cookies[name] = { value: '', options };
    }),
    cookies,
  };
  return res;
};

describe('cookies utils', () => {
  it('sets both auth cookies with httpOnly, sameSite lax and correct maxAge', () => {
    const res = createRes();
    setAuthCookies(res as never, 'access-jwt', 'refresh-jwt');

    expect(res.cookie).toHaveBeenCalledTimes(2);

    const access = res.cookies[ACCESS_TOKEN_COOKIE];
    const refresh = res.cookies[REFRESH_TOKEN_COOKIE];

    expect(access.value).toBe('access-jwt');
    expect(access.options).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    expect(access.options!.maxAge).toBe(15 * 60 * 1000);

    expect(refresh.value).toBe('refresh-jwt');
    expect(refresh.options!.maxAge).toBe(30 * 24 * 60 * 60 * 1000);
  });

  it('sets secure cookies only in production', () => {
    const previousEnv = process.env.NODE_ENV;

    try {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const prodModule = require('./cookies');
      const prodRes = createRes();
      prodModule.setAuthCookies(prodRes, 'a', 'r');
      expect(prodRes.cookies[prodModule.ACCESS_TOKEN_COOKIE].options!.secure).toBe(true);

      process.env.NODE_ENV = 'development';
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const devModule = require('./cookies');
      const devRes = createRes();
      devModule.setAuthCookies(devRes, 'a', 'r');
      expect(devRes.cookies[devModule.ACCESS_TOKEN_COOKIE].options!.secure).toBe(false);
    } finally {
      process.env.NODE_ENV = previousEnv;
      jest.resetModules();
    }
  });

  it('clears both auth cookies', () => {
    const res = createRes();
    clearAuthCookies(res as never);

    expect(res.clearCookie).toHaveBeenCalledWith(ACCESS_TOKEN_COOKIE, { path: '/' });
    expect(res.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN_COOKIE, { path: '/' });
  });
});