const body = document.body;
const toggleClass = "is-sticky";


function open() {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 0) {
    body.classList.add(toggleClass);
  } else {
    body.classList.remove(toggleClass);
  }
}

window.addEventListener("scroll", () => {
  open();
});

window.addEventListener('load', function(event) {
  window.setTimeout(() => {
    body.classList.add('loaded');
  }, 300);
  
});