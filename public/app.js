// Scroll Animation Library
sal({
    threshold: 0.2
});

// Contact form functionality
const contactForm = document.querySelector('.contact-form');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

let formName = document.getElementById('name');
let email = document.getElementById('email');
let message = document.getElementById('message');

contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    let formData = {
        formName: formName.value,
        email: email.value,
        message: message.value
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://mswan.dev/.netlify/functions/contact');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function(){
        const response = JSON.parse(xhr.responseText);
        if(response.status == 'success'){
            notification.classList.remove('hide');
            notification.style.backgroundColor = '#00C851';
            notificationMessage.innerHTML = 'Email sent!<i class="fa-solid fa-circle-check"></i>';
            formName.value = '';
            email.value = '';
            message.value = '';
        }else{
            notification.classList.remove('hide');
            notification.style.backgroundColor = '#ff4444';
            notificationMessage.innerHTML = 'Something went wrong!<i class="fa-solid fa-circle-xmark"></i>';
        }

        setTimeout(() => {notification.classList.add('hide');}, 4500);
    }

    xhr.send(JSON.stringify(formData));

});


// Scroll to top button functionality
const sttButton = document.querySelector('.stt');

window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
        sttButton.classList.add('visible');
    } else {
        sttButton.classList.remove('visible');
    }
});


// Hamburger menu functionality
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.
    addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }))

