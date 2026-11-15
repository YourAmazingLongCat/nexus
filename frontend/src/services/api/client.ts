import { clearSession, getSession } from '../../features/auth/services/auth.api';

export class ApiError extends Error {
  constructor(public status: number, message: string, public details: unknown[] = [], public code?: string, public data?: unknown) {
    super(message); this.name = 'ApiError';
  }
}
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
/** Backend controllers return DTOs directly (including PageResponse.content), not envelopes. */
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!path.startsWith('/api/')) throw new ApiError(0, 'Invalid API path.');
  const headers = new Headers(options.headers);
  const session = getSession();
  if (session && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${session.accessToken}`);
  if (options.body != null && !(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  let response: Response;
  try { response = await fetch(API_BASE_URL + path, { ...options, headers }); }
  catch (error) {
    if (options.signal?.aborted) throw error;
    throw new ApiError(0, 'Không thể kết nối máy chủ. Vui lòng thử lại.');
  }
  const text = response.status === 204 ? '' : await response.text();
  let body: unknown = null;
  if (text) { try { body = JSON.parse(text); } catch { if (response.ok) throw new ApiError(response.status, 'Phản hồi máy chủ không hợp lệ.'); } }
  if (!response.ok) {
    if (response.status === 401 && headers.has('Authorization')) {
      clearSession();
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('nexus:session-changed'));
    }
    const error = body as { message?: string; details?: unknown[]; code?: string; data?: unknown } | null;
    throw new ApiError(response.status, error?.message || `Yêu cầu không thành công (${response.status}).`, Array.isArray(error?.details) ? error.details : [], typeof error?.code === 'string' ? error.code : undefined, error?.data);
  }
  return body as T;
}
export interface PageResponse<T> { content: T[]; page: number; size: number; totalElements: number; totalPages: number; first: boolean; last: boolean }
export function apiErrorMessage(error: unknown): string { return error instanceof Error ? error.message : 'Yêu cầu không thành công.'; }
