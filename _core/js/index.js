
const log = console.log;

log('hey');

import('../../_data/placeholder.json', { with: { type: 'json'} })
  .then(file => { log(file.default) })