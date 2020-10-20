import _ from 'lodash';

import prepareForStaticWebsite from './lib/prepareForStaticWebsite';
import resolveDeployment from './lib/resolveDeployment';

/**
 * Initialize plugin with command options
 *
 * @param {Object} commander
 * @returns {Object}
 */
export function init(commander) {
  commander.option('--env <env>', '(optional) the AWS S3 environment that Felfire must deploys to');

  return commander;
}

/**
 * Run the deployment to AWS S3
 *
 * @param {Object} compiler
 * @param {Object} commander
 * @returns {Promise}
 */
export default function ({ compiler, commander }) {
  const pluginConfigRaw = _.find(compiler.config.plugins, plugin => plugin[0] === 'aws-s3');
  const message = 'Missing plugin\'s configuration properties. See all mandatory properties in ' +
    'the documentation: https://github.com/nicolascava/felfire-aws-s3#configuration.';

  if (!pluginConfigRaw) throw new Error(message);

  const pluginConfig = pluginConfigRaw[1];
  const baseConfig = {
    accessKeyID: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: pluginConfig.bucket,
    region: pluginConfig.region,
  };
  const secondMessage = 'Missing mandatory configuration properties. See all mandatory ' +
    'properties in the documentation: https://github.com/nicolascava/felfire-aws-s3#configuration.';

  let config = null;

  if (
    !baseConfig.accessKeyID ||
    !baseConfig.secretAccessKey ||
    !baseConfig.bucket ||
    !baseConfig.region
  ) {
    throw new Error(secondMessage);
  }

  if (compiler.config.mode === 'static') {
    config = {
      ...baseConfig,
      ...prepareForStaticWebsite(compiler, commander),
    };
  }

  return new Promise(async resolve => resolveDeployment(config, compiler, resolve));
}
