/**
* infinite loop animation
*/
(function () {
    const $$ = (selectors)=>document.querySelectorAll(selectors);
    $$(".offer-wrapper").forEach((scroller) => {
        scroller.setAttribute("data-animated", true);
        
        const scrollerInner = scroller.querySelector(".offer-slider");
        const scrollerContent = Array.from(scrollerInner.children);
        
        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
        });
    });
})();

/**
* custom select
*/
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('select').forEach(select => {
        const container = document.createElement('div');
        container.classList.add('custom-select-container');
        select.style.display = 'none';
        
        const customSelect = document.createElement('div');
        customSelect.classList.add('custom-select');
        
        const selectedItem = document.createElement('div');
        selectedItem.classList.add('selected-item');
        customSelect.appendChild(selectedItem);
        
        const selectedItemImage = document.createElement('img');
        selectedItemImage.classList.add('selected-item-image');
        selectedItemImage.style.display = 'none';
        selectedItem.appendChild(selectedItemImage);
        
        const selectedItemText = document.createElement('span');
        selectedItemText.classList.add('selected-item-text');
        selectedItem.appendChild(selectedItemText);
        
        const arrow = document.createElement('span');
        arrow.classList.add('arrow');
        arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" stroke="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
        </svg>`;
        selectedItem.appendChild(arrow);
        
        const customOptions = document.createElement('div');
        customOptions.classList.add('custom-options');
        customSelect.appendChild(customOptions);
        
        container.appendChild(customSelect);
        select.parentNode.insertBefore(container, select);
        container.appendChild(select);
        
        const options = Array.from(select.options).map(option => {
            return {
                value: option.value,
                text: option.textContent,
                image: option.getAttribute('data-image'),
                selected: option.selected,
                disabled: option.disabled
            };
        });
        
        function renderCustomOptions() {
            customOptions.innerHTML = options.map(option => `
            <div class="custom-option ${option.selected ? 'selected' : ''}" data-value="${option.value}">
            ${option.image ? `<img src="${option.image}" alt="${option.text}">` : ''} 
            ${option.text}
            </div>
            `).join('');
        }
        
        function updateSelectedItem(value) {
            const selectedOption = options.find(option => option.value === value);
            if (selectedOption) {
                if (selectedOption.image) {
                    selectedItemImage.src = selectedOption.image;
                    selectedItemImage.alt = selectedOption.text;
                    selectedItemImage.style.display = 'inline';
                } else {
                    selectedItemImage.style.display = 'none';
                }
                selectedItemText.textContent = selectedOption.text;
            }
        }
        
        function updateSelectValue(value) {
            select.value = value;
            const event = new Event('change');
            select.dispatchEvent(event);
            
            updateSelectedItem(value);
            
            options.forEach(option => {
                option.selected = option.value === value;
            });
            renderCustomOptions();
        }
        
        renderCustomOptions();
        updateSelectedItem(select.value);
        
        selectedItem.addEventListener('click', () => {
            const rect = container.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            if (spaceBelow < customOptions.offsetHeight && spaceAbove > customOptions.offsetHeight) {
                container.classList.add('open-up');
            } else {
                container.classList.remove('open-up');
            }
            
            container.classList.toggle('active');
        });
        
        customOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.custom-option');
            if (option) {
                const value = option.getAttribute('data-value');
                updateSelectValue(value);
                container.classList.remove('active');
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                container.classList.remove('active');
            }
        });
    });
});


window.addEventListener('load', ()=> {
    let headerHeight = document.querySelector('header').offsetHeight;
    let wrapper = document.querySelector('.wrapper');
    wrapper.style.setProperty('--margin-top-main', `${headerHeight}px`);
});

document.addEventListener('DOMContentLoaded', ()=> {
    let navi = document.querySelector('header'),scrollTop = 0,maxPos = 180,threshold = 150, megaMenu = document.querySelectorAll('.the-menu > ul > li:not(.bundles)'), isHovering = false;
    window.addEventListener('scroll', ()=> {
        if (isHovering) return;
        let y = window.scrollY, speed = 0.05, pos = y * speed;
        pos = (y>scrollTop) ? maxPos : 0
        scrollTop = y;
        navi.style.transform = (y > threshold) ? `translate(0, -${pos}%)` : 'translate(0, 0)';
    });
    megaMenu.forEach(e => {
        e.addEventListener('mouseover', function() {
            isHovering = true;
            navi.style.transform = 'translate(0, 0)';
        });
        
        e.addEventListener('mouseout', function() {
            isHovering = false;
            let y = window.scrollY;
            let pos = (y > scrollTop) ? maxPos : 0;
            navi.style.transform = (y > threshold) ? `translate(0, -${pos}%)` : 'translate(0, 0)';
        });
    });

    // product options
    const optContainers = document.querySelectorAll('.has-options');
    optContainers.forEach(container => {
        const optLi = container.querySelectorAll('.product-options li:not(.more-options)');
        const optProduct = container.querySelectorAll('.the-options img');

        optLi.forEach(li => {
            li.addEventListener('click', (event) => {
                event.stopPropagation();
                const index = li.getAttribute('data-index');
                optLi.forEach(item => item.classList.remove('active'));
                optProduct.forEach(img => img.classList.remove('active'));
                li.classList.add('active');
                optProduct[index].classList.add('active');
            });
        });
    });

    // products out of screen
    const sectionContent = document.querySelector('.best-sellers-content .section-content');
    const productCards = document.querySelectorAll('.best-seller-cards .product-card');
    if(sectionContent) {
        function updateProductCardClasses() {
            const scrollLeft = sectionContent.scrollLeft;
            const clientWidth = sectionContent.clientWidth;

            productCards.forEach(card => {
                const cardRect = card.getBoundingClientRect();
                const sectionRect = sectionContent.getBoundingClientRect();

                const cardLeftVisible = Math.max(0, sectionRect.left - cardRect.left);
                const cardRightVisible = Math.max(0, cardRect.right - sectionRect.right);
                const cardWidth = cardRect.width;

                const visibleWidth = cardWidth - (cardLeftVisible + cardRightVisible);
                const visiblePercentage = visibleWidth / cardWidth;

                if (visiblePercentage < 0.8) {
                    card.classList.add('deactivated');
                } else {
                    card.classList.remove('deactivated');
                }
            });
        }
        updateProductCardClasses();
        sectionContent.addEventListener('scroll', updateProductCardClasses);
        window.addEventListener('resize', updateProductCardClasses);
    }

    // contact page toggles
    let queryUl = document.querySelector('.contact-content > ul'),
        queryLi = document.querySelectorAll('.contact-content > ul > li'),
        backBtn = document.querySelectorAll('.back2contact'),
        productID = document.querySelector('.product-query'),
        xtraQuery = document.querySelector('.query-form .additional-query'),
        xtraQueryBtn = document.querySelector('.other-box'),
        otherBox = document.querySelector('.additional-query:not(.product-query .additional-query)'),
        otherBoxOpener = document.querySelector('.additiona-box'),
        queryTitle = document.querySelector('#queryTitle');
    

    if(queryLi) {
        queryLi.forEach((e) => {
            e.addEventListener('click', ()=> {
                queryUl.classList.add('d-none');
                otherBoxOpener.classList.add('d-none');
                productID.classList.remove('d-none');
                queryTitle.innerHTML = e.querySelector('span').innerText;
            });
        });
    }
    
    if(backBtn) {
        backBtn.forEach((e) => {
            e.addEventListener('click', ()=> {
                queryUl.classList.remove('d-none');
                otherBoxOpener.classList.remove('d-none');
                productID.classList.add('d-none');
                otherBox.classList.add('d-none');
            });
        });
    }
    
    if(otherBoxOpener) {
        otherBoxOpener.addEventListener('click', ()=> {
            queryUl.classList.add('d-none');
            otherBoxOpener.classList.add('d-none');
            otherBox.classList.remove('d-none');
            queryTitle.innerHTML = this.innerText;
        });
    }

    if(xtraQueryBtn) {
        xtraQueryBtn.addEventListener('click', ()=> {
            xtraQuery.classList.remove('d-none');
            xtraQueryBtn.classList.add('d-none');
        });
    }
});
    
    

function updateDetailsState() {
    var screenWidth = window.innerWidth;
    var detailsElements = document.querySelectorAll('.footer-middle details');
    
    detailsElements.forEach(function(details) {
        if (screenWidth < 576) {
            details.removeAttribute('open');
        } else {
            details.setAttribute('open', 'open');
        }
    });
}

updateDetailsState();
window.addEventListener('resize', updateDetailsState);

/**
* HAMBURGER & NAV
*/
let hamburger = document.querySelector('.hamburger-wrapper')
let hamburgerMenu = document.querySelector('.hamburger-menu')
let mainNav = document.querySelector('.mobile-menu')

hamburger.addEventListener('pointerdown', (e) => {
    e.stopPropagation()
    hamburgerMenu.classList.toggle('animate')
    mainNav.classList.toggle('focus')
    document.body.classList.toggle('overlay')
})

document.addEventListener('pointerdown', e => {
    if (!e.target.closest('.mobile-menu')) {
        hamburgerMenu.classList.remove('animate')
        mainNav.classList.remove('focus')
        document.body.classList.remove('overlay')
    }
})

document.addEventListener('keydown', e => {
    if (e.key == "Escape") {
        hamburgerMenu.classList.remove('animate')
        mainNav.classList.remove('focus')
        document.body.classList.remove('overlay')
    }
});

document.addEventListener('DOMContentLoaded', () => {
    let mmTriger = document.querySelectorAll('.menu-item')
    mmTriger.forEach((t)=> {
        t.addEventListener('click', (e)=>{
            e.stopPropagation()
            const targetMenu = document.getElementById(e.currentTarget.dataset.target);
            const parentMenu = e.target.closest('.menu-level');

            if (targetMenu && parentMenu) {
                targetMenu.style.transform = 'translateX(0)';
                parentMenu.style.transform = 'translateX(-100%)';

                const title = e.target.textContent;
                const header = targetMenu.querySelector('.menu-header .menu-title');
                if (header) {
                    header.textContent = title;
                }
                targetMenu.dataset.previous = parentMenu.id;
            }
        })
    })

    let backBtn = document.querySelectorAll('.back-button')
    backBtn.forEach((b)=>{
        b.addEventListener('click', (e)=>{
            e.stopPropagation()
            const currentMenu = e.target.closest('.menu-level');
            const previousMenuId = currentMenu.dataset.previous;
            const previousMenu = document.getElementById(previousMenuId);

            if (currentMenu && previousMenu) {
                currentMenu.style.transform = 'translateX(100%)';
                previousMenu.style.transform = 'translateX(0)';
            }
        })
    })
});

// text limit
function applyTextLimit(className) {
    let isExpanded = false;
    function handleTextLimit(element) {
        const textLimit = parseInt(element.getAttribute('data-txt-limit')) || 100;
        const screenLimit = element.getAttribute('data-screen') ? parseInt(element.getAttribute('data-screen')) : null;
        const originalText = element.getAttribute('data-original-text') || element.innerText;

        if (!element.getAttribute('data-original-text')) {
            element.setAttribute('data-original-text', originalText);
        }

        if (screenLimit !== null && window.innerWidth > screenLimit) {
            element.innerText = originalText;
            const readMore = element.querySelector('.read-more');
            if (readMore) {
                readMore.remove();
            }
            return;
        }

        if (originalText.length <= textLimit) return;

        const truncatedText = originalText.slice(0, textLimit) + '...';
        element.innerText = truncatedText;

        const readMore = document.createElement('span');
        readMore.className = ['read-more'];
        readMore.style.cursor = 'pointer';
        readMore.innerHTML = `<br><br> Read more <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>`;

        readMore.addEventListener('click', function() {
            isExpanded = true;
            element.innerText = originalText;
            readMore.remove();
        });

        element.appendChild(readMore);
    }

    function applyToElements() {
        if (isExpanded) return;

        const elements = document.querySelectorAll(`.${className}`);
        elements.forEach(element => {
            handleTextLimit(element);
        });
    }

    applyToElements();

    if (document.querySelector(`.${className}[data-screen]`)) {
        window.addEventListener('resize', function() {
            applyToElements();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    applyTextLimit('text-limit');
});


// faq
let faqCards = document.querySelectorAll('.faq-card');
if(faqCards) {
    faqCards.forEach((e)=> {
        e.querySelector('h3').addEventListener('click', ()=>{
            if(e.classList.contains('active')) {
                e.classList.remove('active');
            }else {
                e.classList.add('active');
            }
        });
        let faqContent = e.querySelector('.faq-content');
        let originHeight = faqContent.style.maxHeight;
        faqContent.style.maxHeight = 'none';
        let contentHeight = faqContent.scrollHeight;
        faqContent.style.setProperty('--faq-maxHeight', `${contentHeight+200}px`);
        faqContent.style.maxHeight = originHeight;
    });
}

// product-Ctrl
const targetDiv = document.querySelector('.product-Ctrl');
if(targetDiv) {
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const isNearTop = scrollTop <= 150;
        const isAtBottom = (documentHeight - windowHeight - scrollTop) <= 0;
        if (isNearTop || isAtBottom) {
            targetDiv.classList.remove('active');
        } else {
            targetDiv.classList.add('active');
        }
    });
}


// pr-count
document.querySelectorAll('.pr-count').forEach(counter => {
    const minusButton = counter.querySelector('.minus');
    const plusButton = counter.querySelector('.plus');
    const countInput = counter.querySelector('.count');
    
    // Disable direct input editing
    countInput.addEventListener('keydown', (event) => {
        event.preventDefault();
    });

    // Update buttons state
    const updateButtons = () => {
        minusButton.disabled = countInput.value <= countInput.min;
        plusButton.disabled = countInput.value >= countInput.max;
    };

    // Initial check
    updateButtons();

    // Event listeners for buttons
    minusButton.addEventListener('click', () => {
        countInput.stepDown();
        updateButtons();
    });

    plusButton.addEventListener('click', () => {
        countInput.stepUp();
        updateButtons();
    });

    // In case the input value is changed programmatically
    countInput.addEventListener('change', updateButtons);
});


// swipers
const swipers = document.querySelectorAll(".hiSmile-swiper");
swipers.forEach((swp) => {
    new Swiper(swp, {
        spaceBetween: 30,
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        speed: 200,
        navigation: {
            nextEl: swp.querySelector(".swiper-button-next"),
            prevEl: swp.querySelector(".swiper-button-prev"),
        },
    });
});