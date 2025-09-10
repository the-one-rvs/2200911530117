
export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Pkg = 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service' | 'auth' | 'config' | 'middleware' | 'utils';

export interface LoggerConfig {
  authToken: string; 
  endpoint?: string;
}

export class Logger {
  private endpoint: string;
  private token: string;

  constructor(cfg: LoggerConfig) {
    this.endpoint = cfg.endpoint ?? 'http://20.244.56.144/evaluation-service/logs';
    this.token = cfg.authToken ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2YWliaGF2c2Fyc3dhdDE0MjAwNUBnbWFpbC5jb20iLCJleHAiOjE3NTc0OTE5NTAsImlhdCI6MTc1NzQ5MTA1MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImI3MmZjNjFmLWE1NTgtNDg4ZS05YTJkLWIxNDZjMWYxOWUzMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InZhaWJoYXYgc2Fyc3dhdCIsInN1YiI6Ijc5MWVhNWQxLTdlYjktNGY4Yy1hZWM0LTc0ZmY0OWVjODE3OCJ9LCJlbWFpbCI6InZhaWJoYXZzYXJzd2F0MTQyMDA1QGdtYWlsLmNvbSIsIm5hbWUiOiJ2YWliaGF2IHNhcnN3YXQiLCJyb2xsTm8iOiIyMjAwOTExNTMwMTE3IiwiYWNjZXNzQ29kZSI6Ik5Xa3RCdSIsImNsaWVudElEIjoiNzkxZWE1ZDEtN2ViOS00ZjhjLWFlYzQtNzRmZjQ5ZWM4MTc4IiwiY2xpZW50U2VjcmV0Ijoia1lrSE5rYWZYRmJoZG5keSJ9.gnXu48IMlF6lgI7br1gHg1M-azYzW-9gXr717J4FqyA';
  }

  async log(stack: Stack, level: Level, pkg: Pkg, message: string): Promise<void> {

    const validStacks: Stack[] = ['backend', 'frontend'];
    const validLevels: Level[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    const validPkgs: Pkg[] = ['cache','controller','cron_job','db','domain','handler','repository','route','service','auth','config','middleware','utils'];

    if (!validStacks.includes(stack)) throw new Error('invalid stack');
    if (!validLevels.includes(level)) throw new Error('invalid level');
    if (!validPkgs.includes(pkg)) throw new Error('invalid package');

    try {
  const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ stack, level, package: pkg, message })
      });

      if (!res.ok) {
        
      }
    } catch {
     
    }
  }
}


export function createRequestLogger(logger: Logger) {
  return function requestLogger(req: any, res: any, next: any) {
    const start = Date.now();
    const id = Math.random().toString(36).slice(2, 10);
    logger.log('backend','info','middleware',`req ${id} ${req.method} ${req.originalUrl}`);
    res.on('finish', () => {
      const ms = Date.now() - start;
      logger.log('backend','info','middleware',`res ${id} ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
    });
    next();
  };
}

export default Logger;
