export interface APIRequestOptions {
  rootURL: string;
  serviceKey: string;
}

export const createAgentAPIFetcher =
  (options: APIRequestOptions) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async<Response=any> (path: string, fetchOptions: RequestInit) : Promise<Response> => {
    const response = await fetch(`${options.rootURL}${path}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.serviceKey}`,
      },
      ...fetchOptions,
    });
    const data = await response.json();
    if (response.status !== 200) {
      console.error(data);
      throw new Error(JSON.stringify(data, null, 2));
    }
    return data as Response;
  };
