package main

import (
	"io/ioutil"
	"log"
	"mime"
	"strings"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/exp/slices"
)

var (
	music               []MediaFile
	supportedMediaTypes = []string{"audio/mpeg", "audio/x-flac"}
)

const (
	MEDIA_DIR = "/Users/beta/Music/Music"
)

func main() {
	log.Println("Starting Harmony...")

	log.Print("Indexing songs...")
	indexSongs()

	app := fiber.New(fiber.Config{
		ServerHeader:          "Harmony",
		CaseSensitive:         true,
		AppName:               "Harmony",
		DisableStartupMessage: true,
	})

	v1api := app.Group("/api").Group("/v1")

	/*
	   GET: /api/v1/ping
	   Checks if the API Server is running
	*/
	v1api.Get("/ping", func(c *fiber.Ctx) error {
		c.SendStatus(200)
		return c.SendString("Pong!")
	})

	/*
		GET: /api/v1/music
		Lists all music files
	*/
	v1api.Get("/music", func(c *fiber.Ctx) error {
		c.SendStatus(200)
		return c.JSON(music)
	})

	// Start listening for requests
	log.Println("Flagdown listening on http://127.0.0.1:3000")
	app.Listen("127.0.0.1:3000")
}

func indexSongs() {
	var newMusicFiles []MediaFile
	var dirsToIndex = []string{MEDIA_DIR}

	var dirsIndexSize = len(dirsToIndex)
	for i := 0; i < dirsIndexSize; i++ {
		files, err := ioutil.ReadDir(dirsToIndex[i])
		if err != nil {
			log.Println("Failed to read media directory:", err)
		}

		for _, f := range files {
			var filePath = dirsToIndex[i] + "/" + f.Name()
			var fileExt = strings.Split(filePath, ".")[len(strings.Split(filePath, "."))-1]
			var fileType = mime.TypeByExtension("." + fileExt)

			if f.IsDir() {
				log.Println("Found new dir", filePath)
				dirsToIndex = append(dirsToIndex, filePath)
			} else {
				if slices.Contains(supportedMediaTypes, fileType) {
					log.Println("Found song", filePath)

					var fileData = MediaFile{len(newMusicFiles), filePath}

					newMusicFiles = append(newMusicFiles, fileData)
				}
			}
		}

		dirsIndexSize = len(dirsToIndex)
	}

	music = newMusicFiles
}

type MediaFile struct {
	id   int
	path string
}
