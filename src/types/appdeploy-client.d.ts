declare module "@appdeploy/client" {
  export const api: {
    get(url: string): Promise<{ data: any }>;
    post(url: string, body?: unknown): Promise<{ data: any }>;
    put(url: string, body?: unknown): Promise<{ data: any }>;
    delete(url: string): Promise<{ data: any }>;
  };
  export const auth: {
    isSignedIn(): boolean;
    getUser(): Promise<any>;
    signIn(): Promise<{ user: any }>;
    signOut(): Promise<void>;
  };
  export const image: {
    resizeIfNeeded(
      file: File,
      options?: { maxDimension?: number; maxPixels?: number }
    ): Promise<{ data: string; mimeType: string; bytes: number }>;
  };
}
