declare module 'ooni-components';
declare module 'rebass';

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    LOCALES: string[];
  }
}
