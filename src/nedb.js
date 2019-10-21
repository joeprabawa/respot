const Datastore = require("nedb");
export const db = new Datastore({ filename: "database", autoload: true });
