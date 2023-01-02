@echo off

mkdir build

cd api
go build -o ../build
move ..\build\api.exe ..\build\harmony.exe
cd ..

npm run build