package main

import (
	"io/ioutil"
	"log"
	"mime"
	"os"
	"strings"

	"github.com/dhowden/tag"
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
	log.Println("Harmony listening on http://127.0.0.1:3000")
	app.Listen("127.0.0.1:3000")
}

/*
indexSongs
Finds and reads metadata of files in the the MEDIA_DIR directory. It will ignore
all files with an extension that doesn't have a MIME type that is found in
supportedMediaTypes, and will store results in the global music dir.

Params: None
Returns: None
*/
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
					newMusicFiles = append(newMusicFiles, newMediaFile(filePath))
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

	title string
}

/*
newMediaFile
Returns a new MediaFile object from a file path.

filePath		string		The path of the file
*/
func newMediaFile(filePath string) MediaFile {
	file, err := os.Open(filePath)
	if err != nil {
		log.Println("Failed to read file:", err)
	}

	log.Println("Found song", filePath)
	m, err := tag.ReadFrom(file)
	if err != nil {
		log.Fatal("Failed to read file metadata:", err)
	}

	var id = 0 // TODO: Generate a UUID for files

	return MediaFile{id, filePath, m.Title()}
}
