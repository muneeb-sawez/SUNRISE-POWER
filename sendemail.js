document.getElementById("service-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission

  const form = document.getElementById("service-form");

  // Send the form data using EmailJS
  emailjs.sendForm("service_tyc0213", "template_32q43sm", form, "Prx0yDnr-5MlTe-vB")
    .then(function(response) {
      alert("✅ Your inquiry has been submitted successfully!");
      closeModal(); // Close the modal after submission
      form.reset(); // Reset the form
    }, function(error) {
      alert("❌ Failed to submit the inquiry. Please try again.");
      console.error("EmailJS Error:", error);
    });
});
