// Real Estate Website - Main JavaScript
// Bilingual (English/Farsi) functionality

class RealEstateApp {
    constructor() {
        this.properties = [];
        // Default to 'fa' (Dari) if no preference saved
        this.currentLanguage = localStorage.getItem('language') || 'fa';
        this.isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        this.serverConnected = false;
        this.serverStatusChecked = false;
        this.init();
    }

    async init() {
        // Set initial direction based on language
        document.documentElement.setAttribute('dir', this.currentLanguage === 'fa' ? 'rtl' : 'ltr');

        // Setup theme/language immediately
        this.setupTheme();
        this.setupLanguageSwitching();

        // Load properties from static JSON
        await this.loadProperties();

        this.setupNavigation();
        this.initializePage();
        this.setupAnimations();
    }

    // Fetch with timeout helper
    async fetchWithTimeout(url, options = {}, timeout = 15000) { // Increased default to 15s
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - server took too long to respond');
            }
            throw error;
        }
    }

    // Property Data Management
    // Property Data Management
    async loadProperties() {
        try {
            console.log('[RealEstateApp] Fetching properties from static JSON...');
            // Fetch from the new static location
            const response = await fetch('/data/listings.json');

            if (!response.ok) {
                throw new Error(`Failed to load listings: ${response.status}`);
            }

            const data = await response.json();
            this.properties = data.properties || [];
            console.info('[RealEstateApp] Loaded properties:', this.properties.length);
        } catch (error) {
            console.error('[RealEstateApp] Error loading properties:', error);
            // Minimal fallback to avoid white screen if JSON fails
            this.properties = [];
        }
    }


    // Language Management
    setupLanguageSwitching() {
        const langButtons = document.querySelectorAll('[data-lang]');
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = button.getAttribute('data-lang');
                this.switchLanguage(newLang);
            });
        });
    }

    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');

        // Initial check - Default to DARK if no preference
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme')); // Default to dark when clean slate

        if (isDark) {
            document.documentElement.classList.add('dark');
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIcon) moonIcon.classList.add('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDarkMode = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

                if (isDarkMode) {
                    if (sunIcon) sunIcon.classList.remove('hidden');
                    if (moonIcon) moonIcon.classList.add('hidden');
                } else {
                    if (sunIcon) sunIcon.classList.add('hidden');
                    if (moonIcon) moonIcon.classList.remove('hidden');
                }
            });
        }
    }

    updateAdminStats() {
        const totalEl = document.getElementById('stats-total-properties');
        const availEl = document.getElementById('stats-available-properties');
        const soldEl = document.getElementById('stats-sold-properties');
        const revenueEl = document.getElementById('stats-revenue');

        if (!totalEl && !availEl && !soldEl && !revenueEl) return;

        const total = this.properties.length;
        const available = this.properties.filter(p => (p.status || '').toLowerCase() === 'available').length;
        const sold = this.properties.filter(p => (p.status || '').toLowerCase() === 'sold').length;

        // Revenue requested to be zero for now (display in Afghani)
        const revenueText = '؋0';

        if (totalEl) totalEl.textContent = total;
        if (availEl) availEl.textContent = available;
        if (soldEl) soldEl.textContent = sold;
        if (revenueEl) revenueEl.textContent = revenueText;
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);

        // Redirect to appropriate page
        const currentPage = window.location.pathname.split('/').pop();
        const basePage = currentPage.replace('-fa.html', '').replace('.html', '');
        const queryParams = window.location.search; // Preserve query params

        let targetPage;
        if (lang === 'fa') {
            targetPage = basePage === 'index' || basePage === '' ? 'index-fa.html' :
                basePage === 'listings' ? 'listings-fa.html' :
                    basePage === 'details' ? 'details-fa.html' : 'index-fa.html';
        } else {
            targetPage = basePage === 'index' || basePage === '' ? 'index.html' :
                basePage === 'listings' ? 'listings.html' :
                    basePage === 'details' ? 'details.html' : 'index.html';
        }

        window.location.href = targetPage + queryParams;
    }

    // Navigation Setup
    setupNavigation() {
        const navLinks = document.querySelectorAll('[data-nav]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const navType = link.getAttribute('data-nav');
                if (navType === 'admin') {
                    e.preventDefault();
                    this.showAdminLogin();
                }
            });
        });
    }

    // Page Initialization
    initializePage() {
        const page = this.getCurrentPage();

        switch (page) {
            case 'index':
                this.initHomepage();
                break;
            case 'listings':
                this.initListings();
                break;
            case 'details':
                this.initDetails();
                break;
            case 'admin':
                this.initAdmin();
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('listings')) return 'listings';
        if (path.includes('details')) return 'details';
        if (path.includes('admin')) return 'admin';
        return 'index';
    }

    // Homepage Initialization
    initHomepage() {
        this.setupHeroCarousel();
        this.displayFeaturedProperties();
        this.setupQuickSearch();
        this.setupOfficeMap();
    }

    setupOfficeMap() {
        const mapContainer = document.getElementById('office-map');
        if (!mapContainer) return;

        const loadMap = () => {
            if (mapContainer.dataset.loaded) return;
            mapContainer.dataset.loaded = 'true';

            // Visual indicator
            mapContainer.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><p>Loading Map...</p></div>';

            this.loadGoogleMaps().then(() => {
                const officeCoords = { lat: 33.138714, lng: 67.4385 };
                const mapOptions = {
                    center: officeCoords,
                    zoom: 16,
                    mapTypeId: 'roadmap',
                    streetViewControl: true,
                    mapTypeControl: true
                };

                const map = new google.maps.Map(mapContainer, mapOptions);

                const marker = new google.maps.Marker({
                    position: officeCoords,
                    map: map,
                    title: this.currentLanguage === 'fa' ? 'دفتر املاک امانت' : 'Amanat Properties Office'
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<div class="p-2 text-center">
                        <h3 class="font-bold">${this.currentLanguage === 'fa' ? 'دفتر املاک امانت' : 'Amanat Properties Office'}</h3>
                        <p class="text-sm">${this.currentLanguage === 'fa' ? 'سنگی‌مشا، جاغوری، ولایت غزنی' : 'Sangi-e-Masha, Jaghuri, Ghazni'}</p>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=33.138714,67.4385" target="_blank" class="text-orange-600 font-bold block mt-2">
                            ${this.currentLanguage === 'fa' ? 'دریافت آدرس' : 'Get Directions'}
                        </a>
                    </div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            }).catch(e => {
                console.error('Map load failed', e);
                mapContainer.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-red-50 text-red-500"><p>Map failed to load.</p></div>';
            });
        };

        // Use IntersectionObserver to lazy load
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadMap();
                        observer.disconnect();
                    }
                });
            }, { rootMargin: '200px' });
            observer.observe(mapContainer);
        } else {
            // Fallback for very old browsers
            loadMap();
        }
    }

    loadGoogleMaps() {
        if (window.google && window.google.maps) return Promise.resolve();
        if (this.mapsLoadingPromise) return this.mapsLoadingPromise;

        this.mapsLoadingPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const apiKey = 'REDACTED_API_KEY';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMapsCallback`;
            script.async = true;
            script.defer = true;
            window.initMapsCallback = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        });
        return this.mapsLoadingPromise;
    }

    setupHeroCarousel() {
        const heroImages = [
            'images/hero_1.webp',
            'images/hero_2.webp',
            'images/hero_3.webp',
            'images/hero_4.webp',
            'images/hero_5.webp',
            'images/hero_6.webp',
            'images/hero_7.webp'
        ];
        const heroContainer = document.getElementById('hero-carousel');

        if (heroContainer) {
            let currentIndex = 0;

            const updateHero = () => {
                heroContainer.style.backgroundImage = `url('${heroImages[currentIndex]}')`;
                heroContainer.style.backgroundSize = 'cover';
                heroContainer.style.backgroundPosition = 'center';
                currentIndex = (currentIndex + 1) % heroImages.length;
            };

            updateHero();
            setInterval(updateHero, 5000);
        }
    }

    displayFeaturedProperties() {
        const container = document.getElementById('featured-properties');
        if (!container) return;

        // Show most recent listings first based on date_added
        const sortedByDate = [...this.properties].sort((a, b) => {
            const da = a.date_added ? new Date(a.date_added) : new Date(0);
            const db = b.date_added ? new Date(b.date_added) : new Date(0);
            return db - da;
        });

        const featured = sortedByDate.slice(0, 4);

        if (featured.length === 0) {
            const msg = this.currentLanguage === 'fa'
                ? 'در حال حاضر ملکی برای نمایش در لیست‌های ویژه موجود نیست.'
                : 'No properties are available to feature yet.';
            container.innerHTML = `<div class="col-span-full text-center text-gray-500 py-8">${msg}</div>`;
            return;
        }

        container.innerHTML = featured.map(property => this.createPropertyCard(property)).join('');

        // Make featured cards clickable to go to details
        const cards = container.querySelectorAll('.property-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const prop = featured[index];
                if (prop && prop.id) {
                    window.location.href = `details.html?id=${prop.id}`;
                }
            });
        });
    }

    setupQuickSearch() {
        const priceRange = document.getElementById('quick-price-range');
        const searchBtn = document.getElementById('quick-search-btn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const minPrice = priceRange ? priceRange.value : 0;
                window.location.href = `listings.html?minPrice=${minPrice}`;
            });
        }
    }

    // Listings Page Initialization
    initListings() {
        this.setupFilters();
        // Default sort: newest first
        this.sortProperties('date-new');
        this.setupSorting();
    }

    setupFilters() {
        const priceSlider = document.getElementById('price-slider');
        const typeFilters = document.querySelectorAll('[data-filter="type"]');
        const applyFilters = document.getElementById('apply-filters');

        if (applyFilters) {
            applyFilters.addEventListener('click', () => {
                this.applyFilters();
            });
        }
    }

    displayProperties(filteredProperties = null) {
        const container = document.getElementById('properties-grid');
        if (!container) return;
        const isFiltered = Array.isArray(filteredProperties);
        const properties = isFiltered ? filteredProperties : this.properties;
        console.info('[RealEstateApp] displayProperties called — container:', !!container, 'properties count:', properties.length, 'filtered:', isFiltered);

        // Empty / no-results states
        if (!properties || properties.length === 0) {
            let msg;
            if (this.currentLanguage === 'fa') {
                msg = isFiltered
                    ? 'هیچ ملکی با فیلترهای انتخاب شده یافت نشد.'
                    : 'در حال حاضر ملکی برای نمایش موجود نیست.';
            } else {
                msg = isFiltered
                    ? 'No properties match your current filters.'
                    : 'No properties are available to display yet.';
            }
            container.innerHTML = `<div class="col-span-full text-center text-gray-500 py-8">${msg}</div>`;

            // Update properties count if present
            const countEl = document.getElementById('properties-count');
            if (countEl) {
                countEl.textContent = this.currentLanguage === 'fa'
                    ? (0).toLocaleString('fa-AF')
                    : '0';
            }
            return;
        }

        container.innerHTML = properties.map(property => this.createPropertyCard(property)).join('');

        // Add click listeners to property cards
        const cards = container.querySelectorAll('.property-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                window.location.href = `details.html?id=${properties[index].id}`;
            });
        });

        // Update properties count if present (listings pages)
        const countEl = document.getElementById('properties-count');
        if (countEl) {
            const count = properties.length;
            countEl.textContent = this.currentLanguage === 'fa'
                ? count.toLocaleString('fa-AF')
                : String(count);
        }
    }

    applyFilters() {
        const minPrice = document.getElementById('min-price')?.value || 0;
        const maxPrice = document.getElementById('max-price')?.value || Infinity;
        const selectedTypes = Array.from(document.querySelectorAll('[data-filter="type"]:checked')).map(cb => cb.value);
        const selectedBedroomRadio = document.querySelector('[name="bedrooms"]:checked');
        const bedroomValue = selectedBedroomRadio ? selectedBedroomRadio.value : '0';

        let filtered = this.properties.filter(property => {
            const priceMatch = property.price >= minPrice && property.price <= maxPrice;
            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(property.type);

            const typeLower = (property.type || '').toLowerCase();
            const isLandOrCommercial = typeLower === 'land' || typeLower === 'commercial';

            let bedroomsMatch = true;
            const propBeds = typeof property.bedrooms === 'number' ? property.bedrooms : 0;

            if (!isLandOrCommercial && bedroomValue && bedroomValue !== '0') {
                const requiredBeds = parseInt(bedroomValue, 10);
                if (requiredBeds === 4) {
                    bedroomsMatch = propBeds >= 4;
                } else {
                    bedroomsMatch = propBeds === requiredBeds;
                }
            }

            return priceMatch && typeMatch && bedroomsMatch;
        });

        // Build a simple active filters summary
        const filtersEl = document.getElementById('active-filters');
        if (filtersEl) {
            const parts = [];
            if (selectedTypes.length > 0) {
                if (this.currentLanguage === 'fa') {
                    parts.push(`نوع: ${selectedTypes.join(', ')}`);
                } else {
                    parts.push(`Type: ${selectedTypes.join(', ')}`);
                }
            }
            const minVal = document.getElementById('min-price')?.value;
            const maxVal = document.getElementById('max-price')?.value;
            if (minVal || maxVal) {
                if (this.currentLanguage === 'fa') {
                    const minText = minVal ? `${parseInt(minVal, 10).toLocaleString('fa-AF')}؋` : '۰؋';
                    const maxText = maxVal ? `${parseInt(maxVal, 10).toLocaleString('fa-AF')}؋` : 'بدون محدودیت';
                    parts.push(`قیمت: ${minText} تا ${maxText}`);
                } else {
                    const minText = minVal ? `؋${minVal}` : '؋0';
                    const maxText = maxVal ? `؋${maxVal}` : 'No limit';
                    parts.push(`Price: ${minText} – ${maxText}`);
                }
            }
            if (bedroomValue && bedroomValue !== '0') {
                if (this.currentLanguage === 'fa') {
                    const bedText = bedroomValue === '4'
                        ? '۴+'
                        : parseInt(bedroomValue, 10).toLocaleString('fa-AF');
                    parts.push(`اتاق خواب: ${bedText}`);
                } else {
                    const bedText = bedroomValue === '4' ? '4+' : bedroomValue;
                    parts.push(`Bedrooms: ${bedText}`);
                }
            }

            if (parts.length === 0) {
                filtersEl.textContent = this.currentLanguage === 'fa'
                    ? 'فیلترها: هیچ'
                    : 'Filters: none';
            } else {
                const label = this.currentLanguage === 'fa' ? 'فیلترها: ' : 'Filters: ';
                filtersEl.textContent = label + parts.join(' | ');
            }
        }

        this.displayProperties(filtered);
    }

    setupSorting() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            // Ensure UI reflects default sort
            sortSelect.value = sortSelect.value || 'date-new';
            this.sortProperties(sortSelect.value);
            sortSelect.addEventListener('change', (e) => {
                const sortBy = e.target.value;
                this.sortProperties(sortBy);
            });
        } else {
            // Fallback if no select is present
            this.sortProperties('date-new');
        }
    }

    sortProperties(sortBy) {
        let sorted = [...this.properties];

        switch (sortBy) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'date-old':
                sorted.sort((a, b) => new Date(a.date_added) - new Date(b.date_added));
                break;
            case 'date-new':
                sorted.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
                break;
            case 'area-large':
                sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
                break;
        }

        this.displayProperties(sorted);
    }

    // Details Page Initialization
    initDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const propertyId = parseInt(urlParams.get('id'));

        if (propertyId) {
            const property = this.properties.find(p => p.id === propertyId);
            if (property) {
                this.displayPropertyDetails(property);
                this.setupImageGallery();
                this.setupContactForm();
                this.setupWhatsAppIntegration(property);
            }
        }
    }

    displayPropertyDetails(property) {
        const title = document.getElementById('property-title');
        const price = document.getElementById('property-price');
        const description = document.getElementById('property-description');
        const features = document.getElementById('property-features');
        const areaEl = document.getElementById('property-area');
        const bedroomsEl = document.getElementById('property-bedrooms');
        const bathroomsEl = document.getElementById('property-bathrooms');
        const statusEl = document.getElementById('property-status');
        const bedroomsBlock = document.getElementById('property-bedrooms-block');
        const bathroomsBlock = document.getElementById('property-bathrooms-block');

        if (title) title.textContent = this.currentLanguage === 'fa' ? property.title_fa : property.title;
        if (price) price.textContent = this.formatPrice(property.price);
        if (description) description.textContent = this.currentLanguage === 'fa' ? property.description_fa : property.description;

        // Video Tour
        const videoContainer = document.getElementById('property-video-container');
        if (videoContainer) {
            if (property.video_url) {
                videoContainer.innerHTML = `
                    <h3 class="text-2xl font-bold mb-4">${this.currentLanguage === 'fa' ? 'تور ویدیویی' : 'Video Tour'}</h3>
                    <div class="aspect-w-16 aspect-h-9">
                        <iframe src="${property.video_url}" title="Property Tour" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-64 md:h-96 rounded-lg shadow-lg"></iframe>
                    </div>
                `;
                videoContainer.style.display = 'block';
            } else {
                videoContainer.style.display = 'none';
            }
        }

        // Update key specs
        if (areaEl && typeof property.area !== 'undefined' && property.area !== null) {
            if (this.currentLanguage === 'fa') {
                areaEl.textContent = property.area.toLocaleString('fa-AF');
            } else {
                areaEl.textContent = property.area;
            }
        }

        const isLandOrCommercial = (property.type || '').toLowerCase() === 'land' || (property.type || '').toLowerCase() === 'commercial';

        if (bedroomsBlock) {
            bedroomsBlock.style.display = isLandOrCommercial ? 'none' : '';
        }
        if (bathroomsBlock) {
            bathroomsBlock.style.display = isLandOrCommercial ? 'none' : '';
        }

        if (!isLandOrCommercial) {
            if (bedroomsEl && typeof property.bedrooms !== 'undefined' && property.bedrooms !== null) {
                bedroomsEl.textContent = this.currentLanguage === 'fa'
                    ? property.bedrooms.toLocaleString('fa-AF')
                    : property.bedrooms;
            }
            if (bathroomsEl && typeof property.bathrooms !== 'undefined' && property.bathrooms !== null) {
                bathroomsEl.textContent = this.currentLanguage === 'fa'
                    ? property.bathrooms.toLocaleString('fa-AF')
                    : property.bathrooms;
            }
        }

        if (statusEl && property.status) {
            statusEl.textContent = property.status;
        }

        if (features) {
            const featureList = this.currentLanguage === 'fa' ? property.features_fa : property.features;
            features.innerHTML = featureList.map(feature => `<li>${feature}</li>`).join('');
        }

        // Initialize Map
        this.setupMap(property);
    }

    setupMap(property) {
        // Default to Sangi-e-Masha, Jaghuri if no coords
        const lat = property.lat || 33.245;
        const lng = property.lng || 67.417;

        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        const loadMap = () => {
            if (mapContainer.dataset.loaded) return;
            mapContainer.dataset.loaded = 'true';

            mapContainer.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><p>Loading Property Map...</p></div>';

            this.loadGoogleMaps().then(() => {
                const mapOptions = {
                    center: { lat: lat, lng: lng },
                    zoom: 15,
                    mapTypeId: 'roadmap',
                    streetViewControl: true,
                    mapTypeControl: true
                };

                const map = new google.maps.Map(mapContainer, mapOptions);

                const marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    title: this.currentLanguage === 'fa' ? property.title_fa : property.title
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<div class="p-2"><strong>${this.currentLanguage === 'fa' ? property.title_fa : property.title}</strong></div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            }).catch(e => {
                console.error(e);
                mapContainer.innerHTML = '<div class="text-red-500 text-center p-4">Map failed to load</div>';
            });
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadMap();
                    observer.disconnect();
                }
            }, { rootMargin: '200px' });
            observer.observe(mapContainer);
        } else {
            loadMap();
        }
    }

    setupImageGallery() {
        const gallery = document.getElementById('image-gallery');
        if (gallery) {
            // Get property from URL
            const urlParams = new URLSearchParams(window.location.search);
            const propertyId = parseInt(urlParams.get('id'));
            const property = this.properties.find(p => p.id === propertyId);

            if (property && property.images && property.images.length > 0) {
                // Update gallery with property images
                const track = gallery.querySelector('.splide__track');
                const list = track ? track.querySelector('.splide__list') : null;

                if (list) {
                    const fallbackImg = this.getDefaultImageForType(property.type);
                    list.innerHTML = property.images.map((img, index) => {
                        return `
                            <li class="splide__slide">
                                <img src="${img}" 
                                     alt="Property Image ${index + 1}" 
                                     class="property-image"
                                     onerror="this.onerror=null; this.src='${fallbackImg}';"
                                     loading="lazy">
                            </li>
                        `;
                    }).join('');
                }
            }

            // Initialize Splide carousel
            const splide = new Splide(gallery, {
                type: 'fade',
                autoplay: false,
                arrows: true,
                pagination: true,
            });
            splide.mount();
        }
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(form);
            });
        }
    }

    setupWhatsAppIntegration(property) {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        if (whatsappBtn && property) {
            const message = encodeURIComponent(
                `Hello, I'm interested in ${property.title} located in ${property.location}. Price: ${this.formatPrice(property.price)}`
            );
            whatsappBtn.href = `https://wa.me/${property.contact.replace(/\D/g, '')}?text=${message}`;
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simulate form submission
        this.showNotification('Message sent successfully!', 'success');
        form.reset();

        // In production, this would send to a server
        console.log('Contact form data:', data);
    }

    // Admin Panel Initialization
    initAdmin() {
        if (!this.isAdminLoggedIn) {
            this.showAdminLogin();
        } else {
            this.setupAdminPanel();
        }
    }

    showAdminLogin() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        const isFa = this.currentLanguage === 'fa';
        const title = isFa ? 'ورود مدیر' : 'Admin Login';
        const pwdPlaceholder = isFa ? 'رمز عبور' : 'Password';
        const loginBtn = isFa ? 'ورود' : 'Login';
        const cancelBtnText = isFa ? 'انصراف' : 'Cancel';
        const contactText = isFa
            ? 'نیاز به تغییر رمز عبور دارید؟ با <a href="mailto:propertiesamanat@gmail.com" class="text-blue-500 hover:underline">propertiesamanat@gmail.com</a> در تماس شوید'
            : 'Need to change the password? Contact <a href="mailto:propertiesamanat@gmail.com" class="text-blue-500 hover:underline">propertiesamanat@gmail.com</a>';

        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full relative shadow-xl" dir="${isFa ? 'rtl' : 'ltr'}">
                <button type="button" id="close-admin-modal" class="absolute top-4 ${isFa ? 'left-4' : 'right-4'} text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">${title}</h2>
                <form id="admin-login-form">
                    <input type="password" id="admin-password" placeholder="${pwdPlaceholder}" class="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-3 transition-colors">${loginBtn}</button>
                    <p class="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        ${contactText}
                    </p>
                    <button type="button" id="cancel-admin-login" class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 p-2 rounded transition-colors">${cancelBtnText}</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Focus password input
        setTimeout(() => {
            const input = modal.querySelector('#admin-password');
            if (input) input.focus();
        }, 100);

        // Close functions
        const closeModal = () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        };

        const closeBtn = modal.querySelector('#close-admin-modal');
        const cancelBtn = modal.querySelector('#cancel-admin-login');

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        // Login form submission
        const form = modal.querySelector('#admin-login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = modal.querySelector('#admin-password').value;
            if (this.validateAdminPassword(password)) {
                this.isAdminLoggedIn = true;
                localStorage.setItem('adminLoggedIn', 'true');
                closeModal();
                // If already on admin.html, set up the admin panel
                // Otherwise, navigate to admin.html
                if (this.getCurrentPage() === 'admin') {
                    this.setupAdminPanel();
                } else {
                    window.location.href = 'admin.html';
                }
            } else {
                this.showNotification('Invalid password', 'error');
            }
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    validateAdminPassword(password) {
        // In production, this should be server-side validation
        return password === 'admin123'; // Simple demo password
    }

    setupAdminPanel() {
        this.displayAdminProperties();
        this.setupAdminForms();
        this.updateAdminStats();
    }

    displayAdminProperties() {
        const container = document.getElementById('admin-properties');
        if (!container) return;

        container.innerHTML = this.properties.map(property => `
            <tr class="border-b table-row">
                <td class="p-2">${property.id}</td>
                <td class="p-2">${property.title || 'N/A'}</td>
                <td class="p-2">${property.type || 'N/A'}</td>
                <td class="p-2">${this.formatPrice(property.price || 0)}</td>
                <td class="p-2">
                    <span class="px-2 py-1 rounded text-xs font-semibold ${property.status === 'Available' ? 'bg-green-100 text-green-800' :
                property.status === 'Sold' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
            }">${property.status || 'Available'}</span>
                </td>
                <td class="p-2">
                    <button onclick="app.editProperty(${property.id})" class="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Edit</button>
                    <button onclick="app.deleteProperty(${property.id})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                </td>
            </tr>
        `).join('');
        this.updateAdminStats();
    }

    setupAdminForms() {
        const addForm = document.getElementById('add-property-form');
        if (addForm) {
            // Initialize map for add property
            // Default to Jaghuri coordinates
            this.setupMapPicker('add-property-map', 'add-lat', 'add-lng', 'add-coords', 33.245, 67.417);

            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProperty(addForm);
            });
        }

        const editForm = document.getElementById('edit-property-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProperty(editForm);
            });
        }

        const closeEditBtn = document.getElementById('close-edit-modal');
        if (closeEditBtn) {
            closeEditBtn.addEventListener('click', () => {
                document.getElementById('edit-property-modal').classList.add('hidden');
                this.editingProperty = null;
            });
        }
    }

    setupMapPicker(mapId, latInputId, lngInputId, coordsDisplayId, initialLat, initialLng) {
        const mapContainer = document.getElementById(mapId);
        if (!mapContainer || typeof google === 'undefined') return;

        // Clean up logic handled by Google Maps instance management usually not needed as strictly as Leaflet
        // but we can clear container innerHTML if we want a fresh start, though usually not recommended.

        const mapOptions = {
            center: { lat: initialLat, lng: initialLng },
            zoom: 15, // Higher zoom for better detail
            mapTypeId: 'roadmap', // Map view (Karte)
            streetViewControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                mapTypeIds: ['roadmap', 'satellite', 'hybrid']
            }
        };

        const map = new google.maps.Map(mapContainer, mapOptions);

        const marker = new google.maps.Marker({
            position: { lat: initialLat, lng: initialLng },
            map: map,
            draggable: true,
            title: "Property Location"
        });

        // Update inputs
        const updateInputs = (lat, lng) => {
            const latInput = document.getElementById(latInputId);
            const lngInput = document.getElementById(lngInputId);
            const display = document.getElementById(coordsDisplayId);

            if (latInput) latInput.value = lat.toFixed(6);
            if (lngInput) lngInput.value = lng.toFixed(6);
            if (display) display.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        };

        // Initial update
        updateInputs(initialLat, initialLng);

        // Drag event
        marker.addListener('dragend', () => {
            const position = marker.getPosition();
            updateInputs(position.lat(), position.lng());
        });

        // Click event on map to move marker
        map.addListener('click', (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            marker.setPosition({ lat, lng });
            updateInputs(lat, lng);
        });
    }

    addProperty(form) {
        const formData = new FormData(form);
        const newProperty = {
            id: Date.now(),
            title: formData.get('title'),
            title_fa: formData.get('title_fa'),
            type: formData.get('type'),
            type_fa: formData.get('type_fa') || formData.get('type'),
            price: parseInt(formData.get('price')),
            area: parseInt(formData.get('area')),
            bedrooms: parseInt(formData.get('bedrooms')),
            bathrooms: parseInt(formData.get('bathrooms')),
            location: formData.get('location'),
            location_fa: formData.get('location_fa'),
            lat: parseFloat(formData.get('lat')),
            lng: parseFloat(formData.get('lng')),
            description: formData.get('description'),
            description_fa: formData.get('description_fa'),
            status: 'Available',
            images: (window.pendingUploadImages && window.pendingUploadImages.length) ? window.pendingUploadImages.slice() : ['hero-villa.jpg'], // Use uploaded images if available
            features: formData.get('features').split(',').map(f => f.trim()),
            features_fa: formData.get('features_fa') ? formData.get('features_fa').split(',').map(f => f.trim()) : [],
            contact: formData.get('contact'),
            date_added: new Date().toISOString().split('T')[0]
        };

        // Try multipart/form-data POST with actual File objects if present
        const tryPostMultipart = async () => {
            try {
                // First try to use preserved File objects from window.pendingUploadFiles
                // If not available, fall back to reading from the input element
                let files = [];
                if (window.pendingUploadFiles && Array.isArray(window.pendingUploadFiles) && window.pendingUploadFiles.length > 0) {
                    files = window.pendingUploadFiles.slice();
                } else {
                    const imageInput = document.getElementById('image-upload');
                    files = imageInput ? Array.from(imageInput.files) : [];
                }

                // If no files available, skip multipart upload
                if (files.length === 0) {
                    return false;
                }

                const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
                const MAX_FILES = 30;

                // Client-side validation before uploading
                if (files.length > MAX_FILES) {
                    this.showNotification(`Too many files selected (max ${MAX_FILES}).`, 'error');
                    return false;
                }
                for (const f of files) {
                    if (!f.type || !f.type.startsWith('image/')) {
                        this.showNotification('Only image files are allowed.', 'error');
                        return false;
                    }
                    if (f.size > MAX_FILE_SIZE) {
                        this.showNotification('One or more files exceed the 5MB size limit.', 'error');
                        return false;
                    }
                }
                const fd = new FormData();
                fd.append('title', newProperty.title || '');
                fd.append('type', newProperty.type || '');
                fd.append('price', newProperty.price || 0);
                fd.append('area', newProperty.area || 0);
                fd.append('bedrooms', newProperty.bedrooms || 0);
                fd.append('bathrooms', newProperty.bathrooms || 0);
                fd.append('location', newProperty.location || '');
                fd.append('description', newProperty.description || '');
                fd.append('status', newProperty.status || 'Available');
                fd.append('features', JSON.stringify(newProperty.features || []));
                fd.append('contact', newProperty.contact || '');
                fd.append('lat', newProperty.lat || 0);
                fd.append('lng', newProperty.lng || 0);
                fd.append('date_added', newProperty.date_added || new Date().toISOString().split('T')[0]);

                files.forEach(f => fd.append('images', f));

                console.log('[RealEstateApp] Uploading property with', files.length, 'files');
                console.log('[RealEstateApp] FormData entries:', Array.from(fd.entries()).map(([k, v]) => [k, v instanceof File ? `File: ${v.name} (${v.size} bytes)` : v]));

                const resp = await this.fetchWithTimeout('/api/properties', { method: 'POST', body: fd }, 30000); // Increased timeout for large files
                if (resp.ok) {
                    const body = await resp.json();
                    const saved = body.property || newProperty;
                    console.log('[RealEstateApp] Property saved successfully:', saved);
                    console.log('[RealEstateApp] Image paths:', saved.images);

                    // Verify image paths are accessible
                    if (saved.images && saved.images.length > 0) {
                        console.log('[RealEstateApp] Verifying image paths:', saved.images);
                        saved.images.forEach((imgPath, idx) => {
                            const img = new Image();
                            img.onload = () => console.log(`[RealEstateApp] Image ${idx + 1} loaded successfully:`, imgPath);
                            img.onerror = () => console.error(`[RealEstateApp] Image ${idx + 1} failed to load:`, imgPath);
                            img.src = imgPath;
                        });
                    }

                    this.properties.push(saved);

                    // Clear pending uploads after saving
                    try { window.pendingUploadImages = []; } catch (e) { /* ignore */ }
                    try { window.pendingUploadFiles = []; } catch (e) { /* ignore */ }

                    // Cache a copy locally for offline fallback
                    try { localStorage.setItem('properties', JSON.stringify(this.properties)); } catch (e) { /* ignore */ }

                    this.displayAdminProperties();
                    this.serverConnected = true; // Mark as connected on success
                    this.setupConnectionStatusIndicator(); // Update status indicator
                    this.showNotification(`Property uploaded successfully! ${saved.images ? saved.images.length : 0} image(s) saved.`, 'success');
                    form.reset();
                    // Reset file upload area - trigger custom event for admin.html to handle
                    const resetEvent = new CustomEvent('resetFileUpload');
                    window.dispatchEvent(resetEvent);
                    return true;
                } else {
                    const errorText = await resp.text();
                    console.error('[RealEstateApp] Server error:', resp.status, errorText);
                    let errorMessage = `Upload failed: ${resp.status} ${resp.statusText}`;
                    try {
                        const errorJson = JSON.parse(errorText);
                        if (errorJson.error) {
                            errorMessage = errorJson.error;
                        }
                    } catch (e) {
                        // Not JSON, use text as-is
                    }
                    this.serverConnected = false; // Mark as disconnected on error
                    this.setupConnectionStatusIndicator(); // Update status indicator
                    this.showNotification(errorMessage, 'error');
                }
            } catch (e) {
                console.error('[RealEstateApp] Multipart POST failed:', e);
                console.error('[RealEstateApp] Error details:', {
                    name: e.name,
                    message: e.message,
                    stack: e.stack
                });
                this.serverConnected = false; // Mark as disconnected on error
                this.setupConnectionStatusIndicator(); // Update status indicator
                let errorMsg = 'Upload error occurred';
                if (e.message.includes('timeout')) {
                    errorMsg = 'Upload timeout - files may be too large or server is slow. Try smaller files or check server connection.';
                } else if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
                    errorMsg = 'Network error - server may be down. Check if server is running on port 3000.';
                } else {
                    errorMsg = `Upload error: ${e.message}`;
                }
                this.showNotification(errorMsg, 'error');
            }
            return false;
        };

        // Attempt multipart first, fall back to JSON+dataURL POST (existing flow)
        tryPostMultipart().then(ok => {
            if (ok) return;

            // Fallback: previous JSON POST logic
            const tryPostJson = async () => {
                try {
                    const resp = await this.fetchWithTimeout('/api/properties', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newProperty)
                    }, 10000);
                    if (resp.ok) {
                        const body = await resp.json();
                        const saved = body.property || newProperty;
                        this.properties.push(saved);
                        try { window.pendingUploadImages = []; } catch (e) { /* ignore */ }
                        try { window.pendingUploadFiles = []; } catch (e) { /* ignore */ }
                        try { localStorage.setItem('properties', JSON.stringify(this.properties)); } catch (e) { /* ignore */ }
                        this.serverConnected = true; // Mark as connected on success
                        this.setupConnectionStatusIndicator(); // Update status indicator
                        this.displayAdminProperties();
                        this.showNotification('Property added and saved to server (JSON).', 'success');
                        form.reset();
                        // Reset file upload area - trigger custom event for admin.html to handle
                        const resetEvent = new CustomEvent('resetFileUpload');
                        window.dispatchEvent(resetEvent);
                        return true;
                    }
                } catch (e) {
                    console.warn('[RealEstateApp] JSON POST to API failed:', e);
                    this.serverConnected = false; // Mark as disconnected on error
                    this.setupConnectionStatusIndicator(); // Update status indicator
                }
                return false;
            };

            tryPostJson().then(ok2 => {
                if (ok2) return;

                // Final fallback: persist locally
                this.properties.push(newProperty);
                try { window.pendingUploadImages = []; } catch (e) { /* ignore */ }
                try { window.pendingUploadFiles = []; } catch (e) { /* ignore */ }
                try { localStorage.setItem('properties', JSON.stringify(this.properties)); } catch (e) { console.warn('Could not persist properties to localStorage:', e); }
                this.displayAdminProperties();
                this.showNotification('Property added locally (server unavailable).', 'warning');
                form.reset();
                // Reset file upload area - trigger custom event for admin.html to handle
                const resetEvent = new CustomEvent('resetFileUpload');
                window.dispatchEvent(resetEvent);
            });
        });
    }

    updateProperty(form) {
        const formData = new FormData(form);
        const id = parseInt(formData.get('id'));
        const index = this.properties.findIndex(p => p.id === id);

        if (index === -1) {
            this.showNotification('Property not found', 'error');
            return;
        }

        const updatedProperty = {
            ...this.properties[index],
            title: formData.get('title'),
            title_fa: formData.get('title_fa'),
            type: formData.get('type'),
            type_fa: formData.get('type_fa'),
            price: parseInt(formData.get('price')),
            area: parseInt(formData.get('area')),
            bedrooms: parseInt(formData.get('bedrooms')),
            bathrooms: parseInt(formData.get('bathrooms')),
            location: formData.get('location'),
            location_fa: formData.get('location_fa'),
            lat: parseFloat(formData.get('lat')),
            lng: parseFloat(formData.get('lng')),
            contact: formData.get('contact'),
            description: formData.get('description'),
            description_fa: formData.get('description_fa'),
            features: formData.get('features').split(',').map(s => s.trim()).filter(Boolean),
            features_fa: formData.get('features_fa').split(',').map(s => s.trim()).filter(Boolean)
        };

        // Server-Side Update logic
        const tryUpdateServer = async () => {
            if (!this.serverConnected) return false;

            try {
                // Try multipart if there are new files
                const files = (window.editPendingUploadFiles || []).filter(f => f !== null);

                if (files.length > 0) {
                    const fd = new FormData();
                    Object.keys(updatedProperty).forEach(key => {
                        if (key === 'images' || key === 'features' || key === 'features_fa') {
                            fd.append(key, JSON.stringify(updatedProperty[key]));
                        } else {
                            fd.append(key, updatedProperty[key]);
                        }
                    });

                    files.forEach(f => fd.append('images_new', f)); // Use a specific key for new images

                    const resp = await this.fetchWithTimeout(`/api/properties/${id}`, {
                        method: 'PUT',
                        body: fd
                    }, 30000);

                    if (resp.ok) {
                        const body = await resp.json();
                        this.properties[index] = body.property || updatedProperty;
                        this.finishUpdate();
                        return true;
                    }
                } else {
                    // Just JSON update if no new files
                    const resp = await this.fetchWithTimeout(`/api/properties/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedProperty)
                    }, 10000);

                    if (resp.ok) {
                        const body = await resp.json();
                        this.properties[index] = body.property || updatedProperty;
                        this.finishUpdate();
                        return true;
                    }
                }
            } catch (e) {
                console.warn('[RealEstateApp] Server update failed:', e);
            }
            return false;
        };

        tryUpdateServer().then(ok => {
            if (!ok) {
                // Local-only/fallback update
                if (window.editPendingUploadImages) {
                    const newImages = window.editPendingUploadImages.filter(img => img !== null);
                    if (newImages.length > 0) {
                        updatedProperty.images = [...(updatedProperty.images || []), ...newImages];
                    }
                }

                this.properties[index] = updatedProperty;
                this.finishUpdate();
                if (this.serverConnected) {
                    this.showNotification('Updated locally, but server sync failed.', 'warning');
                }
            }
        });
    }

    finishUpdate() {
        localStorage.setItem('properties', JSON.stringify(this.properties));
        this.displayAdminProperties();
        this.showNotification('Property updated successfully', 'success');
        document.getElementById('edit-property-modal').classList.add('hidden');
        window.editPendingUploadFiles = null;
        window.editPendingUploadImages = null;
    }

    editProperty(id) {
        const property = this.properties.find(p => p.id === id);
        if (!property) {
            this.showNotification('Property not found!', 'error');
            return;
        }

        // Populate edit form
        document.getElementById('edit-property-id').value = property.id;
        document.getElementById('edit-title').value = property.title || '';
        document.getElementById('edit-title-fa').value = property.title_fa || '';
        document.getElementById('edit-type').value = property.type || '';
        document.getElementById('edit-type-fa').value = property.type_fa || '';
        document.getElementById('edit-price').value = property.price || 0;
        document.getElementById('edit-area').value = property.area || '';
        document.getElementById('edit-bedrooms').value = property.bedrooms || '';
        document.getElementById('edit-bathrooms').value = property.bathrooms || '';
        document.getElementById('edit-location').value = property.location || '';
        document.getElementById('edit-location-fa').value = property.location_fa || '';
        document.getElementById('edit-contact').value = property.contact || '';
        document.getElementById('edit-status').value = property.status || 'Available';
        document.getElementById('edit-description').value = property.description || '';
        document.getElementById('edit-description-fa').value = property.description_fa || '';
        document.getElementById('edit-features').value = Array.isArray(property.features) ? property.features.join(', ') : (property.features || '');
        document.getElementById('edit-features-fa').value = Array.isArray(property.features_fa) ? property.features_fa.join(', ') : (property.features_fa || '');

        // Show current images
        const currentImagesPreview = document.getElementById('current-images-preview');
        if (property.images && property.images.length > 0) {
            currentImagesPreview.innerHTML = `
                <p class="text-sm font-semibold text-gray-700 mb-2">Current Images (${property.images.length}):</p>
                <div class="grid grid-cols-4 gap-2">
                    ${property.images.map(img => `
                        <div class="relative">
                            <img src="${img}" alt="Property image" class="w-full h-20 object-cover rounded border">
                            <button type="button" onclick="app.removeImageFromEdit('${img}', ${id})" class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            currentImagesPreview.innerHTML = '<p class="text-sm text-gray-500">No images currently</p>';
        }

        // Initialize edit image slots
        this.initializeEditImageSlots();

        // Show modal
        const modal = document.getElementById('edit-property-modal');
        if (modal) {
            modal.classList.remove('hidden');
            // Initialize map for edit property
            // Default to existing coords or Jaghuri fallback
            const lat = property.lat || 33.245;
            const lng = property.lng || 67.417;

            // Small timeout to allow modal to render so map can size correctly
            setTimeout(() => {
                this.setupMapPicker('edit-property-map', 'edit-lat', 'edit-lng', 'edit-coords', lat, lng);
            }, 100);
        }

        // Store current property for reference
        this.editingProperty = property;
    }

    initializeEditImageSlots() {
        const container = document.getElementById('edit-image-slots');
        if (!container) return;

        const MAX_FILES = 30;
        container.innerHTML = '';

        for (let i = 0; i < MAX_FILES; i++) {
            const slot = document.createElement('div');
            slot.className = 'border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center text-center bg-gray-50';
            slot.innerHTML = `
                <div class="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden" id="edit-slot-preview-${i}">
                    <span class="text-gray-400 text-sm">No image</span>
                </div>
                <input type="file" accept="image/*" class="hidden" id="edit-image-slot-input-${i}">
                <button type="button" class="px-3 py-1 rounded bg-white border border-gray-300 text-sm hover:border-orange-400" data-slot="${i}">
                    Select image ${i + 1}
                </button>
                <p class="text-xs text-gray-500 mt-1">Max 5MB</p>
            `;
            container.appendChild(slot);

            const btn = slot.querySelector('button');
            const input = slot.querySelector('input[type="file"]');
            const preview = slot.querySelector(`#edit-slot-preview-${i}`);

            btn.addEventListener('click', () => input.click());
            input.addEventListener('change', (e) => this.handleEditSlotFile(i, e.target.files ? e.target.files[0] : null, preview));
        }

        // Initialize edit upload arrays
        if (!window.editPendingUploadFiles) {
            window.editPendingUploadFiles = new Array(MAX_FILES).fill(null);
            window.editPendingUploadImages = new Array(MAX_FILES).fill(null);
        }
    }

    handleEditSlotFile(index, file, previewEl) {
        if (!previewEl) return;
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        const imageError = document.getElementById('edit-image-error');

        if (!file) {
            window.editPendingUploadFiles[index] = null;
            window.editPendingUploadImages[index] = null;
            previewEl.innerHTML = `<span class="text-gray-400 text-sm">No image</span>`;
            return;
        }

        if (!file.type || !file.type.startsWith('image/')) {
            if (imageError) {
                imageError.textContent = 'Only image files are allowed.';
                imageError.classList.remove('hidden');
            }
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            if (imageError) {
                imageError.textContent = 'File too large (max 5MB).';
                imageError.classList.remove('hidden');
            }
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            window.editPendingUploadFiles[index] = file;
            window.editPendingUploadImages[index] = reader.result;
            previewEl.innerHTML = `<img src="${reader.result}" alt="Preview" class="w-full h-24 object-cover rounded">`;
            if (imageError) {
                imageError.textContent = '';
                imageError.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    }

    async removeImageFromEdit(imagePath, propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (!property) return;

        const confirmMsg = this.currentLanguage === 'fa'
            ? 'آیا مطمئن هستید که میخواهید این تصویر را حذف کنید؟'
            : 'Are you sure you want to remove this image?';

        if (confirm(confirmMsg)) {
            property.images = property.images.filter(img => img !== imagePath);

            // Update on server
            try {
                const updatedProperty = { ...property };
                const resp = await this.fetchWithTimeout(`/api/properties/${propertyId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedProperty)
                }, 10000);

                if (resp.ok) {
                    const body = await resp.json();
                    const saved = body.property || updatedProperty;

                    // Update local properties array
                    const index = this.properties.findIndex(p => p.id === propertyId);
                    if (index !== -1) {
                        this.properties[index] = saved;
                    }

                    try { localStorage.setItem('properties', JSON.stringify(this.properties)); } catch (e) { /* ignore */ }

                    this.showNotification('Image removed successfully!', 'success');
                    this.editProperty(propertyId); // Refresh the edit modal
                } else {
                    this.showNotification('Failed to remove image on server', 'error');
                    this.editProperty(propertyId); // Refresh anyway
                }
            } catch (error) {
                console.error('Error removing image:', error);
                this.showNotification('Error removing image: ' + error.message, 'error');
                this.editProperty(propertyId); // Refresh anyway
            }
        }
    }

    deleteProperty(id) {
        const confirmMsg = this.currentLanguage === 'fa'
            ? 'آیا مطمئن هستید که میخواهید این ملک را حذف کنید؟'
            : 'Are you sure you want to delete this property?';

        if (confirm(confirmMsg)) {
            // Try server delete first
            const tryDelete = async () => {
                try {
                    const resp = await this.fetchWithTimeout(`/api/properties/${id}`, { method: 'DELETE' }, 5000);
                    if (resp.ok) {
                        this.properties = this.properties.filter(p => p.id !== id);
                        try { localStorage.setItem('properties', JSON.stringify(this.properties)); } catch (e) { /* ignore */ }
                        this.displayAdminProperties();
                        this.serverConnected = true; // Mark as connected on success
                        this.setupConnectionStatusIndicator(); // Update status indicator
                        this.showNotification('Property deleted from server!', 'success');
                        return true;
                    }
                } catch (e) {
                    console.warn('[RealEstateApp] Could not DELETE via API:', e);
                    this.serverConnected = false; // Mark as disconnected on error
                    this.setupConnectionStatusIndicator(); // Update status indicator
                }
                return false;
            };

            tryDelete().then(ok => {
                if (ok) return;
                // Fallback: delete locally
                this.properties = this.properties.filter(p => p.id !== id);
                try { localStorage.setItem('properties', JSON.stringify(this.properties)); } catch (e) { console.warn('Could not persist properties to localStorage:', e); }
                this.displayAdminProperties();
                this.showNotification('Property deleted locally (server unavailable).', 'warning');
            });
        }
    }

    // Utility Functions
    createPropertyCard(property) {
        const title = this.currentLanguage === 'fa' ? property.title_fa : property.title;
        const location = this.currentLanguage === 'fa' ? property.location_fa : property.location;

        const isLandOrCommercial = (property.type || '').toLowerCase() === 'land' || (property.type || '').toLowerCase() === 'commercial';

        // Determine if listing is new (e.g., added within last 30 days)
        let isNew = false;
        if (property.date_added) {
            const addedDate = new Date(property.date_added);
            const now = new Date();
            const diffDays = (now - addedDate) / (1000 * 60 * 60 * 24);
            isNew = diffDays <= 30;
        }

        // Get first image or use fallback
        const firstImage = (property.images && property.images.length > 0)
            ? property.images[0]
            : this.getDefaultImageForType(property.type);

        const fallbackImg = this.getDefaultImageForType(property.type);

        const newLabel = this.currentLanguage === 'fa' ? 'جدید' : 'New';
        const detailsLabel = this.currentLanguage === 'fa' ? 'مشاهده جزئیات' : 'View Details';

        // Choose a primary feature/tag to highlight on the card
        let primaryTag = '';
        if (Array.isArray(property.features) && property.features.length > 0) {
            const features = property.features;
            const typeLower = (property.type || '').toLowerCase();
            if (typeLower === 'land') {
                primaryTag =
                    features.find(f => /development|ready/i.test(f)) ||
                    features.find(f => /investment/i.test(f)) ||
                    features[0];
            } else if (typeLower === 'commercial') {
                primaryTag =
                    features.find(f => /prime/i.test(f)) ||
                    features.find(f => /high traffic/i.test(f)) ||
                    features[0];
            } else {
                primaryTag = features[0];
            }
        }

        // If in FA, try to use the FA feature text when available
        if (this.currentLanguage === 'fa' && Array.isArray(property.features_fa) && property.features_fa.length > 0) {
            primaryTag = property.features_fa[0] || primaryTag;
        }

        return `
            <div class="property-card bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105">
                <div class="relative">
                    <img src="${firstImage}" 
                         alt="${title}" 
                         class="w-full h-48 object-cover property-image"
                         onerror="this.onerror=null; this.src='${fallbackImg}';"
                         loading="lazy">
                    <div class="absolute top-2 left-2 bg-white/90 text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                        Listing #${property.id}
                    </div>
                    ${isNew ? `<div class="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow"> ${newLabel} </div>` : ''}
                </div>
                <div class="p-4 flex flex-col gap-2">
                    <h3 class="text-xl font-bold mb-2">${title}</h3>
                    <p class="text-gray-600 mb-2">${location}</p>
                    <p class="text-2xl font-bold text-blue-600 mb-2">${this.formatPrice(property.price)}</p>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span>${property.area} m²</span>
                        <div class="flex gap-2">
                            ${!isLandOrCommercial && property.bedrooms > 0 ? `<span>${property.bedrooms} Beds</span>` : ''}
                            ${!isLandOrCommercial && property.bathrooms > 0 ? `<span>${property.bathrooms} Baths</span>` : ''}
                        </div>
                    </div>
                    ${primaryTag
                ? `<div class="mt-1 inline-flex px-2 py-1 rounded-full bg-orange-50 text-xs font-medium text-orange-700 border border-orange-100">
                               ${primaryTag}
                           </div>`
                : ''}
                    <div class="mt-2">
                        <button class="text-sm text-orange-600 font-semibold hover:underline">
                            ${detailsLabel}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Helper method to get default image based on property type
    getDefaultImageForType(type) {
        const imageMap = {
            'Villa': 'hero-villa.jpg',
            'Apartment': 'hero-apartment.jpg',
            'Commercial': 'hero-commercial.jpg',
            'House': 'hero-villa.jpg',
            'Land': 'hero-commercial.jpg'
        };
        return imageMap[type] || 'hero-villa.jpg';
    }

    formatPrice(price) {
        if (this.currentLanguage === 'fa') {
            // Use 'لک' (lak / 100,000) as the primary unit for Dari views.
            // 1 لک = 100,000 افغانی. For prices below 100,000 show the exact amount in افغانی.
            const LAK = 100000;
            if (price >= LAK) {
                const lak = Math.floor(price / LAK);
                // Display lak with localized digits and append unit
                return lak.toLocaleString('fa-AF') + ' لک افغانی';
            } else {
                return price.toLocaleString('fa-AF') + ' افغانی';
            }
        } else {
            // English view: show price in Afghani with the Afghani sign (؋), using millions as the unit
            return `؋${(price / 1000000).toFixed(1)}M`;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    // Setup connection status indicator
    setupConnectionStatusIndicator() {
        // Remove existing indicator if present
        const existing = document.getElementById('server-status-indicator');
        if (existing) {
            existing.remove();
        }

        // Only show indicator if server status was checked
        if (!this.serverStatusChecked) return;

        // NEW: Hide for visitors (show only for logged in admins or on the admin page)
        const isPageAdmin = window.location.pathname.includes('admin.html');
        if (!this.isAdminLoggedIn && !isPageAdmin) return;

        const indicator = document.createElement('div');
        indicator.id = 'server-status-indicator';
        indicator.className = `fixed bottom-4 right-4 p-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${this.serverConnected ? 'bg-green-500' : 'bg-yellow-500'
            } text-white text-sm`;

        const statusText = this.serverConnected
            ? 'Server Connected'
            : 'Server Offline - Using local data';

        indicator.innerHTML = `
            <span class="w-2 h-2 rounded-full ${this.serverConnected ? 'bg-white' : 'bg-red-200'} animate-pulse"></span>
            <span>${statusText}</span>
        `;

        document.body.appendChild(indicator);

        // Auto-hide after 5 seconds if connected, keep visible if disconnected
        if (this.serverConnected) {
            setTimeout(() => {
                if (document.body.contains(indicator)) {
                    indicator.style.opacity = '0';
                    indicator.style.transition = 'opacity 0.5s';
                    setTimeout(() => {
                        if (document.body.contains(indicator)) {
                            indicator.remove();
                        }
                    }, 500);
                }
            }, 5000);
        }
    }

    // Animation Setup
    setupAnimations() {
        // Initialize Anime.js animations
        if (typeof anime !== 'undefined') {
            // Fade in elements on page load
            anime({
                targets: '.fade-in',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                delay: anime.stagger(100)
            });
        }
    }
}

// Initialize the application
const app = new RealEstateApp();

// Global functions for admin panel
window.app = app;