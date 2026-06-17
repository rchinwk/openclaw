const fs = require('fs');

const workflow = {
  id: 'AidaCalendarManager01',
  name: 'Aida Calendar Manager',
  active: true,
  isArchived: false,
  nodes: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Calendar webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2.1,
      position: [-620, 0],
      webhookId: 'aida-calendar-manager-webhook',
      parameters: {
        httpMethod: 'POST',
        path: 'aida-calendar-manager',
        authentication: 'none',
        responseMode: 'responseNode',
        options: {
          ipWhitelist: '127.0.0.1,::1,172.16.0.0/12',
        },
      },
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Ryan Private events',
      type: 'n8n-nodes-base.googleCalendar',
      typeVersion: 1.3,
      position: [-300, 0],
      parameters: {
        resource: 'event',
        operation: 'getAll',
        calendar: {
          __rl: true,
          mode: 'list',
          value: 'ryan.chin.wk@gmail.com',
          cachedResultName: 'Ryan Private',
        },
        returnAll: true,
        timeMin: '={{ $json.body.start }}',
        timeMax: '={{ $json.body.end }}',
        options: {
          recurringEventHandling: 'expand',
          orderBy: 'startTime',
          timeZone: {
            __rl: true,
            mode: 'id',
            value: 'Europe/Amsterdam',
          },
        },
      },
      credentials: {
        googleCalendarOAuth2Api: {
          id: 'R7FgG9Uv2RG4j3zU',
          name: 'Google Calendar account',
        },
      },
    },
    {
      id: '33333333-3333-4333-8333-333333333333',
      name: 'Format response',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [20, 0],
      parameters: {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const items = $input.all().map((item) => item.json);

function text(value) {
  return String(value || '').replace(/\\s+/g, ' ').trim();
}

function fmt(value, allDay) {
  if (!value) return '';
  if (allDay || /^\\d{4}-\\d{2}-\\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat('nl-NL', {
      timeZone: 'Europe/Amsterdam',
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(value + 'T00:00:00+02:00'));
  }
  return new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

const events = items
  .filter((event) => event && event.status !== 'cancelled')
  .map((event) => {
    const start = event.start?.dateTime || event.start?.date || event.start || '';
    const end = event.end?.dateTime || event.end?.date || event.end || '';
    return {
      id: event.id,
      title: text(event.summary || '(geen titel)'),
      start,
      end,
      allDay: !!event.start?.date,
      location: text(event.location || ''),
    };
  })
  .sort((a, b) => String(a.start).localeCompare(String(b.start)));

let answer;
if (!events.length) {
  answer = 'Ik vind geen afspraken in die periode.';
} else {
  answer = events.slice(0, 20).map((event) => {
    const line = '- ' + fmt(event.start, event.allDay) + ': ' + event.title;
    return event.location ? line + ' (' + event.location + ')' : line;
  }).join('\\n');
}

return [{
  json: {
    ok: true,
    calendar: 'Ryan Private',
    eventCount: events.length,
    events,
    answer,
  },
}];
`,
      },
    },
    {
      id: '44444444-4444-4444-8444-444444444444',
      name: 'Respond',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.5,
      position: [320, 0],
      parameters: {
        respondWith: 'json',
        responseBody: '={{ $json }}',
        options: {
          responseCode: 200,
        },
      },
    },
  ],
  connections: {
    'Calendar webhook': {
      main: [[{ node: 'Ryan Private events', type: 'main', index: 0 }]],
    },
    'Ryan Private events': {
      main: [[{ node: 'Format response', type: 'main', index: 0 }]],
    },
    'Format response': {
      main: [[{ node: 'Respond', type: 'main', index: 0 }]],
    },
  },
  settings: {
    timezone: 'Europe/Amsterdam',
    executionOrder: 'v1',
  },
  staticData: {},
  pinData: {},
};

fs.writeFileSync('/tmp/aida-calendar-backend-read.json', JSON.stringify([workflow], null, 2));
console.log('/tmp/aida-calendar-backend-read.json');
