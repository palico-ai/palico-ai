export interface APIRequestOptions {
  rootURL: string;
  serviceKey: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface APIFetchOptions<Body = any> {
  method: string;
  body?: Body;
}

const formatPath = (path: string) =>
  path.charAt(0) === '/' ? path.substring(1) : path;

export const createAPIClient = (options: APIRequestOptions) => {
  return {
    fetchJSON: async <Response = any, RequestBody = any>(
      path: string,
      fetchOptions: APIFetchOptions<RequestBody>
    ): Promise<Response> => {
      const response = await fetch(`${options.rootURL}/${formatPath(path)}`, {
        method: fetchOptions.method,
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
    },
    fetch: async <RequestBody = any>(
      path: string,
      fetchOptions: APIFetchOptions<RequestBody>
    ): Promise<Response> => {
      const response = await fetch(`${options.rootURL}/${formatPath(path)}`, {
        method: fetchOptions.method,
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${options.serviceKey}`,
        },
        body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
      });
      if (response.status !== 200) {
        console.error('Error response', response);
        console.error('path', path);
        console.error('fetchOptions', fetchOptions);
        throw new Error(response.statusText);
      }
      return response;
    },
  };
};

// {
//   'x-powered-by' => { name: 'X-Powered-By', value: 'Express' },
//   'access-control-allow-origin' => { name: 'Access-Control-Allow-Origin', value: '*' },
//   'access-control-allow-headers' => { name: 'Access-Control-Allow-Headers', value: '*' },
//   'content-type' => { name: 'Content-Type', value: 'application/json' },
//   'transfer-encoding' => { name: 'Transfer-Encoding', value: 'chunked' },
//   'cache-control' => { name: 'Cache-Control', value: 'no-cache' },
//   'connection' => { name: 'Connection', value: 'keep-alive' },
//   'date' => { name: 'Date', value: 'Thu, 31 Oct 2024 17:54:16 GMT' }
// }

// {
//   'x-powered-by' => { name: 'X-Powered-By', value: 'Express' },
//   'access-control-allow-origin' => { name: 'Access-Control-Allow-Origin', value: '*' },
//   'access-control-allow-headers' => { name: 'Access-Control-Allow-Headers', value: '*' },
//   'content-type' => { name: 'Content-Type', value: 'application/json; charset=utf-8' },
//   'content-length' => { name: 'Content-Length', value: '208' },
//   'etag' => { name: 'ETag', value: 'W/"d0-cnxmvB321ad7QUM9fXATmGMpBdc"' },
//   'date' => { name: 'Date', value: 'Thu, 31 Oct 2024 18:00:10 GMT' },
//   'connection' => { name: 'Connection', value: 'keep-alive' },
//   'keep-alive' => { name: 'Keep-Alive', value: 'timeout=5' }
// }
