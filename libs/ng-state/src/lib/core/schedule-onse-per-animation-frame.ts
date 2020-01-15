export function scheduleOncePerAnimationFrame(
  work: () => void,
  cfg: {
    host: {
      requestAnimationFrameId: number;
    };
    requestAnimationFrameRef?: (cb: () => void) => number;
  } = { host: window as any, requestAnimationFrameRef: requestAnimationFrame }
) {
  const requestAnimationFrameRef = cfg.requestAnimationFrameRef;

  // If a requestAnimationFrame is already scheduled
  // do nothing
  if (cfg.host.requestAnimationFrameId !== -1) {
    return;
  }
  // If NO requestAnimationFrame is scheduled
  // request a new requestAnimationFrame and assinge its it to `PushPipe.rid`
  cfg.host.requestAnimationFrameId = requestAnimationFrameRef(() => {
    // Reset requestAnimationFrameId
    cfg.host.requestAnimationFrameId = -1;
    // Logic here will get buffered in the micro task queue and executed only ones
    work();
  });
}
