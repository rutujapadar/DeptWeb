// navbar
document.getElementById("menu-toggle").addEventListener("click", function() {
  document.getElementById("nav-links").classList.toggle("active");
});


// scroll effect
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});

// fculties cards
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".faculty-track");
  const cards = Array.from(document.querySelectorAll(".faculty-card"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentIndex = 0;
  const cardWidth = 280; // Card width + padding

  // Initialize the carousel
  function initCarousel() {
    // Set initial positions
    updateCarousel();

    // Set the first card as active on initial load
    cards[currentIndex].classList.add("active");
  }

  // Update the carousel position and active states
  function updateCarousel() {
    const centerOffset = (window.innerWidth * 0.8) / 2 - cardWidth / 2;
    const translateX = centerOffset - currentIndex * cardWidth;

    track.style.transform = `translateX(${translateX}px)`;

    // Update active class
    cards.forEach((card) => card.classList.remove("active"));
    cards[currentIndex].classList.add("active");

    // Enable/disable navigation buttons based on position
    prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";

    nextBtn.style.opacity = currentIndex === cards.length - 1 ? "0.5" : "1";
    nextBtn.style.pointerEvents =
      currentIndex === cards.length - 1 ? "none" : "auto";
  }

  // Event listeners for buttons
  prevBtn.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener("click", function () {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Handle window resize
  window.addEventListener("resize", updateCarousel);

  // Initialize the carousel
  initCarousel();
});

// student section
document.addEventListener("DOMContentLoaded", function () {
  // Batch switching functionality
  const batchButtons = document.querySelectorAll(".batch-btn");
  const batchContainers = document.querySelectorAll(".batch-container");

  // Initialize each batch's carousel
  const batches = ["batch1", "batch2", "batch3", "batch4"];
  batches.forEach((batchId) => {
    initStudentCarousel(batchId);
  });

  // Add event listeners to batch buttons
  batchButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const batchId = this.dataset.batch;

      // Update active button
      batchButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Show selected batch container
      batchContainers.forEach((container) => {
        container.classList.remove("active");
        if (container.id === batchId) {
          container.classList.add("active");

          // Reset the carousel position for the selected batch
          resetCarouselPosition(batchId);
        }
      });
    });
  });

  // Initialize the student carousel for a specific batch
  function initStudentCarousel(batchId) {
    const batchContainer = document.getElementById(batchId);
    const track = batchContainer.querySelector(".students-track");
    const cards = Array.from(track.querySelectorAll(".student-card"));
    const prevBtn = batchContainer.querySelector(".student-prev-btn");
    const nextBtn = batchContainer.querySelector(".student-next-btn");

    // Store current index in the track element using a data attribute
    track.dataset.currentIndex = 0;
    const cardWidth = 280; // Card width + padding

    // Initialize the first card as active
    if (cards.length > 0) {
      cards[0].classList.add("active");
    }

    // Update the carousel position
    function updateCarousel() {
      const currentIndex = parseInt(track.dataset.currentIndex);
      const centerOffset = (window.innerWidth * 0.8) / 2 - cardWidth / 2;
      const translateX = centerOffset - currentIndex * cardWidth;

      track.style.transform = `translateX(${translateX}px)`;

      // Update active class
      cards.forEach((card) => card.classList.remove("active"));
      if (cards[currentIndex]) {
        cards[currentIndex].classList.add("active");
      }

      // Enable/disable navigation buttons based on position
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
      prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";

      nextBtn.style.opacity = currentIndex === cards.length - 1 ? "0.5" : "1";
      nextBtn.style.pointerEvents =
        currentIndex === cards.length - 1 ? "none" : "auto";
    }

    // Event listeners for buttons
    prevBtn.addEventListener("click", function () {
      const currentIndex = parseInt(track.dataset.currentIndex);
      if (currentIndex > 0) {
        track.dataset.currentIndex = currentIndex - 1;
        updateCarousel();
      }
    });

    nextBtn.addEventListener("click", function () {
      const currentIndex = parseInt(track.dataset.currentIndex);
      if (currentIndex < cards.length - 1) {
        track.dataset.currentIndex = currentIndex + 1;
        updateCarousel();
      }
    });

    // Initial positioning
    updateCarousel();

    // Store the update function for later use
    track.updateCarousel = updateCarousel;
  }

  // Reset the carousel position for a batch
  function resetCarouselPosition(batchId) {
    const batchContainer = document.getElementById(batchId);
    const track = batchContainer.querySelector(".students-track");

    // Reset to first card
    track.dataset.currentIndex = 0;
    if (track.updateCarousel) {
      track.updateCarousel();
    }
  }

  // Handle window resize for all carousels
  window.addEventListener("resize", function () {
    batches.forEach((batchId) => {
      const batchContainer = document.getElementById(batchId);
      const track = batchContainer.querySelector(".students-track");
      if (track.updateCarousel) {
        track.updateCarousel();
      }
    });
  });
});

// achievement section

document.addEventListener("DOMContentLoaded", function () {
  // Achievement category switching functionality
  const categoryButtons = document.querySelectorAll(".category-btn");
  const achievementCategories = document.querySelectorAll(
    ".achievement-category"
  );

  // Add event listeners to category buttons
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const categoryId = this.dataset.category;

      // Update active button
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Show selected category
      achievementCategories.forEach((category) => {
        category.classList.remove("active");
        if (category.id === categoryId) {
          category.classList.add("active");

          // Reset animation
          resetCardAnimations(category);
        }
      });
    });
  });

  // Function to reset the card animations
  function resetCardAnimations(categoryElement) {
    const cards = categoryElement.querySelectorAll(".achievement-card");

    cards.forEach((card, index) => {
      // Remove the card temporarily from DOM
      card.style.animation = "none";

      // Force reflow
      void card.offsetWidth;

      // Add the animation back
      card.style.animation = "";
      card.style.animationName = "fadeInUp";
      card.style.animationDuration = "0.5s";
      card.style.animationFillMode = "forwards";
      card.style.animationDelay = `${0.1 + index * 0.2}s`;
    });
  }

  // Optional: Add scrolling effects for achievement cards when visible in viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  // Observe all achievement cards
  document.querySelectorAll(".achievement-card").forEach((card) => {
    observer.observe(card);
  });
});

// gallery

document.addEventListener("DOMContentLoaded", function () {
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close");

  // Open Lightbox
  galleryItems.forEach((img) => {
    img.addEventListener("click", function () {
      lightbox.style.display = "flex";
      lightboxImg.src = this.src;
    });
  });

  // Close Lightbox
  closeBtn.addEventListener("click", function () {
    lightbox.style.display = "none";
  });

  // Close Lightbox when clicking outside the image
  lightbox.addEventListener("click", function (e) {
    if (e.target !== lightboxImg) {
      lightbox.style.display = "none";
    }
  });
});
