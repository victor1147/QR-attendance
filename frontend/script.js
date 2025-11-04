const API_BASE = "http://10.10.173.138:5000/api";

// --- SIGNUP ---
async function signup(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const matNo = document.getElementById("mat-no").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value.trim();
  const messageBox = document.getElementById("signupMessage");

  if (!name || !matNo || !password || !role) {
    messageBox.textContent = "Please fill in all fields.";
    messageBox.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, matNo, password, role }),
    });
    const data = await res.json();

    if (!res.ok) {
      messageBox.textContent = data.message;
      messageBox.style.color = "red";
      return;
    }

    messageBox.textContent = "Account created successfully!";
    messageBox.style.color = "green";
    setTimeout(() => (window.location.href = "login.html"), 1200);
  } catch {
    messageBox.textContent = "Error connecting to server.";
    messageBox.style.color = "red";
  }
}

// --- LOGIN ---
async function login(event) {
  event.preventDefault();

  const matNo = document.getElementById("mat-no").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageBox = document.getElementById("loginMessage");

  if (!matNo || !password) {
    messageBox.textContent = "Please fill in all fields.";
    messageBox.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matNo, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      messageBox.textContent = data.message;
      messageBox.style.color = "red";
      return;
    }

    localStorage.setItem("userRole", data.role);
    localStorage.setItem("userMatNo", matNo);

    messageBox.textContent = "Login successful!";
    messageBox.style.color = "green";

    setTimeout(() => {
      if (data.role === "lecturer") {
        window.location.href = "lecturer.html";
      } else {
        window.location.href = "student.html";
      }
    }, 1000);
  } catch {
    messageBox.textContent = "Error connecting to server.";
    messageBox.style.color = "red";
  }
}
function goToLogin() {
  window.location.href = "login.html";
}
function goToSignUp() {
  window.location.href = "SignUp.html";
}
// ======== QR Code Generator ========
let qrRefreshInterval = null;

function generateQR(auto = false) {
  const course = document.getElementById("course").value.trim();
  const qrContainer = document.getElementById("qrcode");
  const timerDisplay = document.getElementById("timer");
  const errorMsg = document.getElementById("courseError");

  // Reset previous state
  qrContainer.innerHTML = "";
  errorMsg.textContent = "";
  timerDisplay.textContent = "";

  // Validate course input
  if (!course) {
    errorMsg.textContent = "⚠️ Please enter a valid course code.";
    errorMsg.style.color = "#ff4d4d";
    errorMsg.style.fontWeight = "500";
    errorMsg.style.marginTop = "5px";
    return;
  }

  // Generate unique session token
  const sessionToken = `${course}_${Date.now()}`;

  // Generate QR and show
  QRCode.toCanvas(sessionToken, { width: 250 }, function (error, canvas) {
    if (error) {
      errorMsg.textContent = "❌ Failed to generate QR. Try again.";
      errorMsg.style.color = "#ff4d4d";
      return;
    }
    qrContainer.appendChild(canvas);
  });

  // Countdown timer
  let countdown = 30;
  timerDisplay.textContent = `⏱ QR expires in ${countdown}s`;

  // Clear previous interval if any
  if (qrRefreshInterval) clearInterval(qrRefreshInterval);

  qrRefreshInterval = setInterval(() => {
    countdown--;
    timerDisplay.textContent = `QR expires in ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(qrRefreshInterval);
      timerDisplay.textContent = " Generating new QR...";
      setTimeout(() => generateQR(true), 1000); // Auto-generate a new one
    }
  }, 1000);

  if (!auto) {
    console.log(`✅ QR generated for course: ${course}`);
  }
}
function printQR() {
  const qrContainer = document.getElementById("qrcode");
  if (qrContainer.innerHTML.trim() === "") {
    alert("Please generate a QR code first.");
    return;
  } 
}
