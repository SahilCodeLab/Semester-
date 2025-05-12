 // Highlight current class based on time
    function highlightCurrentClass() {
      console.log('Running highlightCurrentClass');
      document.querySelectorAll('tr').forEach(row => {
        row.classList.remove('current-class');
      });

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = now.getDay();
      const currentTotalMinutes = currentHour * 60 + currentMinute;

      const activeTab = document.querySelector('.tab.active');
      if (!activeTab) {
        console.error('No active tab found. Highlighting aborted.');
        return;
      }

      const activeDay = activeTab.textContent.toLowerCase().trim();
      const dayMap = {
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6
      };

      if (dayMap[activeDay] !== currentDay) {
        console.log(`Active day (${activeDay}) does not match current day (${currentDay})`);
        return;
      }

      const activeContent = document.querySelector('.tab-content.active');
      if (!activeContent) {
        console.error('No active tab content found');
        return;
      }

      const table = activeContent.querySelector('table');
      if (table) {
        console.log(`Table width for ${activeDay}: ${table.offsetWidth}px`);
      }

      const rows = activeContent.querySelectorAll('tbody tr');
      if (rows.length === 0) {
        console.error('No table rows found in active tab content');
        return;
      }

      rows.forEach(row => {
        const timeCell = row.cells[0];
        const timeText = timeCell.textContent.trim();

        if (!timeText.includes('-')) {
          console.log(`Skipping row with invalid time format: ${timeText}`);
          return;
        }

        try {
          const [startTime, endTime] = timeText.split('-').map(t => t.trim());
          const [startHour, startMinute] = startTime.split(':').map(Number);
          let [endHour, endMinute] = endTime.split(':').map(Number);

          if (endTime === '4:00') {
            endHour = 16;
            endMinute = 0;
          }

          const startHour24 = startHour < 12 && startHour >= 1 ? startHour + 12 : startHour;
          const endHour24 = endHour < 12 && endHour >= 1 ? endHour + 12 : endHour;

          const startTotalMinutes = startHour24 * 60 + startMinute;
          const endTotalMinutes = endHour24 * 60 + endMinute;

          console.log(`Checking time slot: ${startTime} - ${endTime} ` +
            `(${startTotalMinutes} - ${endTotalMinutes} minutes) ` +
            `against current time: ${currentHour}:${currentMinute} ` +
            `(${currentTotalMinutes} minutes)`);

          if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes) {
            row.classList.add('current-class');
            console.log(`Highlighted row: ${timeText} on ${activeDay}`);
            setTimeout(() => {
              row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }
        } catch (error) {
          console.error(`Error parsing time for row: ${timeText}`, error);
        }
      });
    }

    // Update current time display in 12-hour format
    function updateCurrentTime() {
      console.log('Running updateCurrentTime');
      const now = new Date();
      const dateString = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

      const activeTab = document.querySelector('.tab.active');
      if (activeTab) {
        const activeDay = activeTab.textContent.toLowerCase().trim();
        const timeElement = document.getElementById(`${activeDay}-time`);
        if (timeElement) {
          timeElement.textContent = `${dateString} • ${timeString}`;
          console.log(`Updated time for ${activeDay}: ${dateString} • ${timeString}`);
        } else {
          console.error(`Time element not found for day: ${activeDay}`);
        }
      } else {
        console.error('No active tab found for time update');
      }
    }

    // Show selected day's content
    function showDay(day) {
      console.log(`Attempting to show day: ${day}`);
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });

      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.remove('holiday');
      });

      const selectedContent = document.getElementById(day);
      if (selectedContent) {
        selectedContent.classList.add('active');
        console.log(`Activated content for day: ${day}`);
      } else {
        console.error(`No content found for day: ${day}`);
        return;
      }

      const tab = document.querySelector(`.tab[onclick="showDay('${day}')"]`);
      if (tab) {
        tab.classList.add('active');
        if (day === 'sunday') {
          tab.classList.add('holiday');
        }
        console.log(`Activated tab for day: ${day}`);
      } else {
        console.error(`No tab found for day: ${day}`);
      }

      updateCurrentTime();
      highlightCurrentClass();
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function () {
      console.log('Initializing page');
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = new Date().getDay();
      let todayDay = days[today];

      if (!document.getElementById(todayDay)) {
        console.warn(`Content for today (${todayDay}) not found, falling back to Monday`);
        todayDay = 'monday';
      }

      const todayTab = document.querySelector(`.tab[onclick="showDay('${todayDay}')"]`);
      if (todayTab) {
        todayTab.classList.add('active');
        if (todayDay === 'sunday') {
          todayTab.classList.add('holiday');
        }
        console.log(`Setting initial day to: ${todayDay}`);
        showDay(todayDay);
      } else {
        console.error('No tabs found in the DOM, defaulting to Monday');
        const mondayTab = document.querySelector(`.tab[onclick="showDay('monday')"]`);
        if (mondayTab) {
          mondayTab.classList.add('active');
          showDay('monday');
        } else {
          console.error('No Monday tab found. Initialization failed.');
        }
      }

      updateCurrentTime();
      highlightCurrentClass();

      setInterval(() => {
        updateCurrentTime();
        highlightCurrentClass();
      }, 60000);

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

      console.log('Page initialized successfully');
    });
