
  // Function to load notices with optional filtering
  async function loadNotices(category = '', search = '') {
    try {
      let url = '/api/notices';
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      const notices = await response.json();
      
      const container = document.getElementById('notices-container');
      container.innerHTML = '';
      
      notices.forEach(notice => {
        const card = document.createElement('div');
        card.className = 'notice-card';
        card.dataset.category = notice.category;
        card.innerHTML = `
          <h3>📌 ${notice.title}</h3>
          <p>${notice.description}</p>
          <p><small>📅 ${notice.date} | 🏷 ${notice.category}</small></p>
        `;
        container.appendChild(card);
      });
      
    } catch (error) {
      console.error('Error loading notices:', error);
    }
  }

  // Initialize notices
  document.addEventListener('DOMContentLoaded', () => {
    loadNotices();
    
    // Search functionality
    document.getElementById('search').addEventListener('input', (e) => {
      const search = e.target.value.trim();
      const category = document.getElementById('categoryFilter').value;
      loadNotices(category, search);
    });
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      const category = e.target.value;
      const search = document.getElementById('search').value.trim();
      loadNotices(category, search);
    });
  });