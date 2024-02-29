document.addEventListener("DOMContentLoaded", () => {
    const logOutButton = document.querySelector(".logout-btn");
    const formSignup = document.querySelector(".form-signup");
    const formLogin = document.querySelector(".form-login");
    const formUpdateUser = document.querySelector(".form-updateUser");
    const formPasswordUpdate = document.querySelector(".form-updatePassword")
    const likeButtons = document.querySelectorAll(".like-btn")
    const formCreatePost = document.querySelector(".form-createPost")
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

    if(formCreatePost) {
        formCreatePost.addEventListener("submit", createPostHandler)
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

const createPostHandler = async (e) => {
    e.preventDefault()
    console.log("hello");
    const caption = document.getElementById("caption").value
    const content = document.getElementById("content").value
    const photo = document.getElementById("photo").files[0]

    const formData = new FormData();
    formData.append("caption", caption)
    formData.append("photo", photo)
    formData.append("content", content)

    createPost(formData)
}

document.addEventListener("DOMContentLoaded", () => {
    const likeButtons = document.querySelectorAll(".like-btn");

    likeButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const postId = button.closest(".post").dataset.postId; // Retrieve post ID
            try {
                const res = await axios.post(`http://localhost:3000/api/v1/posts/${postId}/likes`);
                if (res.data.status === "success") {
                    location.reload(true); // Reload page after successful like
                }
            } catch(err) {
                console.error("Error:", err);
            }
        });
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     const deletePostButtons = document.querySelectorAll(".delete-btn");

//     deletePostButtons.forEach(button => {
//         button.addEventListener("click", async () => {
//             const postId = button.closest(".post").dataset.postId; // Retrieve post ID
//             try {
//                 const res = await axios({
//                     method : "DELETE",
//                     url : `http://localhost:3000/api/v1/posts/deletePost/${postId}`
//                 })
//                 if(res.data.status === "success") {
//                     location.reload(true);
//                 }
//             } catch(err) {
//                 console.log("Error :", err);
//             }
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", async (event) => {
        if (event.target.matches(".delete-btn")) {
            const button = event.target;
            const postId = button.closest(".post").dataset.postId; // Retrieve post ID
            try {
                const res = await axios({
                    method : "DELETE",
                    url : `http://localhost:3000/api/v1/posts/deletePost/${postId}`
                });
                alert("post deleted")
                console.log(res);
                location.reload(true)
            } catch (err) {
                console.log("Error:", err);
            }
        }
    });
});


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

const createPost = async (data) => {
    try {
        const res = await axios({
            method : "POST",
            url : "http://localhost:3000/api/v1/posts",
            data
        })

        if(res.data.status === "success") {
            alert("post uploaded")
            location.reload(true)
            //return
        }
    } catch(err) {
        console.error("Error:", err);
    }
}

const deletePost = async(postId) => {
    try {
        const res = await axios({
            method : "DELETE",
            url : `http://localhost:3000/api/v1/posts/deletePost/${postId}`
        })

        if(res.data.status === "success") {
            alert("post deleted")
            location.reload(true)
        }
    } catch(err) {
        console.error("Error:", err);
    }
}

