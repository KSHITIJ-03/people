document.querySelector(".form-login").addEventListener("submit", e => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    login(email, password)
})

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