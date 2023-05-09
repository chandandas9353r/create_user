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

function loggedIn() {
    let createClassCard = document.getElementById('createClassCard'),
        content = document.getElementById('content'),
        nolecture = document.getElementById('nolecture'),
        lecturesList = document.getElementById('lecturesList'),
        date = new Date(),
        currentDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()
    currentDate = (date.getMonth() + 1 < 10) ? `${currentDate}:0${date.getMonth() + 1}:${date.getFullYear()}` : `${currentDate}:${date.getMonth() + 1}:${date.getFullYear()}`
    
    onValue(ref(database,`classes/`), (snapshot) => {
        if(snapshot.val() == null) nolecture.innerHTML = 'No lectures has been set'
        else{
            nolecture.style.display = 'none'
            lecturesList.style.display = 'flex'
            let section = document.createElement('div')
            section.setAttribute('class','cards')
            let item = document.createElement('p')
            item.innerHTML = 'COMPILER'
            section.append(item)
            item = document.createElement('div')
            let desc = document.createElement('span')
            desc.innerHTML = 'Class starts at 11:00 AM'
            item.append(desc)
            section.append(item)
            desc = document.createElement('br')
            item.append(desc)
            section.append(item)
            desc = document.createElement('span')
            desc.innerHTML = 'Dept : BCA'
            item.append(desc)
            section.append(item)
            desc = document.createElement('br')
            item.append(desc)
            section.append(item)
            desc = document.createElement('span')
            desc.innerHTML = 'Semester : 6th'
            item.append(desc)
            section.append(item)
            lecturesList.append(section)
        }
    })

    document.querySelector('.container > .container1').addEventListener('click', openCreateCard)

    function openCreateCard() {
        content.style.display = 'none'
        createClassCard.style.display = 'block'
        let create = document.getElementById('create'),
            cancel = document.getElementById('cancel'),
            uid = auth.currentUser.uid
        create.addEventListener('click', function () {
            onValue(ref(database), (snapshot) => {
                let date = new Date(),
                    currentDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate(),
                    dept = snapshot.child(`users/teacher/${uid}/Department`).val(),
                    teacherName = snapshot.child(`users/teacher/${uid}/Name`).val(),
                    sem = document.getElementById('sem').value,
                    sub = document.getElementById('sub').value,
                    room = `${document.getElementById('room').value}`,
                    time = document.getElementById('time').value
                currentDate = (date.getMonth() + 1 < 10) ? `${currentDate}:0${date.getMonth() + 1}:${date.getFullYear()}` : `${currentDate}:${date.getMonth() + 1}:${date.getFullYear()}`
                console.log(teacherName,currentDate, dept, sem, sub, room, time)
                set(ref(database,`classes/${currentDate}/${dept}/${sem}`), {
                    'Subject': sub,
                    'Room': room,
                    'Teacher': teacherName,
                    'Time': time
                })
            })
            window.setTimeout(() => {
                location.reload()
            }, 3000)
        })
        cancel.addEventListener('click', function () {
            location.reload()
        })
    }
}