
  // Function to load students by batch
  async function loadStudents(batch) {
    try {
      const response = await fetch(`/api/students/${batch}`);
      const students = await response.json();
      
      const container = document.getElementById('students-content');
      container.innerHTML = `
        <button class="scroll-btn student-prev-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="students-track-container">
          <div class="students-track">
            ${students.map(student => `
              <div class="student-card">
                <div class="card-inner">
                  <img src="${student.photo_url || '/assets/images/faculty-placeholder.jpg'}" 
                       alt="${student.name}" />
                  <h3>${student.name}</h3>
                  <p>Roll: ${student.roll_number}</p>
                  ${student.cgpa ? `<p>CGPA: ${student.cgpa}</p>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <button class="scroll-btn student-next-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
      `;
      
      // Initialize carousel functionality
      initStudentCarousel();
      
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  // Initialize with first batch
  document.addEventListener('DOMContentLoaded', () => {
    loadStudents('2022-26');
    
    // Batch button event listeners
    document.querySelectorAll('.batch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.batch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadStudents(btn.dataset.batch);
      });
    });
  });

  // Carousel functionality
  function initStudentCarousel() {
    const track = document.querySelector('.students-track');
    const prevBtn = document.querySelector('.student-prev-btn');
    const nextBtn = document.querySelector('.student-next-btn');
    
    if (!track) return;
    
    let currentPosition = 0;
    const cardWidth = 300; // Adjust based on your CSS
    const visibleCards = 4; // Number of cards visible at once
    
    prevBtn.addEventListener('click', () => {
      currentPosition = Math.min(currentPosition + cardWidth, 0);
      track.style.transform = `translateX(${currentPosition}px)`;
    });
    
    nextBtn.addEventListener('click', () => {
      const maxPosition = -((track.children.length - visibleCards) * cardWidth);
      currentPosition = Math.max(currentPosition - cardWidth, maxPosition);
      track.style.transform = `translateX(${currentPosition}px)`;
    });
  }
