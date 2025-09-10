
// Landing Page Class
class LandingPage {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.landingContainer = document.getElementById('landingPage');
        this.slideInterval = null;
        this.init();
    }
    
    init() {
        // Removed fade-in animation - landing page loads immediately
        this.startSlideshow();
        this.addClickListener();
        this.preloadImages();
    }
    
    startSlideshow() {
        if (this.slides.length > 0) {
            this.slideInterval = setInterval(() => {
                this.nextSlide();
            }, 4000); // Change slide every 4 seconds
        }
    }
    
    nextSlide() {
        if (this.slides.length > 0) {
            this.slides[this.currentSlide].classList.remove('active');
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            this.slides[this.currentSlide].classList.add('active');
        }
    }
    
    addClickListener() {
        if (this.landingContainer) {
            this.landingContainer.addEventListener('click', (e) => {
                this.redirectToHome();
            });
            
            // Also handle Enter key and Space bar for accessibility
            document.addEventListener('keydown', (e) => {
                if (e.code === 'Enter' || e.code === 'Space') {
                    e.preventDefault();
                    this.redirectToHome();
                }
            });
        }
    }
    
    redirectToHome() {
        // Clear the slideshow interval
        clearInterval(this.slideInterval);
        
        // Show transition overlay
        const overlay = document.getElementById('transition-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
        
        // Add enhanced exit animation
        if (this.landingContainer) {
            this.landingContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            this.landingContainer.style.opacity = '0';
            this.landingContainer.style.transform = 'scale(1.05)';
            this.landingContainer.style.filter = 'blur(2px)';
        }
        
        // Redirect after animation
        setTimeout(() => {
            window.location.href = 'homepage.html';
        }, 800);
    }

    
    
    
    preloadImages() {
        // Preload slideshow images for smooth transitions
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && img.src) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize landing page if it exists
    if (document.getElementById('landingPage')) {
        new LandingPage();
    }
    
    // Add smooth animations for form elements on registration page
    if (document.getElementById('contactForm')) {
        document.querySelectorAll('.form-group').forEach((group, index) => {
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
});

// Add loading screen functionality
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Hide transition overlay after page loads
    setTimeout(() => {
        const overlay = document.getElementById('transition-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }, 300);
});

// Homepage

// Homepage JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Get references to DOM elements
    const logo = document.querySelector('.logo');
    const tcBtn = document.getElementById('tcBtn');
    const tcModal = document.getElementById('tcModal');
    const tcClose = document.getElementById('tcClose');
    
    // Debug: Check if elements are found
    console.log('T&C Button:', tcBtn);
    console.log('T&C Modal:', tcModal);
    console.log('T&C Close:', tcClose);
    
    // Logo click handler - return to homepage
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logo clicked - staying on homepage');
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Terms & Conditions button click handler
    if (tcBtn && tcModal) {
        tcBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Terms & Conditions button clicked');
            tcModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    } else {
        console.error('T&C button or modal not found!');
    }
    
    // Close modal when X button is clicked
    if (tcClose && tcModal) {
        tcClose.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Terms & Conditions modal closed');
            tcModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        });
    }
    
    // Close modal when clicking outside of it
    if (tcModal) {
        window.addEventListener('click', function(event) {
            if (event.target === tcModal) {
                console.log('Modal closed by clicking outside');
                tcModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && tcModal && tcModal.style.display === 'block') {
            console.log('Modal closed with Escape key');
            tcModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Add some interactive hover effects
    const interactiveElements = document.querySelectorAll('.tc-btn, .account-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation when page loads
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('Homepage JavaScript loaded successfully!');
});

// Utility functions for future enhancements
const HomepageUtils = {
    // Function to handle account navigation
    navigateToAccount: function() {
        console.log('Account navigation triggered');
        window.location.href = 'index.html';
    },
    
    // Function to handle responsive behavior
    handleResize: function() {
        const width = window.innerWidth;
        console.log('Window resized to:', width);
        
        if (width < 768) {
            console.log('Mobile view active');
        } else {
            console.log('Desktop view active');
        }
    },
    
    // Function to validate user session (placeholder)
    checkUserSession: function() {
        const isLoggedIn = false;
        
        if (isLoggedIn) {
            console.log('User is logged in');
        } else {
            console.log('User is not logged in');
        }
    }
};
const LoginUtils = {
    // Function to handle account navigation
    navigateToAccount: function() {
        console.log('Account navigation triggered');
        window.location.href = 'homepage.html';
    },
    
    // Function to handle responsive behavior
    handleResize: function() {
        const width = window.innerWidth;
        console.log('Window resized to:', width);
        
        if (width < 768) {
            console.log('Mobile view active');
        } else {
            console.log('Desktop view active');
        }
    },
    
    // Function to validate user session (placeholder)
   
};




// Add resize listener
window.addEventListener('resize', HomepageUtils.handleResize);

// Initialize session check
HomepageUtils.checkUserSession();


// diff pages
// Smooth scrolling function for contact section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Modal functions
function openModal() {
    document.getElementById('tcModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('tcModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('tcModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Property search functionality
document.getElementById('propertySearchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const location = document.getElementById('locationInput').value;
    const radius = document.getElementById('radiusSelect').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    
    // Show filtered results
    showPropertyResults(location, radius, minPrice, maxPrice);
});

function showPropertyResults(location, radius, minPrice, maxPrice) {
    const resultsContainer = document.getElementById('propertyResults');
    
    // Sample properties with radius and price in lakhs
    const sampleProperties = [
        { name: 'Modern Apartment', location: location, price: 25, distance: 3, type: 'Apartment', bedrooms: '2 BHK' },
        { name: 'Luxury Villa', location: location, price: 85, distance: 8, type: 'Villa', bedrooms: '4 BHK' },
        { name: 'Cozy Studio', location: location, price: 15, distance: 2, type: 'Studio', bedrooms: '1 BHK' },
        { name: 'Penthouse Suite', location: location, price: 150, distance: 12, type: 'Penthouse', bedrooms: '3 BHK' },
        { name: 'Family Home', location: location, price: 45, distance: 18, type: 'Independent House', bedrooms: '3 BHK' },
        { name: 'Premium Flat', location: location, price: 65, distance: 25, type: 'Apartment', bedrooms: '2 BHK' },
        { name: 'Budget Apartment', location: location, price: 12, distance: 35, type: 'Apartment', bedrooms: '1 BHK' },
        { name: 'Luxury Bungalow', location: location, price: 200, distance: 28, type: 'Bungalow', bedrooms: '5 BHK' }
    ];
    
    // Filter properties based on search criteria
    let filteredProperties = sampleProperties.filter(property => {
        let matchesRadius = true;
        let matchesPrice = true;
        
        // Filter by radius
        if (radius) {
            matchesRadius = property.distance <= parseInt(radius);
        }
        
        // Filter by price range
        if (minPrice) {
            matchesPrice = matchesPrice && property.price >= parseInt(minPrice);
        }
        if (maxPrice) {
            matchesPrice = matchesPrice && property.price <= parseInt(maxPrice);
        }
        
        return matchesRadius && matchesPrice;
    });
    
    // Sort by price (ascending)
    filteredProperties.sort((a, b) => a.price - b.price);
    
    resultsContainer.innerHTML = '';
    
    if (filteredProperties.length === 0) {
        resultsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3>No properties found</h3>
                <p>Try adjusting your search criteria to find more properties.</p>
            </div>
        `;
        return;
    }
    
    filteredProperties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        propertyCard.innerHTML = `
            <div class="property-image">Property Image</div>
            <h3>${property.name}</h3>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Type:</strong> ${property.type} (${property.bedrooms})</p>
            <p><strong>Distance:</strong> ${property.distance} km away</p>
            <p><strong>Price:</strong> ₹${property.price} Lakhs</p>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="search-btn" onclick="contactForProperty('${property.name}')">Contact Us</button>
                <button class="search-btn" style="background: #28a745;" onclick="viewDetails('${property.name}')">View Details</button>
            </div>
        `;
        resultsContainer.appendChild(propertyCard);
    });
    
    // Show results count
    const resultsHeader = document.createElement('div');
    resultsHeader.innerHTML = `<h3 style="grid-column: 1 / -1; margin-bottom: 1rem;">Found ${filteredProperties.length} properties</h3>`;
    resultsContainer.insertBefore(resultsHeader, resultsContainer.firstChild);
}

function contactForProperty(propertyName) {
    alert(`Thank you for your interest in ${propertyName}. We will contact you shortly!`);
}

function viewDetails(propertyName) {
    alert(`Viewing details for ${propertyName}. This would open a detailed property page.`);
}

// Add price range sorting functionality
function sortProperties(sortBy) {
    const resultsContainer = document.getElementById('propertyResults');
    const propertyCards = Array.from(resultsContainer.querySelectorAll('.property-card'));
    
    if (propertyCards.length === 0) return;
    
    // Extract price from each card and sort
    propertyCards.sort((a, b) => {
        const priceA = parseInt(a.querySelector('p:last-of-type').textContent.match(/₹(\d+)/)[1]);
        const priceB = parseInt(b.querySelector('p:last-of-type').textContent.match(/₹(\d+)/)[1]);
        
        return sortBy === 'asc' ? priceA - priceB : priceB - priceA;
    });
    
    // Clear and re-append sorted cards
    const resultsHeader = resultsContainer.querySelector('h3');
    resultsContainer.innerHTML = '';
    if (resultsHeader) resultsContainer.appendChild(resultsHeader);
    propertyCards.forEach(card => resultsContainer.appendChild(card));
}


// Adjust selectors to your actual login form fields

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
    username: document.getElementById('username').value.trim(),
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch('https://yourdomain.com/login.php', { // your PHP URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || 'Login successful.');
      window.location.href = 'homepage.html';
    } else {
      alert(result.error || 'Login failed.');
    }
  } catch (err) {
    alert('Error connecting to server.');
    console.error(err);
  }
  
});

// Login
fetch('login.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  email: document.getElementById('username').value.trim(),
  password: document.getElementById('password').value
})

})
