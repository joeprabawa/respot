const Datastore = require("nedb-promises");
let db = Datastore.create("./database");
db.load();

export default db;


