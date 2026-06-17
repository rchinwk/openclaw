const fs = require('fs');

const workflow = {
  id: 'AidaContactLookup01',
  name: 'Aida Contact Lookup',
  active: true,
  isArchived: false,
  nodes: [
    {
      id: '11111111-aaaa-4111-8111-111111111111',
      name: 'Contact webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2.1,
      position: [-620, 0],
      webhookId: 'aida-contact-lookup-webhook',
      parameters: {
        httpMethod: 'POST',
        path: 'aida-contact-lookup',
        authentication: 'none',
        responseMode: 'responseNode',
        options: { ipWhitelist: '127.0.0.1,::1,172.16.0.0/12' },
      },
    },
    {
      id: '22222222-aaaa-4222-8222-222222222222',
      name: 'Google Contacts search',
      type: 'n8n-nodes-base.googleContacts',
      typeVersion: 1,
      position: [-300, 0],
      parameters: {
        resource: 'contact',
        operation: 'getAll',
        returnAll: false,
        limit: 10,
        fields: ['names', 'emailAddresses', 'phoneNumbers'],
        useQuery: true,
        query: '={{ $json.body.query }}',
        rawData: false,
      },
      credentials: {
        googleContactsOAuth2Api: {
          id: '8gFWpq6Y1VeQqZD9',
          name: 'Google Contacts account',
        },
      },
    },
    {
      id: '33333333-aaaa-4333-8333-333333333333',
      name: 'Format contacts',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [20, 0],
      parameters: {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const contacts = $input.all().map((item) => item.json).map((person) => {
  const name = person.names?.[0]?.displayName || person.names?.[0]?.unstructuredName || '';
  const email = person.emailAddresses?.[0]?.value || '';
  return { name, email };
}).filter((contact) => contact.name || contact.email);
return [{ json: { ok: true, contacts, count: contacts.length, first: contacts[0] || null } }];
`,
      },
    },
    {
      id: '44444444-aaaa-4444-8444-444444444444',
      name: 'Respond',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.5,
      position: [320, 0],
      parameters: {
        respondWith: 'json',
        responseBody: '={{ $json }}',
        options: { responseCode: 200 },
      },
    },
  ],
  connections: {
    'Contact webhook': { main: [[{ node: 'Google Contacts search', type: 'main', index: 0 }]] },
    'Google Contacts search': { main: [[{ node: 'Format contacts', type: 'main', index: 0 }]] },
    'Format contacts': { main: [[{ node: 'Respond', type: 'main', index: 0 }]] },
  },
  settings: { timezone: 'Europe/Amsterdam', executionOrder: 'v1' },
  staticData: {},
  pinData: {},
};

fs.writeFileSync('/tmp/aida-contact-lookup.json', JSON.stringify([workflow], null, 2));
console.log('/tmp/aida-contact-lookup.json');
