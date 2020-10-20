# Felfire AWS S3

> AWS S3 plugin for Felfire

> ❌ Sorry, but this library is no longer maintained. Please find an alternative.

## Getting started

Felfire AWS S3 is part of the [Felfire](https://github.com/nicolascava/felfire) plugin ecosystem.

## Why Felfire AWS S3?

Felfire AWS S3 is a plugin that takes compiled sources from a Felfire app or website then deploy it to a specified AWS S3's bucket.
 
Its purpose is to improve the developer experience on deployment pipelines.

## Command

Felfire AWS S3 will take sources from the build directory (e.q. `buildDir` from Felfire's configuration) to do its deployment process:

```bash
felfire aws-s3 [--env=staging]
```

### Option

`--env`: specify on which environment you want to deploy your sources (default to `production`). The second choice is `staging`. If specified, Felfire AWS S3 will prefix your bucket's name with `staging.` (removing `www.` prefix if present).

## Custom configuration

Here are the full options explained:

```json
"plugins": [
  ["aws-s3", {
    "bucket": "my-bucket-name",
    "region": "us-west-2"
  }]
]
```

## License

The MIT License (MIT)

Copyright (c) 2018 Nicolas Cava

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
