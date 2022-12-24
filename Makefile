all: build

build:
	mkdir build
	build/harmony

build/harmony:
	go build ./api
	mv api ./build/harmony