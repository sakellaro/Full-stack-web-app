const successMessage = document.querySelector("#success-message");

setTimeout(()=>{
    successMessage.style.opacity = 0;
},4000);

document.querySelector('#book-button').addEventListener('click', ()=>{
    window.location.href="/booking";
});

(function () {
    'use strict'
  
    var form = document.querySelector('#login-form');
        
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
        event.preventDefault()
        }
  
        form.classList.add('was-validated')
        })
  })()