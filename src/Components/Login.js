import React, { useState } from 'react';
import {
    getAuth, signOut,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signInWithPopup, GoogleAuthProvider,
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
    // const handleGoogleSignIn = () => {
    //     const provider = new GoogleAuthProvider();
    //     // remember to give the first parameter auth, then the
    //     // second parameter would be provider, it gave you a tough time
    //     signInWithPopup(auth, provider)
    //         .then((res) => {
    // const { displayName, photoURL, email } = res.user;
    // const signedInUser = {
    //     name: displayName,
    //     photo: photoURL,
    //     email: email,
    //     isSignedIn: true
    // };
    // setUser(signedInUser);
    //         }).catch((err) => {
    //             console.log(err);
    //         })
    // };

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
                console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
        e.preventDefault();
    };

    return (
        <div className="container d-flex">
            {/* <div>
                <h3>This is google auth</h3>
                {user.isSignedIn ? <button onClick={() => handleSignOut()}>Sign out</button>
                    : <button onClick={() => handleGoogleSignIn()}>Google sign in</button>}

                {user.isSignedIn && <div>
                    <p>Welcome {user.name}</p>
                    <p>Email: {user.email}</p>
                    <img src={user.photo} alt="" ></img>
                </div>}
            </div> */}
            <div>
                {user.isSignedIn ? <h3 className="welcome-msg">Welcome : {user.email}</h3> : <h3 className="welcome-msg">Please Login First</h3>}
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
                >Don't have account? Register here</button>
            </div>
        </div>
    );
};

export default Login;