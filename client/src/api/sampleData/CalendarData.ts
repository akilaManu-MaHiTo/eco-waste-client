export const myevents = [
  {
    id: 0,
    title: "training",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    resourceId: 1,
  },
  {
    id: 1,
    title: "late lunch",
    start: new Date(2021, 5, 8, 14, 0, 0),
    end: new Date(2021, 5, 8, 16, 30, 0),
    resourceId: 2,
  },
  {
    id: 2,
    title: "fight",
    start: new Date(2021, 5, 8, 8, 30, 0),
    end: new Date(2021, 5, 8, 12, 30, 0),
    resourceId: 3,
  },
  {
    id: 3,
    title: "party",
    start: new Date(2021, 5, 8, 7, 0, 0),
    end: new Date(2021, 5, 8, 10, 30, 0),
    resourceId: 4,
  },
];
