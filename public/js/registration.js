(function () {
    'use strict'
  
    var form = document.querySelector('#registration-form');
        
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
        event.preventDefault()
        }
  
        form.classList.add('was-validated')
        })
  })()