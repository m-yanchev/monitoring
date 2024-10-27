@echo off
setlocal

xcopy /E /I /Y %~dp0standalone "C:\Program Files\monitoring\"
 
echo Installing Node.js and MongoDB...
start /wait "" "%~dp0installers/nnode-v20.18.0-x64.msi"
start /wait "" "%~dp0installers/mongodb-windows-x86_64-8.0.1-signed.msi"

echo Starting MongoDB in authentication mode...
start "" "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --auth --dbpath "C:\Program Files\MongoDB\data"

timeout /t 10

echo Running MongoDB setup script...
mongosh -f "%~dp0setup_mongo.js"

echo Starting HTTP server...
node "C:\Program Files\monitoring\standalone\server.js"

echo All tasks completed.
pause