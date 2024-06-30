document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const username = event.target.userName.value;
    const password = event.target.password.value;

    try {
        const response = await fetch('http://localhost:8080/api/auth/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName: username, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            localStorage.setItem('token', data.token);
            // Optionally, redirect the user to another page
            window.location.href = '/front-end/chat page.html';
        } else {
            alert('Login failed: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
    }
});