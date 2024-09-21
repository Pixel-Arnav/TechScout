// Function to detect CMS platforms from headers and page content
function detectCMS(details) {
    const headers = details.responseHeaders;
    let detectedTech = {};
  
    function analyzeHTML(url) {
      fetch(url)
        .then((response) => response.text())
        .then((html) => {
          // WordPress theme & plugin detection
          if (html.includes('/wp-content/themes/')) {
            detectedTech['cms'] = 'WordPress';
            const themeMatch = html.match(/\/wp-content\/themes\/([a-zA-Z0-9-_]+)/);
            if (themeMatch && themeMatch[1]) {
              detectedTech['theme'] = themeMatch[1];
            }
            const pluginMatches = [...html.matchAll(/\/wp-content\/plugins\/([a-zA-Z0-9-_]+)/g)];
            if (pluginMatches.length > 0) {
              detectedTech['plugins'] = pluginMatches.map((match) => match[1]);
            }
          }
  
          // Webflow detection
          if (html.includes('data-wf-site')) {
            detectedTech['cms'] = 'Webflow';
          }
  
          // Shopify detection
          if (html.includes('.myshopify.com') || html.includes('Shopify.theme')) {
            detectedTech['cms'] = 'Shopify';
          }
  
          // Wix detection
          if (html.includes('wix.com') || html.includes('X-Wix-Request-Id')) {
            detectedTech['cms'] = 'Wix';
          }
  
          // Squarespace detection
          if (html.includes('static.squarespace.com') || html.includes('Squarespace.Commerce')) {
            detectedTech['cms'] = 'Squarespace';
          }
  
          // Magento detection
          if (html.includes('/skin/frontend/') || html.includes('Magento_Cookie')) {
            detectedTech['cms'] = 'Magento';
          }
  
          // Drupal detection
          if (html.includes('Drupal.settings') || html.includes('sites/default/files')) {
            detectedTech['cms'] = 'Drupal';
          }
  
          // Joomla detection
          if (html.includes('Joomla!') || html.includes('joomla.org')) {
            detectedTech['cms'] = 'Joomla';
          }
  
          // Store detected technologies
          chrome.storage.local.set({ detectedTech });
        })
        .catch((error) => {
          console.error('Error fetching HTML:', error);
          chrome.storage.local.set({ error: 'Unable to fetch website content' });
        });
    }
  
    // Check headers for CMS-related information
    headers.forEach((header) => {
      if (header.name.toLowerCase() === 'x-powered-by') {
        const headerValue = header.value.toLowerCase();
  
        // Detect WordPress, Drupal, Joomla, Magento via headers
        if (headerValue.includes('wordpress')) {
          detectedTech['cms'] = 'WordPress';
          analyzeHTML(details.url);
        }
  
        if (headerValue.includes('drupal')) {
          detectedTech['cms'] = 'Drupal';
        }
  
        if (headerValue.includes('joomla')) {
          detectedTech['cms'] = 'Joomla';
        }
  
        if (headerValue.includes('magento')) {
          detectedTech['cms'] = 'Magento';
        }
      }
  
      // Detect Squarespace, Wix, and Shopify via headers
      if (header.name.toLowerCase() === 'x-squarespace-version') {
        detectedTech['cms'] = 'Squarespace';
      }
  
      if (header.name.toLowerCase() === 'x-wix-request-id') {
        detectedTech['cms'] = 'Wix';
      }
  
      if (header.name.toLowerCase() === 'x-shopify-stage') {
        detectedTech['cms'] = 'Shopify';
      }
    });
  
    // If no CMS was detected via headers, check the HTML
    if (!detectedTech['cms']) {
      analyzeHTML(details.url);
    } else {
      chrome.storage.local.set({ detectedTech });
    }
  }
  
  // Function to detect JavaScript libraries and frameworks
  function detectJavaScriptLibraries(details) {
    let detectedTech = {};
  
    fetch(details.url)
      .then((response) => response.text())
      .then((html) => {
        // Detect React, Angular, Vue, jQuery via HTML content
        if (html.includes('react')) {
          detectedTech['jsFramework'] = 'React';
        }
  
        if (html.includes('angular')) {
          detectedTech['jsFramework'] = 'Angular';
        }
  
        if (html.includes('vue')) {
          detectedTech['jsFramework'] = 'Vue.js';
        }
  
        if (html.includes('jquery')) {
          detectedTech['jsLibrary'] = 'jQuery';
        }
  
        // Store detected JavaScript libraries and frameworks
        chrome.storage.local.set({ detectedTech });
      })
      .catch((error) => {
        console.error('Error fetching JavaScript libraries:', error);
      });
  }
  
  // Function to detect hosting, caching, and SSL information
  function detectHostingCachingAndSSL(details) {
    let detectedTech = {};
  
    details.responseHeaders.forEach((header) => {
      // Detect hosting server
      if (header.name.toLowerCase() === 'server') {
        detectedTech['hosting'] = header.value;
      }
  
      // Detect Cloudflare caching
      if (header.name.toLowerCase() === 'cf-cache-status') {
        detectedTech['caching'] = 'Cloudflare';
      }
    });
  
    // Get SSL information from the connection details
    chrome.webRequest.getSecurityInfo(details.requestId, {}, (securityInfo) => {
      if (securityInfo) {
        detectedTech['sslIssuer'] = securityInfo.certificateIssuer;
        detectedTech['sslValidUntil'] = securityInfo.validTo;
      }
      chrome.storage.local.set({ detectedTech });
    });
  }
  
  // Function to detect performance metrics (TTFB and Page Load Time)
  function detectPerformanceMetrics() {
    let detectedTech = {};
    const performanceData = window.performance.timing;
  
    const ttfb = performanceData.responseStart - performanceData.navigationStart;
    const pageLoadTime = performanceData.loadEventEnd - performanceData.navigationStart;
  
    detectedTech['ttfb'] = `${ttfb} ms`;
    detectedTech['pageLoadTime'] = `${pageLoadTime} ms`;
  
    chrome.storage.local.set({ detectedTech });
  }
  
  // Function to detect SEO meta tags and essential files
  function detectSEOTagsAndFiles(details) {
    let detectedTech = {};
  
    fetch(details.url)
      .then((response) => response.text())
      .then((html) => {
        // Detect Meta Description
        const metaDescriptionMatch = html.match(/<meta name="description" content="(.*?)"/);
        if (metaDescriptionMatch && metaDescriptionMatch[1]) {
          detectedTech['metaDescription'] = metaDescriptionMatch[1];
        }
  
        // Detect Open Graph Tags
        const ogTitleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
        if (ogTitleMatch && ogTitleMatch[1]) {
          detectedTech['ogTitle'] = ogTitleMatch[1];
        }
  
        // Detect Canonical Links
        const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/);
        if (canonicalMatch && canonicalMatch[1]) {
          detectedTech['canonicalURL'] = canonicalMatch[1];
        }
  
        // Check for robots.txt and sitemap.xml
        fetch(details.url + '/robots.txt').then((res) => {
          if (res.ok) {
            detectedTech['robotsTxt'] = 'Present';
          }
        });
  
        fetch(details.url + '/sitemap.xml').then((res) => {
          if (res.ok) {
            detectedTech['sitemapXml'] = 'Present';
          }
        });
  
        chrome.storage.local.set({ detectedTech });
      })
      .catch((error) => {
        console.error('Error fetching SEO tags:', error);
      });
  }
  
  // Main event listener for headers and content detection
  chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
      detectCMS(details);
      detectJavaScriptLibraries(details);
      detectHostingCachingAndSSL(details);
      detectSEOTagsAndFiles(details);
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
  );
  
  // Event listener for performance metrics after the page load
  chrome.webNavigation.onCompleted.addListener((details) => {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      function: detectPerformanceMetrics,
    });
  });
  