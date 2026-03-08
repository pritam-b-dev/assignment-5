const userName = document.getElementById("user-name");
const password = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");

//to logged in
loginBtn.addEventListener("click", function () {
  if (userName.value === "admin" && password.value === "admin123") {
    window.location.assign("./issues.html");
  } else {
    const incorrectCard = document.getElementById("incorrect-card");
    incorrectCard.innerText = "Incorrect ID or password!";
    userName.value = "";
    password.value = "";
  }
});

//Enter button click to login
for (const input of [userName, password]) {
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") loginBtn.click();
  });
}
