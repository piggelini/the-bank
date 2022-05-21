const loginForm = document.querySelector(".login-form");
const loginUser = document.getElementById("user");
const loginPass = document.getElementById("pass");
const registerBtn = document.getElementById("registerBtn");
const registerFormContainer = document.querySelector(".registerForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {

            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: loginUser.value, pass: loginPass.value })
    });
    const data = await response.json();
    getAccounts();
    if (data.user) {
        loginForm.classList.add("hide-login-box");

    }

});


let createRegisterForm = () => {
    loginForm.style.display = 'none';

    let regForm =
        `

    <form class="register-form">
    <h2>Register</h2>
    <label for="user">Username</label>
    <input type="text" name="user" id="reg-user">
    <label for="user">Password</label>
    <input type="password" name="pass" id="reg-pass">
    <button id="register">Register</button>
</form>
    `

    registerFormContainer.innerHTML = regForm;

    let registerForm = document.querySelector(".register-form")
    let regUser = document.getElementById("reg-user");
    let regPass = document.getElementById("reg-pass")

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: regUser.value,
                pass: regPass.value
            })
        });
        const data = await res.json();
        console.log("Registered!")
        loginForm.style.display = 'block';
        registerForm.style.display = "none";
    });

}

const checkLoggedin = async () => {
    const res = await fetch('/api/users/loggedin');
    const data = await res.json();

    if (data.user) {
        loginForm.style.display = 'none';
        getAccounts();
    }
}

checkLoggedin();


