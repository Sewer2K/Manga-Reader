// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Load dark mode preference from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.dataset.theme = savedTheme;
    darkModeToggle.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
} else {
    darkModeToggle.textContent = '🌙 Dark Mode'; // Default text
}

darkModeToggle.addEventListener('click', () => {
    const newTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    body.dataset.theme = newTheme;
    darkModeToggle.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('theme', newTheme); // Save preference
});

// Track read chapters
const readChapters = JSON.parse(localStorage.getItem('readChapters')) || [];

// Fetch manga chapters (English only)
async function fetchMangaChapters() {
    const mangaId = 'b0b721ff-c388-4486-aa0f-c2b0bb321512'; // Frieren manga ID
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://api.mangadex.org/manga/${mangaId}/feed?order[chapter]=asc&translatedLanguage[]=en`
    )}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const chapters = JSON.parse(data.contents).data; // Parse the API response

        // Filter unique chapters (remove duplicates)
        const uniqueChapters = chapters.reduce((acc, chapter) => {
            if (!acc.some(c => c.attributes.chapter === chapter.attributes.chapter)) {
                acc.push(chapter);
            }
            return acc;
        }, []);

        // Display chapters
        const chaptersContainer = document.getElementById('chapters');
        uniqueChapters.forEach(chapter => {
            const chapterLink = document.createElement('a');
            chapterLink.href = `chapter.html?chapter=${chapter.id}`;
            chapterLink.textContent = `Chapter ${chapter.attributes.chapter}`;
            chapterLink.classList.add('chapter-link');

            // Check if the chapter has been read
            if (readChapters.includes(chapter.id)) {
                chapterLink.classList.add('read');
            }

            // Add click event to mark chapter as read
            chapterLink.addEventListener('click', () => {
                if (!readChapters.includes(chapter.id)) {
                    readChapters.push(chapter.id);
                    localStorage.setItem('readChapters', JSON.stringify(readChapters));
                }
            });

            chaptersContainer.appendChild(chapterLink);
        });

        // Populate chapter select dropdown
        const chapterSelectHome = document.getElementById('chapter-select-home');
        uniqueChapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.id;
            option.textContent = `Chapter ${chapter.attributes.chapter}`;
            chapterSelectHome.appendChild(option);
        });

        // Add event listener for chapter select dropdown
        chapterSelectHome.addEventListener('change', (e) => {
            const selectedChapterId = e.target.value;
            if (selectedChapterId) {
                window.location.href = `chapter.html?chapter=${selectedChapterId}`;
            }
        });
    } catch (error) {
        console.error('Error fetching manga chapters:', error);
    }
}

fetchMangaChapters();