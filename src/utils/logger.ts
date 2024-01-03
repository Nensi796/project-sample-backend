import winston from 'winston';
// import { CloudWatchLogsTransport } from 'winston-aws-cloudwatch';
// import { CloudWatchLogs } from 'aws-sdk';

// const cloudWatchLogs = new CloudWatchLogs();

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    // Add a CloudWatch transport for logging to CloudWatch
    // new CloudWatchLogsTransport({
    //   logGroupName: 'mozarto-group',
    //   logStreamName: 'mozarto-stream',
    //   cloudWatchLogs,
    // }),
  ],
});

export default logger;
