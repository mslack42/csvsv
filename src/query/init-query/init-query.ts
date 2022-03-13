import {copyFile} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {InitQueryOpts} from '../../data/opts/init-query-opts.js';
import {KnownError} from '../../errror/known-error.js';

export const initQuery = async (initQueryOpts: InitQueryOpts) => {
  const callback = (err: Error) => {
    if (err) {
      console.log(err);
      throw new KnownError('Initialisation failed');
    }console.log(`${initQueryOpts.name} initialised`);
  };

  const assetsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../assets/');
  const filename = initQueryOpts.withDocs ? 'initQueryWithDocs.mjs' : 'initQuery.mjs';

  copyFile(path.join(assetsDir, filename), initQueryOpts.name, callback);
};
