package main

import (
	"io/ioutil"
	"log"
	"mime"
	"strings"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/exp/slices"

	"github.com/BetaPictoris/harmony/api/types"
)

var (
	music   []types.MediaFile
	albums  []types.Album
	artists []types.Artist

	supportedMediaTypes = []string{"audio/mpeg", "audio/x-flac"}
)

const (
	MEDIA_DIR = "/Users/beta/Music/Music"
)

func main() {
	log.Println("Starting Harmony...")

	// Update local song index in the background.
	go indexSongs()

	app := fiber.New(fiber.Config{
		ServerHeader:          "Harmony",
		AppName:               "Harmony",
		CaseSensitive:         true,
		DisableStartupMessage: true,
	})

	app.Static("/app", "./app")

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
	   GET: /api/v1/index/update
	   Updates the song index.
	*/
	v1api.Get("/index/update", func(c *fiber.Ctx) error {
		go indexSongs()
		return c.SendStatus(202)
	})

	/*
		GET: /api/v1/songs
		Lists all music files
	*/
	v1api.Get("/songs", func(c *fiber.Ctx) error {
		data := []types.BasicMediaFile{}

		for i := 0; i < len(music); i++ {
			data = append(data, types.BasicMediaFile{music[i].Id, music[i].Metadata.Title()})
		}

		c.SendStatus(200)
		return c.JSON(data)
	})

	/*
		GET: /api/v1/song/:ID
		Returns the data on a file with :ID
	*/
	v1api.Get("/songs/:ID", func(c *fiber.Ctx) error {
		data := types.MediaFile{}

		for i := 0; i < len(music); i++ {
			if music[i].Id == c.Params("ID") {
				data = music[i]
				break
			}
		}

		if (data.Id == types.MediaFile{}.Id) {
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
		GET: /api/v1/song/:ID/cover
		Returns the covert art of a song with :ID
	*/
	v1api.Get("/songs/:ID/cover", func(c *fiber.Ctx) error {
		// Find the song
		var song types.MediaFile

		for i := 0; i < len(music); i++ {
			if music[i].Id == c.Params("ID") {
				song = music[i]
				break
			}
		}

		// Open picture byte array as io.Reader
		picture := song.Metadata.Picture().Data

		// Set the content type
		c.Set("Content-Type", "image/jpeg")
		c.SendStatus(200)
		return c.Send(picture)
	})

	/*
		GET: /api/v1/albums
		List all albums
	*/
	v1api.Get("/albums", func(c *fiber.Ctx) error {
		data := []types.BasicAlbum{}

		for i := 0; i < len(albums); i++ {
			data = append(data, types.BasicAlbum{albums[i].Id, albums[i].Title, albums[i].ArtistID})
		}

		c.SendStatus(200)
		return c.JSON(data)
	})

	/*
		GET: /api/v1/albums/:ID
		List details on an album
	*/
	v1api.Get("/albums/:ID", func(c *fiber.Ctx) error {
		data := types.Album{}

		for i := 0; i < len(albums); i++ {
			if albums[i].Id == c.Params("ID") {
				data = albums[i]
				break
			}
		}

		if data.Id == "" {
			return c.SendStatus(404)
		}

		c.SendStatus(200)
		return c.JSON(data)
	})

	/*
		GET: /api/v1/albums/:ID/cover
		Returns the cover art of an album
	*/
	v1api.Get("/albums/:ID/cover", func(c *fiber.Ctx) error {
		// Find the album
		var album types.Album

		for i := 0; i < len(albums); i++ {
			if albums[i].Id == c.Params("ID") {
				album = albums[i]
				break
			}
		}

		// Return 404 if album not found
		if album.Id == "" {
			return c.SendStatus(404)
		}

		// Get the album art of the first song
		// Find the first song
		var song types.MediaFile

		for i := 0; i < len(music); i++ {
			if music[i].Id == album.SongIDs[0] {
				song = music[i]
				break
			}
		}

		// Send the album art
		c.Set("Content-Type", "image/jpeg")
		c.SendStatus(200)
		return c.Send(song.Metadata.Picture().Data)
	})

	/*
		GET: /api/v1/artists
		List all artists
	*/
	v1api.Get("/artists", func(c *fiber.Ctx) error {
		data := []types.BasicArtist{}

		for i := 0; i < len(artists); i++ {
			data = append(data, types.BasicArtist{artists[i].Id, artists[i].Name})
		}

		c.SendStatus(200)
		return c.JSON(data)
	})

	/*
		GET: /api/v1/artists/:ID
		List the details of a specific artist
	*/
	v1api.Get("/artists/:ID", func(c *fiber.Ctx) error {
		data := types.Artist{}

		for i := 0; i < len(artists); i++ {
			if artists[i].Id == c.Params("ID") {
				data = artists[i]
				break
			}
		}

		if data.Id == "" {
			return c.SendStatus(404)
		}

		c.SendStatus(200)
		return c.JSON(data)
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
	log.Println("[INDEX] Updating song index...")
	var newMediaFiles []types.MediaFile
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
					newMediaFile, newAlbums, newArtists := types.NewMediaFile(filePath, albums, artists)
					newMediaFiles = append(newMediaFiles, newMediaFile)

					albums = newAlbums
					artists = newArtists
				}
			}
		}

		dirsIndexSize = len(dirsToIndex)
	}

	log.Println("[INDEX] Found", len(newMediaFiles), "songs,", len(albums), "albums, and", len(artists), "artists!")

	music = newMediaFiles
}
