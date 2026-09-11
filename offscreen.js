chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "edgeclose-beep") {
    playBeep();
    sendResponse({ beeped: true });
  }
});

function playBeep() {
  try {
    const context = new AudioContext();
    if (context.state === "suspended") context.resume().catch(() => {});
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 880;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.15, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.4);
    oscillator.addEventListener("ended", () => context.close().catch(() => {}));
  } catch {}
}