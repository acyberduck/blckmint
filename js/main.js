// Main JavaScript for Blckmint landing page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Form submission handling
    initFormSubmission();
});

// Function to scroll to signup section
function scrollToSignup() {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
        window.scrollTo({
            top: signupSection.offsetTop,
            behavior: 'smooth'
        });
    }
}

// Handle scroll animations
function initAnimations() {
    // Add fade-in class to elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.benefit-card, .value-proposition h3, .value-proposition p, .beta-announcement, .signup-content h3, .signup-content p, .signup-form');
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Check if elements are in viewport on load
    checkVisibility();
    
    // Check if elements are in viewport on scroll
    window.addEventListener('scroll', checkVisibility);
    
    function checkVisibility() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
}

// Handle form submission
function initFormSubmission() {
    const form = document.getElementById('signup-form');
    const formMessage = document.getElementById('form-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            // Basic email validation
            if (!validateEmail(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.style.color = '#EF4444'; // Red color for error
                return;
            }
            
            // Show processing message
            formMessage.textContent = 'Processing...';
            formMessage.style.color = '#FFFFFF';
            
            // Submit to MailerLite
            if (window.mailerLiteToken) {
                // Create/update subscriber in MailerLite
                fetch('https://connect.mailerlite.com/api/subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${window.mailerLiteToken}`
                    },
                    body: JSON.stringify({
                        email: email,
                        fields: {
                            source: 'Blckmint Landing Page',
                            signup_date: new Date().toISOString().split('T')[0]
                        },
                        status: 'active'
                    })
                })
                .then(response => {
                    if (response.ok || response.status === 201) {
                        return response.json();
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .then(data => {
                    // Success message
                    formMessage.textContent = 'Thank you! You\'re on the list for early Beta access.';
                    formMessage.style.color = '#10B981'; // Green color for success
                    
                    // Clear the form
                    document.getElementById('email').value = '';
                    
                    // Log success for debugging
                    console.log('MailerLite subscription successful:', data);
                })
                .catch(error => {
                    // Error message
                    formMessage.textContent = 'Something went wrong. Please try again.';
                    formMessage.style.color = '#EF4444'; // Red color for error
                    
                    // Log error for debugging
                    console.error('MailerLite subscription error:', error);
                });
            } else {
                // Fallback if MailerLite token is not available
                setTimeout(function() {
                    formMessage.textContent = 'Thank you! You\'re on the list for early Beta access.';
                    formMessage.style.color = '#10B981'; // Green color for success
                    document.getElementById('email').value = '';
                }, 1500);
            }
        });
    }
}

// Email validation helper
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
