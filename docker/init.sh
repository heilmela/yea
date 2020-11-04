#!/bin/bash
set -e
mongo <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);
    use $MONGO_INITDB_DATABASE;
    var user = '$DB_USER';
    var passwd = '$DB_PASSWORD';
    db.createUser({user: user, pwd: passwd, roles: [
        {role: 'readWrite',db: '$MONGO_INITDB_DATABASE'}
    ]});
    db.createCollection("user");
EOF