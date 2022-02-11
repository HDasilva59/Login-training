type Person = {
  ID: string;
  PSWD: string;
  cookie: undefined | string;
};

const users: [] | Person[] = [
  {
    ID: "admin",
    PSWD: "admin",
    cookie: undefined,
  },
];

export { users };
