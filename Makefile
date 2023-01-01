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
	./build/harmony