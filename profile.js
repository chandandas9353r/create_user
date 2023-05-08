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
    if (user) {
        onValue(ref(database,'users/'), (snapshot) => {
            (snapshot.child(`${user.uid}`).exists()) ? window.open('dashboard.html','_self') : updateProfileDetails(user)
        })
    } else {
        console.log('SIGNED OUT')
    }
});

function updateProfileDetails(user){
    document.getElementById('updateBtn').addEventListener('click', function(){
        let fname = document.getElementById('fname').value,
            lname = document.getElementById('lname').value,
            roll = document.getElementById('roll').value,
            year = document.getElementById('year'),
            sid = document.getElementById('sid').value,
            course = document.getElementById('course').value,
            sem = document.getElementsByName('sem'),
            isSelected = false,
            i
        sid = (year.value == '') ? '2020-'+sid : year.value+'-'+sid
        course = (course == '') ? 'BCA' : course
        for(i = 0; i < sem.length; i++){
            if(sem[i].checked){
                isSelected = true
                break
            }
        }
        sem = (isSelected) ? i+1 : '6'
        set(ref(database, `users/${user.uid}`), {
            'First Name': fname,
            'Last Name': lname,
            'Roll': roll,
            'Student ID': sid,
            'Course': course,
            'Semester': sem
        }).then(() => {
            console.log('DATA UPDATED')
        }).catch((error) => {
            console.log(error.code)
        })
    })
}