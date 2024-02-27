// const signup = async(name, email, username, password, confirmPassword) => {
//     try {
//         const res = await axios({
//             method : "POST",
//             url : "http://localhost:3000/api/v1/users/signup",
//             data : { name, email, username, password, confirmPassword}
//         })

//         if(res.data.status === "success") {
//             window.setTimeout(() => {
//                 location.assign("/users")
//             }, 1000)
//         }
//     } catch(err) {
//         alert(err.response.data.message)
//     }
// }

// const updateUser = async(name, username) => {
//     try {
//         const res = await axios({
//             method : "POST",
//             url : "http://localhost:3000/api/v1/updateMe",
//             data : {name, username}
//         })

//         if(res.data.status === "success") {
//             location.reload(true)
//         }
//     } catch(err) {
//         alert(err.response.data.message)
//     }
// }


// document.addEventListener("DOMContentLoaded", () => {
//     const logOutButton = document.querySelector(".logout-btn");
//     const logout = async() => {
//     try {
//         const res = await axios({
//             method : "GET",
//             url : "http://localhost:3000/api/v1/users/logout"
//         })
//         if(res.data.status === "success") {
//             location.assign("/login")
//         }
//         } catch(err) {
//             alert(err.response.data.message)
//         }
//     }

//     if (logOutButton) {
//         logOutButton.addEventListener("click", logout);
//     }
    // const formSignup = document.querySelector(".form-signup");
    // if (formSignup) {
    //     formSignup.addEventListener("submit", e => {
    //         console.log("hello from the signup");
    //         e.preventDefault();
    //         const name = document.getElementById("name").value
    //         const username = document.getElementById("username").value;
    //         const email = document.getElementById("email").value;
    //         const password = document.getElementById("password").value;
    //         const confirmPassword = document.getElementById("confirmPassword").value;
    //         signup(name, email, username, password, confirmPassword);
    //     });
    // }
// });

// // document.querySelector(".form-updateUser").addEventListener("submit", e => {
// //     e.preventDefault()
// //     const username = document.getElementById("username").value
// //     const name = document.getElementById("name").value
// //     updateUser(name, username)
// // })

// document.querySelector(".form-login").addEventListener("submit", e => {
//     e.preventDefault()
//     const email = document.getElementById("email").value
//     const password = document.getElementById("password").value
//     login(email, password)
// })

// // document.querySelector(".form-signup").addEventListener("submit", e => {
// //     console.log("hello form the signup");
// //     e.preventDefault()
// //     const username = document.getElementById("username").value
// //     const email = document.getElementById("email").value
// //     const password = document.getElementById("password").value
// //     const confirmPassword = document.getElementById("confirmPassword").value
// //     signup(email, username, password, confirmPassword)
// // })

// const login = async (email, password) => {
//     try {
//         const res = await axios ({
//             method : "POST",
//             url : "http://localhost:3000/api/v1/users/login",
//             data : {
//                 email, password
//             }
//         })
//         //console.log(res);
//         if(res.data.status === "success") {
//             window.setTimeout(() => {
//                 location.assign("/users")
//             }, 1000)
//         }
//     } catch(err) {
//         console.log(err.response.data);
//         alert(err.response.data.message)
//     }
// }



// // const logOutButton = document.querySelector(".logout-btn")
// // console.log(logOutButton);

// // if(logOutButton) {
// //     console.log("logout button clicked");
// //     logOutButton.addEventListener("click", logout)
// // }


// // Your other JavaScript code here...


// document.addEventListener("DOMContentLoaded", () => {
//     //const logOutButton = document.querySelector(".logout-btn");
//     console.log("from updateUser");
//     const updateUser = async(name, username) => {
//         try {
//             const res = await axios({
//                 method : "POST",
//                 url : "http://localhost:3000/api/v1/updateMe",
//                 data : {name, username}
//             })

//             if(res.data.status === "success") {
//                 location.reload(true)
//             }
//         } catch(err) {
//             alert(err.response.data.message)
//         }
//     }


//     document.querySelector(".form-updateUser").addEventListener("submit", e => {
//         e.preventDefault()
//         const username = document.getElementById("username").value
//         const name = document.getElementById("name").value
//         updateUser(name, username)
//     })

    
// });


document.addEventListener("DOMContentLoaded", () => {
    const logOutButton = document.querySelector(".logout-btn");
    const formSignup = document.querySelector(".form-signup");
    const formLogin = document.querySelector(".form-login");
    const formUpdateUser = document.querySelector(".form-updateUser");
    const formPasswordUpdate = document.querySelector(".form-updatePassword")
    
    if(formPasswordUpdate) {
        formPasswordUpdate.addEventListener("submit", updatePasswordHandler)
    }

    if (logOutButton) {
        logOutButton.addEventListener("click", logout);
    }

    if (formSignup) {
        formSignup.addEventListener("submit", signupHandler);
    }

    if (formLogin) {
        formLogin.addEventListener("submit", loginHandler);
    }

    if (formUpdateUser) {
        formUpdateUser.addEventListener("submit", updateUserHandler);
    }

});

const updatePasswordHandler = async(e) => {
    e.preventDefault();
    const oldPassword = document.getElementById("old-password").value
    const newPassword = document.getElementById("new-password").value
    const confirmPassword = document.getElementById("confirm-password").value
    updatePassword(oldPassword, newPassword, confirmPassword)
}

const signupHandler = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    signup(name, email, username, password, confirmPassword);
};

const loginHandler = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
};

const updateUserHandler = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const displayPhoto = document.getElementById("displayPhoto").files[0]
    //console.log(name);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('displayPhoto', displayPhoto);

    updateUser(formData)
};

const logout = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "http://localhost:3000/api/v1/users/logout",
        });
        if (res.data.status === "success") {
            location.assign("/login");
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const signup = async(name, email, username, password, confirmPassword) => {
    try {
        const res = await axios({
            method : "POST",
            url : "http://localhost:3000/api/v1/users/signup",
            data : { name, email, username, password, confirmPassword}
        })

        if(res.data.status === "success") {
            window.setTimeout(() => {
                location.assign("/users")
            }, 1000)
        }
    } catch(err) {
        alert(err.response.data.message)
    }
}

const login = async (email, password) => {
    try {
        const res = await axios ({
            method : "POST",
            url : "http://localhost:3000/api/v1/users/login",
            data : {
                email, password
            }
        })
        //console.log(res);
        if(res.data.status === "success") {
            window.setTimeout(() => {
                location.assign("/users")
            }, 1000)
        }
    } catch(err) {
        console.log(err.response.data);
        alert(err.response.data.message)
    }
}

const updateUser = async(data) => {
    try {
        const res = await axios({
            method : "PATCH",
            url : "http://localhost:3000/api/v1/users/updateMe",
            data
        })

        if(res.data.status === "success") {
            location.reload(true)
        }
    } catch(err) {
        alert(err.response.data.message)
    }
}

const updatePassword = async(oldPassword, newPassword, confirmPassword) => {
    try {
        if(newPassword != confirmPassword) {
            alert("new password and confirm password are not same")
            location.reload(true)
            return
        }
        const res = await axios({
            method : "POST",
            url : "http://localhost:3000/api/v1/users/updatePassword",
            data : {oldPassword, newPassword, confirmPassword}
        })

        if(res.data.status === "success") {
            alert("password updated")
            window.setTimeout(() => {
                location.assign("/me")
            }, 1000)
        }
    } catch(err) {
        alert(err.response.data.message)
    }
}