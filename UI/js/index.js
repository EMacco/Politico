const toggleMenu = chkBtn => {
  const overlay = document.getElementById('overlay');
  overlay.style.display = chkBtn.checked ? 'block' : 'none';

  // Make it not to be scrollable
  const content = document.getElementById('user-home-main');
  if (chkBtn.checked) {
    content.classList.add('makeUnscrollable');
  } else {
    content.classList.remove('makeUnscrollable');
  }
};
