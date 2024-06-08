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
 * main-menu accordion for mobile view
 */
const parentLi = document.querySelectorAll('.has-child > a')
parentLi.forEach(e => {
    e.addEventListener('pointerdown', () => {
        e.removeAttribute('href')
        let parentItem = (level) => level.closest('.has-child')
        let childMenu = (level) => level.closest('.has-child').querySelector('.mega-menu-container')
        parentItem(e).classList.toggle("open")
        parentLi.forEach(li => {
            if(parentItem(li) !== parentItem(e)) {
                parentItem(li).classList.remove('open')
                childMenu(li).style.maxHeight = null
            }
        });
        
        if(parentItem(e).classList.contains('open')) {
            childMenu(e).style.maxHeight = childMenu(e).scrollHeight + "px"
        } else {
            childMenu(e).style.maxHeight = null
        }
        
    })
});

/**
 * dynamic height of main-menu
 */
const othersHeight = document.querySelectorAll('.mm-header, .mm-footer')
let getHeights = 0
othersHeight.forEach(e => {
    getHeights += e.scrollHeight
    const elementStyle = window.getComputedStyle(e);
    getHeights += parseFloat(elementStyle.getPropertyValue('margin-top')) + parseFloat(elementStyle.getPropertyValue('margin-bottom'));
})
document.querySelector('.mobile-menu menu').style.setProperty('--othersHeight', `${getHeights}px`)

/**
* HAMBURGER & NAV
*/
let hamburger = document.querySelector('.hamburger-wrapper')
let hamburgerMenu = document.querySelector('.hamburger-menu')
let mainNav = document.querySelector('.mobile-menu')

hamburger.addEventListener('pointerdown', () => {
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
