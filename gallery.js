
      // Function to load gallery images
      async function loadGallery() {
        try {
          const response = await fetch('/api/gallery');
          const galleryItems = await response.json();
          
          const container = document.getElementById('gallery-container');
          container.innerHTML = '';
          
          galleryItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
              <img src="${item.image_url}" alt="${item.alt_text || 'ECE Event'}" />
            `;
            container.appendChild(galleryItem);
          });
          
          // Initialize lightbox functionality
          initLightbox();
          
        } catch (error) {
          console.error('Error loading gallery:', error);
        }
      }
    
      // Initialize lightbox
      function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox .close');
        
        document.querySelectorAll('.gallery-item img').forEach(img => {
          img.addEventListener('click', function() {
            lightbox.style.display = 'block';
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
          });
        });
        
        closeBtn.addEventListener('click', function() {
          lightbox.style.display = 'none';
        });
        
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox) {
            lightbox.style.display = 'none';
          }
        });
      }
    
      // Initialize gallery
      document.addEventListener('DOMContentLoaded', loadGallery);
    