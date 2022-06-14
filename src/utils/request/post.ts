import req, { Opts } from './req';
import {POST} from './methods';

/**
 * Make post request
 *
 * @param {string} url
 * @param opts {{method|string, path|string, query|object, data|object}}
 * @param {boolean} log
 * @returns {Promise<*>}
 */
export default function post (url: string, opts: Opts, log = false) {
    return req(url, {
        ...opts,
        method: POST,
    }, log);
}
