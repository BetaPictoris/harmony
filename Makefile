export PATH := node_modules/.bin:$(PATH)

all: build

build:
	mkdir build
	build/harmony

build/harmony:
	go build ./api
	mv api ./build/harmony

build/app:
	BUILD_PATH='./build/app' react-app-rewired build