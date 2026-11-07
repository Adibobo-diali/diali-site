/**
 * DIALI booking API v2, for the new website.
 *
 * INSTALL ON A COPY FIRST (File > Make a copy of the Sheet; its script is copied with it).
 * 1. Add this file to the copied Apps Script project.
 * 2. In the existing doPost(e), add as the first lines:
 *      var body = JSON.parse(e.postData.contents || '{}');
 *      if (body.v === 2) return handleV2_(body);
 *    so the old Odoo seat page keeps working unchanged (rollback stays possible).
 * 3. Script properties (Project settings > Script properties):
 *      V2_SECRET        long random string, same as APPS_SCRIPT_SECRET in Cloudflare
 *      RESEND_API_KEY   from resend.com
 *      MAIL_FROM        DIALI <noreply@send.dialivzw.eu>
 *      MAIL_REPLY_TO    Dialivzw@outlook.com
 *      SITE             https://www.dialivzw.eu
 *      GMAIL_OFF        true   (old script stops sending through Gmail; all mail goes via Resend)
 *      BACKUP_FOLDER_ID Drive folder id for nightly backups
 * 4. Run setupV2() once: it creates the tabs and the time-driven triggers.
 * 5. Deploy > Manage deployments > edit the web app > New version.
 *
 * TO CONFIRM: the column layout of the existing bookings tab. COLS below assumes the v2 layout;
 * if the existing tab differs, map it here so both front ends read and write the same rows.
 */

var TAB = { bookings: 'Bookings', waitlist: 'Waitlist', messages: 'Messages', fc27: 'FC27', events: 'Analytics' };
var COLS = ['id', 'token', 'created', 'email', 'name', 'guests', 'seats', 'lang', 'ref', 'newsletter', 'fc27', 'status', 'checkedIn', 'reconfirmed', 'source'];
var ROWS = ['B', 'C', 'D', 'E', 'F', 'G'];
var PER_ROW = 20;
var MAX_PER_BOOKING = 4, MAX_PER_EMAIL = 6;
var WAVES = [
  { n: 1, opens: '2026-11-05T10:00:00+01:00', lastRow: 'C' },
  { n: 2, opens: '2026-11-19T10:00:00+01:00', lastRow: 'E' },
  { n: 3, opens: '2026-12-03T10:00:00+01:00', lastRow: 'G' }
];
var WAITLIST_ONLY_FROM = '2026-12-15T00:00:00+01:00';
var EVENT_END = '2026-12-20T13:30:00+01:00';
var PURGE_ON = '2027-01-20T00:00:00+01:00';

function prop_(k) { return PropertiesService.getScriptProperties().getProperty(k); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sheet_(name, header) {
  var sh = ss_().getSheetByName(name);
  if (!sh) { sh = ss_().insertSheet(name); if (header) sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}

function handleV2_(body) {
  if (!body || body.secret !== prop_('V2_SECRET')) return out_({ error: 'forbidden' });
  var p = body.payload || {};
  try {
    switch (body.action) {
      case 'state': return out_(state_());
      case 'book': return out_(book_(p));
      case 'get': return out_(get_(p.token));
      case 'release': return out_(release_(p.token, p.seats));
      case 'reconfirm': return out_(reconfirmV2_(p.token));
      case 'waitlist': return out_(waitlist_(p, 'waitlist'));
      case 'notify': return out_(waitlist_(p, 'notify'));
      case 'form': return out_(form_(p));
      case 'fc27Public': return out_(fc27Public_());
      case 'track': sheet_(TAB.events, ['at', 'event', 'path']).appendRow([new Date(), p.e, p.p]); return out_({ ok: true });
      default:
        if (String(body.action).indexOf('admin:') === 0) return out_(admin_(body.action.slice(6), p));
        return out_({ error: 'unknown_action' });
    }
  } catch (err) {
    console.error(err);
    return out_({ error: 'server', detail: String(err && err.message || err) });
  }
}

// ---------- data access ----------
function readBookings_() {
  var sh = sheet_(TAB.bookings, COLS), v = sh.getDataRange().getValues(), head = v[0], list = [];
  for (var i = 1; i < v.length; i++) {
    var o = { _row: i + 1 };
    head.forEach(function (h, j) { o[h] = v[i][j]; });
    o.seats = String(o.seats || '').split(/[\s,]+/).filter(String);
    o.guests = String(o.guests || '').split('|').filter(String);
    o.fc27 = o.fc27 ? JSON.parse(o.fc27) : [];
    list.push(o);
  }
  return list;
}
function writeBooking_(b) {
  var sh = sheet_(TAB.bookings, COLS);
  var row = COLS.map(function (c) {
    if (c === 'seats') return b.seats.join(' ');
    if (c === 'guests') return (b.guests || []).join('|');
    if (c === 'fc27') return JSON.stringify(b.fc27 || []);
    return b[c] === undefined ? '' : b[c];
  });
  if (b._row) sh.getRange(b._row, 1, 1, COLS.length).setValues([row]); else sh.appendRow(row);
}
function active_(list) { return list.filter(function (b) { return b.status !== 'released' && b.seats.length; }); }
function publicBooking_(b) { return { id: b.id, token: b.token, email: b.email, name: b.name, guests: b.guests, seats: b.seats, lang: b.lang, fc27: b.fc27 }; }

// ---------- state ----------
function openRows_(now) {
  var cur = null;
  WAVES.forEach(function (w) { if (new Date(w.opens).getTime() <= now) cur = w; });
  return { cur: cur, rows: cur ? ROWS.slice(0, ROWS.indexOf(cur.lastRow) + 1) : [] };
}
function state_() {
  var now = Date.now(), o = openRows_(now), taken = {};
  active_(readBookings_()).forEach(function (b) { b.seats.forEach(function (s) { taken[s] = 1; }); });
  var left = 0, total = 0;
  ROWS.forEach(function (r) { for (var i = 1; i <= PER_ROW; i++) { if (!taken[r + i]) { total++; if (o.rows.indexOf(r) >= 0) left++; } } });
  var next = WAVES.filter(function (w) { return new Date(w.opens).getTime() > now; })[0];
  var fc = fc27Count_();
  return {
    currentWave: o.cur ? o.cur.n : 0, openRows: o.rows, seatsLeft: left, totalLeft: total,
    nextWave: next ? next.n : null, nextWaveAt: next ? next.opens : null, allFull: total === 0,
    waitlistOnly: now >= new Date(WAITLIST_ONLY_FROM).getTime(), over: now > new Date(EVENT_END).getTime(),
    taken: Object.keys(taken), rows: ROWS, perRow: PER_ROW, fc27Count: fc
  };
}

// ---------- booking (atomic: lock, check, write) ----------
function book_(p) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return { error: 'busy' };
  try {
    var now = Date.now();
    if (now > new Date(EVENT_END).getTime()) return { error: 'over' };
    if (now >= new Date(WAITLIST_ONLY_FROM).getTime()) return { error: 'waitlist_only' };
    var o = openRows_(now);
    var closed = p.seats.filter(function (s) { return o.rows.indexOf(s.charAt(0)) < 0; });
    if (closed.length) return { error: 'closed', seats: closed };
    if (p.seats.length > MAX_PER_BOOKING) return { error: 'invalid' };
    var list = active_(readBookings_()), taken = {}, already = 0;
    list.forEach(function (b) { b.seats.forEach(function (s) { taken[s] = 1; }); if (String(b.email).toLowerCase() === p.email) already += b.seats.length; });
    var gone = p.seats.filter(function (s) { return taken[s]; });
    if (gone.length) return { error: 'taken', taken: gone };
    if (already + p.seats.length > MAX_PER_EMAIL) return { error: 'cap', already: already };
    var b = {
      id: 'D' + Utilities.getUuid().slice(0, 6).toUpperCase(), token: Utilities.getUuid().replace(/-/g, ''), created: new Date(),
      email: p.email, name: p.name, guests: p.guests, seats: p.seats, lang: p.lang, ref: p.ref, newsletter: p.newsletter ? 'yes' : '',
      fc27: p.fc27 || [], status: 'active', checkedIn: '', reconfirmed: '', source: 'web-v2'
    };
    writeBooking_(b);
    SpreadsheetApp.flush();
    (p.fc27 || []).forEach(function (f) { sheet_(TAB.fc27, ['kind', 'name', 'under16', 'source', 'booking', 'at']).appendRow(['signup', f.name, f.under16 ? 'yes' : '', 'booking', b.id, new Date()]); });
    lock.releaseLock();
    try { sendConfirmation_(b); } catch (e) { console.error('mail failed', e); }
    return { ok: true, booking: publicBooking_(b) };
  } finally { try { lock.releaseLock(); } catch (e) {} }
}
function get_(token) {
  var b = readBookings_().filter(function (x) { return x.token === token; })[0];
  return b ? { ok: true, booking: publicBooking_(b) } : { error: 'not_found' };
}
function release_(token, seats) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var b = readBookings_().filter(function (x) { return x.token === token; })[0];
    if (!b) return { error: 'not_found' };
    var rel = seats && seats.length ? seats : b.seats;
    b.seats = b.seats.filter(function (s) { return rel.indexOf(s) < 0; });
    if (!b.seats.length) b.status = 'released';
    writeBooking_(b);
    return { ok: true, booking: publicBooking_(b) };
  } finally { lock.releaseLock(); }
}

function reconfirmV2_(token) {
  var b = readBookings_().filter(function (x) { return x.token === token; })[0];
  if (!b) return { error: 'not_found' };
  b.reconfirmed = new Date(); writeBooking_(b); return { ok: true };
}

// ---------- waitlist, notify, messages ----------
function waitlist_(p, kind) {
  sheet_(TAB.waitlist, ['at', 'kind', 'email', 'seats', 'lang', 'ref', 'offered', 'claimed']).appendRow([new Date(), kind, p.email, p.seats || 1, p.lang, p.ref || '', '', '']);
  sendMail_(p.email, T_(p.lang, kind === 'notify' ? 'notifySubject' : 'waitlistSubject'), T_(p.lang, kind === 'notify' ? 'notifyBody' : 'waitlistBody'));
  return { ok: true };
}
function form_(p) {
  sheet_(TAB.messages, ['at', 'form', 'source', 'name', 'email', 'organisation', 'type', 'seats', 'message', 'ref', 'lang']).appendRow([new Date(), p.form, p.source, p.name, p.email, p.organisation, p.type, p.seats, p.message, p.ref, p.lang]);
  var to = prop_('MAIL_REPLY_TO') || 'Dialivzw@outlook.com';
  var subj = '[' + (p.form === 'club' ? 'Club block' : p.form === 'partner' ? 'Partner: ' + (p.type || 'Not sure yet') : 'Question') + '] ' + p.name;
  var html = '<p><b>' + esc_(p.name) + '</b> &lt;' + esc_(p.email) + '&gt;' + (p.organisation ? ' · ' + esc_(p.organisation) : '') + (p.seats ? ' · ' + p.seats + ' seats' : '') + (p.ref ? ' · ref ' + esc_(p.ref) : '') + '</p><p>' + esc_(p.message).replace(/\n/g, '<br>') + '</p>';
  var r = sendMail_(to, subj, html, p.email);
  return r ? { ok: true } : { error: 'mail_failed' }; // never claim "sent" when nothing was sent
}

// ---------- FC 27 ----------
function fc27Rows_() { return sheet_(TAB.fc27, ['kind', 'name', 'under16', 'source', 'booking', 'at']).getDataRange().getValues().slice(1); }
function fc27Count_() {
  var rows = fc27Rows_(), n = 0, formTotal = 0;
  rows.forEach(function (r) { if (r[0] === 'signup') n++; if (r[0] === 'formTotal') formTotal = Number(r[1]) || 0; });
  return n + formTotal;
}
function bracket_() { var s = prop_('FC27_BRACKET'); return s ? JSON.parse(s) : { rounds: [], history: [] }; }
function saveBracket_(b) { PropertiesService.getScriptProperties().setProperty('FC27_BRACKET', JSON.stringify(b)); }
function fc27Public_() { var b = bracket_(); return { ok: true, count: fc27Count_(), rounds: b.rounds }; }

// ---------- admin ----------
function admin_(action, p) {
  if (action === 'bookings') {
    var wl = sheet_(TAB.waitlist).getDataRange().getValues().slice(1).filter(function (r) { return r[1] === 'waitlist' && !r[7]; }).map(function (r) { return { email: r[2], seats: r[3], offered: r[6] }; });
    return { ok: true, bookings: active_(readBookings_()).map(function (b) { var o = publicBooking_(b); o.ref = b.ref; o.checkedIn = !!b.checkedIn; return o; }), waitlist: wl };
  }
  if (action === 'checkin') {
    var b = readBookings_().filter(function (x) { return x.id === p.id; })[0]; if (!b) return { error: 'not_found' };
    b.checkedIn = b.checkedIn ? '' : new Date(); writeBooking_(b); return { ok: true };
  }
  if (action === 'block') {
    var lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      var taken = {}; active_(readBookings_()).forEach(function (x) { x.seats.forEach(function (s) { taken[s] = 1; }); });
      var gone = p.seats.filter(function (s) { return taken[s]; }); if (gone.length) return { error: 'taken', taken: gone };
      writeBooking_({ id: 'C' + Utilities.getUuid().slice(0, 6).toUpperCase(), token: Utilities.getUuid().replace(/-/g, ''), created: new Date(), email: p.email, name: p.club, guests: [], seats: p.seats, lang: 'en', ref: p.ref || '', newsletter: '', fc27: [], status: 'active', checkedIn: '', reconfirmed: 'yes', source: 'admin-block:' + p.by });
      return { ok: true };
    } finally { lock.releaseLock(); }
  }
  if (action === 'offer') {
    var sh = sheet_(TAB.waitlist), rows = sh.getDataRange().getValues(), open = [];
    rows.forEach(function (r, i) { if (i && r[1] === 'waitlist' && !r[7]) open.push(i + 1); });
    var rowNo = open[p.index]; if (!rowNo) return { error: 'not_found' };
    var r = rows[rowNo - 1]; sh.getRange(rowNo, 7).setValue(new Date());
    sendMail_(r[2], T_(r[4], 'offerSubject'), T_(r[4], 'offerBody').replace('{link}', (prop_('SITE') || '') + '/seats'));
    return { ok: true };
  }
  if (action === 'fc27') {
    var rows2 = fc27Rows_(), ft = 0, signups = [];
    rows2.forEach(function (r) { if (r[0] === 'formTotal') ft = Number(r[1]) || 0; if (r[0] === 'signup') signups.push({ name: r[1], under16: r[2] === 'yes', source: r[3], booking: r[4] }); });
    var inIds = {}; readBookings_().forEach(function (b) { if (b.checkedIn) inIds[b.id] = 1; });
    var br = bracket_();
    return { ok: true, formTotal: ft, signups: signups, checkedIn: signups.filter(function (s) { return inIds[s.booking]; }), rounds: br.rounds };
  }
  if (action === 'fc27-form-total') { sheet_(TAB.fc27).appendRow(['formTotal', Number(p.total) || 0, '', 'admin', p.by, new Date()]); return { ok: true }; }
  if (action === 'fc27-draw') {
    var names = (p.names || []).slice(0, 16).sort(function () { return Math.random() - 0.5; });
    var slots = []; for (var i = 0; i < 16; i++) slots.push(names[i] || null);
    var nb = { rounds: [slots], history: [] }; saveBracket_(nb); return { ok: true, rounds: nb.rounds };
  }
  if (action === 'fc27-win') {
    var bb = bracket_(); bb.history.push(JSON.stringify(bb.rounds));
    var w = bb.rounds[p.round][p.match * 2 + p.side];
    if (!bb.rounds[p.round + 1]) { bb.rounds[p.round + 1] = []; for (var k = 0; k < bb.rounds[p.round].length / 2; k++) bb.rounds[p.round + 1].push(null); }
    bb.rounds[p.round + 1][p.match] = w; saveBracket_(bb); return { ok: true, rounds: bb.rounds };
  }
  if (action === 'fc27-undo') { var bu = bracket_(); var h = bu.history.pop(); if (h) bu.rounds = JSON.parse(h); saveBracket_(bu); return { ok: true, rounds: bu.rounds }; }
  return { error: 'unknown_admin_action' };
}

// ---------- email via Resend ----------
function sendMail_(to, subject, html, replyTo, attachments) {
  var key = prop_('RESEND_API_KEY'); if (!key) { console.warn('RESEND_API_KEY missing'); return false; }
  var body = { from: prop_('MAIL_FROM') || 'DIALI <noreply@send.dialivzw.eu>', to: [to], subject: subject, html: wrap_(html), reply_to: replyTo || prop_('MAIL_REPLY_TO') || 'Dialivzw@outlook.com' };
  if (attachments) body.attachments = attachments;
  var r = UrlFetchApp.fetch('https://api.resend.com/emails', { method: 'post', contentType: 'application/json', headers: { Authorization: 'Bearer ' + key }, payload: JSON.stringify(body), muteHttpExceptions: true });
  return r.getResponseCode() < 300;
}
function wrap_(html) {
  return '<div style="background:#050a1a;padding:24px;font-family:Inter,Arial,sans-serif;color:#ffffff"><div style="max-width:560px;margin:0 auto">'
    + '<p style="color:#d9b45a;letter-spacing:.18em;font-size:12px;text-transform:uppercase;margin:0 0 16px">DIALI vzw · Seen. Ready. Chosen.</p>'
    + '<div style="font-size:16px;line-height:1.6;color:#ffffff">' + html + '</div>'
    + '<p style="color:rgba(255,255,255,.6);font-size:12px;margin-top:32px">DIALI vzw · Registered in Aalst · Reg. no. 1013473618 · Sport for Solidarity is co-funded by the European Solidarity Corps, with JINT.</p></div></div>';
}
function esc_(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function ics_() {
  var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DIALI vzw//EN', 'BEGIN:VEVENT', 'UID:the-mind-behind-the-game-20261220@dialivzw.eu', 'DTSTAMP:20261106T120000Z', 'DTSTART:20261220T093000Z', 'DTEND:20261220T123000Z', 'SUMMARY:The Mind Behind the Game · DIALI', 'LOCATION:De Felix\\, Braemkasteelstraat 33-35\\, Gentbrugge', 'DESCRIPTION:Doors 10:00. Registration only.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  return [{ filename: 'the-mind-behind-the-game.ics', content: Utilities.base64Encode(ics, Utilities.Charset.UTF_8) }];
}
function sendConfirmation_(b) {
  var site = prop_('SITE') || 'https://www.dialivzw.eu', L = b.lang;
  var seats = b.seats.map(function (s) { return T_(L, 'row') + ' ' + s.charAt(0) + ', ' + T_(L, 'seat') + ' ' + s.slice(1); }).join('<br>');
  var fc = b.fc27 && b.fc27.length ? T_(L, 'fcYes') : T_(L, 'fcNo').replace('{link}', site + '/fc27');
  var html = '<h1 style="font-family:Georgia,serif;font-weight:500;font-size:30px;margin:0 0 12px">' + T_(L, 'youreIn') + '</h1>'
    + '<p>' + seats + '</p><p>' + esc_([b.name].concat(b.guests).join(', ')) + '</p>'
    + '<p>' + T_(L, 'when') + '<br>De Felix, Braemkasteelstraat 33-35, Gentbrugge</p>'
    + '<p>' + fc + '</p>'
    + '<p><a style="color:#f2d98a" href="' + site + '/seats/manage?token=' + b.token + '">' + T_(L, 'manage') + '</a></p>';
  sendMail_(b.email, T_(L, 'confirmSubject'), html, null, ics_());
}

// ---------- scheduled jobs ----------
function setupV2() {
  sheet_(TAB.bookings, COLS); sheet_(TAB.waitlist, ['at', 'kind', 'email', 'seats', 'lang', 'ref', 'offered', 'claimed']);
  sheet_(TAB.messages, ['at', 'form', 'source', 'name', 'email', 'organisation', 'type', 'seats', 'message', 'ref', 'lang']);
  sheet_(TAB.fc27, ['kind', 'name', 'under16', 'source', 'booking', 'at']); sheet_(TAB.events, ['at', 'event', 'path']);
  ScriptApp.getProjectTriggers().forEach(function (t) { if (/^job_/.test(t.getHandlerFunction())) ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('job_hourly').timeBased().everyHours(1).create();
  ScriptApp.newTrigger('job_nightlyBackup').timeBased().atHour(3).everyDays(1).create();
}
function job_hourly() {
  var now = new Date(), done = PropertiesService.getScriptProperties();
  var once = function (key, when, fn) { if (now >= new Date(when) && !done.getProperty(key)) { fn(); done.setProperty(key, String(now)); } };
  WAVES.forEach(function (w) { once('wave' + w.n, w.opens, function () { notifyWave_(w); }); });
  once('reconfirm', '2026-12-13T10:00:00+01:00', reconfirm_);
  once('release', '2026-12-15T10:00:00+01:00', releaseUnconfirmed_);
  once('reminder', '2026-12-19T10:00:00+01:00', reminder_);
  once('purge', PURGE_ON, purge_);
}
function notifyWave_(w) {
  var sh = sheet_(TAB.waitlist), rows = sh.getDataRange().getValues();
  rows.forEach(function (r, i) { if (i && r[1] === 'notify' && !r[6]) { sendMail_(r[2], T_(r[4], 'waveOpenSubject').replace('{n}', w.n), T_(r[4], 'waveOpenBody').replace('{link}', (prop_('SITE') || '') + '/seats')); sh.getRange(i + 1, 7).setValue(new Date()); } });
}
function reconfirm_() {
  var site = prop_('SITE') || '';
  active_(readBookings_()).forEach(function (b) { if (b.reconfirmed) return; sendMail_(b.email, T_(b.lang, 'stillSubject'), T_(b.lang, 'stillBody').replace('{link}', site + '/seats/manage?confirm=1&token=' + b.token).replace('{fc}', site + '/fc27')); });
}
function releaseUnconfirmed_() { /* Seats whose holders did not reconfirm are released on 15 Dec. Reconfirmation sets column "reconfirmed". */
  active_(readBookings_()).forEach(function (b) { if (!b.reconfirmed && b.source === 'web-v2') { b.status = 'released'; writeBooking_(b); } });
}
function reminder_() { var site = prop_('SITE') || ''; active_(readBookings_()).forEach(function (b) { sendMail_(b.email, T_(b.lang, 'reminderSubject'), T_(b.lang, 'reminderBody').replace('{fc}', site + '/fc27'), null, ics_()); }); }
function purge_() { var sh = sheet_(TAB.bookings, COLS); if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, COLS.length).clearContent(); var wl = sheet_(TAB.waitlist); if (wl.getLastRow() > 1) wl.getRange(2, 1, wl.getLastRow() - 1, 8).clearContent(); }
function job_nightlyBackup() { var id = prop_('BACKUP_FOLDER_ID'); if (!id) return; DriveApp.getFileById(ss_().getId()).makeCopy('DIALI bookings backup ' + Utilities.formatDate(new Date(), 'Europe/Brussels', 'yyyy-MM-dd'), DriveApp.getFolderById(id)); }

// ---------- email copy (NL and FR: native review TO CONFIRM) ----------
var STR_ = {
  en: { row: 'Row', seat: 'seat', youreIn: "You're in.", when: 'Sun 20 Dec 2026 · Doors 10:00 · Programme 10:30–13:30', manage: 'Manage or release your seats',
    confirmSubject: 'Your seat for The Mind Behind the Game, Sun 20 Dec', fcYes: "You're on the FC 27 list. Check in on the day to play. Signing up does not guarantee a place.", fcNo: 'Want to play FC 27? <a style="color:#f2d98a" href="{link}">Sign up here</a>.',
    waitlistSubject: "You're on the waitlist · The Mind Behind the Game", waitlistBody: "<p>You're on the waitlist. If a seat comes free, we'll email you a link to claim it within 24 hours.</p>",
    notifySubject: "We'll tell you when the next wave opens", notifyBody: "<p>We'll email you the moment the next wave of seats opens.</p>",
    waveOpenSubject: 'Wave {n} is open · The Mind Behind the Game', waveOpenBody: '<p>New seats are open now. <a style="color:#f2d98a" href="{link}">Choose your seat</a>.</p>',
    offerSubject: 'A seat is free for you · claim it within 24 hours', offerBody: '<p>A seat came free. <a style="color:#f2d98a" href="{link}">Claim it within 24 hours</a>.</p>',
    stillSubject: 'Still coming on Sun 20 Dec?', stillBody: '<p>One click to keep your seat: <a style="color:#f2d98a" href="{link}">Yes, I\'m coming</a>. Unconfirmed seats are released on 15 Dec.</p><p>Want to play FC 27? <a style="color:#f2d98a" href="{fc}">Sign up</a>.</p>',
    reminderSubject: 'Tomorrow: The Mind Behind the Game, doors 10:00', reminderBody: '<p>See you tomorrow at De Felix, Braemkasteelstraat 33-35, Gentbrugge. Doors 10:00.</p><p>Route and parking: TO CONFIRM.</p><p>FC 27: <a style="color:#f2d98a" href="{fc}">sign up or check the bracket</a>.</p>' },
  nl: { row: 'Rij', seat: 'plaats', youreIn: 'Je bent erbij.', when: 'Zo 20 dec 2026 · Deuren 10:00 · Programma 10:30–13:30', manage: 'Beheer of annuleer je plaatsen',
    confirmSubject: 'Je plaats voor The Mind Behind the Game, zo 20 dec', fcYes: 'Je staat op de FC 27-lijst. Check in op de dag om te spelen. Inschrijven garandeert geen plaats.', fcNo: 'Zin om FC 27 te spelen? <a style="color:#f2d98a" href="{link}">Schrijf je hier in</a>.',
    waitlistSubject: 'Je staat op de wachtlijst · The Mind Behind the Game', waitlistBody: '<p>Je staat op de wachtlijst. Komt er een plaats vrij, dan mailen we je een link die 24 uur geldig is.</p>',
    notifySubject: 'We laten je weten wanneer de volgende golf opent', notifyBody: '<p>We mailen je zodra de volgende golf plaatsen opent.</p>',
    waveOpenSubject: 'Golf {n} is open · The Mind Behind the Game', waveOpenBody: '<p>Er zijn nieuwe plaatsen. <a style="color:#f2d98a" href="{link}">Kies je plaats</a>.</p>',
    offerSubject: 'Er is een plaats vrij voor jou · 24 uur geldig', offerBody: '<p>Er kwam een plaats vrij. <a style="color:#f2d98a" href="{link}">Claim ze binnen 24 uur</a>.</p>',
    stillSubject: 'Kom je nog op zo 20 dec?', stillBody: '<p>Eén klik om je plaats te houden: <a style="color:#f2d98a" href="{link}">Ja, ik kom</a>. Onbevestigde plaatsen worden op 15 dec vrijgegeven.</p><p>FC 27 spelen? <a style="color:#f2d98a" href="{fc}">Schrijf je in</a>.</p>',
    reminderSubject: 'Morgen: The Mind Behind the Game, deuren 10:00', reminderBody: '<p>Tot morgen in De Felix, Braemkasteelstraat 33-35, Gentbrugge. Deuren 10:00.</p><p>FC 27: <a style="color:#f2d98a" href="{fc}">inschrijven of het schema bekijken</a>.</p>' },
  fr: { row: 'Rang', seat: 'place', youreIn: "C'est confirmé.", when: 'Dim 20 déc 2026 · Portes 10:00 · Programme 10:30–13:30', manage: 'Gérer ou libérer tes places',
    confirmSubject: 'Ta place pour The Mind Behind the Game, dim 20 déc', fcYes: "Tu es sur la liste FC 27. Présente-toi le jour même pour jouer. L'inscription ne garantit pas une place.", fcNo: 'Envie de jouer à FC 27 ? <a style="color:#f2d98a" href="{link}">Inscris-toi ici</a>.',
    waitlistSubject: "Tu es sur la liste d'attente · The Mind Behind the Game", waitlistBody: "<p>Tu es sur la liste d'attente. Si une place se libère, nous t'enverrons un lien valable 24 heures.</p>",
    notifySubject: "Nous te préviendrons à l'ouverture de la prochaine vague", notifyBody: "<p>Nous t'écrirons dès l'ouverture de la prochaine vague.</p>",
    waveOpenSubject: 'La vague {n} est ouverte · The Mind Behind the Game', waveOpenBody: '<p>De nouvelles places sont ouvertes. <a style="color:#f2d98a" href="{link}">Choisis ta place</a>.</p>',
    offerSubject: 'Une place est libre pour toi · valable 24 heures', offerBody: '<p>Une place s\'est libérée. <a style="color:#f2d98a" href="{link}">Réserve-la dans les 24 heures</a>.</p>',
    stillSubject: 'Tu viens toujours le dim 20 déc ?', stillBody: '<p>Un clic pour garder ta place : <a style="color:#f2d98a" href="{link}">Oui, je viens</a>. Les places non confirmées sont libérées le 15 déc.</p><p>FC 27 ? <a style="color:#f2d98a" href="{fc}">Inscris-toi</a>.</p>',
    reminderSubject: 'Demain : The Mind Behind the Game, portes 10:00', reminderBody: '<p>À demain à De Felix, Braemkasteelstraat 33-35, Gentbrugge. Portes 10:00.</p><p>FC 27 : <a style="color:#f2d98a" href="{fc}">inscription et tableau</a>.</p>' }
};
function T_(lang, k) { var s = STR_[lang] || STR_.en; return s[k] || STR_.en[k] || k; }
