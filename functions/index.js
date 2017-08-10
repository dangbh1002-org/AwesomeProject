const functions = require('firebase-functions');
var request = require('request');

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


exports.sendNotifications = functions.database.ref('taskUsers/{taskId}')
  .onWrite(event => {
    const eventSnaps = event.data;
    const messages = [];
    eventSnaps.forEach(itemSnap => {
      const uid = itemSnap.key;
      // create notification and userNotifications
      admin.database().ref(`userNotifications/${uid}`).push({
          body: "You've got a new task!",
          data: { taskId: event.params.taskId }
        });

      console.log('uid: ', uid);
      admin.database().ref("users/"+ uid + "/token").once('value', snap => {
        const token = snap.key;
        messages.push({
          to: token,
          sound: 'default',
          body: "You've got a new task!",
          data: { taskId: event.params.taskId }
        });

        console.log('token: ', token);
      })
    })

    console.log('messages: ', messages);
    return request({
      url: functions.config().expo.endpoint,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'accept-encoding': 'gzip, deflate'
      },
      body: JSON.stringify(messages)
    });


  })
