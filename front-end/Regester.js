const fileInput = document.querySelector('#file');
const img = document.querySelector('#photo');
const registerForm = document.querySelector('#registerForm');

fileInput.addEventListener('change', function () {
  const chosenFile = this.files[0];

  if (chosenFile) {
    const reader = new FileReader();

    reader.addEventListener('load', function () {
      img.setAttribute('src', reader.result);
    });

    reader.readAsDataURL(chosenFile);
  }
});

registerForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(registerForm);

  try {
    const response = await fetch('http://localhost:8080/api/auth/signUp', {
      method: 'POST',
      body: formData
    });

    const data = await response.json(); // Parse JSON response

    if (response.ok) {
      alert(data.message);
            
            window.location.href = '/front-end/chat page.html';
    } else {
      alert('Register failed: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error during register:', error);
    alert('An error occurred. Please try again later.');
  }
});
