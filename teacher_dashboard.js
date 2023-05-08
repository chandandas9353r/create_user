import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

const appSettings = {
    apiKey: "AIzaSyBJ2Z4fqeti3-xwrDjVlIYGu-Du6v2Gb-s",
    authDomain: "create-user-signin-signup.firebaseapp.com",
    projectId: "create-user-signin-signup",
    databaseURL: "https://create-user-signin-signup-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "create-user-signin-signup.appspot.com",
    messagingSenderId: "332562437134",
    appId: "1:332562437134:web:4b15b04ddfc431a9ee985f"
}

const app = initializeApp(appSettings)
const auth = getAuth(app)
const database = getDatabase(app)

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.open('signin.html', '_self')
        return
    }
});

function deptName(){
    onValue(ref(database, `users/teacher/`), (snapshot) => {
        console.log()
    })
}

document.getElementById('addBtn').addEventListener('click', function () {
    let user = auth.currentUser.uid
    onValue(ref(database, `users/teacher/` + deptName), (snapshot) => {
        if(snapshot.child(`${user}`).exists()){
            console.log(snapshot.child(`${user}`).val().Course)
        }
    })
    console.log(auth.currentUser.uid)
    document.getElementById('createClassContainer').style.display = 'block'
    document.getElementById('container').style.opacity = '20%'
    document.getElementById('heading').style.opacity = '20%'
    document.getElementById('createClassBtn').addEventListener('click', function () {
        let semester = document.getElementById('sem'),
            subject = document.getElementById('sub'),
            room = document.getElementById('room'),
            time = document.getElementById('time'),
            currentDate = new Date().toLocaleDateString()
        if (semester.value.length == 0) {
            semester.setCustomValidity('Choose Semester')
            semester.reportValidity()
            return
        }
        else if (subject.value.length == 0) {
            subject.setCustomValidity('Choose Subject')
            subject.reportValidity()
            return
        }
        else if (room.value.length == 0) {
            room.setCustomValidity('Enter Room Number')
            room.reportValidity()
            return
        }
        else if (time.value == "") {
            time.setCustomValidity('Choose Time Slot')
            time.reportValidity()
            return
        }
        // else{
        //     onValue(set(ref(database, `classes/${currentDate}`)))
        // }
    })
})