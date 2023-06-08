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
        dept,
        teacherName
    currentDate = (date.getMonth() + 1 < 10) ? `${currentDate}:0${date.getMonth() + 1}:${date.getFullYear()}` : `${currentDate}:${date.getMonth() + 1}:${date.getFullYear()}`

    onValue(ref(database), (snapshot) => {
        teacherName = snapshot.child(`users/teacher/${uid}/Name`).val()
        dept = snapshot.child(`users/teacher/${uid}/Department`).val()
        onValue(ref(database, `classes/${currentDate}/teachers/${dept}/${uid}/`), (snapshot) => {
            if (snapshot.val() == null) nolecture.innerHTML = 'No lectures has been set.... '
            else {
                nolecture.style.display = 'none'
                lecturesList.style.display = 'flex'
                lecturesList.innerHTML = null
                snapshot.forEach(element => {
                    let startTime = element.child('Start Time').val(),
                        sub = element.key,
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
                let classStartTime = element.child('Start Time').val()
                let classEndTime = element.child('End Time').val()
                let sem = element.child('Semester').val()
                let sub = element.key
                if(classStartTime <= currentTime && classEndTime > currentTime){
                    window.open(`teacher_ongoingDisplay.html?Teacher=${teacherName}&Department=${dept}&Semester=${sem}&Subject=${sub}&Start Time=${classStartTime}&End Time=${classEndTime}`,'_self')
                }
            });
        })
    },1000)

    document.querySelector('.container > .container1').addEventListener('click', openCreateCard)

    document.querySelector('#content > button').addEventListener('click', checkRecords)
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
            set(ref(database, `classes/${currentDate}/teachers/${dept}/${uid}/${sub}/`), {
                'Semester': sem,
                'Start Time': startTime,
                'End Time': endTime,
                'Room': room
            })
            set(ref(database, `classes/${currentDate}/${dept}/${sem}/${sub}/${teacherName}/`), {
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
        content.style.display = 'block'
        createClassCard.style.display = 'none'
    })
}

function checkRecords(){
    let sub = (document.querySelector('#content > select').value).toUpperCase(),
        date = document.getElementById('date').value,
        today = date.slice(8,10),
        month = date.slice(5,7),
        year = date.slice(0,4),
        recordsTable = document.querySelector('#content > table')
    date = `${today}:${month}:${year}`
    onValue(ref(database), (snapshot) => {
        let uid = auth.currentUser.uid,
            dept = snapshot.child(`users/teacher/${uid}/`).val().Department,
            name = snapshot.child(`users/teacher/${uid}/`).val().Name,
            sem = snapshot.child(`classes/${date}/teachers/${dept}/${uid}/${sub}/`).val().Semester
        snapshot.child(`attendance/${date}/${dept}/${sem}/${sub}/${name}/`).forEach(element => {
            let studentRow = document.createElement('tr'),
                studentName = document.createElement('td'),
                studentRoll = document.createElement('td'),
                studentId = document.createElement('td'),
                studentRemark = document.createElement('td'),
                studentEligible = document.createElement('td'),
                sUid = element.key,
                sName = snapshot.child(`users/student/${dept}/${sem}/${sUid}/`).val().Name,
                sRoll = snapshot.child(`users/student/${dept}/${sem}/${sUid}/`).val().Roll,
                sId = snapshot.child(`users/student/${dept}/${sem}/${sUid}/Student ID/`).val(),
                sRemark = snapshot.child(`attendance/${date}/${dept}/${sem}/${sub}/${name}/${sUid}/Location/`).val().Present
            studentName.innerHTML = sName
            studentRoll.innerHTML = sRoll
            studentId.innerHTML = sId
            studentRemark.innerHTML = (sRemark) ? 'Present' : 'Absent'
            studentEligible.innerHTML = (sRemark) ? 'Yes' : 'No'
            studentRow.append(studentName,studentRoll,studentId,studentRemark,studentEligible)
            recordsTable.append(studentRow)
        });
    })
}