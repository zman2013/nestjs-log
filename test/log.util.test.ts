import { getLog } from "../src"
import {promises  as fs} from 'fs'
import * as path from 'path'

jest.mock('moment', () => {
    return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
});

describe('log test', () => {

    afterEach( async function clearTempFiles(){
        const dir = await fs.readdir('./test-app')
        for await( const file of dir){
            fs.unlink( path.join('./test-app', file))
        }
        await fs.rmdir('./test-app')
    })

    it('basic', async () => {
        process.env.LOG_DIR = './test-app'

        const log = getLog('test')
        log.info('log some thing')

        const buffer = await fs.readFile('test-app/app.2020-01-01-08.log')

        const result = buffer.toString('UTF-8')
        
        expect(result).toContain("2020-01-01T08:00:00.000 info [test]: log some thing")
    })

    it('splat', async () => {
      process.env.LOG_DIR = './test-app'

      const log = getLog('test')
      log.info('log some thing', 'splat1', 'splat2')

      const buffer = await fs.readFile('test-app/app.2020-01-01-08.log')

      const result = buffer.toString('UTF-8')
      
      expect(result).toContain("2020-01-01T08:00:00.000 info [test]: log some thing splat1 splat2")
    })

    it('object', async () => {
      process.env.LOG_DIR = './test-app'
      
      const log = getLog('test')
      log.info({text: 'abc'})

      const buffer = await fs.readFile('test-app/app.2020-01-01-08.log')

      const result = buffer.toString('UTF-8')
      
      expect(result).toContain("2020-01-01T08:00:00.000 info [test]:  { text: 'abc' }")
    })

    it('loggerService', async () => {
        process.env.LOG_DIR = './test-app'
        process.env.NODE_ENV = 'dev'
        process.env.LOG_LEVEL = 'verbose'

        const log = getLog('test').loggerService

        log.log('log', 'test')
        log.error('error', 'trace', 'test')
        log.warn('warn', 'test')
        log.debug('debug', 'test')
        log.verbose('verbose', 'test')

        const buffer = await fs.readFile('test-app/app.2020-01-01-08.log')

        const result = buffer.toString('UTF-8')
        
        expect(result).toContain(
            `2020-01-01T08:00:00.000 info [test]: log test
2020-01-01T08:00:00.000 error [test]: error trace test
2020-01-01T08:00:00.000 warn [test]: warn test
2020-01-01T08:00:00.000 verbose [test]: verbose test`)
    
    })
})