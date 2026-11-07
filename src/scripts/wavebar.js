import { getState, countdown, stateLabel } from './api.js';
async function run() {
  const s = await getState();
  const now = Date.now();
  document.querySelectorAll('[data-wave]').forEach((li) => {
    const open = new Date(li.dataset.opens).getTime() <= now;
    li.classList.toggle('is-open', open);
    li.classList.toggle('is-current', s && !s.error && Number(li.dataset.wave) === s.currentWave);
  });
  const status = document.querySelector('[data-wave-status]');
  if (status) status.textContent = stateLabel(s).text;
  const left = document.querySelector('[data-seats-left]');
  const name = document.querySelector('[data-wave-name]');
  if (left && s && !s.error) { left.textContent = s.seatsLeft; name.textContent = s.currentWave ? `Wave ${s.currentWave} of 3` : `Wave ${s.nextWave} opens in ${countdown(s.nextWaveAt)}`; }
}
run(); setInterval(() => !document.hidden && run(), 15000);
