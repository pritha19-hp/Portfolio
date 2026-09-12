alert("JavaScript is working!");
/* welcome message */

alert("Welcome to Pritha's Portfolio!");


/* smooth scrolling */

let links = document.querySelectorAll("nav a");

links.forEach(function(link) {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        let section = document.querySelector(this.getAttribute("href"));

        section.scrollIntoView({
            behavior: "smooth"
        });

    });

});

/* contact form */

let form = document.getElementById("contact-form");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;


    /* Check whether all fields are filled */

    if (name == "" || email == "" || message == "") {

        alert("Please fill all the fields.");

        return;

    }


    /* Send data to backend */

    fetch("http://localhost:3000/contact", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name,
            email: email,
            message: message
        })

    })

    .then(function(response) {

        return response.json();

    })

    .then(function(data) {

        alert(data.message);

        form.reset();

    })

    .catch(function(error) {

        alert("Something went wrong. Please try again.");

        console.log(error);

    });

});
