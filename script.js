// Open the modal and show the clicked image
function openModal(img) {
    var modal = document.getElementById("imageModal");
    var modalImg = document.getElementById("modalImage");
    var captionText = document.getElementById("caption");

    // Only open lightbox on desktop screens (1024px and wider)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    // If the image is inside a link to another page, don't open the lightbox.
    var parentLink = img.closest && img.closest('a');
    if (parentLink) {
        var ah = parentLink.getAttribute('href') || '';
        if (ah && !ah.startsWith('#') && !ah.startsWith('javascript:')) return;
    }

    // Ensure modal is visible using both class and style (robust to CSS changes)
    if (modal.classList) modal.classList.add('open');
    modal.style.display = "flex";  // Display the modal
    modalImg.src = img.src;  // Set the image source of the modal to the clicked image
    captionText.innerHTML = img.alt || '';  // Show the alt text as caption
}

// Close the modal
function closeModal() {
    var modal = document.getElementById("imageModal");
    if (modal.classList) modal.classList.remove('open');
    modal.style.display = "none";  // Hide the modal
}

// Add Escape key functionality to close the modal
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal(); // Close the modal if Escape is pressed
    }
});

// Responsive slider implementation
document.addEventListener('DOMContentLoaded', function () {
    // Ensure modal is closed on page load and close it when any anchor is clicked
    var modalEl = document.getElementById('imageModal');
    if (modalEl) { modalEl.classList.remove('open'); modalEl.style.display = 'none'; }
    document.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { if (modalEl) { modalEl.classList.remove('open'); modalEl.style.display = 'none'; } }));

    const wrapper = document.querySelector('.slider-wrapper');
    const track = document.querySelector('.slider-track');
    // `track` is the scrollable element now. Use `scrollContainer` when scrolling.
    const scrollContainer = track;
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (!wrapper || !track || slides.length === 0) return;

    let index = 0;
    // For full-width slides, derive width from wrapper
    let slideWidth = scrollContainer.clientWidth;
    let gap = parseInt(getComputedStyle(track).gap) || 12;
    let isPointerDown = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslateValue = 0;
    let activePointerId = null;
    let wasDragging = false;

    function updateMeasurements() {
        slideWidth = scrollContainer.clientWidth;
        gap = parseInt(getComputedStyle(track).gap) || 12;
        slides.forEach(s => s.style.width = `${slideWidth}px`);
    }

    function moveToIndex(i) {
        const maxIndex = Math.max(0, slides.length - 1);
        index = Math.min(Math.max(0, i), maxIndex);
        // account for track's left padding when calculating target scroll
        const trackStyle = getComputedStyle(track);
        const trackPaddingLeft = parseInt(trackStyle.paddingLeft) || 0;
        const target = index * slideWidth - trackPaddingLeft;
        scrollContainer.scrollTo({ left: target, behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', () => moveToIndex(index - 1));
    nextBtn.addEventListener('click', () => moveToIndex(index + 1));

    // Recalculate on resize
    window.addEventListener('resize', () => {
        updateMeasurements();
        moveToIndex(index);
    });

    // Enable keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') moveToIndex(index - 1);
        if (e.key === 'ArrowRight') moveToIndex(index + 1);
    });

    // Optional: click any image inside slides to open modal
    slides.forEach(sl => {
        const imgs = Array.from(sl.querySelectorAll('img'));
        imgs.forEach(img => {
            img.addEventListener('click', (e) => {
                openModal(img);
            });
        });
    });

    // Update index on native scroll (throttle) from the scrollable track
    let scrollTimeout = null;
    scrollContainer.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            index = Math.round(scrollContainer.scrollLeft / slideWidth);
        }, 80);
    });

    // initial layout
    updateMeasurements();
    moveToIndex(0);
});
