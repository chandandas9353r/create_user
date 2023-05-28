import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

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

let queryString = window.location.search
let urlParams = new URLSearchParams(queryString)
let classStartTime = urlParams.get('Start Time')
let classEndTime = urlParams.get('End Time')
let dept = urlParams.get('Course')
let sem = urlParams.get('Semester')
let sub = urlParams.get('Subject')
let teacherName = urlParams.get('Teacher')

onAuthStateChanged(auth, (user) => {
    if (!user) window.open('signin.html', '_self')
    else loggedIn()
})

function checkLocation() {
    let uid = auth.currentUser.uid
    navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude,
            lng = position.coords.longitude,
            date = new Date(),
            currentDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()
        currentDate = (date.getMonth() + 1 < 10) ? `${currentDate}:0${date.getMonth() + 1}:${date.getFullYear()}` : `${currentDate}:${date.getMonth() + 1}:${date.getFullYear()}`
        onValue(ref(database, `classes/${currentDate}/${dept}/${sem}/${sub}/${teacherName}/`), (snapshot) => {
            let locationMatch = true
            if(!snapshot.child('Location').exists()){
                set(ref(database, `attendance/${currentDate}/${dept}/${sem}/${sub}/${teacherName}/${uid}/`), {
                    'Latitude': lat,
                    'Longitude': lng,
                    'Present': locationMatch
                })
            } else {
                let serverLat = snapshot.child('Location/Latitude').val()
                let serverLng = snapshot.child('Location/Longitude').val()
                locationMatch = (serverLat == lat && serverLng == lng) ? true : false
                update(ref(database, `attendance/${currentDate}/${dept}/${sem}/${sub}/${teacherName}/${uid}/`), {
                    'Latitude': lat,
                    'Longitude': lng,
                    'Present': locationMatch
                })
            }
        })
    })
}

function loggedIn() {
    let startHour = parseInt(classStartTime.slice(0, 2)),
        startMinutes = parseInt(classStartTime.slice(3, 5)),
        endHour = parseInt(classEndTime.slice(0, 2)),
        endMinutes = parseInt(classEndTime.slice(3, 5)),
        totalTime = (endMinutes < startMinutes) ? ((endHour - startHour - 1) * 60 + (startMinutes - endMinutes)) : ((endHour - startHour) * 60 + (endMinutes - startMinutes))
    window.setInterval(() => {
        let currentTime = new Date().toTimeString().slice(0, 5)
        if (classEndTime <= currentTime) {
            window.open('student_dashboard.html', '_self')
        }
    }, 1000)
    checkLocation()
    window.setInterval(checkLocation, (totalTime / 10) * 60 * 1000)
}