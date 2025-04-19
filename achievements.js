
// Function to load achievements by category
async function loadAchievements(category) {
  try {
    const response = await fetch(`/api/achievements/${category}`);
    const achievements = await response.json();
    
    const container = document.getElementById('achievements-container');
    container.innerHTML = `
      <div class="achievement-category active">
        <div class="achievement-cards">
          ${achievements.map(achievement => `
            <div class="achievement-card">
              <div class="achievement-icon">
                <i class="${achievement.icon_class || 'fas fa-trophy'}"></i>
              </div>
              <div class="achievement-content">
                <h3>${achievement.title}</h3>
                <p class="achievement-date">${new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                <p class="achievement-desc">${achievement.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
}

// Initialize with first category
document.addEventListener('DOMContentLoaded', () => {
  loadAchievements('department');
  
  // Category button event listeners
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadAchievements(btn.dataset.category);
    });
  });
});
