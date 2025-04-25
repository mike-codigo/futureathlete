const sportsData = [
    {
      name: "SOCCER",
      description: "Brazil's most beloved sport with five World Cup victories.",
      image: "../img/esportes/basketball.webp"
    },
    {
      name: "BASKETBALL",
      description: "Growing rapidly with Brazilian teams competing internationally.",
      image: "../img/esportes/basketball.webp"
    },
    {
      name: "VOLLEYBALL",
      description: "Extremely popular with successful national teams.",
      image: "../img/esportes/basketball.webp"
    },
    {
      name: "BEACH TENNIS",
      description: "Increasingly popular along Brazil's extensive coastline.",
      image: "../img/esportes/basketball.webp"
    },
    {
      name: "ATHLETICS",
      description: "Track and field events with strong Brazilian representation.",
      image: "../img/esportes/basketball.webp"
    },
    {
      name: "SKATEBOARDING",
      description: "Thriving urban sport with many Brazilian champions.",
      image: "../img/esportes/basketball.webp"
    },
    {
      name: "BODYBUILDING",
      description: "Popular fitness activity with competitive events nationwide.",
      image: "../img/esportes/basketball.webp"
    },
    {
      name: "FUTSAL",
      description: "Indoor football variant with massive participation.",
      image: "../img/esportes/basketball.webp"
    },
    {
      name: "JIU-JITSU",
      description: "Martial art with deep roots in Brazilian culture.",
      image: "../img/esportes/basketball.webp"
    },
    {
      name: "SWIMMING",
      description: "Well-established sport with Olympic achievements.",
      image: "../img/esportes/basketball.webp"
    }
  ];

  // Create carousel items
  function createCarouselItems() {
    const carousel = document.getElementById("carousel");
    
    // Create original set of cards
    sportsData.forEach(sport => {
      const card = createCard(sport);
      carousel.appendChild(card);
    });
    
    // Clone the entire set of cards twice for smoother infinite scroll
    const originalCards = [...carousel.children];
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      carousel.appendChild(clone);
    });
    
    // Clone again for good measure
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      carousel.appendChild(clone);
    });
  }

  function createCard(sport, isClone = false) {
    const card = document.createElement("div");
    card.className = "card";
    if (isClone) card.dataset.clone = "true";
    
    const img = document.createElement("img");
    img.src = sport.image;
    img.alt = sport.name;
    img.className = "card-image";
    
    const title = document.createElement("h2");
    title.textContent = sport.name;
    
    const desc = document.createElement("p");
    desc.textContent = sport.description;
    
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    
    return card;
  }

  // Initialize the carousel
  function initCarousel() {
    createCarouselItems();
    
    const carouselContainer = document.getElementById("carousel-container");
    const carousel = document.getElementById("carousel");
    const cardWidth = 290; // Card width + margin
    const totalCards = carousel.children.length;
    const totalWidth = totalCards * cardWidth;
    
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let autoAnimationId = null;
    let lastTimestamp = 0;
    
    // Touch events
    carouselContainer.addEventListener("touchstart", dragStart);
    carouselContainer.addEventListener("touchend", dragEnd);
    carouselContainer.addEventListener("touchmove", drag);

    // Mouse events
    carouselContainer.addEventListener("mousedown", dragStart);
    carouselContainer.addEventListener("mouseup", dragEnd);
    carouselContainer.addEventListener("mouseleave", dragEnd);
    carouselContainer.addEventListener("mousemove", drag);
    
    // Prevent context menu on right click
    carouselContainer.addEventListener("contextmenu", e => e.preventDefault());

    function dragStart(event) {
      event.preventDefault();
      startPos = getPositionX(event);
      isDragging = true;
      carouselContainer.classList.add("is-dragging");
      
      // Stop auto-animation when user interacts
      if (autoAnimationId) {
        cancelAnimationFrame(autoAnimationId);
        autoAnimationId = null;
      }
      
      animationID = requestAnimationFrame(animation);
    }

    function drag(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }

    function dragEnd() {
      cancelAnimationFrame(animationID);
      isDragging = false;
      carouselContainer.classList.remove("is-dragging");
      
      prevTranslate = currentTranslate;
      
      // Check if we need to reset position for infinite scroll
      handleInfiniteScroll();
      
      // Resume auto-animation after user interaction
      startAutoAnimation();
    }

    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
      carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function handleInfiniteScroll() {
      // Get the first set cards width (original set)
      const originalSetWidth = sportsData.length * cardWidth;
      
      // If scrolled too far right (showing cloned cards)
      if (currentTranslate > 0) {
        // Jump back by the width of the original set
        currentTranslate -= originalSetWidth;
        prevTranslate = currentTranslate;
        carousel.style.transition = "none";
        setSliderPosition();
      }
      
      // If scrolled too far left (showing end clones)
      else if (Math.abs(currentTranslate) > totalWidth - originalSetWidth) {
        // Jump forward by the width of the original set
        currentTranslate += originalSetWidth;
        prevTranslate = currentTranslate;
        carousel.style.transition = "none";
        setSliderPosition();
      }
    }
    
    // Constant auto-animation
    function autoAnimation(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      // Calculate time delta and move a small amount based on time
      const elapsed = timestamp - lastTimestamp;
      const pixelsPerSecond = 50; // Speed - adjust this value for faster/slower movement
      const pixelsToMove = (pixelsPerSecond * elapsed) / 1000;
      
      // Move carousel
      currentTranslate -= pixelsToMove;
      prevTranslate = currentTranslate;
      
      // Handle infinite scroll
      handleInfiniteScroll();
      
      // Apply movement
      carousel.style.transition = "none";
      setSliderPosition();
      
      // Update last timestamp
      lastTimestamp = timestamp;
      
      // Continue animation
      autoAnimationId = requestAnimationFrame(autoAnimation);
    }
    
    function startAutoAnimation() {
      // Reset timestamp to avoid jumps
      lastTimestamp = 0;
      // Start animation loop
      autoAnimationId = requestAnimationFrame(autoAnimation);
    }
    
    // Start auto-animation initially
    startAutoAnimation();
  }

  // Initialize the carousel when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", initCarousel);