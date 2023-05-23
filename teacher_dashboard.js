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
    let nolecture = document.getElementById('nolecture'),
        lecturesList = document.getElementById('lecturesList'),
        date = new Date(),
        currentDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate(),
        uid = auth.currentUser.uid,
        dept
    currentDate = (date.getMonth() + 1 < 10) ? `${currentDate}:0${date.getMonth() + 1}:${date.getFullYear()}` : `${currentDate}:${date.getMonth() + 1}:${date.getFullYear()}`

    onValue(ref(database), (snapshot) => {
        dept = snapshot.child(`users/teacher/${uid}/Department`).val()
        onValue(ref(database, `classes/${currentDate}/teachers/${dept}/${uid}/`), (snapshot) => {
            if (snapshot.val() == null) nolecture.innerHTML = 'No lectures has been set.... '
            else {
                nolecture.style.display = 'none'
                lecturesList.style.display = 'flex'
                lecturesList.innerHTML = null
                snapshot.forEach(element => {
                    let startTime = element.key,
                        sub = element.child('Subject').val(),
                        sem = element.child('Semester').val(),
                        section = document.createElement('div'),
                        item = document.createElement('div')
                    section.setAttribute('class', 'cards')
                    createSection('p', sub, section, null)
                    createSection('span', `Class starts at ${startTime}`, item, section)
                    createSection('br', '', item, section)
                    createSection('span', `Dept : ${dept}`, item, section)
                    createSection('br', '', item, section)
                    createSection('span', `Semester : ${sem}`, item, section)
                    lecturesList.append(section)
                })
            }
        })
    })

    window.setInterval(() => {
        onValue(ref(database, `classes/${currentDate}/teachers/${dept}/${uid}/`), (snapshot) => {
            let currentTime = new Date().toLocaleTimeString().slice(0,5)
            snapshot.forEach(element => {
                let classStartTime = element.key
                let classEndTime = element.child('End Time').val()
                if(classStartTime <= currentTime && classEndTime > currentTime){
                    window.open(`teacher_ongoingDisplay.html?Start Time=${classStartTime}&End Time=${classEndTime}`,'_self')
                }
            });
        })
    },1000)

    document.querySelector('.container > .container1').addEventListener('click', openCreateCard)
}
function openCreateCard() {
    let createClassCard = document.getElementById('createClassCard'),
        content = document.getElementById('content'),
        create = document.getElementById('newClassBtn'),
        cancel = document.getElementById('cancel')
    content.style.display = 'none'
    createClassCard.style.display = 'block'
    create.addEventListener('click', function () {
        onValue(ref(database), (snapshot) => {
            let date = new Date(),
                uid = auth.currentUser.uid,
                dept = snapshot.child(`users/teacher/${uid}/Department`).val(),
                teacherName = snapshot.child(`users/teacher/${uid}/Name`).val(),
                currentDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate(),
                startTime = document.getElementById('startTime').value,
                endTime = document.getElementById('endTime').value,
                sem = document.getElementById('sem').value,
                sub = document.getElementById('sub').value,
                room = `R-${document.getElementById('room').value}`
            currentDate = (date.getMonth() + 1 < 10) ? `${currentDate}:0${date.getMonth() + 1}:${date.getFullYear()}` : `${currentDate}:${date.getMonth() + 1}:${date.getFullYear()}`
            set(ref(database, `classes/${currentDate}/teachers/${dept}/${uid}/${startTime}/`), {
                'Semester': sem,
                'Room': room,
                'Subject': sub,
                'End Time': endTime
            })
            set(ref(database, `classes/${currentDate}/${dept}/${sem}/${startTime}/`), {
                'Teacher': teacherName,
                'Subject': sub,
                'End Time': endTime,
                'Room': room
            })
        })
        window.setTimeout(() => {
            location.reload()
        }, 1000)
    })
    cancel.addEventListener('click', function () {
        content.style.display = 'block'
        createClassCard.style.display = 'none'
    })
}