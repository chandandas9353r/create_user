import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

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
    if (user) onValue(ref(database,`student/`), (snapshot) => {(snapshot.child(user.uid).exists()) ? window.open('student_dashboard.html','_self') : window.open('teacher_dashboard.html','_self')})
})

let signUpBtn = document.querySelector('#sign-up-button > #sign-up-btn')

signUpBtn.addEventListener('click', signUp)

function signUp() {
    let email = document.getElementsByName('email')[0].value
    let password = document.getElementsByName('password')[0].value

    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        sendEmailVerification(auth.currentUser)
        verifyAccount(auth)
    }).catch((error) => {if(error.code == 'auth/email-already-in-use') if(verifyAccount(auth)) window.open('signin.html','_self')});
}

function verifyAccount(auth) {
    if(auth.currentUser == null) return true
    let verified = auth.currentUser.emailVerified
    if (verified == false){
        document.querySelector('.container').style.visibility = 'hidden'
        document.getElementById('verify').style.visibility = 'visible'
        document.getElementById('text').innerHTML = `Verification email sent to ${auth.currentUser.email}`
    } else return true
}