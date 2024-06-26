export interface APIRequestOptions {
  rootURL: string;
  serviceKey: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface APIFetchOptions<Body = any> {
  method: string;
  body?: Body;
}

export const createAPIFetcher =
  (options: APIRequestOptions) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async <Response = any, RequestBody = any>(
    path: string,
    fetchOptions: APIFetchOptions<RequestBody>
  ): Promise<Response> => {
    const response = await fetch(`${options.rootURL}${path}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.serviceKey}`,
      },
      body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
    });
    const data = await response.json();
    if (response.status !== 200) {
      console.error(data);
      throw new Error(JSON.stringify(data, null, 2));
    }
    return data as Response;
  };
