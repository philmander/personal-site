import bunyan from 'bunyan';

export const logger = bunyan.createLogger({
  name: 'personal-site',
  level: (process.env.LOG_LEVEL as bunyan.LogLevel) || 'info',
  serializers: bunyan.stdSerializers,
});
