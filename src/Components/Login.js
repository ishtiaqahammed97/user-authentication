import React, { useState } from 'react';
import {
    getAuth, signOut,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signInWithPopup, GoogleAuthProvider, FacebookAuthProvider
} from "firebase/auth";
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
    // states
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        photo: '',
        isSignedIn: false,
        errorMsg: ''
    });
    const [newUser, setNewUser] = useState(false)

    const registerUser = () => {
        setNewUser(true);
    };

    // create new user
    const createAccount = (e) => {
        if (user.isValid) {
            createUserWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    setNewUser(false)
                    console.log(user, 'signed in successfully');
                })
                .catch((error) => {
                    // const createdUser = { ...user };
                    // createdUser.errorMsg = error.message;
                    console.log(error.message)
                    // setUser(createdUser);
                });
        } else {
            const invalidInput = { ...user };
            invalidInput.errorMsg = 'Please validate your input';
            setUser(invalidInput);
            console.log()
        }
        e.preventDefault();
    };

    /// form validation
    const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
    const hasNumber = input => /\d/.test(input);

    const handleChange = (event) => {
        const newUserInfo = {
            ...user
        }

        let isValid = true;
        if (event.target.name === "email") {
            isValid = is_valid_email(event.target.value);
        }
        if (event.target.name === "password") {
            isValid = event.target.value.length > 8 && hasNumber(event.target.value);
        }
        newUserInfo[event.target.name] = event.target.value;
        newUserInfo.isValid = isValid;
        setUser(newUserInfo);
    };

    /// handle sign out
    const handleSignOut = () => {
        signOut(auth).then(() => {
            const userSignOut = {
                name: '',
                email: '',
                photo: '',
                isSignedIn: false,
                isValid: false,
                errorMsg: ''
            };
            setUser(userSignOut);
        }).catch((error) => {
            console.log(error)
        })
    };

    // sign in with google
    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        // remember to give the first parameter auth, then the
        // second parameter would be provider, it gave you a tough time
        signInWithPopup(auth, provider)
            .then((res) => {
                const { displayName, photoURL, email } = res.user;
                const signedInUser = {
                    name: displayName,
                    photo: photoURL,
                    email: email,
                    isSignedIn: true
                };
                setUser(signedInUser);
            }).catch((err) => {
                console.log(err);
            })
    };

    // sign in user
    const handleSignIn = (e) => {
        // const authGet = getAuth();
        signInWithEmailAndPassword(auth, user.email, user.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const { displayName, photoURL, email } = user;
                const signedInUser = {
                    name: displayName,
                    photo: photoURL,
                    email: email,
                    isSignedIn: true
                };
                setUser(signedInUser);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
        e.preventDefault();
    };

    /// handle facebook sign in with popup

    const fbProvider = new FacebookAuthProvider()

    const handleFacebookSignIn = () => {
        signInWithPopup(auth, fbProvider)
            .then((result) => {
                const user = result.user;
                const { displayName, photoURL, email } = user;
                const signedInUser = {
                    name: displayName,
                    email: email,
                    photo: photoURL,
                    isSignedIn: true
                };
                setUser(signedInUser);
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

            })
            .catch((error) => {
                // Handle Errors here.
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    return (
        <div className="container d-flex">

            <div>
                {user.isSignedIn ? <div className="welcome-msg">
                    <p>Welcome {user.name}</p>
                    <p>Email: {user.email}</p>
                    <img src={user.photo} alt="" ></img>
                </div> : <h3 className="welcome-msg">Please Login First</h3>}
            </div>
            <div className="own-auth">
                {!newUser ? <h1 className="text-center text-secondary">Login Form</h1> : <h1 className="text-center text-secondary">Sign In Form</h1>}
                <form>
                    <br />
                    <input className="form-control-lg ms-5" type="text" name="email" onBlur={handleChange} placeholder="Your email" />
                    <br /> <br />
                    <input className="form-control-lg ms-5" type="password" name="password" onBlur={handleChange} placeholder="password" />
                    <br />
                    {user.isSignedIn ? <input type="submit" className="btn btn-primary mt-5 ms-5" value="Sign Out" onClick={handleSignOut} /> :
                        <input type="submit" className="btn btn-primary mt-5 ms-5" value="Sign In" onClick={handleSignIn} />}

                    {(user.isSignedIn === false && newUser === true) && <input type="submit" className="btn btn-primary mt-5 ms-5" value="Sign Up" onClick={createAccount} />}
                    {user.errorMsg && <p>{user.errorMsg}</p>}
                </form>
                <button className="btn btn-success btn-block mb-2 mt-5 ms-5"
                    onClick={registerUser}
                >Don't have account? Register here
                </button> &nbsp;  <div>

                    <button onClick={() => handleGoogleSignIn()}
                        className="btn btn-secondary ms-5 mb-2"
                    >
                        Google Sign in
                    </button>

                    <button
                        className="btn btn-secondary mb-2 ms-2"
                        onClick={handleFacebookSignIn}
                    >Facebook Sign in</button>

                </div>
            </div>
        </div>
    );
};

export default Login;