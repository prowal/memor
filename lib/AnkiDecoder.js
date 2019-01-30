/*
MIT License

MEMOR

Copyright (c) 2019 Gaétan Walter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*----------------------------------------------------------------------------------------------
------------------------------------ANKI DECODER OBJECT-----------------------------------------
----------------------------------------------------------------------------------------------*/
function AnkiDecoder() {
	this.decode = function(_file){
    // here we go !
    JSZip.loadAsync(_file).then(function (zip) {

			// Read the DB
			zip.file("collection.anki2").async("uint8array").then(function (u8) {
				this.readDB(u8);
			}.bind(this));

			// Read the media file TODO
		
    }.bind(this)).then(function (text) {
      console.log(text);
    })
	}

	this.readDB = function(_u8){
		// Create the db
		let db = new SQL.Database(_u8);

		// Query decks informations
		let rawDecks = db.exec("SELECT decks FROM col"); // query
		let decks = JSON.parse(rawDecks[0].values[0][0]);	// parse
		let decksLength = Object.keys(decks).length - 1; // count how many decks are present in the collection
		console.log(decks);
		console.log(decksLength); // Check for decklength and say merge in one deck

		// Query models informations
		let rawModels = db.exec("SELECT models FROM col");
		let models = JSON.parse(rawModels[0].values[0][0])
		console.log(models);

		// Query models informations
		let rawCards = db.exec("SELECT * FROM cards");
		console.log(rawCards[0]);

		// Query notes (raw Data)
		let rawNotes = db.exec("SELECT * FROM notes");
		console.log(rawNotes[0]);
		let cards = [];
		for(let i = 0; i < rawCards[0].values.length; i++){ // for every card
			for(let j = 0; j < rawNotes[0].values.length; j++){ // go through all notes
				if(rawNotes[0].values[j][0] == rawCards[0].values[i][1]){	// search for matching id note
					let raw = rawNotes[0].values[j][6].split(String.fromCharCode(31)); // retrieve the data and split recto/verso
					if(rawCards[0].values[i][3] == 0){ // straight card
						cards[i] = {
							recto: raw[0],
							verso: raw[1],
						}
					} else { // reversed card
						cards[i] = {
							recto: raw[1],
							verso: raw[0],
						}	
					}
				}
			}
		}
		console.log(cards);
	}
}
