const admin = require("firebase-admin");

const serviceAccount = require("./firestore/spajam-2020-cb983-firebase-adminsdk-fayd1-af185f1ec7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spajam-2020-cb983.firebaseio.com"
});

const db = admin.firestore();
// db.collection('user').get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err);
//   });

let doc = db.collection('user');
let observer = doc.onSnapshot(querySnapshot => {
  console.log(`Received query snapshot of size ${querySnapshot.size}`);
  querySnapshot.forEach((eachDoc) => {
    console.log(eachDoc.id, '=>', eachDoc.data());
  });
}, err => {
  console.log(`Encountered error: ${err}`);
});