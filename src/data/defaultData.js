import { v4 as uuid } from 'uuid';

const PEOPLE = [
  { id: 'p1', name: 'Anna K.', color: '#ff642e' },
  { id: 'p2', name: 'John D.', color: '#00c875' },
  { id: 'p3', name: 'Sarah M.', color: '#4caf82' },
  { id: 'p4', name: 'Mike R.', color: '#66bb6a' },
];

export const STATUS_OPTIONS = [
  { label: 'Working on it', color: '#fdab3d' },
  { label: 'Done', color: '#00c875' },
  { label: 'Stuck', color: '#e2445c' },
  { label: 'Not Started', color: '#c4c4c4' },
  { label: '', color: '#c4c4c4' },
];

export const PRIORITY_OPTIONS = [
  { label: 'Critical', color: '#333333' },
  { label: 'High', color: '#e2445c' },
  { label: 'Medium', color: '#fdab3d' },
  { label: 'Low', color: '#4caf82' },
  { label: '', color: '#c4c4c4' },
];

export const COLUMN_TYPES = {
  status: { label: 'Status', width: 140 },
  person: { label: 'Person', width: 140 },
  date: { label: 'Date', width: 140 },
  priority: { label: 'Priority', width: 140 },
  text: { label: 'Text', width: 200 },
  numbers: { label: 'Numbers', width: 120 },
};

export function createDefaultData() {
  const boardId = uuid();
  const board2Id = uuid();
  const board3Id = uuid();
  const board4Id = uuid();

  return {
    people: PEOPLE,
    activity: [],
    boards: [
      {
        id: boardId,
        name: 'Project Planning',
        favorite: false,
        columns: [
          { id: uuid(), type: 'status', title: 'Status', width: 140 },
          { id: uuid(), type: 'person', title: 'Owner', width: 140 },
          { id: uuid(), type: 'date', title: 'Due Date', width: 140 },
          { id: uuid(), type: 'priority', title: 'Priority', width: 140 },
          { id: uuid(), type: 'text', title: 'Notes', width: 200 },
        ],
        groups: [
          {
            id: uuid(),
            title: 'To Do',
            color: '#4caf82',
            collapsed: false,
            items: [
              {
                id: uuid(),
                name: 'Research competitors',
                values: {},
              },
              {
                id: uuid(),
                name: 'Define project scope',
                values: {},
              },
              {
                id: uuid(),
                name: 'Create wireframes',
                values: {},
              },
            ],
          },
          {
            id: uuid(),
            title: 'In Progress',
            color: '#fdab3d',
            collapsed: false,
            items: [
              {
                id: uuid(),
                name: 'Design landing page',
                values: {},
              },
              {
                id: uuid(),
                name: 'Set up CI/CD pipeline',
                values: {},
              },
            ],
          },
          {
            id: uuid(),
            title: 'Completed',
            color: '#00c875',
            collapsed: false,
            items: [
              {
                id: uuid(),
                name: 'Initial project setup',
                values: {},
              },
            ],
          },
        ],
      },
      {
        id: board2Id,
        name: 'Bug Tracker',
        favorite: true,
        columns: [
          { id: uuid(), type: 'status', title: 'Status', width: 140 },
          { id: uuid(), type: 'priority', title: 'Priority', width: 140 },
          { id: uuid(), type: 'person', title: 'Assignee', width: 140 },
          { id: uuid(), type: 'text', title: 'Description', width: 200 },
        ],
        groups: [
          {
            id: uuid(),
            title: 'Critical Bugs',
            color: '#e2445c',
            collapsed: false,
            items: [
              { id: uuid(), name: 'Login page crashes on mobile', values: {} },
              { id: uuid(), name: 'Payment processing timeout', values: {} },
            ],
          },
          {
            id: uuid(),
            title: 'Minor Issues',
            color: '#4caf82',
            collapsed: false,
            items: [
              { id: uuid(), name: 'Typo on about page', values: {} },
            ],
          },
        ],
      },
      {
        id: board3Id,
        name: 'Waste Truck Analytics (Demo)',
        favorite: false,
        columns: [
          { id: uuid(), type: 'status', title: 'Status', width: 140 },
          { id: uuid(), type: 'person', title: 'Owner', width: 140 },
          { id: uuid(), type: 'date', title: 'Date', width: 140 },
          { id: uuid(), type: 'text', title: 'Route / Area', width: 200 },
          { id: uuid(), type: 'text', title: 'Truck ID', width: 140 },
          { id: uuid(), type: 'numbers', title: 'Trips', width: 120 },
          { id: uuid(), type: 'numbers', title: 'Tons Collected', width: 140 },
          { id: uuid(), type: 'numbers', title: 'Fuel (L)', width: 120 },
          { id: uuid(), type: 'priority', title: 'Priority', width: 140 },
          { id: uuid(), type: 'text', title: 'Notes', width: 240 },
        ],
        groups: [
          {
            id: uuid(),
            title: 'Dashboards & KPIs',
            color: '#4caf82',
            collapsed: false,
            items: [
              { id: uuid(), name: 'Daily collection dashboard (tons, trips, missed stops)', values: {} },
              { id: uuid(), name: 'Fuel efficiency dashboard (L / ton, L / km)', values: {} },
              { id: uuid(), name: 'Service level: on-time %, overflow incidents', values: {} },
            ],
          },
          {
            id: uuid(),
            title: 'Data Pipelines',
            color: '#fdab3d',
            collapsed: false,
            items: [
              { id: uuid(), name: 'Ingest GPS pings (truck location every 10s)', values: {} },
              { id: uuid(), name: 'Import weighbridge tickets / scale data', values: {} },
              { id: uuid(), name: 'Join routes ↔ neighborhoods ↔ schedules', values: {} },
            ],
          },
          {
            id: uuid(),
            title: 'Ops Alerts',
            color: '#e2445c',
            collapsed: false,
            items: [
              { id: uuid(), name: 'Alert when truck deviates from route > 300m', values: {} },
              { id: uuid(), name: 'Alert when bin sensors show overflow risk', values: {} },
            ],
          },
        ],
      },
      {
        id: board4Id,
        name: 'BoQ Management & Conversion (Demo)',
        favorite: false,
        columns: [
          { id: uuid(), type: 'status', title: 'Status', width: 140 },
          { id: uuid(), type: 'person', title: 'Owner', width: 140 },
          { id: uuid(), type: 'priority', title: 'Priority', width: 140 },
          { id: uuid(), type: 'text', title: 'Source Format', width: 160 },
          { id: uuid(), type: 'text', title: 'Target Format', width: 160 },
          { id: uuid(), type: 'numbers', title: 'Items', width: 120 },
          { id: uuid(), type: 'numbers', title: 'Total (NIS)', width: 140 },
          { id: uuid(), type: 'date', title: 'Due Date', width: 140 },
          { id: uuid(), type: 'text', title: 'Notes', width: 260 },
        ],
        groups: [
          {
            id: uuid(),
            title: 'Intake & Parsing',
            color: '#4caf82',
            collapsed: false,
            items: [
              { id: uuid(), name: 'Parse BoQ PDF → structured JSON (sections, items, units)', values: {} },
              { id: uuid(), name: 'OCR + table extraction for scanned documents', values: {} },
              { id: uuid(), name: 'Normalize units (m, m², m³, ton) + rounding rules', values: {} },
            ],
          },
          {
            id: uuid(),
            title: 'Mapping & Conversion',
            color: '#fdab3d',
            collapsed: false,
            items: [
              { id: uuid(), name: 'Map item codes to internal catalog', values: {} },
              { id: uuid(), name: 'Convert to contractor template (Excel) + validations', values: {} },
              { id: uuid(), name: 'Generate comparison: original vs converted totals', values: {} },
            ],
          },
          {
            id: uuid(),
            title: 'Approvals & Outputs',
            color: '#00c875',
            collapsed: false,
            items: [
              { id: uuid(), name: 'Approval workflow: estimator → PM → finance', values: {} },
              { id: uuid(), name: 'Export: Excel + PDF summary + change log', values: {} },
            ],
          },
        ],
      },
    ],
    activeBoardId: boardId,
  };
}
