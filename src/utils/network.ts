/**
 * @summary forces a given link to be HTTPS-only
 * @param input original URL
 **/
export const forceHttps = (input: string) => {
  const https = /^https:\/\//;
  const http = /^http:\/\//;
  const secure = https.test(input);
  const insecure = http.test(input);

  return secure ? input : `https://${insecure ? input.substring(7) : input}`;
};
