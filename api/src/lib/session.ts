import { Context } from "hono";
import { KVNamespace } from "@cloudflare/workers-types";

class Session {
  private data: Record<string, any> | undefined;
  private sessionId: string;
  private kv: KVNamespace;
  private loaded: boolean = false;
  private sessionExpire: number;

  constructor(
    c: Context,
    sessionId: string,
    sessionExpire: number = 60 * 60 * 24
  ) {
    this.sessionId = sessionId;
    this.kv = c.env.SAMPLE_KV;
    this.sessionExpire = sessionExpire;
  }

  private async loadData(): Promise<void> {
    if (!this.loaded) {
      const data = await this.kv.get(this.sessionId);
      this.data = data ? JSON.parse(data) : {};
      this.loaded = true;
    }
  }

  public async set(key: string, value: any): Promise<void> {
    await this.loadData();
    this.data![key] = value;
    await this.kv.put(this.sessionId, JSON.stringify(this.data), {
      expirationTtl: this.sessionExpire,
    });
  }

  public async get(key: string): Promise<any> {
    await this.loadData();
    return this.data![key];
  }

  public async delete(key: string): Promise<void> {
    await this.loadData();
    delete this.data![key];
    await this.kv.put(this.sessionId, JSON.stringify(this.data));
  }

  public async clear(): Promise<void> {
    this.data = {};
    await this.kv.put(this.sessionId, JSON.stringify(this.data));
  }

  public async destroy(): Promise<void> {
    await this.kv.delete(this.sessionId);
  }
}

export default Session;
