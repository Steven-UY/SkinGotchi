document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Get the form data
    var email = document.querySelector('input[name="email"]').value;
    var password = document.querySelector('input[name="password"]').value;
  
    // Example: Validate the form data (you can add more complex validation)
    if (email === "" || password === "") {
      alert("Please fill in both fields.");
      return;
    }
  
    // Example: Perform the login action (you can replace this with your own logic)
    console.log("Logging in with", email, password);
    alert("Login successful!");