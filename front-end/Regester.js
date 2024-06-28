const imgDiv = document.querySelector('.user-img');
const img = document.querySelector('#photo');
const fileInput = document.querySelector('#file');

const uploadBtn = document.querySelector('#uploadbtn');

fileInput.addEventListener('change', function(){
  const chosenFile = this.files[0];

  if (chosenFile) {
    const reader = new FileReader();
    console.log('lol')
    reader.addEventListener('load', function(){
      img.setAttribute('src', reader.result);
    });
    reader.readAsDataURL(chosenFile);
  }
  else{
    console.log('error')
  }
});
