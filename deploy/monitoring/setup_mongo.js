const {CREDENTIALS} = required("./.credentials.js")

db = connect( 'mongodb://localhost:27017/admin' );
db.createUser(
    {
      user: CREDENTIALS.ADMIN.USER,
      pwd: CREDENTIALS.ADMIN.PWD,
      roles: [
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" }
      ]
    }
  )

db = connect( `mongodb://${CREDENTIALS.ADMIN.USER}:${CREDENTIALS.ADMIN.PWD}@localhost:27017/networkMonitoring` );
db.createCollection(
    "networkCanalsStates",
    {
        timeseries: {
            timeField: "timestamp",
            metaField: "metadata"
        },
        expireAfterSeconds: 86400
    }
)

db = connect( `mongodb://${CREDENTIALS.ADMIN.USER}:${CREDENTIALS.ADMIN.PWD}@localhost:27017/admin` );
db.createUser(
    {
        user: CREDENTIALS.APP.USER,
        pwd: CREDENTIALS.APP.PWD,
        roles: [
            {role: "readWrite", db: "networkMonitoring"}
        ]
    }
)