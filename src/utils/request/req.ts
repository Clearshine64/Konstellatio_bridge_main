import { POST, PUT } from './methods';

export interface Query {
    [key: string]: any;
}

interface Data {
    [key: string]: any;
}

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT';

export type Opts = {
    method?: Method;
    path?: string;
    query?: Query;
    data?: Data;
};

export default function req(
    url: string,
    { method, path, query, data }: Opts = {
        method: 'GET',
        path: '',
    },
    log = false,
) {
    path = path || '';
    const urlPath = new URL(`${url}${path}`);
    query &&
        Object.keys(query).forEach((param) => {
            if (query[param]) urlPath.searchParams.append(param, query[param]);
        });

    log && console.log(urlPath.toString());

    return fetch(
        urlPath.toString(),
        method === POST || method === PUT
            ? {
                  method,
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
              }
            : {},
    ).then((response) => response.json());
}
