import Signup from "./modules/signup.module.js";

const signupBTN = document.getElementById("signup-button");

signupBTN.addEventListener("click", async () => {
    const id = document.getElementById("signup-id").value;
    const email = document.getElementById("signup-email").value;
    const pw = document.getElementById("signup-pw").value;

    const signup = new Signup(id, email, pw);
    const result = await signup.signupSend();

    if (result.status == 200) {
        console.log("success");
    } else {
        console.log("failure");
    }
});