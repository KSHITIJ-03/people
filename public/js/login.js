document.addEventListener("DOMContentLoaded", () => {
    const logOutButton = document.querySelector(".logout-btn");
    const formSignup = document.querySelector(".form-signup");
    const formLogin = document.querySelector(".form-login");
    const formUpdateUser = document.querySelector(".form-updateUser");
    const formPasswordUpdate = document.querySelector(".form-updatePassword")
    const likeButtons = document.querySelectorAll(".like-btn")
    const formCreatePost = document.querySelector(".form-createPost")
    const formDeleteAccount = document.querySelector(".form-deleteAccount")

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

    if(formDeleteAccount) {
        formDeleteAccount.addEventListener("submit", deleteAccountHandler)
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
    e.preventDefault();
    console.log("hello");
    const caption = document.getElementById("caption").value;
    const content = document.getElementById("content").value;
    const photo = document.getElementById("photo").files[0];
    
    // Retrieve values of tag inputs
    const tagInputs = document.querySelectorAll(".tag-input");
    const tags = Array.from(tagInputs).map(input => input.value);
    console.log(tags);

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("photo", photo);
    formData.append("content", content);
    console.log(formData);
    formData.append("tags", tags);
    console.log(formData);
    createPost(formData);
}


const deleteAccountHandler = async (e) => {
    e.preventDefault()
    const password = document.getElementById("password").value
    deleteAccount(password)
}

const deleteAccount = async (password) => {
    try {
        const res = await axios({
            method: "DELETE",
            url: "http://localhost:3000/api/v1/users/deleteMe",
            data : {password}
        });
        alert("account deleted")
        location.assign("/login");
    } catch (err) {
        alert(err.response.data.message)
    }
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

document.addEventListener("DOMContentLoaded", () => {
    const followButton = document.querySelector(".follow-btn");

    followButton.addEventListener("click", async () => {
        const userId = document.getElementById("follow").value // Retrieve post ID
        try {
            console.log(userId);
            const res = await axios.post(`http://localhost:3000/api/v1/users/${userId}/followRequest`);
            if (res.data.status === "success") {
                location.reload(true); // Reload page after successful like
            }
        } catch(err) {
            console.error("Error:", err);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const acceptButton = document.getElementById("accept")

    acceptButton.addEventListener("click", async () => {
        const userId = document.getElementById("accept").value // Retrieve post ID
        try {
            console.log(userId);
            const accept = "true"
            const res = await axios({
                    method : "DELETE",
                    url : `http://localhost:3000/api/v1/users/${userId}/followRequest`,
                    data : {accept}
                });
            if (res.data.status === "success") {
                location.reload(true); // Reload page after successful acceptance
            }
        } catch(err) {
            console.error("Error:", err);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const rejectButton = document.getElementById("reject")

    rejectButton.addEventListener("click", async () => {
        const userId = document.getElementById("reject").value // Retrieve post ID
        try {
            console.log(userId);
            const accept = "false"
            const res = await axios({
                    method : "DELETE",
                    url : `http://localhost:3000/api/v1/users/${userId}/followRequest`,
                    data : {accept}
                });
            if (res.data.status === "success") {
                location.reload(true); // Reload page after successful acceptance
            }
        } catch(err) {
            console.error("Error:", err);
        }
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
        console.log(data);
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

document.addEventListener('DOMContentLoaded', function() {
    // Get all comment buttons
    var commentButtons = document.querySelectorAll('.comment-btn');

    // Add click event listener to each comment button
    commentButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var postId = this.getAttribute('data-post-id');
            var commentSection = document.querySelector('.comment-section[data-post-id="' + postId + '"]');
            if (commentSection.classList.contains('hidden')) {
                commentSection.classList.remove('hidden');
            } else {
                commentSection.classList.add('hidden');
            }
        });
    });

    // Get all comment forms
    var commentForms = document.querySelectorAll('.comment-form');

    // Add submit event listener to each comment form
    commentForms.forEach(function(form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            const postId = this.closest('.post').getAttribute('data-post-id');
            const comment = this.querySelector('input[name="comment-text"]').value;
            //console.log(comment);
            try {
                const res = await axios({
                    method : "POST",
                    url : `http://localhost:3000/api/v1/posts/${postId}/comments`,
                    data : {comment}
                })
                if(res.data.status === "success") {
                    alert("comment posted")
                    location.reload(true)
                }
            } catch(err) {
                console.log("Error: ", err);
            }
            console.log('Comment submitted for post ID:', postId, 'Text:', comment);
            // Clear the input field
            this.querySelector('input[name="comment-text"]').value = '';
        });
    });
});

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();

    searchResults.innerHTML = '';

    if (query.length > 0) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/users/search?query=${query}`);
            const results = await response.json();
            const finalResult = results.users;

            finalResult.forEach(result => {
                const resultItem = document.createElement('div');

                // Create the image element for the display photo
                const image = document.createElement('img');
                image.src = `/img/users/${result.displayPhoto}`; // Assuming the display photo is stored in the "/img/users/" directory
                image.alt = 'User Display Photo';
                image.classList.add('user-display-photo'); // Add a class for styling if needed

                // Create the link element for the user profile
                const link = document.createElement('a');
                link.href = `/user/${result.username}`; 
                link.textContent = `${result.name} (${result.username})`;

                // Append both the image and the link to the resultItem
                resultItem.appendChild(image);
                resultItem.appendChild(link);
                
                searchResults.appendChild(resultItem);
            });
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const tagContainer = document.getElementById('tagContainer');
    const addTagBtn = document.getElementById('addTagBtn');

    addTagBtn.addEventListener('click', () => {
        // Create a new input field
        const newTagInput = document.createElement('input');
        newTagInput.type = 'text';
        newTagInput.name = 'tag[]';
        newTagInput.className = 'tag-input';
        newTagInput.placeholder = 'Enter usernames';
        newTagInput.autocomplete = 'off';

        // Append the new input field to the tag container
        tagContainer.appendChild(newTagInput);
    });
});

