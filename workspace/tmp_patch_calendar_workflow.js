const fs = require('fs');

const inPath = '/tmp/aida-calendar-afterfix.json';
const outPath = '/tmp/aida-calendar-contacts-prompt.json';
const raw = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const wf = Array.isArray(raw) ? raw[0] : raw;

wf.active = true;
wf.isArchived = false;

for (const name of ['Agenda bekijken', 'Afspraak toevoegen']) {
  const node = wf.nodes.find((candidate) => candidate.name === name);
  if (node) {
    node.parameters.calendar = {
      __rl: true,
      mode: 'list',
      value: 'primary',
      cachedResultName: 'Primary calendar',
    };
  }
}

const agent = wf.nodes.find((node) => node.name === 'Aida Calendar Agent');
if (agent) {
  agent.parameters.options.maxIterations = 5;
  agent.parameters.options.systemMessage = `Je bent Aida Calendar Assistent voor Ryan. Antwoord altijd kort in het Nederlands en toon nooit redenering, toolnamen of interne stappen.

Gebruik tools zo:
- Agenda/beschikbaarheid: gebruik Agenda bekijken met concrete ISO start/end in Europe/Amsterdam.
- "morgen": hele lokale dag morgen.
- "deze week": vandaag t/m zondag 23:59.
- "dit weekend": komende zaterdag 00:00 t/m zondag 23:59.
- Plannen met een persoon: zoek eerst Contact zoeken op naam. Gebruik het e-mailadres als attendee als beschikbaar.
- Maak alleen een afspraak als datum, starttijd, eindtijd/duur en titel duidelijk zijn. Als iets ontbreekt: vraag 1 korte vervolgvraag.
- Als er een herinnering wordt gevraagd, maak de afspraak met standaard Google Calendar reminders; noem dat kort in je antwoord.

Antwoordvorm voor agenda/beschikbaarheid:
- Als leeg: "Je agenda is leeg in die periode."
- Als bezet: maximaal 5 regels met tijd + titel, daarna korte conclusie.

Vandaag is {{ $now.setZone('Europe/Amsterdam').toISO() }}.`;
}

const model = wf.nodes.find((node) => node.name === 'Ollama Chat Model');
if (model) {
  model.parameters.model = 'gemma4:e2b';
  model.parameters.options = {
    temperature: 0,
    think: false,
    numCtx: 4096,
    numPredict: 384,
    keepAlive: '10m',
  };
}

if (!wf.nodes.find((node) => node.name === 'Contact zoeken')) {
  wf.nodes.push({
    id: 'c2f40d73-5a7d-4a38-a057-54c4d8ff7b41',
    name: 'Contact zoeken',
    type: 'n8n-nodes-base.googleContacts',
    typeVersion: 1,
    position: [288, 288],
    parameters: {
      resource: 'contact',
      operation: 'getAll',
      returnAll: false,
      limit: 10,
      fields: ['names', 'emailAddresses', 'phoneNumbers'],
      useQuery: true,
      query: "={{ $fromAI('query', 'Name or partial name of the contact to search for', 'string') }}",
      rawData: false,
    },
    credentials: {
      googleContactsOAuth2Api: {
        id: '8gFWpq6Y1VeQqZD9',
        name: 'Google Contacts account',
      },
    },
    rewireOutputLogTo: 'ai_tool',
  });
}

wf.connections['Contact zoeken'] = {
  ai_tool: [[{ node: 'Aida Calendar Agent', type: 'ai_tool', index: 0 }]],
};

fs.writeFileSync(outPath, JSON.stringify([wf], null, 2));
console.log(outPath);
