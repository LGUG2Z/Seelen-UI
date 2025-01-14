import * as Logger from '@tauri-apps/plugin-log';

export function wrapConsole() {
  const WebConsole = {
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    trace: console.trace,
  };

  const StrintifyParams = (params: any[]): string => {
    return params.reduce((a, b) => a + ' ' + JSON.stringify(b), '');
  };

  window.addEventListener('unhandledrejection', (event) => {
    console.error(`Unhandled Rejection - ${event.reason}`);
  });

  console.error = (...params: any[]) => {
    WebConsole.error(...params);
    Logger.error(StrintifyParams(params));
  };

  console.warn = (...params: any[]) => {
    WebConsole.warn(...params);
    Logger.warn(StrintifyParams(params));
  };

  console.info = (...params: any[]) => {
    WebConsole.info(...params);
    Logger.info(StrintifyParams(params));
  };

  console.debug = (...params: any[]) => {
    WebConsole.debug(...params);
    Logger.debug(StrintifyParams(params));
  };

  console.trace = (...params: any[]) => {
    WebConsole.trace(...params);
    Logger.trace(StrintifyParams(params));
  };
}
