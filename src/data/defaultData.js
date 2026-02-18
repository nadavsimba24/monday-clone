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
    ],
    activeBoardId: boardId,
  };
}
