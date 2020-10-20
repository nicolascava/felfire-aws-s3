import uploadFiles from './uploadFiles';

/**
 * Resolve file deployment to AWS S3
 *
 * @param {Object} config
 * @param {Object} compiler
 * @param {Function} resolve
 * @returns {Promise.<*>}
 */
export default async function (config, compiler, resolve) {
  const mutableConfig = config;

  if (compiler.config.mode === 'static') {
    let resolvedCount = 0;

    return mutableConfig.locales.map(async (locale) => {
      if (mutableConfig.env === 'staging' && mutableConfig.locales.indexOf(locale) === 0) {
        mutableConfig.bucket = mutableConfig.bucket.indexOf('www.') > -1 ?
          mutableConfig.bucket.replace('www.', 'staging.') : `staging.${mutableConfig.bucket}`;
      }

      if (mutableConfig.env === 'staging' && mutableConfig.locales.indexOf(locale) > 0) {
        mutableConfig.bucket = mutableConfig.bucket.indexOf('www.') > -1 ?
          mutableConfig.bucket.replace('www.', `staging.${locale}.`) :
          `staging.${locale}.${mutableConfig.bucket}`;
      }

      if (mutableConfig.env === 'prod' && mutableConfig.locales.indexOf(locale) > 0) {
        mutableConfig.bucket = mutableConfig.bucket.indexOf('www.') > -1 ?
          mutableConfig.bucket.replace('www.', `${locale}.`) : `${locale}.${mutableConfig.bucket}`;
      }

      await uploadFiles(mutableConfig, compiler, locale);

      resolvedCount += 1;

      if (resolvedCount === mutableConfig.locales.length) return resolve();

      return locale;
    });
  }

  await uploadFiles(mutableConfig, compiler);

  return resolve();
}
