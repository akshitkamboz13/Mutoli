// Mutoli Website JavaScript

// Product data
const products = {
    '250g-jar': {
        name: '250g Jar',
        price: '₹120',
        numericPrice: 120,
        description: 'Best for home/gym use',
        features: ['Daily training fuel', '4-6 weeks of workouts', 'Best value for athletes']
    },
    '4-pouch-combo': {
        name: '50g × 4 Pouch Combo',
        price: '₹150',
        numericPrice: 150,
        description: 'Travel-friendly, easy to carry',
        features: ['Perfect for gym bags', 'Pre/post workout portions', 'Resealable pouches']
    },
    '30-sachets': {
        name: '6g × 30 Sachets Set',
        price: '₹140',
        numericPrice: 140,
        description: 'Daily-use convenience pack',
        features: ['30-day fitness plan', 'Pre-measured energy shots', 'Ultimate convenience']
    }
};

// Configuration - Update this with your Google Apps Script URL
const CONFIG = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxdBaUrTgI8_dX7ycJ9cjuAR3Xbn7fb9g-TeX9wQKBQosvtUwYYDVwWrJzGUzaBENHO5w/exec',
    UPI_ID: 'mutoli@ptyes',
    UPI_NAME: 'Mutoli',
    CURRENCY: 'INR'
};

// Test Google Sheets connection (for debugging)
async function testGoogleSheetsConnection() {
    console.log('🧪 Testing Google Sheets connection...');
    
    // First test - Simple GET request to verify web app is accessible
    console.log('🔍 Step 1: Testing web app accessibility...');
    try {
        const getResponse = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'GET'
        });
        
        if (getResponse.ok) {
            const getResult = await getResponse.text();
            console.log('✅ Web app is accessible via GET request');
            console.log('📄 GET Response:', getResult);
        } else {
            console.log('⚠️ GET request status:', getResponse.status);
        }
    } catch (getError) {
        console.log('❌ GET request failed:', getError.message);
    }
    
    // Second test - Test data submission
    console.log('🔍 Step 2: Testing data submission...');
    const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Connection test from Mutoli website',
        orderNumber: 'TEST-' + Date.now(),
        orderStatus: 'Connection Test',
        fullName: 'Test Customer Real',
        phone: '9876543210',
        email: 'test@mutoli.com',
        address: 'Test Address 123',
        product: 'Test Product Real',
        quantity: '2',
        totalAmount: '240',
        notes: 'This is a real test from website',
        submissionDate: new Date().toLocaleDateString('en-IN'),
        submissionTime: new Date().toLocaleTimeString('en-IN'),
        formattedTimestamp: new Date().toLocaleString('en-IN'),
        source: 'Website Test',
        step: 'Connection Test'
    };
    
    console.log('🧪 Test data:', testData);
    
    // Try multiple submission methods
    await submitToGoogleSheets(testData);
    
    console.log('✅ Connection test completed - check Google Sheets for test data');
    console.log('📋 Look for entry with Order Number: ' + testData.orderNumber);
    console.log('👤 Customer Name: ' + testData.fullName);
    return true;
}

// Test with real order data simulation
async function testRealOrderData() {
    console.log('🧪 Testing with real order data simulation...');
    
    const realOrderData = {
        orderNumber: 'ORD-' + new Date().getFullYear() + 
                    String(new Date().getMonth() + 1).padStart(2, '0') + 
                    String(new Date().getDate()).padStart(2, '0') + 
                    String(new Date().getHours()).padStart(2, '0') + 
                    String(new Date().getMinutes()).padStart(2, '0') + 
                    String(new Date().getSeconds()).padStart(2, '0') + '-' + 
                    Math.random().toString(36).substr(2, 4).toUpperCase(),
        fullName: 'Akshit Test Customer',
        phone: '9876543210',
        email: 'akshit@test.com',
        address: 'Test Address, New Delhi, India',
        product: '250g Jar - ₹120',
        quantity: '2',
        totalAmount: '240',
        notes: 'Test order from website debugging',
        submissionTime: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        submissionDate: new Date().toLocaleDateString('en-IN'),
        submissionTimeFormatted: new Date().toLocaleTimeString('en-IN'),
        orderStatus: 'Order Created - Proceeding to Payment',
        source: 'Website Order Form',
        step: 'Order Creation',
        formattedTimestamp: new Date().toLocaleString('en-IN')
    };
    
    console.log('📦 Real order data:', realOrderData);
    
    // Send the data
    const result = await submitToGoogleSheets(realOrderData);
    console.log('📊 Result:', result ? 'SUCCESS' : 'FAILED');
    
    return result;
}

// Enhanced debugging test to check raw data transmission
async function testRawDataTransmission() {
    console.log('🔬 Testing raw data transmission to Google Sheets...');
    
    const testData = {
        test: true,
        orderNumber: 'RAW-TEST-' + Date.now(),
        fullName: 'Raw Test Customer',
        phone: '1234567890',
        email: 'rawtest@example.com',
        product: 'Raw Test Product',
        timestamp: new Date().toISOString()
    };
    
    console.log('🔬 Sending raw test data:', testData);
    
    try {
        // Test with explicit JSON stringify
        const jsonString = JSON.stringify(testData);
        console.log('📄 JSON string being sent:', jsonString);
        console.log('📏 JSON string length:', jsonString.length);
        
        const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonString
        });
        
        console.log('📡 Response received:', response);
        console.log('📊 Response status:', response.status);
        console.log('📝 Response status text:', response.statusText);
        
        // Try to read response if possible
        try {
            const responseText = await response.text();
            console.log('📄 Response text:', responseText);
        } catch (readError) {
            console.log('⚠️ Could not read response (expected with CORS):', readError.message);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Raw transmission test failed:', error);
        
        // Retry with no-cors mode
        console.log('🔄 Retrying with no-cors mode...');
        try {
            await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData)
            });
            console.log('✅ No-cors request sent successfully');
            return true;
        } catch (noCorsError) {
            console.error('❌ No-cors request also failed:', noCorsError);
            return false;
        }
    }
}

// Global variables
let selectedProduct = null;
let currentStep = 1;
let orderData = {
    product: null,
    quantity: 1,
    totalAmount: 0
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    setupImageLoading();
    setupFormValidation();
    setupNavbar();
    setupOrderForm();
    initializeQRCode();
    setupStepByStepOrder();
    
    // Make test function available globally for debugging
    window.testGoogleSheetsConnection = testGoogleSheetsConnection;
    console.log('Google Sheets test function available. Run testGoogleSheetsConnection() in console to test connection.');
});

// Initialize website
function initializeWebsite() {
    try {
        // Add fade-in animation to hero section
        setTimeout(() => {
            const heroElements = document.querySelectorAll('#hero .animate-fade-in');
            heroElements.forEach((element, index) => {
                setTimeout(() => {
                    if (element) {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }
                }, index * 200);
            });
        }, 100);

        // Initialize smooth scrolling for anchor links
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll animations
        setupScrollAnimations();
    } catch (error) {
        console.error('Error initializing website:', error);
        // Ensure content is visible even if there's an error
        document.body.style.opacity = '1';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Copy UPI ID functionality - using onclick attribute instead
    // The button already has onclick="copyUpiId()" in HTML
    
    // Form submission is handled by setupOrderForm()
    // Navigation menu (mobile)
    setupMobileNavigation();
    
    // Setup navbar scroll effect
    setupNavbarScrollEffect();
}

// Setup navbar functionality
function setupNavbar() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Change hamburger to X icon
            const icon = mobileMenuBtn.querySelector('svg path');
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            } else {
                icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            }
        });
    }
    
    // Close mobile menu when clicking nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('svg path');
            icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        });
    });
    
    // Smooth scroll for all nav links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Setup navbar scroll effect
function setupNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let navbarVisible = true;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Change navbar background opacity based on scroll
        if (scrollTop > 50) {
            navbar.classList.add('bg-white/98');
            navbar.classList.remove('bg-white/95');
        } else {
            navbar.classList.add('bg-white/95');
            navbar.classList.remove('bg-white/98');
        }
        
        // Hide/show navbar on scroll (optional - can be disabled)
        if (scrollTop > lastScrollTop && scrollTop > 200 && navbarVisible) {
            // Scrolling down - hide navbar
            navbar.style.transform = 'translateY(-100%)';
            navbarVisible = false;
        } else if (scrollTop < lastScrollTop && !navbarVisible) {
            // Scrolling up - show navbar
            navbar.style.transform = 'translateY(0)';
            navbarVisible = true;
        }
        
        lastScrollTop = scrollTop;
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = ['hero', 'why-mutoli', 'story', 'products', 'pre-order'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section;
            }
        }
    });
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('text-honey', 'font-bold');
        link.classList.add('text-gray-700');
    });
    
    // Add active class to current section link
    if (currentSection) {
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.remove('text-gray-700');
            activeLink.classList.add('text-honey', 'font-bold');
        }
    }
}

// Scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Pre-order function
function preOrder(productId) {
    console.log('preOrder function called with:', productId);
    selectedProduct = productId;
    const product = products[productId];
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    console.log('Product found:', product);

    // Update selected product display
    updateSelectedProduct(product);

    // Automatically select product in form dropdown
    selectProductInForm(productId);

    // Scroll to pre-order section
    const preOrderSection = document.getElementById('pre-order');
    if (preOrderSection) {
        preOrderSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Generate QR code after scrolling (with delay to ensure elements are visible)
        setTimeout(() => {
            console.log('Generating QR code after scroll...');
            generateDynamicQRCode(productId);
        }, 500);
    } else {
        // If no scroll needed, generate immediately
        generateDynamicQRCode(productId);
    }

    // Add analytics tracking
    trackEvent('product_selected', {
        product_id: productId,
        product_name: product.name,
        product_price: product.price
    });
}

// Update selected product display
function updateSelectedProduct(product) {
    const selectedProductDiv = document.getElementById('selected-product');
    const productDetailsDiv = document.getElementById('product-details');
    
    if (selectedProductDiv && productDetailsDiv) {
        productDetailsDiv.innerHTML = `
            <div class="flex items-center justify-center mb-4">
                <div class="text-center">
                    <h4 class="text-xl font-bold text-gray-900">${product.name}</h4>
                    <p class="text-gray-600">${product.description}</p>
                    <p class="text-2xl font-bold text-honey mt-2">${product.price} + shipping</p>
                </div>
            </div>
            <ul class="text-gray-600 space-y-1">
                ${product.features.map(feature => `<li class="flex items-center justify-center"><i class="fas fa-check text-honey mr-2"></i>${feature}</li>`).join('')}
            </ul>
        `;
        
        selectedProductDiv.classList.remove('hidden');
        selectedProductDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Automatically select product in form dropdown
function selectProductInForm(productId) {
    const productSelect = document.querySelector('select[name="product"]');
    
    if (!productSelect) {
        console.error('Product select element not found');
        return;
    }

    // Map product IDs to form option values
    const productMapping = {
        '250g-jar': '250g Jar - ₹120',
        '4-pouch-combo': '4 Pouch Combo - ₹150',
        '30-sachets': '30 Sachets - ₹140'
    };

    const optionValue = productMapping[productId];
    
    if (optionValue) {
        // Find and select the matching option
        const options = productSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === optionValue) {
                productSelect.selectedIndex = i;
                
                // Trigger change event to ensure any listeners are notified
                const changeEvent = new Event('change', { bubbles: true });
                productSelect.dispatchEvent(changeEvent);
                
                // Add visual feedback - briefly highlight the form field
                productSelect.style.backgroundColor = '#fef3c7'; // light yellow
                setTimeout(() => {
                    productSelect.style.backgroundColor = '';
                }, 1000);
                
                console.log('Product automatically selected:', optionValue);
                break;
            }
        }
    } else {
        console.error('Product mapping not found for:', productId);
    }
}

// Helper function to create UPI transaction note
function createTransactionNote(productName, customerName, orderNumber) {
    // Format: "Mutoli [Product] order for [Customer] - Order: [OrderNumber]"
    return `Mutoli ${productName} order for ${customerName} - Order: ${orderNumber}`;
}

// Helper function to create UPI URI with enhanced message
function createUPIUri(amount, productName, customerName, orderNumber) {
    const transactionNote = createTransactionNote(productName, customerName, orderNumber);
    return `upi://pay?pa=${CONFIG.UPI_ID}&pn=${CONFIG.UPI_NAME}&am=${amount}&cu=${CONFIG.CURRENCY}&tn=${encodeURIComponent(transactionNote)}`;
}

// Generate dynamic QR code for selected product
function generateDynamicQRCode(productId) {
    console.log('generateDynamicQRCode called with:', productId);
    
    const product = products[productId];
    
    if (!product) {
        console.error('Product not found for QR generation:', productId);
        return;
    }

    console.log('Generating QR for product:', product);

    // Get customer name if available for more personalized QR
    const customerName = document.getElementById('fullName')?.value || 'Customer';
    const orderNumberPreview = 'ORD-' + new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 8);
    
    // Create UPI URI with enhanced message using helper function
    const upiUri = createUPIUri(product.numericPrice, product.name, customerName, orderNumberPreview);
    const transactionNote = createTransactionNote(product.name, customerName, orderNumberPreview);
    
    console.log('Generated UPI URI:', upiUri);
    console.log('Transaction note:', transactionNote);

    // Get QR code elements
    const defaultQR = document.getElementById('default-qr');
    const dynamicQR = document.getElementById('dynamic-qr');
    const qrCanvas = document.getElementById('qr-canvas');
    const amountSpan = document.getElementById('qr-amount');
    const productSpan = document.getElementById('qr-product');

    console.log('QR Elements found:', {
        defaultQR: !!defaultQR,
        dynamicQR: !!dynamicQR,
        qrCanvas: !!qrCanvas,
        amountSpan: !!amountSpan,
        productSpan: !!productSpan
    });

    if (!qrCanvas || !defaultQR || !dynamicQR) {
        console.error('QR code elements not found');
        return;
    }

    // Update text elements
    if (amountSpan) amountSpan.textContent = product.price;
    if (productSpan) productSpan.textContent = product.name;

    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded');
        return;
    }

    console.log('Generating QR code with QRCode library...');

    // Clear the canvas first
    const context = qrCanvas.getContext('2d');
    context.clearRect(0, 0, qrCanvas.width, qrCanvas.height);

    // Generate QR code
    QRCode.toCanvas(qrCanvas, upiUri, {
        width: 200,
        height: 200,
        color: {
            dark: '#000000',  // Black dots
            light: '#FFFFFF'  // White background
        },
        margin: 2,
        errorCorrectionLevel: 'M'
    }, function (error) {
        if (error) {
            console.error('QR Code generation failed:', error);
            // Fallback to default QR if generation fails
            showDefaultQR();
        } else {
            console.log('Dynamic QR code generated successfully with customer details');
            // Hide default QR and show dynamic QR
            defaultQR.classList.add('hidden');
            dynamicQR.classList.remove('hidden');
        }
    });
}

// Show default QR code (when no product selected)
function showDefaultQR() {
    const defaultQR = document.getElementById('default-qr');
    const dynamicQR = document.getElementById('dynamic-qr');
    
    if (defaultQR && dynamicQR) {
        defaultQR.classList.remove('hidden');
        dynamicQR.classList.add('hidden');
    }
}

// Initialize QR code display
function initializeQRCode() {
    // Ensure default QR is shown initially
    showDefaultQR();
    
    // Wait for QRCode library to load with timeout
    let attempts = 0;
    const maxAttempts = 100; // 10 seconds max wait
    
    function checkQRCodeLibrary() {
        attempts++;
        
        if (typeof QRCode !== 'undefined') {
            console.log('QR code system initialized successfully');
            return;
        }
        
        if (attempts >= maxAttempts) {
            console.warn('QRCode library took longer than expected to load, but fallback should be available');
            return;
        }
        
        // Check every 100ms for first 5 seconds, then every 500ms
        const checkInterval = attempts < 50 ? 100 : 500;
        setTimeout(checkQRCodeLibrary, checkInterval);
    }
    
    // Start checking after a brief delay to allow script loading
    setTimeout(checkQRCodeLibrary, 200);
}

// Fallback QR code solution if CDN fails
function loadQRCodeFallback() {
    console.log('Loading QR code fallback solution');
    window.QRCode = {
        toCanvas: function(canvas, text, options, callback) {
            console.log('Using fallback QR generation for:', text);
            const size = options.width || 200;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=10`;
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                try {
                    const ctx = canvas.getContext('2d');
                    canvas.width = size;
                    canvas.height = size;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, size, size);
                    ctx.drawImage(img, 0, 0, size, size);
                    console.log('Fallback QR code generated successfully');
                    if (callback) callback(null);
                } catch (error) {
                    console.error('Error drawing QR code:', error);
                    if (callback) callback(error);
                }
            };
            img.onerror = function() {
                console.error('Failed to load QR code image');
                if (callback) callback(new Error('Failed to generate QR code'));
            };
            img.src = qrUrl;
        }
    };
    console.log('QR code fallback system loaded');
}

// Copy UPI ID to clipboard
function copyUpiId() {
    const upiId = 'mutoli@ptyes';
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(upiId).then(() => {
            showNotification('UPI ID copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy UPI ID:', err);
            fallbackCopyTextToClipboard(upiId);
        });
    } else {
        fallbackCopyTextToClipboard(upiId);
    }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('UPI ID copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy UPI ID. Please copy manually: ' + text, 'error');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showNotification('Failed to copy UPI ID. Please copy manually: ' + text, 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.className += ' bg-green-500 text-white';
            break;
        case 'error':
            notification.className += ' bg-red-500 text-white';
            break;
        default:
            notification.className += ' bg-honey text-white';
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Old form submission handler - DEPRECATED
// This function is no longer used - replaced by handleOrderSubmission
// Keeping for reference but not actively used

// Get form data
function getFormData(form) {
    const inputs = form.querySelectorAll('input, textarea');
    const data = {};
    
    inputs.forEach(input => {
        data[input.placeholder] = input.value.trim();
    });
    
    return data;
}

// Validate form
function validateForm(formData) {
    const requiredFields = ['Full Name', 'Phone Number', 'Email Address', 'Delivery Address', 'UPI Transaction ID / Reference Number'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        if (!formData[field]) {
            missingFields.push(field);
        }
    });
    
    if (missingFields.length > 0) {
        showNotification(`Please fill in: ${missingFields.join(', ')}`, 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData['Email Address'])) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate phone number
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(formData['Phone Number'])) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    return true;
}

// Clear form
function clearForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.value = '';
    });
}

// Setup image loading
function setupImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.setAttribute('data-loaded', 'false');
        
        img.addEventListener('load', function() {
            this.setAttribute('data-loaded', 'true');
        });
        
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
            this.alt = 'Image not available';
        });
    });
}

// Setup form validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const placeholder = field.placeholder;
    
    // Remove existing error styling
    field.classList.remove('border-red-500');
    
    // Check if field is required and empty
    if (isRequiredField(placeholder) && !value) {
        showFieldError(field, `${placeholder} is required`);
        return false;
    }
    
    // Specific validations
    if (placeholder === 'Email Address' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (placeholder === 'Phone Number' && value) {
        const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

// Check if field is required
function isRequiredField(placeholder) {
    const requiredFields = ['Full Name', 'Phone Number', 'Email Address', 'Delivery Address', 'UPI Transaction ID / Reference Number'];
    return requiredFields.includes(placeholder);
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('border-red-500');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('border-red-500');
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Setup scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .product-card, #why-mutoli .bg-white, #products .bg-white');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Setup mobile navigation (legacy function - now handled by setupNavbar)
function setupMobileNavigation() {
    // This function is now handled by setupNavbar()
    // Keeping for backward compatibility
}

// Analytics tracking (placeholder)
function trackEvent(eventName, parameters = {}) {
    // Replace with actual analytics implementation (Google Analytics, etc.)
    console.log('Event tracked:', eventName, parameters);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
}

// Utility function to find elements by text content
HTMLElement.prototype.contains = function(text) {
    return this.textContent.includes(text);
};

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause any animations or timers
        console.log('Page hidden');
    } else {
        // Page is visible - resume animations or timers
        console.log('Page visible');
    }
});

// Error handling for the entire application
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You might want to send this to your error tracking service
});

// ===================================
// ORDER FORM FUNCTIONALITY
// ===================================

// Setup order form submission
function setupOrderForm() {
    const orderForm = document.getElementById('orderForm');
    const submitBtn = document.getElementById('submitOrderBtn');
    const productSelect = document.querySelector('select[name="product"]');
    
    if (orderForm && submitBtn) {
        orderForm.addEventListener('submit', handleOrderSubmission);
    }
    
    // Listen for manual product selection changes
    if (productSelect) {
        productSelect.addEventListener('change', function(e) {
            const selectedValue = e.target.value;
            
            if (selectedValue) {
                // Map form option values back to product IDs
                const valueToIdMapping = {
                    '250g Jar - ₹120': '250g-jar',
                    '4 Pouch Combo - ₹150': '4-pouch-combo',
                    '30 Sachets - ₹140': '30-sachets'
                };
                
                const productId = valueToIdMapping[selectedValue];
                if (productId) {
                    generateDynamicQRCode(productId);
                }
            } else {
                // No product selected, show default QR
                showDefaultQR();
            }
        });
    }
}

// Handle order form submission
async function handleOrderSubmission(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitOrderBtn');
    const successMsg = document.getElementById('orderSuccessMessage');
    const errorMsg = document.getElementById('orderErrorMessage');
    
    // Hide previous messages
    successMsg.classList.add('hidden');
    errorMsg.classList.add('hidden');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = new FormData(e.target);
        const submissionData = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            notes: formData.get('notes'),
            // Use data from step-by-step process
            product: `${orderData.product.name} - ₹${orderData.product.numericPrice}`,
            quantity: orderData.quantity,
            totalAmount: orderData.totalAmount,
            // Automatically capture submission time
            submissionTime: new Date().toISOString(),
            timestamp: new Date().toISOString(),
            orderNumber: generateOrderNumber()
        };
        
        // Get screenshot file
        const screenshotFile = formData.get('paymentScreenshot');
        
        // Validate required fields
        if (!submissionData.fullName || !submissionData.phone || !submissionData.email || 
            !submissionData.address || !screenshotFile || screenshotFile.size === 0) {
            throw new Error('Please fill in all required fields and upload payment screenshot');
        }
        
        // Submit to Google Sheets
        console.log('Submitting order to Google Sheets...');
        const sheetsSubmission = await submitToGoogleSheets(submissionData);
        
        if (sheetsSubmission) {
            console.log('Order successfully submitted to Google Sheets');
        } else {
            console.warn('Google Sheets submission failed, but continuing with order process');
        }
        
        // Create WhatsApp message with order details
        const whatsappMessage = createWhatsAppOrderMessage(submissionData);
        
        // Show success message and open WhatsApp
        successMsg.classList.remove('hidden');
        
        // Track WhatsApp confirmation click
        trackWhatsAppConfirmation(submissionData);
        
        // Open WhatsApp with pre-filled message
        setTimeout(() => {
            window.open(whatsappMessage, '_blank');
        }, 1000);
        
        // Reset form
        e.target.reset();
        
        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Show notification
        showNotification('Order details prepared! Please send via WhatsApp along with your payment screenshot.', 'success');
        
    } catch (error) {
        console.error('Order submission error:', error);
        
        // Show error message
        errorMsg.classList.remove('hidden');
        errorMsg.querySelector('span').textContent = error.message || 'Error processing order. Please try again or contact us directly.';
        
        // Scroll to error message
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Show notification
        showNotification('Error processing order. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Submit data to Google Sheets via Google Apps Script
async function submitToGoogleSheets(orderData) {
    try {
        console.log('🔄 Starting Google Sheets submission...');
        console.log('📋 Order data to submit:', orderData);
        
        // Check if Google Script URL is configured
        if (CONFIG.GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            console.warn('⚠️ Google Script URL not configured. Simulating submission for now.');
            // Simulate successful submission for development
            await new Promise(resolve => setTimeout(resolve, 2000));
            return true;
        }
        
        console.log('🌐 Google Script URL configured:', CONFIG.GOOGLE_SCRIPT_URL);
        
        // Prepare data for Google Sheets with proper formatting
        const sheetData = {
            ...orderData,
            // Format date for better readability in sheets (only if not already provided)
            submissionDate: orderData.submissionDate || new Date().toLocaleDateString('en-IN'),
            submissionTime: orderData.submissionTime || new Date().toLocaleTimeString('en-IN'),
            formattedTimestamp: orderData.formattedTimestamp || new Date().toLocaleString('en-IN'),
            // Preserve existing order status or use default
            orderStatus: orderData.orderStatus || 'Pending Payment Verification',
            // Preserve existing source or use default
            source: orderData.source || 'Website Order Form'
        };
        
        console.log('📤 Sending request to Google Sheets...');
        console.log('🔗 URL:', CONFIG.GOOGLE_SCRIPT_URL);
        console.log('📦 Final sheet data:', sheetData);
        
        // Try methods sequentially - stop after first success
        let submitted = false;
        
        // Method 1: Try with form data (URL encoded) first
        if (!submitted) {
            console.log('🔄 Trying Method 1: Form data submission...');
            try {
                const formData = new FormData();
                Object.keys(sheetData).forEach(key => {
                    formData.append(key, sheetData[key]);
                });
                
                const formResponse = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });
                
                console.log('✅ Method 1 (Form data) sent successfully');
                submitted = true;
            } catch (formError) {
                console.log('⚠️ Method 1 (Form data) failed:', formError.message);
            }
        }
        
        // Method 2: Try with URL parameters (only if Method 1 failed)
        if (!submitted) {
            console.log('🔄 Trying Method 2: URL parameters...');
            try {
                const params = new URLSearchParams();
                Object.keys(sheetData).forEach(key => {
                    params.append(key, sheetData[key]);
                });
                
                const urlResponse = await fetch(CONFIG.GOOGLE_SCRIPT_URL + '?' + params.toString(), {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });
                
                console.log('✅ Method 2 (URL params) sent successfully');
                submitted = true;
            } catch (urlError) {
                console.log('⚠️ Method 2 (URL params) failed:', urlError.message);
            }
        }
        
        // Method 3: JSON method (only if both previous methods failed)
        if (!submitted) {
            console.log('🔄 Trying Method 3: JSON submission...');
            const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sheetData)
            });
            
            console.log('✅ Method 3 (JSON) sent successfully');
            submitted = true;
        }
        
        if (submitted) {
            console.log('✅ Data submitted successfully using one method');
            console.log('📋 Check Google Sheets for new entry with Order Number:', sheetData.orderNumber);
        } else {
            console.log('❌ All submission methods failed');
        }
        return true;
        
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        
        // Try alternative method with form data
        try {
            console.log('Trying alternative submission method...');
            
            const formData = new FormData();
            Object.keys(orderData).forEach(key => {
                if (orderData[key] !== null && orderData[key] !== undefined) {
                    formData.append(key, orderData[key].toString());
                }
            });
            
            // Add formatted date fields for alternative method
            formData.append('submissionDate', new Date().toLocaleDateString('en-IN'));
            formData.append('submissionTime', new Date().toLocaleTimeString('en-IN'));
            formData.append('orderStatus', 'Pending Payment Verification');
            formData.append('source', 'Website Order Form');
            
            const altResponse = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
            
            console.log('Alternative method completed successfully');
            return true;
            
        } catch (altError) {
            console.error('Alternative method also failed:', altError);
            return false;
        }
    }
}

// Generate unique order number
function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `MUT${year}${month}${day}${random}`;
}

// Copy UPI ID functionality
function copyUpiId() {
    const upiId = CONFIG.UPI_ID;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(upiId).then(() => {
            showNotification('UPI ID copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy UPI ID:', err);
            fallbackCopyTextToClipboard(upiId);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(upiId);
    }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('UPI ID copied to clipboard!', 'success');
        } else {
            showNotification('Please copy manually: ' + text, 'info');
        }
    } catch (err) {
        console.error('Fallback: Could not copy text:', err);
        showNotification('Please copy manually: ' + text, 'info');
    }
    
    document.body.removeChild(textArea);
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You might want to send this to your error tracking service
});

// Track WhatsApp confirmation click
async function trackWhatsAppConfirmation(orderData) {
    try {
        const whatsappTrackingData = {
            orderNumber: orderData.orderNumber,
            fullName: orderData.fullName,
            phone: orderData.phone,
            email: orderData.email,
            product: orderData.product,
            quantity: orderData.quantity,
            totalAmount: orderData.totalAmount,
            whatsappClickTime: new Date().toISOString(),
            whatsappClickDate: new Date().toLocaleDateString('en-IN'),
            whatsappClickTimeFormatted: new Date().toLocaleTimeString('en-IN'),
            orderStatus: 'WhatsApp Confirmation Initiated',
            source: 'Website WhatsApp Link',
            step: 'WhatsApp Confirmation',
            action: 'Confirm Order via WhatsApp',
            screenshotStatus: 'To be sent via WhatsApp',
            // Special flag to update existing entry instead of creating new one
            updateMode: 'WHATSAPP_UPDATE',
            updateField: 'whatsappClickTime'
        };
        
        console.log('Tracking WhatsApp confirmation click (update mode)...');
        
        // Submit to Google Sheets (non-blocking)
        const result = await submitToGoogleSheets(whatsappTrackingData);
        
        if (result) {
            console.log('WhatsApp confirmation tracked successfully in Google Sheets');
        } else {
            console.warn('Failed to track WhatsApp confirmation in Google Sheets');
        }
        
    } catch (error) {
        console.error('Error tracking WhatsApp confirmation:', error);
        // Don't throw error - this shouldn't block the WhatsApp flow
    }
}

// Create WhatsApp order message
function createWhatsAppOrderMessage(orderData) {
    const whatsappNumber = '+918813017827'; // Your WhatsApp number
    
    const message = `*MUTOLI PRE-ORDER*

� *Order Details:*
• Product: ${orderData.product}
• Quantity: ${orderData.quantity}
• Total Amount: ₹${orderData.totalAmount}
• Order #: ${orderData.orderNumber}

*Customer Info:*
• Name: ${orderData.fullName}
• Phone: ${orderData.phone}
• Email: ${orderData.email}

*Delivery Address:*
${orderData.address}

*Order Submitted:*
${new Date(orderData.submissionTime).toLocaleString()}

${orderData.notes ? `*Notes:* ${orderData.notes}` : ''}

---
*Next Steps:*
1. I'm sending payment screenshot in next message
2. Please confirm order details
3. Let me know expected delivery time

Thank you! �`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

// Generate order number with new format
function generateOrderNumber() {
    const date = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14); 
    const random = Math.random().toString(36).substring(2, 6).toUpperCase(); 
    return "ORD-" + date + "-" + random;
}

// Setup step-by-step order process
function setupStepByStepOrder() {
    // Add click listeners to product options
    const productOptions = document.querySelectorAll('.product-option');
    productOptions.forEach(option => {
        option.addEventListener('click', function() {
            const productId = this.dataset.product;
            selectProduct(productId);
        });
    });
}

// Select product in step 1
function selectProduct(productId) {
    const product = products[productId];
    if (!product) return;
    
    // Remove previous selections
    document.querySelectorAll('.product-option').forEach(option => {
        option.classList.remove('border-honey', 'bg-honey/5');
        option.classList.add('border-gray-200');
    });
    
    // Highlight selected product
    const selectedOption = document.querySelector(`[data-product="${productId}"]`);
    selectedOption.classList.remove('border-gray-200');
    selectedOption.classList.add('border-honey', 'bg-honey/5');
    
    // Store selection
    orderData.product = product;
    orderData.quantity = 1;
    orderData.totalAmount = product.numericPrice;
    
    // Update summary
    updateOrderSummary();
    
    // Show quantity selection
    document.getElementById('quantity-selection').classList.remove('hidden');
}

// Update quantity
function updateQuantity(change) {
    const newQuantity = orderData.quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
        orderData.quantity = newQuantity;
        orderData.totalAmount = orderData.product.numericPrice * orderData.quantity;
        
        document.getElementById('selected-quantity').textContent = orderData.quantity;
        updateOrderSummary();
    }
}

// Update order summary
function updateOrderSummary() {
    if (!orderData.product) return;
    
    document.getElementById('summary-product').textContent = orderData.product.name;
    document.getElementById('summary-unit-price').textContent = orderData.product.price;
    document.getElementById('summary-quantity').textContent = orderData.quantity;
    document.getElementById('summary-total').textContent = `₹${orderData.totalAmount}`;
}

// Proceed to payment step
function proceedToPayment() {
    if (!orderData.product) return;
    
    // Collect customer details from step 1 form
    const fullName = document.querySelector('input[name="fullName"]')?.value;
    const phone = document.querySelector('input[name="phone"]')?.value;
    const email = document.querySelector('input[name="email"]')?.value;
    const address = document.querySelector('textarea[name="address"]')?.value;
    const notes = document.querySelector('textarea[name="notes"]')?.value;
    
    // Validate required fields
    if (!fullName || !phone || !email || !address) {
        alert('Please fill in all required fields before proceeding to payment.');
        return;
    }
    
    // Generate order number and store customer details
    orderData.orderNumber = generateOrderNumber();
    orderData.fullName = fullName;
    orderData.phone = phone;
    orderData.email = email;
    orderData.address = address;
    orderData.notes = notes;
    orderData.submissionTime = new Date().toISOString();
    
    // Prepare data for Google Sheets
    const orderSubmissionData = {
        orderNumber: orderData.orderNumber,
        fullName: orderData.fullName,
        phone: orderData.phone,
        email: orderData.email,
        address: orderData.address,
        notes: orderData.notes || '',
        product: `${orderData.product.name} - ₹${orderData.product.numericPrice}`,
        quantity: orderData.quantity,
        totalAmount: orderData.totalAmount,
        submissionTime: orderData.submissionTime,
        timestamp: orderData.submissionTime,
        submissionDate: new Date().toLocaleDateString('en-IN'),
        submissionTimeFormatted: new Date().toLocaleTimeString('en-IN'),
        orderStatus: 'Order Created - Proceeding to Payment',
        source: 'Website Order Form',
        step: 'Order Creation',
        formattedTimestamp: new Date().toLocaleString('en-IN')
    };
    
    // Submit to Google Sheets (non-blocking)
    console.log('Submitting order details to Google Sheets...');
    console.log('Order data being sent:', orderSubmissionData);
    
    submitToGoogleSheets(orderSubmissionData).then(success => {
        if (success) {
            console.log('✅ Order details successfully submitted to Google Sheets');
            console.log('Order Number:', orderData.orderNumber, 'Status: Order Created - Proceeding to Payment');
        } else {
            console.warn('❌ Failed to submit order details to Google Sheets');
        }
    }).catch(error => {
        console.error('❌ Error submitting order details:', error);
    });
    
    // Update step indicators
    updateStepIndicator(2);
    
    // Hide step 1, show step 2
    document.getElementById('step1-content').classList.add('hidden');
    document.getElementById('step2-content').classList.remove('hidden');
    
    // Update payment details with order number
    document.getElementById('payment-product').textContent = orderData.product.name;
    document.getElementById('payment-quantity').textContent = orderData.quantity;
    document.getElementById('payment-total').textContent = `₹${orderData.totalAmount}`;
    document.getElementById('qr-payment-amount').textContent = `₹${orderData.totalAmount}`;
    
    // Display order number in payment section
    const orderNumberElement = document.getElementById('payment-order-number');
    if (orderNumberElement) {
        orderNumberElement.textContent = orderData.orderNumber;
    }
    
    // Generate QR code for payment with order number
    generatePaymentQR();
    
    // Scroll to payment section
    document.getElementById('step2-content').scrollIntoView({ behavior: 'smooth' });
}

// Generate payment QR code
function generatePaymentQR() {
    const canvas = document.getElementById('payment-qr-canvas');
    
    // Create UPI URI with enhanced message using helper function
    const upiString = createUPIUri(orderData.totalAmount, orderData.product.name, orderData.fullName, orderData.orderNumber);
    const transactionNote = createTransactionNote(orderData.product.name, orderData.fullName, orderData.orderNumber);
    
    console.log('Generating payment QR with transaction note:', transactionNote);
    console.log('UPI String:', upiString);
    
    if (window.QRCode && window.QRCode.toCanvas) {
        QRCode.toCanvas(canvas, upiString, {
            width: 200,
            height: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        }, function(error) {
            if (error) {
                console.error('Payment QR Code generation failed:', error);
                // Use fallback method
                loadQRCodeFallback(canvas, upiString);
            } else {
                console.log('Payment QR Code generated successfully with customer details');
            }
        });
    } else {
        console.log('QRCode library not available, using fallback');
        // Fallback will be handled by the loadQRCodeFallback function
        loadQRCodeFallback(canvas, upiString);
    }
}

// Payment completed - send to WhatsApp
function paymentCompleted() {
    console.log('Payment completed - redirecting to WhatsApp (no automatic tracking)');
    
    // Prepare order data for WhatsApp (using same Order ID)
    const whatsappOrderData = {
        orderNumber: orderData.orderNumber,
        fullName: orderData.fullName,
        phone: orderData.phone,
        email: orderData.email,
        address: orderData.address,
        notes: orderData.notes,
        product: `${orderData.product.name} - ₹${orderData.product.numericPrice}`,
        quantity: orderData.quantity,
        totalAmount: orderData.totalAmount,
        submissionTime: orderData.submissionTime
    };
    
    // Track WhatsApp confirmation click (this will update the existing order entry)
    trackWhatsAppConfirmation(whatsappOrderData);
    
    // Create WhatsApp message with order details
    const whatsappMessage = createWhatsAppOrderMessage(whatsappOrderData);
    
    // Open WhatsApp with pre-filled message
    window.open(whatsappMessage, '_blank');
}

// Go back to product selection from payment
function goBackToProductSelection() {
    // Update step indicators
    updateStepIndicator(1);
    
    // Hide step 2, show step 1
    document.getElementById('step2-content').classList.add('hidden');
    document.getElementById('step1-content').classList.remove('hidden');
    
    // Scroll to product selection
    document.getElementById('step1-content').scrollIntoView({ behavior: 'smooth' });
}

// Update step indicator
function updateStepIndicator(step) {
    currentStep = step;
    
    // Reset all steps
    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById(`step${i}-circle`);
        if (i <= step) {
            circle.classList.remove('bg-gray-300', 'text-gray-600');
            circle.classList.add('bg-honey', 'text-white');
        } else {
            circle.classList.remove('bg-honey', 'text-white');
            circle.classList.add('bg-gray-300', 'text-gray-600');
        }
    }
}

// Open UPI app with pre-filled payment details
function openUpiApp() {
    if (!orderData.product) {
        showNotification('Please select a product first', 'error');
        return;
    }
    
    if (!orderData.orderNumber) {
        showNotification('Order ID not generated. Please try again.', 'error');
        return;
    }
    
    // Create UPI URI for direct app opening (using same Order ID as QR code)
    const upiString = `upi://pay?pa=${CONFIG.UPI_ID}&pn=${CONFIG.UPI_NAME}&am=${orderData.totalAmount}&cu=${CONFIG.CURRENCY}&tn=Mutoli ${orderData.product.name} - ${orderData.orderNumber}`;
    
    console.log('Opening UPI app with Order ID:', orderData.orderNumber);
    console.log('UPI String:', upiString);
    
    // Try to open UPI app directly
    const link = document.createElement('a');
    link.href = upiString;
    link.target = '_blank';
    
    // For mobile devices, this will open the UPI app
    // For desktop, it will show available UPI apps or fallback
    link.click();
    
    // Show notification
    showNotification(`Opening UPI app for Order ${orderData.orderNumber}...`, 'success');
    
    // Optional: Show fallback message after a delay
    setTimeout(() => {
        showNotification('If UPI app didn\'t open, please scan the QR code above', 'info');
    }, 3000);
}
