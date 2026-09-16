/* welcome message */
alert("Welcome to Pritha's Portfolio!");

/* smooth scrolling */
let links = document.querySelectorAll("nav a");

links.forEach(function(link) {
    link.addEventListener("click", function(event) {
        let href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
            let section = document.querySelector(href);
            if (section) {
                event.preventDefault();
                section.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
});

/* contact form */
let form = document.getElementById("contact-form");

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let formData = new FormData(form);

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })
        .then(async function(response) {
            let json = await response.json();
            if (response.status === 200) {
                alert("Message sent successfully!");
                form.reset();
            } else {
                alert(json.message || "Something went wrong. Please try again.");
            }
        })
        .catch(function(error) {
            alert("Something went wrong. Please try again.");
            console.log(error);
        });
    });
}
