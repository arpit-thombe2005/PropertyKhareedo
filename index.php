<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link rel="stylesheet" href="landingpage.css">
    <link rel="stylesheet" href="theme.css">
</head>
<body>
    <div id="transition-overlay" class="transition-overlay">
        <div class="transition-loader"></div>
    </div>
    
    <div id="landingPage" class="landing-container">
        <div class="slideshow-container">
            <div class="slide active">
                <img src="images/LandingImage1.jpg" alt="Slide 1">
            </div>
            <div class="slide">
                <img src="images/LandingImage2.jpg" alt="Slide 2">
            </div>
            <div class="slide">
                <img src="images/LandingImage3.jpg" alt="Slide 3">
            </div>
        </div>
        
        <div class="logo-overlay">
            <img src="images/transparent.png" alt="Company Logo" class="logo">
        </div>
        
        <div class="loading-indicator">
            <div class="pulse"></div>
        </div>
    </div>

    <script src="theme.js"></script>
    <script src="script.js"></script>
</body>
</html>
