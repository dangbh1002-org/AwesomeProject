const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// exports.addMessage = functions.https.onRequest((req,res) => {
//   const original = req.query.text;
//   admin.database().ref('messages').push({original: original}).then(snap => {
//     res.redirect(303, snap.ref)
//   })
// });
//
// exports.makeUppercase = functions.database.ref('messages/{pushId}/original')
//   .onWrite(event => {
//     const original = event.data.val();
//     console.log('Uppercasing', event.params.pushId, original);
//     const uppercase = original.toUpperCase();
//
//     return event.data.ref.parent.child('uppercase').set(uppercase);
//
//   })

exports.sendNotifications = functions.database.ref('taskUsers/{taskId}').onCreate(event => {
  const eventSnaps = event.data;
  const messages = [];
  eventSnaps.forEach(itemSnap => {
    const uid = itemSnap.key;


    // create notification and userNotifications
    admin.database().ref(`userNotifications/${uid}`).push({
      body: "You've got a new task!",
      data: {
        taskId: event.params.taskId
      }
    });

    admin.database().ref(`tasks/${event.params.taskId}`).once('value', snap => {
      const item = { name: snap.val().name, key: snap.key};
      const payload = {
        data: item,
        notification: {
          title: "You've got a new task!",
          body: item.name,
          sound: "default"
        }
      }
      return admin.messaging()
        .sendToTopic(`/topics/${uid}`, payload)
        .then(result => console.log(result))
        .catch(err => console.log(err));

    })


  })

})
