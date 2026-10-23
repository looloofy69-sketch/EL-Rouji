// Build-only compatibility shim for GitHub Actions.
// The hosted AppDeploy runtime provides the real @appdeploy/client package.
// This shim is selected only when EL_ROUJI_CI_BUILD=1 and must never be deployed.
type ApiResult = { data: any };
async function request(method: string, url: string, body?: unknown): Promise<ApiResult> {
  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((payload as { error?: string }).error || `HTTP ${response.status}`);
  return { data: payload };
}

export const api = {
  get: (url: string) => request("GET", url),
  post: (url: string, body?: unknown) => request("POST", url, body),
  put: (url: string, body?: unknown) => request("PUT", url, body),
  delete: (url: string) => request("DELETE", url),
};

const unavailable = () => new Error("AppDeploy authentication is available only in the hosted runtime.");
export const auth = {
  isSignedIn: () => false,
  getUser: async () => null,
  signIn: async (): Promise<never> => { throw unavailable(); },
  signOut: async () => undefined,
};

export const image = {
  resizeIfNeeded: async (file: File, _options?: { maxDimension?: number; maxPixels?: number; quality?: number; mimeType?: string }) => ({
    data: "",
    mimeType: file.type || "application/octet-stream",
    bytes: file.size,
  }),
};
