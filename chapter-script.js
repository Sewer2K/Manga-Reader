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

// Get chapter ID from URL
const urlParams = new URLSearchParams(window.location.search);
const chapterId = urlParams.get('chapter');

// Mark the chapter as read
if (chapterId && !readChapters.includes(chapterId)) {
    readChapters.push(chapterId);
    localStorage.setItem('readChapters', JSON.stringify(readChapters));
}

// Fetch chapter pages
async function fetchChapterPages(chapterId) {
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://api.mangadex.org/at-home/server/${chapterId}`
    )}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const chapterData = JSON.parse(data.contents); // Parse the API response
        const pages = chapterData.chapter.data; // Array of page filenames

        // Display pages
        const pagesContainer = document.getElementById('pages');
        pagesContainer.innerHTML = ''; // Clear previous pages
        pages.forEach((page, index) => {
            const img = document.createElement('img');
            img.src = `${chapterData.baseUrl}/data/${chapterData.chapter.hash}/${page}`;
            img.alt = `Page ${index + 1}`;
            pagesContainer.appendChild(img);
        });
    } catch (error) {
        console.error('Error fetching chapter pages:', error);
    }
}

fetchChapterPages(chapterId);

// Navigation functionality
const prevChapterButton = document.getElementById('prev-chapter');
const nextChapterButton = document.getElementById('next-chapter');
const chapterSelect = document.getElementById('chapter-select');

const prevChapterButtonBottom = document.getElementById('prev-chapter-bottom');
const nextChapterButtonBottom = document.getElementById('next-chapter-bottom');
const chapterSelectBottom = document.getElementById('chapter-select-bottom');

// Add event listeners for navigation
prevChapterButton.addEventListener('click', goToPreviousChapter);
nextChapterButton.addEventListener('click', goToNextChapter);
prevChapterButtonBottom.addEventListener('click', goToPreviousChapter);
nextChapterButtonBottom.addEventListener('click', goToNextChapter);

chapterSelect.addEventListener('change', (e) => {
    window.location.href = `chapter.html?chapter=${e.target.value}`;
});

chapterSelectBottom.addEventListener('change', (e) => {
    window.location.href = `chapter.html?chapter=${e.target.value}`;
});

// Function to go to the previous chapter
function goToPreviousChapter() {
    const currentChapter = chapterSelect.value;
    const chapters = Array.from(chapterSelect.options);
    const currentIndex = chapters.findIndex(option => option.value === currentChapter);
    if (currentIndex > 0) {
        window.location.href = `chapter.html?chapter=${chapters[currentIndex - 1].value}`;
    }
}

// Function to go to the next chapter
function goToNextChapter() {
    const currentChapter = chapterSelect.value;
    const chapters = Array.from(chapterSelect.options);
    const currentIndex = chapters.findIndex(option => option.value === currentChapter);
    if (currentIndex < chapters.length - 1) {
        window.location.href = `chapter.html?chapter=${chapters[currentIndex + 1].value}`;
    }
}

// Populate chapter select dropdown
async function populateChapterSelect() {
    const mangaId = 'b0b721ff-c388-4486-aa0f-c2b0bb321512'; // Frieren manga ID
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://api.mangadex.org/manga/${mangaId}/feed?order[chapter]=asc&translatedLanguage[]=en`
    )}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const chapters = JSON.parse(data.contents).data; // Parse the API response

        chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.id;
            option.textContent = `Chapter ${chapter.attributes.chapter}`;
            chapterSelect.appendChild(option.cloneNode(true));
            chapterSelectBottom.appendChild(option);
        });

        // Set the selected chapter in the dropdown
        const currentChapterId = new URLSearchParams(window.location.search).get('chapter');
        chapterSelect.value = currentChapterId;
        chapterSelectBottom.value = currentChapterId;
    } catch (error) {
        console.error('Error fetching chapters:', error);
    }
}

populateChapterSelect();