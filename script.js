 // Highlight current class based on time
    function highlightCurrentClass() {
      // Remove any existing highlights
      document.querySelectorAll('tr').forEach(row => {
        row.classList.remove('current-class');
      });
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = now.getDay(); // 0=Sunday, 1=Monday, etc.
      
      // Only highlight if viewing today's timetable
      const activeTab = document.querySelector('.tab.active');
      if (!activeTab) return;
      
      const activeDay = activeTab.textContent.toLowerCase().trim();
      const dayMap = {sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6};
      
      if (dayMap[activeDay] === currentDay) {
        const rows = document.querySelectorAll('.tab-content.active tbody tr');
        
        rows.forEach(row => {
          const timeCell = row.cells[0];
          if (timeCell.textContent.includes('-')) {
            const [startTime, endTime] = timeCell.textContent.split('-').map(t => t.trim());
            const [startHour, startMinute] = startTime.split(':').map(Number);
            let endHour, endMinute;
            
            // Handle 12-hour format if needed
            if (endTime.includes('AM') || endTime.includes('PM')) {
              const [time, period] = endTime.split(' ');
              [endHour, endMinute] = time.split(':').map(Number);
              if (period === 'PM' && endHour !== 12) endHour += 12;
              if (period === 'AM' && endHour === 12) endHour = 0;
            } else {
              [endHour, endMinute] = endTime.split(':').map(Number);
            }
            
            const currentTotalMinutes = currentHour * 60 + currentMinute;
            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;
            
            if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes) {
              row.classList.add('current-class');
              // Smooth scroll to current class
              setTimeout(() => {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 300);
            }
          }
        });
      }
    }
    
    // Update current time display
    function updateCurrentTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      
      const activeTab = document.querySelector('.tab.active');
      
      if (activeTab) {
        const activeDay = activeTab.textContent.toLowerCase().trim();
        const timeElement = document.getElementById(`${activeDay}-time`);
        if (timeElement) {
          timeElement.textContent = `${dateString} • ${timeString}`;
        }
      }
    }
    
    // Show selected day's content
    function showDay(day) {
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Remove active class from all tabs
      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.remove('holiday');
      });
      
      // Show selected day's content
      document.getElementById(day).classList.add('active');
      
      // Add active class to clicked tab
      event.currentTarget.classList.add('active');
      if (day === 'sunday') {
        event.currentTarget.classList.add('holiday');
      }
      
      // Update current class highlighting
      highlightCurrentClass();
      updateCurrentTime();
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
      // Auto-select today's tab
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = new Date().getDay();
      const todayTab = document.querySelector(`.tab:nth-child(${today + 1})`);
      if (todayTab) {
        todayTab.click();
        if (today === 0) { // Sunday
          todayTab.classList.add('holiday');
        }
      }
      
      // Initial updates
      updateCurrentTime();
      highlightCurrentClass();
      
      // Set up periodic updates
      setInterval(() => {
        updateCurrentTime();
        highlightCurrentClass();
      }, 60000); // Update every minute
      
      // Add animation to features on scroll
      const featureCards = document.querySelectorAll('.feature-card');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1 });
      
      featureCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
      });
    });
    
    
    