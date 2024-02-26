const signup = async(name, email, username, password, confirmPassword) => {
    try {
        const res = await axios({
            method : "POST",
            url : "http://localhost:3000/api/v1/users/signup",
            data : { name, email, username, password, confirmPassword}
        })

        if(res.data.status === "success") {
            window.setTimeout(() => {
                location.assign("/overview")
            }, 1000)
        }
    } catch(err) {
        alert(err.response.data.message)
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const logOutButton = document.querySelector(".logout-btn");
    const logout = async() => {
    try {
        const res = await axios({
            method : "GET",
            url : "http://localhost:3000/api/v1/users/logout"
        })
        if(res.data.status === "success") {
            location.reload(true)
        }
        } catch(err) {
            alert(err.response.data.message)
        }
    }

    if (logOutButton) {
        logOutButton.addEventListener("click", logout);
    }
    const formSignup = document.querySelector(".form-signup");
    if (formSignup) {
        formSignup.addEventListener("submit", e => {
            console.log("hello from the signup");
            e.preventDefault();
            const name = document.getElementById("name").value
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            signup(name, email, username, password, confirmPassword);
        });
    }
});
document.querySelector(".form-login").addEventListener("submit", e => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    login(email, password)
})

// document.querySelector(".form-signup").addEventListener("submit", e => {
//     console.log("hello form the signup");
//     e.preventDefault()
//     const username = document.getElementById("username").value
//     const email = document.getElementById("email").value
//     const password = document.getElementById("password").value
//     const confirmPassword = document.getElementById("confirmPassword").value
//     signup(email, username, password, confirmPassword)
// })

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
                location.assign("/overview")
            }, 1000)
        }
    } catch(err) {
        console.log(err.response.data);
        alert(err.response.data.message)
    }
}



// const logOutButton = document.querySelector(".logout-btn")
// console.log(logOutButton);

// if(logOutButton) {
//     console.log("logout button clicked");
//     logOutButton.addEventListener("click", logout)
// }


// Your other JavaScript code here...

