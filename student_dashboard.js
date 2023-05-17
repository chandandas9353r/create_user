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
    if (!user) window.open('signin.html', '_self')
    else loggedIn()
})

function createSection(element, value, div1, div2) {
    let item = document.createElement(element)
    if (value != '') item.innerHTML = value
    div1.append(item)
    if (div2 != null) div2.append(div1)
}

function loggedIn(){
    let nolecture = document.getElementById('nolecture'),
        lecturesList = document.getElementById('lecturesList'),
        date = new Date(),
        currentDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate(),
        uid = auth.currentUser.uid,
        dept,
        sem
    currentDate = (date.getMonth() + 1 < 10) ? `${currentDate}:0${date.getMonth() + 1}:${date.getFullYear()}` : `${currentDate}:${date.getMonth() + 1}:${date.getFullYear()}`

    onValue(ref(database, `student/${uid}`), (snapshot) => {
        dept = snapshot.val().Course
        sem = snapshot.val().Semester
        onValue(ref(database, `classes/${currentDate}/${dept}/${sem}/`), (snapshot) => {
            if (snapshot.val() == null) nolecture.innerHTML = 'No lectures has been set.... '
            else{
                nolecture.style.display = 'none';
                lecturesList.style.display = 'flex';
                lecturesList.innerHTML = null
                snapshot.forEach(element => {
                    let startTime = element.key
                    let section = document.createElement('div'),
                        item = document.createElement('div')
                    section.setAttribute('class', 'cards')
                    createSection('p', element.child('Subject').val(), section, null)
                    createSection('span', `Class starts at ${startTime}`, item, section)
                    createSection('br', '', item, section)
                    createSection('span', `Dept : ${dept}`, item, section)
                    createSection('br', '', item, section)
                    createSection('span', `Semester : ${sem}`, item, section)
                    lecturesList.append(section)
                });
            }
        })
    })
    window.setInterval(() => {
        onValue(ref(database,`classes/${currentDate}/${dept}/${sem}/`), (snapshot) => {
            let currentTime = new Date().toLocaleTimeString().slice(0,5)
            snapshot.forEach(element => {
                let classTime = element.key
                if(classTime < currentTime){
                    window.open('student_ongoingDisplay.html','_self')
                }
            })
            // let length = Object.keys(snapshot.val()).length,
            //     currentTime = date.toLocaleTimeString()
            //     console.log(currentTime)
            // if(Object.values(Object.entries(snapshot.val())[0][1])[2] == )
        })
    },1000)
}