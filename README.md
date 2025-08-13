# PropertyKhareedo

## Overview
PropertyKhareedo is a web application designed for property listing, searching, and related functionalities such as EMI/Rent calculation, profile management, and offers display. It includes both frontend (HTML, CSS, JavaScript, JQuery) and backend (PHP) components, along with database connectivity.

## Project Structure
```
PropertyKhareedo/
    about.css, about.html, about.js        # Information about the website
    button.css                             # Common button styles
    calculate-emi-rent.html                # EMI and Rent calculation page
    db.php                                 # Database connection script
    *.log                                  # Debug and error log files
    dropdown.css                           # Dropdown menu styling
    emi-rent.css, emi-rent.js              # EMI/Rent page design and functionality
    forgot-password.php                    # Password reset initiation
    gallery.html, gallery.js               # Property gallery
    homepage.css, homepage.html, homepage.js # Landing homepage
    index.php, index.js                    # User Registration Scripts
    landingpage.css, landingpage.html      # Landing page styling and structure
    login.js, login.php                    # User login scripts
    map.css, map.js                        # Map-related functionality
    modal-forms.css, modal.js              # Modal forms design and control
    offers.html, offers.js                 # Offers and deals page
    profile.php                            # User profile page
    property-search.*                      # Search functionality for properties
    reset-password.php                     # Password reset processing
    script.js                              # General JavaScript utilities
    Styles.css                             # General stylesheet
    testing.php                            # Test script for development
    images/                                # Image assets for the site
    PHPMailer/                             # Email sending library with configs and translations
```

## Features
- **Property Search** with filters
- **User Authentication** (Login, Forgot Password, Reset Password)
- **EMI & Rent Calculator**
- **Offers & Gallery**
- **Interactive Map**
- **Responsive Design**
- **Email Notifications** (via PHPMailer)

## Requirements
- PHP 7.x or higher
- Microsoft Azure Database
- Web server (Apache/Nginx)
- Composer (for PHPMailer dependencies if needed)

## Setup Instructions
1. Clone or extract the repository into your web server directory.
2. Configure database connection in `db.php`.
3. Import database schema (not provided here; create according to usage in PHP files).
4. Ensure `PHPMailer/` is properly configured for email features.
5. Don't forget to add extensions from SQLSRV512.zip to your xampp/php/php.ini file.
6. Access the site via `http://localhost/PropertyKhareedo/`.

## Notes
- Log files in the root directory (`*.log`) help debug issues.
- Images are stored in the `images/` folder.
- PHPMailer library is included for email functionality.
