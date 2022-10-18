type LogLevel = "log" | "warn" | "error";

type Log = {
  message: string;
  on: string;
  at: string;
  data: string | object;
};

/**
 * @summary logs an event
 * @param level log type
 * @param message log message
 * @param data event data
 */
const log = (level: LogLevel, message: string, data: string | object) => {
  const current = new Date();

  const stamp = current.toISOString();

  const date = stamp.slice(0, 10);
  const time = stamp.slice(11);

  const log: Log = {
    message,
    on: date,
    at: time,
    data,
  };

  console[level].call(console, log);
};
