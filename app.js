// Portfolio Website JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle mobile menu
  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      // Special handling for home link
      if (targetId === "#home") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById("navbar");
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > 100) {
      navbar.style.transform = "translateY(0)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.boxShadow = "none";
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  // Active navigation link highlighting
  const sections = document.querySelectorAll("section[id]");

  function highlightActiveSection() {
    const scrollPos = window.scrollY + 100;

    // Special handling for home section (when at top)
    if (window.scrollY < 200) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const homeLink = document.querySelector('.nav-link[href="#home"]');
      if (homeLink) {
        homeLink.classList.add("active");
      }
      return;
    }

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const correspondingLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`
      );

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));
        if (correspondingLink) {
          correspondingLink.classList.add("active");
        }
      }
    });
  }

  window.addEventListener("scroll", highlightActiveSection);

  // Contact Form Handling
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  // Form validation functions
  function validateName(name) {
    return name.trim().length >= 2;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateSubject(subject) {
    return subject.trim().length >= 3;
  }

  function validateMessage(message) {
    return message.trim().length >= 10;
  }

  // Show error message
  function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    errorElement.textContent = message;
    inputElement.style.borderColor = "var(--color-error)";
    errorElement.style.display = "block";
  }

  // Clear error message
  function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    errorElement.textContent = "";
    inputElement.style.borderColor = "var(--color-border)";
    errorElement.style.display = "none";
  }

  // Clear all errors
  function clearAllErrors() {
    const fields = ["name", "email", "subject", "message"];
    fields.forEach((field) => clearError(field));
  }

  // Show form status
  function showFormStatus(message, isSuccess = true) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${isSuccess ? "success" : "error"}`;
    formStatus.classList.remove("hidden");

    // Hide status after 5 seconds
    setTimeout(() => {
      formStatus.classList.add("hidden");
    }, 5000);
  }

  // Real-time validation
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const subjectField = document.getElementById("subject");
  const messageField = document.getElementById("message");

  nameField.addEventListener("blur", function () {
    if (!validateName(this.value)) {
      showError("name", "Name must be at least 2 characters long");
    } else {
      clearError("name");
    }
  });

  emailField.addEventListener("blur", function () {
    if (!validateEmail(this.value)) {
      showError("email", "Please enter a valid email address");
    } else {
      clearError("email");
    }
  });

  subjectField.addEventListener("blur", function () {
    if (!validateSubject(this.value)) {
      showError("subject", "Subject must be at least 3 characters long");
    } else {
      clearError("subject");
    }
  });

  messageField.addEventListener("blur", function () {
    if (!validateMessage(this.value)) {
      showError("message", "Message must be at least 10 characters long");
    } else {
      clearError("message");
    }
  });

  // Form submission
  // In app.js

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // --- All your validation logic from before stays the same ---
    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    clearAllErrors();
    let isValid = true;
    if (!validateName(name)) {
      showError("name", "Name must be at least 2 characters long");
      isValid = false;
    }
    if (!validateEmail(email)) {
      showError("email", "Please enter a valid email address");
      isValid = false;
    }
    if (!validateSubject(subject)) {
      showError("subject", "Subject must be at least 3 characters long");
      isValid = false;
    }
    if (!validateMessage(message)) {
      showError("message", "Message must be at least 10 characters long");
      isValid = false;
    }
    if (!isValid) {
      showFormStatus("Please fix the errors above", false);
      return;
    }

    // --- This is the new part that sends data to Web3Forms ---
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.classList.add("loading");
    submitButton.disabled = true;

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(async (response) => {
        let jsonResponse = await response.json();
        if (response.status == 200) {
          showFormStatus("Success! Your message has been sent.", true);
          contactForm.reset(); // Clear the form
        } else {
          console.log(response);
          showFormStatus(jsonResponse.message, false);
        }
      })
      .catch((error) => {
        console.log(error);
        showFormStatus("Something went wrong! Please try again.", false);
      })
      .finally(() => {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.classList.remove("loading");
        submitButton.disabled = false;
      });
  });

  // contact form end

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".card, .hero-content, .section-title"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Scroll to top functionality
  let scrollToTopButton = null;

  function createScrollToTopButton() {
    scrollToTopButton = document.createElement("button");
    scrollToTopButton.innerHTML = "↑";
    scrollToTopButton.className = "scroll-to-top";
    scrollToTopButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--color-primary);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

    scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    document.body.appendChild(scrollToTopButton);
  }

  createScrollToTopButton();

  // Show/hide scroll to top button
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopButton.style.opacity = "1";
      scrollToTopButton.style.visibility = "visible";
    } else {
      scrollToTopButton.style.opacity = "0";
      scrollToTopButton.style.visibility = "hidden";
    }
  });

  // External Links Handling
  function setupExternalLinks() {
    // Project links
    const projectLinks = document.querySelectorAll(".project-link");
    const projectUrls = {
      ShareWEB: "https://github.com/shravannikhil/shareweb",
      "Automated Attendance System":
        "https://github.com/shravannikhil/attendance-system",
    };

    projectLinks.forEach((link, index) => {
      const projectTitle = link
        .closest(".card")
        .querySelector(".project-title").textContent;
      const projectUrl =
        projectUrls[projectTitle] || "https://github.com/shravannikhil";

      link.addEventListener("click", function (e) {
        e.preventDefault();
        window.open(projectUrl, "_blank");
      });
    });

    // Certification links
    const certificationLinks = document.querySelectorAll(".certification-link");
    const certificationUrls = [
      "https://drive.google.com/file/d/12Dd0dm7dqCVcFDzp28OrqT2VyWazyW0s/view",
      "https://www.udemy.com/certificate/UC-6eadd880-f303-4c33-b205-406a8a4f4f9b/",
      "https://drive.google.com/file/d/1sw73DL_vJ9EIY_8D1qATP0FmbFSbs9nL/view",
      "https://drive.google.com/file/d/1kHVGj-cPpqOTXAZ9-oq_Hq9nmdOWxA4N/view",
      "https://drive.google.com/file/d/1ZjTuhNWkFhRWbMHHf9AkiRo1XYbgXuN2/view",
      "https://drive.google.com/file/d/1ViwETsvicAyCc0PphH3ZJHoqATZlr_6J/view",
      "https://www.linkedin.com/posts/shravannikhil_python-coding-learningjourney-activity-7078001201992105985-3x35?utm_source=share&utm_medium=member_desktop&rcm=ACoAADkPxngBz7RurTz5sB-VbSHsWtvkVjW7f1M",
      "https://www.linkedin.com/posts/shravannikhil_programming-dsa-python-activity-7081582383430303744-_rud?utm_source=share&utm_medium=member_desktop&rcm=ACoAADkPxngBz7RurTz5sB-VbSHsWtvkVjW7f1M",
    ];

    certificationLinks.forEach((link, index) => {
      const certUrl =
        certificationUrls[index] || "https://linkedin.com/in/shravannikhil";

      link.addEventListener("click", function (e) {
        e.preventDefault();
        window.open(certUrl, "_blank");
      });
    });

    // Publication links
    const publicationLinks = document.querySelectorAll(".publication-link");
    publicationLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        window.open(
          "https://jnanoworld.com/articles/v9s4/nwj-s4-yeswanth-sai-mahesh.pdf",
          "_blank"
        );
      });
    });

    // LinkedIn and social links
    const socialLinks = document.querySelectorAll(".detail-link, .social-link");
    socialLinks.forEach((link) => {
      if (
        link.textContent.includes("LinkedIn") ||
        link.textContent === "LinkedIn"
      ) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          window.open("https://linkedin.com/in/shravannikhil", "_blank");
        });
      }
    });
  }

  // Initialize external links
  setupExternalLinks();

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    // Escape key closes mobile menu
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });

  // Performance optimization: Debounce scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Apply debouncing to scroll events
  const debouncedScrollHandler = debounce(() => {
    highlightActiveSection();
  }, 10);

  window.removeEventListener("scroll", highlightActiveSection);
  window.addEventListener("scroll", debouncedScrollHandler);

  // Add hover effects for external links
  const allExternalLinks = document.querySelectorAll(
    ".project-link, .certification-link, .publication-link, .detail-link, .social-link"
  );
  allExternalLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Form field focus effects
  const formFields = document.querySelectorAll(".form-control");
  formFields.forEach((field) => {
    field.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    field.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });
  });

  // Lazy loading for better performance
  if ("IntersectionObserver" in window) {
    const lazyElements = document.querySelectorAll("[data-lazy]");
    const lazyElementObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add("loaded");
          lazyElementObserver.unobserve(element);
        }
      });
    });

    lazyElements.forEach((element) => {
      lazyElementObserver.observe(element);
    });
  }

  // Console message for developers
  console.log("🚀 Shravan Nikhil Portfolio - Ready!");
  console.log("💼 Built with modern web technologies");
  console.log("📧 Contact: nikhilshravan71@gmail.com");
  console.log("🔗 All external links are functional and open in new tabs");
});
