export PATH := node_modules/.bin:$(PATH)

all: build

# Build the app and the server
build:
	mkdir build/
	make build/harmony
	make build/app
	make build/data

build/harmony:
	cd api; go build -o ../build/
	mv ./build/api ./build/harmony

build/app:
	BUILD_PATH='./build/app/' react-app-rewired build

build/data:
	cp -rv ./examples/ ./build/data/

# Development tasks
clean: clean/app clean/harmony
	rm -rfv ./build/

clean/app:
	rm -rfv ./build/app/

clean/harmony:
	rm -fv ./build/harmony

clean/data:
	rm -fv ./build/data/

start:
	cd build; ./harmony

# Dev AIO tasks
dev: clean build start

dev/app:
	make clean/app
	make build/app

dev/harmony:
	make clean/harmony
	make build/harmony
