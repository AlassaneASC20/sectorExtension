//
// Database management
//

let db;
let dbReq = indexedDB.open('myDatabase', 2);

 const value = async Description => {
   try{
     const descriptor = document.querySelector("#newmessage");
   }
   catch {
     alert("COuldn't read input")
   }
 }





form.addEventListener

// Fires when the version of the database goes up, or the database is created
// for the first time
dbReq.onupgradeneeded = function(event) {
  db = event.target.result;

  // Create an object store named notes, or retrieve it if it already exists.
  // Object stores in databases are where data are stored.
  let notes;
  if (!db.objectStoreNames.contains('notes')) {
    notes = db.createObjectStore('notes', {autoIncrement: true});
  } else {
    notes = dbReq.transaction.objectStore('notes');
  }

  // If there isn't already a timestamp index, make one so we can query notes
  // by their timestamps
  if (!notes.indexNames.contains('timestamp')) {
    console.log('createIndex')
    notes.createIndex('timestamp', 'timestamp');
  }
}

// Fires once the database is opened (and onupgradeneeded completes, if
// onupgradeneeded was called)
dbReq.onsuccess = function(event) {
  // Set the db variable to our database so we can use it!  
  db = event.target.result;
  getAndDisplayNotes(db);
}

// function SubForm (){
//     $.ajax({
//         url:'https://api.apispreadsheets.com/data/11115/',
//         type:'post',
//         data:$("#app").serializeArray(),
//         success: function(){
//           alert("Form Data Submitted :)")
//         },
//         error: function(){
//           alert("There was an error :(")
//         }
//     });
// }




// Fires when we can't open the database
dbReq.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode);
}

//
// IndexedDB functions
//

// addStickyNote adds a sticky note for the message passed in in the notes
// object store.
function addStickyNote(db, message) {
  // Start a database transaction and get the object store
  let tx = db.transaction(['notes'], 'readwrite');
  let store = tx.objectStore('notes');

  // Put the sticky note into the object store
  let note = {text: message, timestamp: Date.now()};
  store.add(note);

  // Wait for the database transaction to complete
  tx.oncomplete = function() { getAndDisplayNotes(db); }
  tx.onerror = function(event) {
    alert('error storing note ' + event.target.errorCode);
  }
}


// addManyNotes adds sticky notes for an array of messages to the notes
// object store. This is to demonstrate that you can run multiple IndexedDB
// requests in the same transaction, and it is completely normal to do so.
function addManyNotes(db, messages) {
  let tx = db.transaction(['notes'], 'readwrite');
  let store = tx.objectStore('notes');

  for (let i = 0; i < messages.length; i++) {
    // All of the requests made from store.add are part of the same
    // transaction.
    store.add({text: messages[i], timestamp: Date.now()});
  }

  tx.oncomplete = function() { console.log('transaction complete') };
}

let reverseOrder = false;

// getAndDisplayNotes retrieves all notes in the notes object store using an
// IndexedDB cursor and sends them to displayNotes so they can be displayed
function getAndDisplayNotes(db) {
  let tx = db.transaction(['notes'], 'readonly');
  let store = tx.objectStore('notes');

  // Retrieve the sticky notes index to run our cursor query on; the results
  // will be ordered by their timestamp
  let index = store.index('timestamp');

  // Create our openCursor request to get all items in the store, which we
  // collect in the allNotes array. If we're going in reverse, then specify
  // the direction as prev, otherwise, we specify it as next
  let req = index.openCursor(null, reverseOrder ? 'prev' : 'next');
  let allNotes = [];

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;

    if (cursor != null) {
      // If the cursor isn't null, we got an IndexedDB item. Add it to the
      // note array and have the cursor continue!
      allNotes.push(cursor.value);

      // cursor.continue has the cursor move to the next item; we keep looping
      // through the notes because that causes req.onsuccess to fire again
      cursor.continue();
    } else {
      // If we have a null cursor, it means we've gotten all the items in the
      // store, so display the notes we got
      displayNotes(allNotes);
    }
  }

  req.onerror = function(event) {
    alert('error in cursor request ' + event.target.errorCode);
  }
}

//
// DOM manipulation
//

// submitNote submits the sticky note in the #newmessage text box to the
// notes object store

document.getElementById("aSubmit").addEventListener("click",submitNote);
function submitNote() {
  let message = document.getElementById('newmessage');
  userInput = message.value
  addStickyNote(db, message.value);
  message.value = '';

const ACCESS_TOKEN = 'ya29.a0AfH6SMA17ktWAyjKtlvi0SWCuaYuITZ9jPfWb0mpLDQvCK6ptAU2TsnymTeoMwTmsnRAjKQFg-C0AA1SdhlnJUF7v-3XiRkiPAA2cungbl52O5TdbaKPXzqutdnT_HC68EJ7jJpR2mmpA4fanTQwv8XYCjWQ';

  fetch('https://sheets.googleapis.com/v4/spreadsheets/1SlktS8Sjvxa1D3MBZ0Ez8EZ-2HBn5wqerhhPmjheuok:batchUpdate', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    //update this token with yours. 
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
	body: JSON.stringify({
    requests: [{
      repeatCell: {
        range: {
          startColumnIndex: 0,
          endColumnIndex: 1,
          startRowIndex: 0,
          endRowIndex: 1,
          sheetId: 0
        },
        cell: {
          userEnteredValue: {
            "stringValue": userInput
          },
        },
        fields: "*"
      }
    }]
  }),
}).then(res =>{
	if (res.status === 201){
		
	}
	else{
		
	}
})
}


  
//   $.ajax({
//     url:'https://api.apispreadsheets.com/data/11115/',
//     type:'post',
//     data:$("#app").serializeArray(),
//     success: function(){
//       alert("Form Data Submitted :)")
//     },
//     error: function(){
//       alert("There was an error :(")
//     }
//   });
// }

// displayNotes takes in an array of sticky note objects and displays them
// as <li> elements.
function displayNotes(notes) {
  let listHTML = '<ul>';

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    listHTML += '<li>';
    listHTML += _.escape(`${note.text} ${new Date(note.timestamp).toString()}`);
    listHTML += '</li>';
  }
  document.getElementById('notes').innerHTML = listHTML;
}

// flipNoteOrder flips the order of the notes we display from forward to
// reverse, and vice versa, re-displaying the notes in the updated order.
function flipNoteOrder(notes) {
  reverseOrder = !reverseOrder;
  getAndDisplayNotes(db);
}

