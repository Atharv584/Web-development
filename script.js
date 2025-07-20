const main = document.querySelector(".main");

function showLogin() {
  main.innerHTML = `
    <div class="content-box">
      <h2 class="section-title">Login Page</h2>
      <form class="form-style">
        <label>Username:</label><br>
        <input type="text" placeholder="Enter username" class="input-box"><br><br>
        <label>Password:</label><br>
        <input type="password" placeholder="Enter password" class="input-box"><br><br>
        <button type="submit" class="submit-btn">Login</button>
      </form>
    </div>
  `;
}

function showRegister() {
  main.innerHTML = `
    <div class="content-box">
      <h2 class="section-title">Register Page</h2>
      <p class="para-text">Register your details here to start accessing live weather data for your favorite cities.</p>
      <form class="form-style">
        <label>Email:</label><br>
        <input type="email" placeholder="Enter email" class="input-box"><br><br>
        <label>Create Username:</label><br>
        <input type="text" placeholder="Choose a username" class="input-box"><br><br>
        <label>Create Password:</label><br>
        <input type="password" placeholder="Choose a password" class="input-box"><br><br>
        <button type="submit" class="submit-btn">Register</button>
      </form>
    </div>
  `;
}

function showCatalog() {
  main.innerHTML = `
    <div class="content-box">
      <h2 class="section-title">Weather Catalog</h2>
      <p class="para-text">Here's a list of cities with live weather stats. Click any location on the left to explore detailed reports.</p>
      <ul class="catalog-list">
        <li>London - 25°C, Clear</li>
        <li>Tokyo - 28°C, Humid</li>
        <li>Italy - 30°C, Sunny</li>
        <li>Mumbai - 33°C, Rainy</li>
        <li>Beijing - 29°C, Cloudy</li>
      </ul>
      <p class="para-text">
        Want to submit your feedback or a custom city request? 
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSewITW6cN4vMP2YgIZHSxPu4mV5qJLd53J43TwokLKZA21TBA/viewform?usp=dialog" target="_blank" style="color:#19C3FB; text-decoration: underline;">
          Fill out this form
        </a>.
      </p>
    </div>
  `;
}
function showLondon() {
  main.innerHTML = `
    <div class="content-box">
      <h2 class="section-title">London Weather</h2>
      <p class="para-text">Currently 25°C with clear skies. Gentle breeze from the west.</p>
      <img src="london.jpg" alt="London"width="400" height="280">
    </div>
  `;
}

function showTokyo() {
  main.innerHTML = `
    <div class="content-box">
      <h2 class="section-title">Tokyo Weather</h2>
      <p class="para-text">Currently 28°C and humid. Expect light rain in the evening.</p>
            <img src="tokyo.jpg" alt="Tokyo"width="400" height="280">
    </div>
  `;
}

function showItaly() {
  main.innerHTML = `
    <div class="content-box">
      <h2 class="section-title">Italy Weather</h2>
      <p class="para-text">Sunny and bright with a high of 30°C. A perfect day to explore!</p>
            <img src="italy.jpg" alt="Italy"width="400" height="280">
    </div>
  `;
}

function showMumbai() {
  main.innerHTML = `
    <div class="content-box">
      <h2 class="section-title">Mumbai Weather</h2>
      <p class="para-text">Heavy rains with thunderstorms. Temperature around 33°C.</p>
      <img src="mumbai.jpg" alt="Mumbai"width="400" height="280">
    </div>
  `;
}

function showBeijing() {
  main.innerHTML = `
    <div class="content-box">
      <h2 class="section-title">Beijing Weather</h2>
      <p class="para-text">Cloudy skies at 29°C. Air quality is moderate today.</p>
      <img src="beijing.jpg" alt="Beijing" width="400" height="280">
    </div>
  `;
}
document.getElementById("place1").addEventListener("click", showLondon);
document.getElementById("place2").addEventListener("click", showTokyo);
document.getElementById("place3").addEventListener("click", showItaly);
document.getElementById("place4").addEventListener("click", showMumbai);
document.getElementById("place5").addEventListener("click", showBeijing);

document.getElementById("login").addEventListener("click", showLogin);
document.getElementById("register").addEventListener("click", showRegister);
document.getElementById("catalog").addEventListener("click", showCatalog);
