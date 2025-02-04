import { debounce, TimeoutIdRef } from '../Timing';
import { toPhysicalPixels } from '../utils';
import { PhysicalSize } from '@tauri-apps/api/dpi';
import { emitTo, listen } from '@tauri-apps/api/event';
import { getCurrent } from '@tauri-apps/api/webviewWindow';

const root_container = document.getElementById('root')!;

export const setWindowSize = () => {
  const webview = getCurrent();
  const screenWidth = Math.floor(window.screen.width * window.devicePixelRatio);
  const screenHeight = Math.floor(window.screen.height * window.devicePixelRatio);
  webview.setSize(new PhysicalSize(screenWidth, screenHeight));
};

export const updateHitbox = () => {
  emitTo('seelenweg-hitbox', 'resize', {
    width: toPhysicalPixels(root_container.offsetWidth),
    height: toPhysicalPixels(root_container.offsetHeight),
  });
  emitTo('seelenweg-hitbox', 'move', {
    x: toPhysicalPixels(root_container.offsetLeft),
    y: toPhysicalPixels(root_container.offsetTop),
  });
};

export const ExtraCallbacksOnLeave = {
  callbacks: [] as (() => void)[],
  add(cb: () => void) {
    this.callbacks.push(cb);
  },
  execute() {
    this.callbacks.forEach((fn) => fn());
  },
};

export function registerDocumentEvents() {
  const timeoutId: TimeoutIdRef = { current: null };
  const webview = getCurrent();

  document.addEventListener('contextmenu', (event) => event.preventDefault());

  const onMouseLeave = () => {
    webview.setIgnoreCursorEvents(true);
    updateHitbox(); // ensure min size hitbox on unzoom elements
    ExtraCallbacksOnLeave.execute();
  };

  const onMouseEnter = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    webview.setIgnoreCursorEvents(false);
  };

  root_container.addEventListener('mouseleave', debounce(onMouseLeave, 200, timeoutId));
  root_container.addEventListener('blur', debounce(onMouseLeave, 200, timeoutId));

  // if for some reazon mouseleave is not emitted
  // set ignore cursor events when user click on screen
  document.body.addEventListener('click', (event) => {
    if (event.target === document.body) {
      onMouseLeave();
    }
  });

  root_container.addEventListener('mouseenter', onMouseEnter);
  listen('mouseenter', onMouseEnter); // listener for hitbox
}
