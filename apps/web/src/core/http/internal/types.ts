export type FetchWithTimeoutOptions = RequestInit & {
  timeout?: number;
};

export type FetchWithRetryOptions = FetchWithTimeoutOptions & {
  retry?: number;
};

export type HttpOptions = Omit<FetchWithRetryOptions, 'method'> & {
  responseType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';
};

export type HttpResponseDefault =
  | Record<string, unknown>
  | Array<unknown>
  | ArrayBuffer
  | Blob
  | FormData
  | boolean
  | number
  | string
  | null
  | undefined;

export type HttpResponse<T extends HttpResponseDefault> = T;

export type HttpClient = {
  get: <T extends HttpResponseDefault>(url: string | URL | Request, options?: HttpOptions) => Promise<HttpResponse<T>>;
  post: <T extends HttpResponseDefault>(url: string | URL | Request, options?: HttpOptions) => Promise<HttpResponse<T>>;
  put: <T extends HttpResponseDefault>(url: string | URL | Request, options?: HttpOptions) => Promise<HttpResponse<T>>;
  patch: <T extends HttpResponseDefault>(
    url: string | URL | Request,
    options?: HttpOptions,
  ) => Promise<HttpResponse<T>>;
  del: <T extends HttpResponseDefault>(url: string | URL | Request, options?: HttpOptions) => Promise<HttpResponse<T>>;
};

export type Http = (baseUrl?: string, defaultOptions?: HttpOptions | undefined) => HttpClient;
