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
	this.db;

	this.decode = function(_file){
		// Create the db
		let Uints = new Uint8Array(_file)
		this.db = new SQL.Database(Uints);

		// Query decks informations
		let rawDecks = this.db.exec("SELECT decks FROM col"); // query
		let decks = JSON.parse(rawDecks[0].values[0][0]);	// parse
		let decksLength = Object.keys(decks).length - 1; // count how many decks are present in the collection
		console.log(decks);
		console.log(decksLength);

		// Query models informations
		let rawModels = this.db.exec("SELECT models FROM col");
		let models = JSON.parse(rawModels[0].values[0][0])
		console.log(models);

		// Query models informations
		let rawCards = this.db.exec("SELECT * FROM cards");
		console.log(rawCards[0]);

		// Query notes (raw Data)
		let rawNotes = this.db.exec("SELECT * FROM notes");
		let notes = [];
		for(let i = 0; i < rawNotes[0].values.length; i++){
			let raw = rawNotes[0].values[i][6].split(String.fromCharCode(31));
			notes[i] = {
				recto: raw[0],
				verso: raw[1],
				recto2: rawNotes[0].values[i][7]
			}
		}
		console.log(notes);
		
	}

}
