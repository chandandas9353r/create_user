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

function loggedIn() {
    let createClassCard = document.getElementById('createClassCard'),
        content = document.getElementById('content'),
        nolecture = document.getElementById('nolecture'),
        lecturesList = document.getElementById('lecturesList'),
        date = new Date(),
        currentDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate(),
        uid = auth.currentUser.uid
    currentDate = (date.getMonth() + 1 < 10) ? `${currentDate}:0${date.getMonth() + 1}:${date.getFullYear()}` : `${currentDate}:${date.getMonth() + 1}:${date.getFullYear()}`

    onValue(ref(database), (snapshot) => {
        let dept = snapshot.child(`users/teacher/${uid}/Department`).val()
        onValue(ref(database, `classes/teachers/${dept}/${uid}/`), (snapshot) => {
            if (snapshot.val() == null) nolecture.innerHTML = 'No lectures has been set.... '
            else {
                nolecture.style.display = 'none';
                lecturesList.style.display = 'flex';
                (snapshot.forEach(element => {
                    let sub = element.key
                    let section = document.createElement('div'),
                        item = document.createElement('div')
                    section.setAttribute('class', 'cards')
                    createSection('p', element.key, section, null)
                    createSection('span', `Class starts at ${snapshot.child(`${sub}/Start Time`).val()}`, item, section)
                    createSection('br', '', item, section)
                    createSection('span', `Dept : ${dept}`, item, section)
                    createSection('br', '', item, section)
                    createSection('span', `Semester : ${snapshot.child(sub).val().Semester}`, item, section)
                    lecturesList.append(section)
                }))
            }
        })
    })

    document.querySelector('.container > .container1').addEventListener('click', openCreateCard)

    function openCreateCard() {
        content.style.display = 'none'
        createClassCard.style.display = 'block'
        let create = document.getElementById('newClassBtn'),
            cancel = document.getElementById('cancel')
        create.addEventListener('click', function () {
            onValue(ref(database), (snapshot) => {
                let date = new Date(),
                    dept = snapshot.child(`users/teacher/${uid}/Department`).val(),
                    teacherName = snapshot.child(`users/teacher/${uid}/Name`).val(),
                    currentDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate(),
                    startTime = document.getElementById('startTime').value,
                    endTime = document.getElementById('endTime').value,
                    sem = document.getElementById('sem').value,
                    sub = document.getElementById('sub').value,
                    room = `R-${document.getElementById('room').value}`
                currentDate = (date.getMonth() + 1 < 10) ? `${currentDate}:0${date.getMonth() + 1}:${date.getFullYear()}` : `${currentDate}:${date.getMonth() + 1}:${date.getFullYear()}`
                set(ref(database, `classes/teachers/${dept}/${uid}/${sub}/`), {
                    'Semester': sem,
                    'Room': room,
                    'Start Time': startTime,
                    'End Time': endTime
                })
                set(ref(database,`classes/${currentDate}/${dept}/${sem}/${sub}/`), {
                    'Teacher': teacherName,
                    'Start Time': startTime,
                    'End Time': endTime,
                    'Room': room
                })
            })
            window.setTimeout(() => {
                location.reload()
            }, 1000)
        })
        cancel.addEventListener('click', function () {
            location.reload()
        })
    }
}