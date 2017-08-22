// actions.js
let firebase = require('firebase');

// tasks
const requestPosts = () => {
  return { type: 'REQUEST_POSTS' }
}
const receivePosts = (data) => {
  return { type: 'RECEIVE_POSTS', data }
}
const getTasks = (userId) => {
  return dispatch => {
    dispatch(requestPosts())

    let ref = firebase.database().ref();

    return ref.child(`userTasks/${userId}`).on('value', snapTasks => {
      let todayTasks = [];
      if(snapTasks.val() === null){
        dispatch(receivePosts(todayTasks));
      }

      snapTasks.forEach(snapTask => {

        let taskId = snapTask.key;
        ref.child(`tasks/${taskId}`).once('value', snapTask => {
          let taskVal = {
            ...snapTask.val(),
            key: snapTask.key
          };
          /**
           * CHECK RULES OF TASK
           */
          // check time range in month

          let now = new Date().getTime();
          let startDate = new Date(taskVal.startDate.time).getTime();
          let endDate = new Date(taskVal.endDate.time);
          endDatePlus = endDate.setDate(endDate.getDate() + 1)
          if( now < startDate  || now > endDatePlus){
            return;
          }

          let today = new Date().getDay().toString();

          if(taskVal.repeats.indexOf(today) === -1){
            return
          }

          todayTasks.push(taskVal);

          dispatch(receivePosts(todayTasks))

        })

      })
    })

  }
}

export {getTasks};
