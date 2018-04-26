import * as webpack from 'webpack';
import * as path from 'path';
import * as ghpages from 'gh-pages';
import {green, exec, createWebpackConf } from '../../utils';

// TODO: clean publish_dist after deploy

export const publish = async () => {
  green('Copying files 📂');

  const indexPath = path.resolve(__dirname, './index.html');
  const appPath = path.resolve(__dirname, '../../../../../');
  const distPath = `${appPath}/publish_dist`;

  await exec(`mkdir -p ${distPath}`);
  await exec(`cp ${indexPath} ${distPath}`);

  green('Creating build 📦');

  const config = createWebpackConf({
    mode: 'production',
    output: {
      path: distPath,
      filename: 'dist-bundle.js'
    }
  });
  const compiler = webpack(config);

  compiler.run((_, stats) => {
    console.log('hasErrors', stats.hasErrors());
    console.log(stats.toString());

    green('Publishing build 🚀');

    ghpages.publish(distPath, {
      // repo: ''
    }, (err: Error) => {
      if (err) {
        console.log('gh-pages publish error', err);
      }
    });
  });
};