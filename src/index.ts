import { LoggerService } from '@nestjs/common';
import * as moment from 'moment';
import { createLogger, format, Logger } from 'winston'
import 'winston-daily-rotate-file'
import { Console, DailyRotateFile } from "winston/lib/winston/transports";


interface MyLogger extends Logger{
    loggerService: LoggerService
}
const timezoned = () => {
    return moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
  };

export function getLog(label: string){

    const myFormat = format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} ${level} [${label}]: ${message}`;
        });

    const level = process.env.LOG_LEVEL ?? 'info'
    const dirname = process.env.LOG_DIR ?? '.'
    const datePattern = process.env.LOG_DATE_PATTERN ?? 'YYYY-MM-DD-HH'
    const maxSize = process.env.LOG_MAX_SIZE ?? '1024m'
    const maxFiles = process.env.LOG_MAX_FILES ?? '14d'

    const transport = new DailyRotateFile({
        level: level,
        filename: 'app',
        dirname: dirname,
        datePattern: datePattern,
        zippedArchive: true,
        maxSize: maxSize,
        maxFiles: maxFiles,
        format: format.combine(
            format.splat(),
            format.timestamp({
                format: timezoned
            }),
            myFormat
            )
    })
    const logger = createLogger({
        transports: [transport],
        defaultMeta: { label: label}
    }) as MyLogger

    if( process.env.NODE_ENV === 'dev' ){
        logger.add(new Console({
            format: format.combine(
                format.splat(),
                format.timestamp({
                    format: timezoned
                }),
                myFormat
                )
        }))
    }

    logger.loggerService = {
        log(message: any, context?: string) {
            logger.info(message, {label: context})
        },
        error(message: any, trace?: string, context?: string) {
            logger.error(message, trace, {label: context})
        },
        warn(message: any, context?: string) {
            logger.warn(message, {label: context})
        },
        debug(message: any, context?: string) {
            logger.debug(message, {label: context})
        },
        verbose(message: any, context?: string) {
            logger.verbose(message, {label: context})
        }
    }

    return logger

}

