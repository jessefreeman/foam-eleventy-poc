document.addEventListener("DOMContentLoaded", () => {
    const activeTag = new URLSearchParams(window.location.search).get('tag') || "all";
    console.log("activeTag", activeTag)
    document.querySelectorAll('.tag-button').forEach(btn => {
      // Create a URL object from the button's href
      const btnUrl = new URL(btn.href, window.location.origin);
      if (btnUrl.searchParams.get('tag') === activeTag) {
        btn.classList.add('active');
      }
    });
  });
  