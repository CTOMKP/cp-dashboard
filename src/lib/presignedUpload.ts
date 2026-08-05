import { apiPost, getBackendBaseUrl } from "@/lib/apiClient";

function unwrapRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

/** Normalize presign JSON (handles TransformInterceptor nesting). */
export function normalizePresignPayload(payload: unknown): {
  uploadUrl: string;
  key: string;
} {
  const root = unwrapRecord(payload);
  if (!root) throw new Error("Invalid upload response");
  const layer1 = unwrapRecord(root.data) ?? root;
  const layer2 = unwrapRecord(layer1.data) ?? layer1;
  const uploadUrl = layer2.uploadUrl;
  const key = layer2.key;
  if (typeof uploadUrl !== "string" || typeof key !== "string") {
    throw new Error("Invalid upload response");
  }
  return { uploadUrl, key };
}

export async function putFileToPresignedUrl(
  uploadUrl: string,
  file: File,
  signal?: AbortSignal,
  contentType?: string,
): Promise<void> {
  const contentTypeHeader = contentType ?? (file.type || "application/octet-stream");
  const headers: HeadersInit = {};
  if (contentTypeHeader) {
    headers["Content-Type"] = contentTypeHeader;
  }

  const res = await fetch(uploadUrl, {
    method: "PUT",
    mode: "cors",
    cache: "no-store",
    credentials: "omit",
    headers,
    body: file,
    signal,
  });
  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }
}

export type PresignImageKind = "generic" | "profile" | "banner";

export async function uploadPresignedImage(
  kind: PresignImageKind,
  file: File,
  opts?: { userId?: string; projectId?: string; signal?: AbortSignal },
): Promise<{ viewUrl: string; key: string }> {
  const mimeType = file.type || "application/octet-stream";
  const body: Record<string, string | number> = {
    type: kind,
    filename: file.name,
    mimeType,
    size: file.size,
  };
  if (opts?.userId != null) body.userId = opts.userId;
  if (opts?.projectId != null) body.projectId = opts.projectId;

  const payload = await apiPost<unknown>("/api/v1/images/presign", body, {
    signal: opts?.signal,
  });

  const { uploadUrl, key } = normalizePresignPayload(payload);
  await putFileToPresignedUrl(uploadUrl, file, opts?.signal, mimeType);

  const base = getBackendBaseUrl();
  const viewUrl = `${base}/api/v1/images/view/${key}`;
  return { viewUrl, key };
}
