package types

import (
	"log"
	"os"

	"github.com/dhowden/tag"
	"github.com/google/uuid"
)

type MediaFile struct {
	Id       string
	ArtistID string
	AlbumID  string

	Path  string
	Title string

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
func NewMediaFile(filePath string, albums []Album, artists []Artist) (MediaFile, []Album, []Artist) {
	file, err := os.Open(filePath)
	if err != nil {
		log.Println("Failed to read file:", err)
	}

	m, err := tag.ReadFrom(file)
	if err != nil {
		log.Println("Failed to read file metadata:", err)
	}

	media := MediaFile{uuid.NewString(), "", "", filePath, m.Title(), m}

	albums = addToAlbumIfExists(albums, media)
	newArtists, albumWithID := addToArtistIfExists(artists, albums[len(albums)-1])

	albums[len(albums)-1].ArtistID = albumWithID.ArtistID
	artists = newArtists

	media.AlbumID = albums[len(albums)-1].Id
	media.ArtistID = artists[len(artists)-1].Id

	return media, albums, artists
}

type Album struct {
	Id         string
	Title      string
	ArtistName string
	ArtistID   string

	SongIDs []string
}

type BasicAlbum struct {
	Id       string
	Title    string
	ArtistID string
}

/*
newAlbum
Returns a new Album object from a title.

title		string		The name of the album
*/
func newAlbum(title string, artistName string) Album {
	return Album{uuid.NewString(), title, artistName, "", []string{}}
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
Adds a MediaFile to an album (and creates an Album if one is not found),
returns a new []Album array.

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
		a := newAlbum(media.Metadata.Album(), media.Metadata.AlbumArtist())
		a = addToAlbum(a, media)
		albums = append(albums, a)
	}

	return albums
}

type Artist struct {
	Id   string
	Name string

	AlbumIDs []string
}

type BasicArtist struct {
	Id   string
	Name string
}

/*
newArtist
Creates a new Artist object.

name		String		The artist's name.
*/
func newArtist(name string) Artist {
	return Artist{uuid.NewString(), name, []string{}}
}

/*
addToArtist
Adds an Album to an artist, returns a new Artist and Album object.

artist		Artist				The album object to add to.
album 		Album     	 	The file to add to the album.
*/
func addToArtist(artist Artist, album Album) (Artist, Album) {
	artist.AlbumIDs = append(artist.AlbumIDs, album.Id)
	album.ArtistID = artist.Id

	return artist, album
}

/*
addToArtistIfExists
Adds an Album to an artist (and creates an Artist if one is not found),
return a new []Artist array.

artists			[]Artist	The array of artists to check.
album				Album			The album to add.
*/
func addToArtistIfExists(artists []Artist, album Album) ([]Artist, Album) {
	artistFound := false

	for i := 0; i < len(artists); i++ {
		if artists[i].Name == album.ArtistName {
			// Check to see if the artist already has an album with this ID.
			for _, a := range artists[i].AlbumIDs {
				// If one is found stop here.
				if a == album.Id {
					artistFound = true
					break
				}
			}

			// If no album is found add it to the artist
			if !artistFound {
				artists[i], album = addToArtist(artists[i], album)
				artistFound = true
				break
			}
		}
	}

	// If an artist can't be found create a new one and add the album's ID to it.
	if !artistFound {
		a := newArtist(album.ArtistName)
		a, album = addToArtist(a, album)
		artists = append(artists, a)
	}

	// Return the new artists array and new album value.
	return artists, album
}
