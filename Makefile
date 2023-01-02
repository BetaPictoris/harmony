export PATH := node_modules/.bin:$(PATH)

all: build

# Build the app and the server
build:
	mkdir build
	make build/harmony
	make build/app

build/harmony:
	cd api; go build -o ../build
	mv build/api build/harmony

build/app:
	BUILD_PATH='./build/app' react-app-rewired build

# Development tasks
clean: clean/app clean/harmony
	rm -rfv build

clean/app:
	rm -rfv build/app

clean/harmony:
	rm -fv build/harmony

start:
	cd build; ./harmony

# Dev AIO tasks
dev: clean dev/app dev/harmony

dev/app:
	clean/app
	make build/app

dev/harmony:
	clean/harmony
	make build/harmony
