import path from 'path';
import s3 from 's3';

import compress from './compress';

/**
 * Fetch files from distribution directory
 *
 * @param {Object} config
 * @param {Object} compiler
 * @param {String} locale
 * @returns {Promise.<Array|Promise>}
 */
export default async function (config, compiler, locale = null) {
  const client = s3.createClient({
    maxAsyncS3: 20,
    s3RetryCount: 3,
    s3RetryDelay: 1000,
    multipartUploadThreshold: 20971520,
    multipartUploadSize: 15728640,
    s3Options: {
      accessKeyId: config.accessKeyID,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
    },
  });
  const defaultS3Params = {
    Bucket: config.bucket,
  };
  const compressed = await compress(compiler);

  if (compressed.assetsFiles.length > 0) {
    compiler.log.white('Deploying to ').blue(config.bucket).white('.').info();
  } else {
    compiler.log.yellow('No static assets found. Skipping deployment.').info();
  }

  compressed.assetsFiles.map((file) => {
    const params = {
      s3Params: JSON.parse(JSON.stringify(defaultS3Params)),
    };

    let relativeFile = null;

    if (compiler.config.mode === 'static') {
      const computedPath = path.join(process.cwd(), `${compiler.config.buildDir}/`, locale);

      relativeFile = file.replace(computedPath, '');
    } else {
      relativeFile = file.replace(path.join(process.cwd(), `${compiler.config.buildDir}/`), '');
    }

    const isFileCompressed = compressed.compressedFiles.indexOf(file) > -1;

    params.localFile = path.join(process.cwd(), compiler.config.buildDir, relativeFile);
    params.s3Params.Key = relativeFile;

    if (isFileCompressed) params.s3Params.ContentEncoding = 'gzip';

    if (file.match(/\.(html)$/)) {
      params.s3Params.CacheControl = 'no-transform, max-age=60, s-maxage=60';
      params.s3Params.Expires = new Date(new Date().setMinutes(new Date().getMinutes() + 1));
    } else {
      params.s3Params.CacheControl = 'no-transform, max-age=31536000, s-maxage=31536000';
      params.s3Params.Expires = new Date(new Date().setYear(new Date().getFullYear() + 1));
    }

    client.uploadFile(params);
    params.s3Params = JSON.parse(JSON.stringify(defaultS3Params));

    if (isFileCompressed) {
      compiler.log.green(path.basename(file)).white(' is uploaded (gzipped).').info();
    } else {
      compiler.log.green(path.basename(file)).white(' is uploaded.').info();
    }

    return file;
  });

  return compressed;
}
