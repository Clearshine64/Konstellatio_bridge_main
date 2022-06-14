import req, { Opts } from './req';
import {GET} from './methods';

/**
 * Make get request
 *
 * @param {string} url
 * @param {object} opts {{method|string, path|string, query|object, data|object}}
 * @param {boolean} log
 * @returns {Promise<*>}
 */
export default function get (url: string, opts?: Opts, log = false) {
    return req(url, {
        ...opts,
        method: GET,
    }, log);
}
