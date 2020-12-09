function get(env) {
    let cmd = run("sh", "-c", `printenv --null ${env} >/tmp/${env}`);
    if (cmd != 0) throw Error(`${env} not found.`)
    return cat(`/tmp/${env}`)
}

let dbName = get('MONGO_INITDB_DATABASE');
let dbUser = get('DB_USER');
let dbPwd = get('DB_PASSWORD');
var db = db.getSiblingDB(dbName);
db.auth(dbUser,dbPwd)
// const user = {

// }
// db.runCommand(
//     {
//         insert: 'user',
//         documents: [user]
//     }
// )
