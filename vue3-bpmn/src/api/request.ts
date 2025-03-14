
// export function request<T>(config: AxiosRequestConfig) {
//   return new Promise<T>((resolve, reject) => {
//     axios.request(config).then(response => {
//       if (response.data.code === 200) {
//         resolve(response.data.data);
//       } else {
//         reject(new Error(response.data.message));
//       }
//     }).catch(err => reject(err));
//   })
// }

import type {MYANY} from "@/types/type";

export function request<T>(config: RequestInit & { url: string; params?: Record<string, MYANY>; data?: MYANY }): Promise<T> {
  // Construct the query string from params
  const queryString = config.params
    ? '?' + new URLSearchParams(config.params).toString()
    : '';

  return new Promise<T>((resolve, reject) => {
    fetch(config.url + queryString, {
      ...config,
      body: config.data ? JSON.stringify(config.data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    })
      .then(async response => {
        const data = await response.json();
        if (response.ok && data.code === 200) {
          resolve(data.data);
        } else {
          reject(new Error(data.message || 'Request failed'));
        }
      })
      .catch(err => reject(err));
  });
}
