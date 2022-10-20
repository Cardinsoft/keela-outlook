type LoggerLog = { message: string; timestamp: string };

/**
 * @see https://developers.google.com/apps-script/reference/base/logger
 */
class Logger {
  private static stack: LoggerLog[] = [];

  /**
   * @see https://developers.google.com/apps-script/reference/base/logger#clear
   *
   * @summary Clears the log.
   */
  static clear() {
    this.stack.length = 0;
    return this;
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/logger#getlog
   *
   * @summary Returns a complete list of messages in the current log.
   */
  static getLog() {
    return this.stack
      .map(({ message, timestamp }) => {
        return `${timestamp}: ${message}`;
      })
      .join("\n");
  }

  /**
   * @see https://developers.google.com/apps-script/reference/base/logger#logdata
   *
   * @summary Writes the string to the logging console.
   * @param data the message to log
   */
  static log(data: any) {
    this.stack.push({
      message: Object.prototype.toString.call(data),
      timestamp: new Date().toISOString(),
    });
    console.log(data);
    return this;
  }
}
