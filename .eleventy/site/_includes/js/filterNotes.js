const urlParams = new URLSearchParams(window.location.search);
const tag = urlParams.get('tag');
if (tag) {
  document.querySelectorAll('.note').forEach(note => {
    const noteTags = note.getAttribute('data-tags').split(',');
    if (!noteTags.includes(tag)) {
      note.style.display = 'none';
    }
  });
}
