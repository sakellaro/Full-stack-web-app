const detailsBtns = document.getElementsByClassName("details-btn");
const popUps = document.getElementsByClassName("pop-up");
const blurBackground = document.querySelector("#blur-background");
const closeBtns = document.getElementsByClassName("close-btn");
const arrivalDate = document.getElementById("ardate");
const departureDate = document.getElementById("dedate");
const bookBtn = document.querySelector(".book-btn");

const detailsBtn = Array.from(detailsBtns);
const popUp = Array.from(popUps);
const closeBtn = Array.from(closeBtns);

const minutes = 1000 * 60;
const hours = minutes * 60;
const days = hours * 24;
let lastDay = new Date().getTime()/days + 183;
let lastDayInMilliseconds = lastDay*24*60*60*1000;
let today = new Date().toISOString().split('T')[0];
let lastDate = new Date(lastDayInMilliseconds).toISOString().split('T')[0];

detailsBtn.forEach((el)=>{
    el.addEventListener("click", ()=>{
        popUp[detailsBtn.indexOf(el)].style.display="block";
        blurBackground.style.display="block";
        blurBackground.style.height = document.body.scrollHeight + "px";
        setTimeout(() => {
            popUp[detailsBtn.indexOf(el)].style.opacity="1";
            blurBackground.style.opacity="0.3";
          }, 0);
        window.addEventListener("resize", setBlurBackgroundHeight);
    });
});

closeBtn.forEach((el)=>{
    el.addEventListener("click", ()=>{
        popUp[closeBtn.indexOf(el)].style.opacity="0";
        blurBackground.style.opacity="0";
        setTimeout(() => {
            popUp[closeBtn.indexOf(el)].style.display="none";
            blurBackground.style.height = null;
            blurBackground.style.display="none";
          }, 600);
        window.removeEventListener("resize", setBlurBackgroundHeight);
    });
});

blurBackground.addEventListener("click", ()=>{
    popUp.forEach((el) => {
        el.style.opacity="0";
        blurBackground.style.opacity="0";
        setTimeout(() => {
            el.style.display="none";
            blurBackground.style.height = null;
            blurBackground.style.display="none";
          }, 600);
        window.removeEventListener("resize", setBlurBackgroundHeight);
    });
});

function setBlurBackgroundHeight() {
    blurBackground.style.height = document.body.scrollHeight + "px";
}

bookCondition_0() ;

bookCondition_1() ;

function bookCondition_0() {

    try{
    
        arrivalDate.setAttribute('min', today);
        departureDate.setAttribute('min', today);
        arrivalDate.setAttribute('max', lastDate);
        departureDate.setAttribute('max', lastDate);
    
        arrivalDate.addEventListener("change", (e) => {
            let ardate = e.target.value.split("-");
            let arrivalDateYear = parseInt(ardate[0]);
            let arrivalDateMonth = parseInt(ardate[1]-1);
            let arrivalDateDay = parseInt(ardate[2]);
            let arrivalDateInDays = Math.round(new Date(arrivalDateYear, arrivalDateMonth, arrivalDateDay).getTime()/days);
            let arrivalDateInDaysPlusOne =  arrivalDateInDays + 1;
            let arrivalDateInDaysPlusOneInMilliseconds = arrivalDateInDaysPlusOne*24*60*60*1000 ;
            let arrivalDatePlusOne = new Date(arrivalDateInDaysPlusOneInMilliseconds).toISOString().split('T')[0];
            departureDate.setAttribute('min', arrivalDatePlusOne);
        });
    
        departureDate.addEventListener("change", (e) => {
            let dedate = e.target.value.split("-");
            let departureDateYear = parseInt(dedate[0]);
            let departureDateMonth = parseInt(dedate[1]-1);
            let departureDateDay = parseInt(dedate[2]);
            let departureDateInDays = Math.round(new Date(departureDateYear, departureDateMonth, departureDateDay).getTime()/days);
            let departureDateInDaysPlusOne =  departureDateInDays - 1;
            let departureDateInDaysPlusOneInMilliseconds = departureDateInDaysPlusOne*24*60*60*1000 ;
            let departureDatePlusOne = new Date(departureDateInDaysPlusOneInMilliseconds).toISOString().split('T')[0];
            arrivalDate.setAttribute('max', departureDatePlusOne);
        });
    
        if (arrivalDate.value!=="") {
            let ardate = arrivalDate.value.split("-");
            let arrivalDateYear = parseInt(ardate[0]);
            let arrivalDateMonth = parseInt(ardate[1]-1);
            let arrivalDateDay = parseInt(ardate[2]);
            let arrivalDateInDays = Math.round(new Date(arrivalDateYear, arrivalDateMonth, arrivalDateDay).getTime()/days);
            let arrivalDateInDaysPlusOne =  arrivalDateInDays + 1;
            let arrivalDateInDaysPlusOneInMilliseconds = arrivalDateInDaysPlusOne*24*60*60*1000 ;
            let arrivalDatePlusOne = new Date(arrivalDateInDaysPlusOneInMilliseconds).toISOString().split('T')[0];
            departureDate.setAttribute('min', arrivalDatePlusOne);
        }
    
        if (departureDate.value!==""){
            let dedate = departureDate.value.split("-");
            let departureDateYear = parseInt(dedate[0]);
            let departureDateMonth = parseInt(dedate[1]-1);
            let departureDateDay = parseInt(dedate[2]);
            let departureDateInDays = Math.round(new Date(departureDateYear, departureDateMonth, departureDateDay).getTime()/days);
            let departureDateInDaysPlusOne =  departureDateInDays - 1;
            let departureDateInDaysPlusOneInMilliseconds = departureDateInDaysPlusOne*24*60*60*1000 ;
            let departureDatePlusOne = new Date(departureDateInDaysPlusOneInMilliseconds).toISOString().split('T')[0];
            arrivalDate.setAttribute('max', departureDatePlusOne);
        }

        (function () {
            'use strict'
          
            var form = document.querySelector('#form');
                
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                event.preventDefault()
                }
          
                form.classList.add('was-validated')
                })
          })()
    
    } finally {
        return;
    }

}

function bookCondition_1() {

    try{
        bookBtn.addEventListener('click', ()=>{
            window.location.href="/users/bookingForm";
            console.log("ok");
        });
    } finally {
        return;
    }
}