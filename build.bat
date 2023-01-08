@echo off

del .\build\harmony.exe
del .\build\app 

mkdir .\build\

cd api
go build -o ../build
move ..\build\api.exe ..\build\harmony.exe
cd ..

mkdir .\build\data\
copy .\examples\config.ini .\build\data\config.ini

npm run build