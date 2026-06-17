const fs = require('fs');

const inPath = '/tmp/aida-calendar-manager-current.json';
const outPath = '/tmp/aida-calendar-manager-backend.json';
const raw = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const wf = Array.isArray(raw) ? raw[0] : raw;

const jsCode = `
const body = $input.first().json.body || {};
const now = new Date();
const start = body.start || body.timeMin || new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
const end = body.end || body.timeMax || new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59).toISOString();

function escapeText(value) {
  return String(value || '').replace(/\\s+/g, ' ').trim();
}

async function googleGet(resource, qs = {}) {
  const options = {
    method: 'GET',
    uri: 'https://www.googleapis.com' + resource,
    qs,
    json: true,
  };
  if (this.helpers.requestOAuth2) {
    return await this.helpers.requestOAuth2.call(this, 'googleCalendarOAuth2Api', options);
  }
  if (this.helpers.httpRequestWithAuthentication) {
    return await this.helpers.httpRequestWithAuthentication.call(this, 'googleCalendarOAuth2Api', options);
  }
  throw new Error('No OAuth helper available in n8n Code node');
}

const calendarList = await googleGet('/calendar/v3/users/me/calendarList', {
  minAccessRole: 'reader',
  showDeleted: false,
  showHidden: false,
  maxResults: 250,
});

const calendars = (calendarList.items || [])
  .filter((calendar) => !calendar.deleted)
  .map((calendar) => ({
    id: calendar.id,
    summary: calendar.summary || calendar.id,
    primary: !!calendar.primary,
    selected: !!calendar.selected,
    accessRole: calendar.accessRole,
  }));

const events = [];
for (const calendar of calendars) {
  try {
    const response = await googleGet('/calendar/v3/calendars/' + encodeURIComponent(calendar.id) + '/events', {
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: 'startTime',
      showDeleted: false,
      maxResults: 50,
    });
    for (const event of response.items || []) {
      if (event.status === 'cancelled') continue;
      const eventStart = event.start?.dateTime || event.start?.date || '';
      const eventEnd = event.end?.dateTime || event.end?.date || '';
      events.push({
        calendar: calendar.summary,
        calendarId: calendar.id,
        summary: escapeText(event.summary || '(geen titel)'),
        start: eventStart,
        end: eventEnd,
        allDay: !!event.start?.date,
        location: escapeText(event.location || ''),
      });
    }
  } catch (error) {
    events.push({
      calendar: calendar.summary,
      calendarId: calendar.id,
      error: error.message || 'Calendar read failed',
    });
  }
}

events.sort((a, b) => String(a.start || '').localeCompare(String(b.start || '')));

function formatDateTime(value, allDay) {
  if (!value) return '';
  if (allDay || /^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

const realEvents = events.filter((event) => !event.error);
let answer;
if (!realEvents.length) {
  answer = 'Ik vind geen afspraken in die periode in je Google Calendars.';
} else {
  answer = realEvents.slice(0, 12)
    .map((event) => {
      const when = formatDateTime(event.start, event.allDay);
      const suffix = event.calendar ? ' [' + event.calendar + ']' : '';
      return '- ' + when + ': ' + event.summary + suffix;
    })
    .join('\\n');
}

return [{
  json: {
    ok: true,
    start,
    end,
    calendarCount: calendars.length,
    eventCount: realEvents.length,
    calendars,
    events: realEvents,
    answer,
  },
}];
`;

const codeNode = wf.nodes.find((node) => node.name === 'Echo');
codeNode.name = 'Calendar backend';
codeNode.parameters.jsCode = jsCode;
codeNode.credentials = {
  googleCalendarOAuth2Api: {
    id: 'R7FgG9Uv2RG4j3zU',
    name: 'Google Calendar account',
  },
};

wf.connections['Availability webhook'].main[0][0].node = 'Calendar backend';
wf.connections['Calendar backend'] = wf.connections.Echo;
delete wf.connections.Echo;
wf.active = true;
wf.isArchived = false;

fs.writeFileSync(outPath, JSON.stringify([wf], null, 2));
console.log(outPath);
