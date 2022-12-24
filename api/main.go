package main

import (
	"io/ioutil"
	"log"
	"mime"
	"os"
	"strings"

	"github.com/dhowden/tag"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/exp/slices"
)

var (
	music               []MediaFile
	albums              []Album
	supportedMediaTypes = []string{"audio/mpeg", "audio/x-flac"}
)

const (
	MEDIA_DIR = "/Users/beta/Music/Music"
)

func main() {
	log.Println("Starting Harmony...")

	log.Print("Indexing songs...")
	go indexSongs()

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
		GET: /api/v1/songs
		Lists all music files
	*/
	v1api.Get("/songs", func(c *fiber.Ctx) error {
		data := []BasicMediaFile{}

		for i := 0; i < len(music); i++ {
			data = append(data, BasicMediaFile{music[i].Id, music[i].Metadata.Title()})
		}

		c.SendStatus(200)
		return c.JSON(data)
	})

	/*
		GET: /api/v1/song/:ID
		Returns the data on a file with :ID
	*/
	v1api.Get("/songs/:ID", func(c *fiber.Ctx) error {
		data := MediaFile{}

		for i := 0; i < len(music); i++ {
			if music[i].Id == c.Params("ID") {
				data = music[i]
				break
			}
		}

		if (data == MediaFile{}) {
			return c.SendStatus(404)
		}
		c.SendStatus(200)
		return c.JSON(data)
	})

	/*
		GET: /api/v1/song/:ID/audio
		Returns a file of an audio file with :ID
	*/
	v1api.Get("/songs/:ID/audio", func(c *fiber.Ctx) error {
		var filePath string

		for i := 0; i < len(music); i++ {
			if music[i].Id == c.Params("ID") {
				filePath = music[i].Path
				break
			}
		}

		c.SendStatus(200)
		return c.SendFile(filePath)
	})

	/*
		GET: /api/v1/albums
		List all albums
	*/
	v1api.Get("/albums", func(c *fiber.Ctx) error {
		c.SendStatus(200)
		return c.JSON(albums)
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
	var newMediaFiles []MediaFile
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
				dirsToIndex = append(dirsToIndex, filePath)
			} else {
				if slices.Contains(supportedMediaTypes, fileType) {
					newMediaFiles = append(newMediaFiles, newMediaFile(filePath))
				}
			}
		}

		dirsIndexSize = len(dirsToIndex)
	}

	log.Println("Found", len(newMediaFiles), "files and", len(albums), "albums!")

	music = newMediaFiles
}

type MediaFile struct {
	Id   string
	Path string

	Metadata tag.Metadata
}

type BasicMediaFile struct {
	Id    string
	Title string
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

	m, err := tag.ReadFrom(file)
	if err != nil {
		log.Println("Failed to read file metadata:", err)
	}

	media := MediaFile{uuid.NewString(), filePath, m}

	albums = addToAlbumIfExists(albums, media)
	return media
}

type Album struct {
	Id      string
	Title   string
	SongIDs []string
}

/*
newAlbum
Returns a new Album object from a title.

title		string		The name of the album
*/
func newAlbum(title string) Album {
	return Album{uuid.NewString(), title, []string{}}
}

/*
addToAlbum
Adds a MediaFile to an album, returns a new Album object.

album		Album				The album object to add to.
media		MediaFile	 	The file to add to the album.
*/
func addToAlbum(album Album, media MediaFile) Album {
	a := album
	a.SongIDs = append(album.SongIDs, media.Id)

	return a
}

/*
addToAlbumIfExists
Adds a MediaFile to an album (and creates an Album if one is not found), returns a new []Album array.

albums		  	[]Album			The array of albums to check.
media					MediaFile		The MediaFile to add to it.
*/
func addToAlbumIfExists(albums []Album, media MediaFile) []Album {
	albumFound := false

	for i := 0; i < len(albums); i++ {
		if albums[i].Title == media.Metadata.Album() {
			albums[i] = addToAlbum(albums[i], media)
			albumFound = true
			break
		}
	}

	if !albumFound {
		a := newAlbum(media.Metadata.Album())
		a = addToAlbum(a, media)
		albums = append(albums, a)
	}

	return albums
}
