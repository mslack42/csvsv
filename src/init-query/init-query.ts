import {copyFile} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {InitQueryOpts} from '../data/opts/init-query-opts';

export const initQuery = async (initQueryOpts: InitQueryOpts) => {
  const callback = (err: Error) => {
    if (err) throw err;
    console.log(`${initQueryOpts.name} initialised`);
  };

  const assetsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../assets/');
  const filename = initQueryOpts.withDocs ? 'initQueryWithDocs.js' : 'initQuery.js';

  copyFile(path.join(assetsDir, filename), initQueryOpts.name, callback);
};
