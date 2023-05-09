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

let studentCard = document.querySelector('.studentCard'),
    teacherCard = document.querySelector('.teacherCard')
studentCard.style.display = 'none'
teacherCard.style.display = 'none'

onAuthStateChanged(auth, (user) => {
    if (user) {
        let uid = (user.uid)
        onValue(ref(database, 'student/'), (snapshot) => {
            let course = snapshot.child(`${uid}/Course`).val(),
                sem = snapshot.child(`${uid}/Semester`).val(),
                profession = snapshot.child(`${uid}/Profession`).val()
            if (profession == 'student') {
                onValue(ref(database, `/users/student/`), (snapshot) => {
                    (snapshot.child(`${course}/${sem}/${uid}`).exists()) ? window.open('student_dashboard.html', '_self') : updateProfileDetails(user)
                })
            } else {
                onValue(ref(database, `/users/teacher/`), (snapshot) => {
                    (snapshot.child(`${uid}`).exists()) ? window.open('teacher_dashboard.html', '_self') : updateProfileDetails(user)
                })
            }
        })
    } else {
        console.log('SIGNED OUT')
    }
});

function updateStudentProfile(user, studentCard, profession) {
    studentCard.querySelector('#updateBtn').addEventListener('click', function () {
        let name = studentCard.querySelector('#name').value,
            roll = studentCard.querySelector('#roll').value,
            year = studentCard.querySelector('#year'),
            sid = studentCard.querySelector('#sid').value,
            course = studentCard.querySelector('#course').value,
            sem = studentCard.querySelector('#sem'),
            isSelected = false,
            i
        sid = (year.value == '') ? '2020-' + sid : year.value + '-' + sid
        course = (course == '') ? 'BCA' : course
        for (i = 0; i < sem.length; i++) {
            if (sem[i].checked) {
                isSelected = true
                break
            }
        }
        sem = (isSelected) ? i + 1 : '6'
        set(ref(database, `users/student/${course}/${sem}/${user.uid}`), {
            'Name': name,
            'Roll': roll,
            'Student ID': sid
        }).then(() => {
            console.log('DATA UPDATED')
        }).catch((error) => {
            console.log(error.code)
        })
        set(ref(database, `student/${user.uid}`), {
            'Course': course,
            'Semester': sem,
            'Profession': profession
        }).then(() => {
            console.log('DATA UPDATED')
        }).catch((error) => {
            console.log(error.code)
        })
    })
}

function updateTeacherProfile(user, teacherCard, profession) {
    teacherCard.querySelector('#updateBtn').addEventListener('click', function () {
        let name = teacherCard.querySelector('#name').value,
            dept = teacherCard.querySelector('#dept')
        dept = (dept.value == '') ? 'BCA' : dept.value
        set(ref(database, `users/teacher/${user.uid}`), {
            'Name': name,
            'Department': dept,
            'Profession': profession
        }).then(() => {
            console.log('DATA UPDATED')
        }).catch((error) => {
            console.log(error.code)
        })
    })
}

function updateProfileDetails(user) {
    let profession = document.getElementById('prof')
    profession.addEventListener('click', function () {
        studentCard.style.display = 'none'
        teacherCard.style.display = 'none'
        if (profession.value == 'student') {
            studentCard.style.display = 'flex'
            updateStudentProfile(user, studentCard, 'student')
            return
        } else if (profession.value == 'teacher') {
            teacherCard.style.display = 'flex'
            updateTeacherProfile(user, teacherCard, 'teacher')
            return
        }
    })
}