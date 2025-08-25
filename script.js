let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

const passwordForm = document.getElementById("passwordForm");
const accountNameInput = document.getElementById("accountName");
const accountPasswordInput = document.getElementById("accountPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const generatePasswordBtn = document.getElementById("generatePasswordBtn");
const searchInput = document.getElementById("searchInput");
const passwordList = document.getElementById("passwordList");
const strengthIndicator = document.getElementById("strengthIndicator");

function savePasswords() {
  localStorage.setItem("passwords", JSON.stringify(passwords));
}

function encodePassword(password) {
  return btoa(password);
}

function decodePassword(encoded) {
  return atob(encoded);
}

function checkPasswordStrength(pwd) {
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
  if (/\d/.test(pwd)) strength++;
  if (/[!@#$%^&*]/.test(pwd)) strength++;
  return strength;
}

function renderPasswords(filterText = "") {
  passwordList.innerHTML = "";
  passwords
    .filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()))
    .forEach((item, index) => {
      const li = document.createElement("li");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = item.name + ": ";

      const passSpan = document.createElement("span");
      passSpan.textContent = item.show ? decodePassword(item.password) : "********";

      const toggleBtn = document.createElement("button");
      toggleBtn.classList.add("toggle-btn");
      toggleBtn.textContent = item.show ? "Hide" : "Show";
      toggleBtn.onclick = () => {
        item.show = !item.show;
        savePasswords();
        renderPasswords(searchInput.value);
      };

      const copyBtn = document.createElement("button");
      copyBtn.classList.add("copy-btn");
      copyBtn.textContent = "Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(decodePassword(item.password));
      };

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.onclick = () => {
        passwords.splice(index, 1);
        savePasswords();
        renderPasswords(searchInput.value);
      };

      li.appendChild(nameSpan);
      li.appendChild(passSpan);
      li.appendChild(toggleBtn);
      li.appendChild(copyBtn);
      li.appendChild(removeBtn);
      passwordList.appendChild(li);
    });
}

accountPasswordInput.addEventListener("input", () => {
  const strength = checkPasswordStrength(accountPasswordInput.value);
  strengthIndicator.setAttribute("data-strength", strength);
});

generatePasswordBtn.addEventListener("click", () => {
  accountPasswordInput.value = Math.random().toString(36).slice(-12);
  const strength = checkPasswordStrength(accountPasswordInput.value);
  strengthIndicator.setAttribute("data-strength", strength);
});

passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (accountPasswordInput.value !== confirmPasswordInput.value) {
    alert("Passwords do not match.");
    return;
  }
  const newItem = {
    name: accountNameInput.value,
    password: encodePassword(accountPasswordInput.value),
    show: false
  };
  passwords.push(newItem);
  savePasswords();
  renderPasswords(searchInput.value);
  accountNameInput.value = "";
  accountPasswordInput.value = "";
  confirmPasswordInput.value = "";
  strengthIndicator.setAttribute("data-strength", 0);
});

searchInput.addEventListener("input", () => {
  renderPasswords(searchInput.value);
});

renderPasswords();