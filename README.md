# nestjs-log

[![Build Status](https://github.com/zman2013/nestjs-log/workflows/Build%20and%20Release/badge.svg)](https://github.com/zman2013/nestjs-log/workflows/Build%20and%20Release/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/zman2013/nestjs-log/badge.svg?branch=master)](https://coveralls.io/github/zman2013/nestjs-log?branch=master)
[![npm](https://img.shields.io/npm/v/nestjs-log.svg)](https://www.npmjs.com/package/nestjs-log/)

> A log can be used as nestjs system logger and application logger. Logs can be rotated based on date('YYYY-MM-DD-HH'), size limit(1G), and old logs will be removed after 14 days. This module wrapps winston.

## Usage

```Install
npm install nestjs-log
```

### example as application logger
```typescript
const log = getLog(TAG) // TAG is a label usually as same as the class

log.verbose(`msg`)
log.debug(`msg`)
log.info(`msg`)
log.warn(`msg`)
log.error(`msg`)

// also support splat
log.info('msg', any1, any2, any3)
log.info(obj)
```

### example as nestjs system logger
```typescript
const app = await NestFactory.create(AppModule, {
    logger: getLog('system').loggerService
  });
```

### environment variables
```js
log level: 
  process.env.LOG_LEVEL ?? 'info'

log dir: 
  process.env.LOG_DIR ?? './log'

log date pattern: 
  process.env.LOG_DATE_PATTERN ?? 'YYYY-MM-DD-HH'

log file max size: 
  process.env.LOG_MAX_SIZE ?? '1024m'
  Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb. If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number.

log file rotation policy: 
  process.env.LOG_MAX_FILES ?? '14d' 
  Maximum number of logs to keep. This can be a number of files or number of days. If using days, add 'd' as the suffix.

log to console:
  set process.env.NODE_ENV to 'dev'
```