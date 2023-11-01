const lightbox = (GLightbox)? GLightbox({ width: '100vw' }) : null;
const lazyLoadInstance = new LazyLoad({});



var lastScrollTop;

function scrollToStart() {
    var elm = document.querySelector('#start');
    elm.scrollIntoView({behavior: 'smooth'});
}

function scrollToTop() {
    var elm = document.querySelector('body');
    elm.scrollIntoView({behavior: 'smooth'});
}


window.addEventListener('load', function(event) {
    window.setTimeout(() => {
        initLightBox();
    }, 100);
    
});


function initLightBox() {
    const items = document.querySelectorAll('img[lightbox]');

    //console.log('init lightbox', items)

    items.forEach((i, n) => {
        lightbox.insertSlide({
            href: i.getAttribute('data-src')
        });

        i.addEventListener('click', () => {
            lightbox.openAt(n);
        });
    });
}



window.addEventListener("scroll", () => {
    const contentTop = (window.scrollY - window.innerHeight);
    const contentPos = contentTop - 500;


    setSidebar(contentTop);

    if (contentTop > 0) {
        document.body.classList.add('cnt-top-zone');
    } else {
        document.body.classList.remove('cnt-top-zone');
    }

    


    if (contentPos > 0) {
        document.body.classList.add('cnt-zone');
    } else {
        document.body.classList.remove('cnt-zone');
    }

    var scrollUP;

    if (window.scrollY > this.lastScrollTop || 0) {
        scrollUP = false;
    } else if (window.scrollY < this.lastScrollTop) {
        scrollUP = true;
    }    

    lastScrollTop = window.scrollY;

    // if (scrollUP && (contentPos+500) < -200) {
    //     scrolling = true;
    //     console.log('schib nach ofben: ' + contentPos);
    // }

    // console.log('scroll: ' + contentPos);
});


var sectionId = null;
const chapterMap = {};
const sidebarCntx = {};

function setSidebar(pageTop, scrlY) {
    const regions = document.querySelectorAll("a.anch");
    var scrollPosition = window.scrollY;
    var windowSize     = window.innerHeight;
    var bodyHeight     = document.body.offsetHeight;   
    const scollDistance = Math.max(bodyHeight - (scrollPosition + windowSize), 0);


    regions.forEach((r, i) => {
        const id = r.getAttribute('id');
        const top = r.offsetTop;
        const bottom = (i < (regions.length - 1)) ? regions[i+1].offsetTop : document.body.scrollHeight;
        const active = (pageTop >= (top-50) && pageTop <= (bottom-50));
        const lastItem = (i == (regions.length-1));

        sidebarCntx[id] = {
            id: id,
            top: top,
            bottom: bottom,
            height: bottom - r.offsetTop,
            active: (scollDistance < 10 && lastItem)? true : active,
            last: lastItem
        }

        const elm = document.querySelector('.sidebar a[href="#' + id + '"]');

        if (elm) {
            if (active) {
                elm.classList.add("active");
            } else {
                elm.classList.remove("active");
            }
        }
    });


    const activeItems = Object.values(sidebarCntx).filter(i => i.active)
                              .sort((a, b) => a.bottom - b.bottom);
      

    if (activeItems.length > 1) {
        // console.log('active items', activeItems)

        const lastITM = activeItems.find(i => i.last);

        activeItems.forEach((sb, i) => {
            const elm = document.querySelector('.sidebar a[href="#' + sb.id + '"]');
            if (lastITM) {
                // console.log('lastITM', lastITM)
                // console.log('lastITM-elm', sb)
                if (sb.last) {
                    elm.classList.add("active");
                } else {
                    elm.classList.remove("active");
                }
            } else {
                if (i == 0) {
                    elm.classList.add("active");
                } else {
                    elm.classList.remove("active");
                }
            }
        });
    }

    // console.log('page top: ' + pageTop + ' scrollY: ' + scollDistance);
    //console.log('sidebarContext', );
}

function navHighlighter(topPoint) {
    let scrollY = window.scrollY;
    const sections = document.querySelectorAll("a[id]");

    const chapter = getCurrentChapter(chapterMap, topPoint);


   
    sections.forEach(current => {
      const sectionTop = current.offsetTop - 50;
      sectionId = current.getAttribute("id");
      if (!chapterMap[sectionId]) chapterMap[sectionId] = {top:sectionTop};

      const elm = document.querySelector('.sidebar a[href="#' + sectionId + '"]');

      if (elm)
      {   
        // console.log(chapter + ' -- ' + sectionId);

        if (chapter === sectionId) {
            elm.classList.add("active");
        } else {
            elm.classList.remove("active");
        }
      }

    });
}
  

function getCurrentChapter(map, X) { 
    let item = null;
    let closestDifference = 10000000; 


    for(const i in map) {
        const currentDifference = Math.abs(X - map[i].top);
  
        if (currentDifference < closestDifference) {
          item = i;
          closestDifference = currentDifference;
        }
    }

  
  
    return item;
}



function toggleSidebar() {

    const sidebar = document.querySelector('.sidebar');

    const isOpen = sidebar.classList.contains('open');

    // console.log('is open: ', isOpen)
    

    if (!isOpen) {
        sidebar.classList.add('open');
    } else {
        sidebar.classList.remove('open');
    }  

}