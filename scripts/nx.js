const { spawnSync } = require('node:child_process');
const path = require('node:path');

const nxBin = require.resolve('nx/bin/nx.js');
const result = spawnSync(process.execPath, [nxBin, ...process.argv.slice(2)], {
  cwd: path.resolve(__dirname, '..'),
  env: {
    ...process.env,
    NX_DAEMON: 'false',
  },
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
