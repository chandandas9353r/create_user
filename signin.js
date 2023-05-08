import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
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

let signInBtn = document.querySelector('#sign-in-button > #sign-in-btn')

signInBtn.addEventListener('click', signIn)

function signIn() {
    let email = document.getElementById('username').value
    let password = document.getElementById('password').value

    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        if (verifyAccount(auth)){
            onValue(ref(database,'users/'), (snapshot) => {
                (snapshot.child(`${userCredential.user.uid}`).exists()) ? window.open('dashboard.html','_self') : window.open('profile.html', '_self')
            })
        }
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage)
    });
}

function verifyAccount(auth) {
    let verified = auth.currentUser.emailVerified
    if (verified == false) {
        document.querySelector('.container').style.visibility = 'hidden'
        document.getElementById('verify').style.visibility = 'visible'
        document.getElementById('text').innerHTML = `Verification email sent to ${auth.currentUser.email}`
    } else return true
}