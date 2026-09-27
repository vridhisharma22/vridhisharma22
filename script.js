if (window.emailjs) {
    window.emailjs.init("Q0xALhwV3sdWXbqFH");
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const button = document.getElementById("register-btn");
    const formStatus = document.getElementById("form-status");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinksContainer = document.querySelector(".nav-links");
    const backToTop = document.querySelector(".back-to-top");
    const commandReadout = document.getElementById("command-readout");
    const roleLine = document.querySelector(".role-line");
    const roleButtons = document.querySelectorAll("[data-role]");
    const certificateModal = document.getElementById("certificate-modal");
    const certificateDialog = certificateModal?.querySelector(".certificate-dialog");
    const certificateImage = document.getElementById("certificate-image");
    const certificateTitle = document.getElementById("certificate-title");
    const certificateClose = certificateModal?.querySelector(".certificate-close");
    let certificateTrigger = null;

    const roleCopy = {
        developer: "aspiring developer",
        designer: "systems-minded designer",
        builder: "curious builder"
    };
    let roleLocked = false;

    roleButtons.forEach((roleButton) => {
        roleButton.addEventListener("click", () => {
            roleLocked = true;
            roleButtons.forEach((button) => button.classList.remove("active"));
            roleButton.classList.add("active");
            document.body.dataset.mode = roleButton.dataset.role;
            if (roleLine) {
                roleLine.classList.add("changing");
                setTimeout(() => {
                    roleLine.textContent = roleCopy[roleButton.dataset.role];
                    roleLine.classList.remove("changing");
                }, 220);
            }
        });
    });

    window.addEventListener("pointermove", (event) => {
        document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
        document.documentElement.style.setProperty("--photo-shift-x", `${(event.clientX / window.innerWidth - 0.5) * 8}px`);
        document.documentElement.style.setProperty("--photo-shift-y", `${(event.clientY / window.innerHeight - 0.5) * 8}px`);
    }, { passive: true });

    window.addEventListener("scroll", () => {
        document.documentElement.style.setProperty("--scroll-depth", `${window.scrollY * 0.08}px`);
        document.body.classList.toggle("has-scrolled", window.scrollY > 40);
    }, { passive: true });

    document.querySelectorAll("[data-command]").forEach((command) => {
        command.addEventListener("click", () => {
            const messages = {
                profile: "loading profile...",
                builds: "opening selected builds...",
                connect: "opening secure channel..."
            };
            if (commandReadout) commandReadout.textContent = messages[command.dataset.command];
            document.querySelector(command.dataset.target)?.scrollIntoView({ behavior: "smooth" });
        });
    });

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinksContainer.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        });

        navLinksContainer.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinksContainer.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
            });
        });
    }

    if (form && button) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!window.emailjs) {
                if (formStatus) formStatus.textContent = "The message service is unavailable. Please try again later.";
                return;
            }

            button.textContent = "SENDING...";
            button.disabled = true;

            window.emailjs.sendForm(
                "service_dr4smk8",
                "template_thgl9bs",
                this
            )
            .then(() => {
                form.reset();
                button.textContent = "MESSAGE SENT ✓";
                button.classList.add("sent");
                if (formStatus) formStatus.textContent = "Message sent successfully. Thank you for reaching out!";
                form.setAttribute("data-status", "Message sent successfully. Thank you for reaching out!");
                setTimeout(() => {
                    button.textContent = "SEND MESSAGE";
                    button.classList.remove("sent");
                    if (formStatus) formStatus.textContent = "";
                    form.removeAttribute("data-status");
                    button.disabled = false;
                }, 4000);
            })
            .catch((error) => {
                console.error(error);
                if (formStatus) formStatus.textContent = "Transmission failed. Please try again.";
                form.setAttribute("data-status", "Transmission failed. Please try again.");
                button.textContent = "SEND MESSAGE";
                button.disabled = false;
            });
        });
    }

    const closeCertificate = () => {
        if (!certificateModal || certificateModal.hidden) return;
        certificateModal.hidden = true;
        document.body.classList.remove("modal-open");
        certificateTrigger?.focus();
        certificateTrigger = null;
    };

    document.querySelectorAll("[data-certificate-src]").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            if (!certificateModal || !certificateDialog || !certificateImage || !certificateTitle) return;
            certificateTrigger = trigger;
            certificateImage.src = trigger.dataset.certificateSrc;
            certificateImage.alt = trigger.dataset.certificateAlt || "Certificate preview";
            certificateTitle.textContent = trigger.dataset.certificateTitle || "Certificate";
            certificateModal.hidden = false;
            document.body.classList.add("modal-open");
            certificateClose?.focus();
        });
    });

    certificateClose?.addEventListener("click", closeCertificate);
    certificateModal?.addEventListener("click", (event) => {
        if (event.target === certificateModal) closeCertificate();
    });

    document.addEventListener("keydown", (event) => {
        if (!certificateModal || certificateModal.hidden) return;
        if (event.key === "Escape") {
            closeCertificate();
            return;
        }
        if (event.key !== "Tab" || !certificateDialog) return;

        const focusable = certificateDialog.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    const revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealElements.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("visible"));
    }

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    const updateActiveNav = () => {
        let current = "";

        if (window.scrollY < 200) {
            current = "home";
        }

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 180;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
                link.setAttribute("aria-current", "location");
            }
        });
    };

    updateActiveNav();
    window.addEventListener("scroll", () => {
        updateActiveNav();
        backToTop?.classList.toggle("visible", window.scrollY > 500);
    }, { passive: true });

    backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    const roles = ["aspiring developer", "problem solver", "creative builder"];
    let roleIndex = 0;
    if (roleLine && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setInterval(() => {
            if (roleLocked) return;
            roleLine.classList.add("changing");
            setTimeout(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                roleLine.textContent = roles[roleIndex];
                roleLine.classList.remove("changing");
            }, 220);
        }, 2800);
    }
});
