@echo off
mkdir build

go build ./api
move ./api.exe build/harmony.exe