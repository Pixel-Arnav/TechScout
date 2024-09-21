document.addEventListener('DOMContentLoaded', () => {
    const cmsInfo = document.getElementById('cms-info');
    const jsInfo = document.getElementById('js-info');
    const hostingInfo = document.getElementById('hosting-info');
    const seoInfo = document.getElementById('seo-info');
    const sslInfo = document.getElementById('ssl-info');
    const loadingIndicator = document.getElementById('loading-indicator');
  
    // Show loading indicator while data is being fetched
    loadingIndicator.style.display = 'block';
  
    // Fetch the detected technologies from Chrome storage
    chrome.storage.local.get('detectedTech', (data) => {
      const tech = data.detectedTech || {};
  
      // Hide the loading indicator when data is ready
      loadingIndicator.style.display = 'none';
  
      // Handle CMS detection
      if (tech.cms) {
        cmsInfo.innerHTML = `<ul><li><strong>CMS:</strong> ${tech.cms}</li></ul>`;
        if (tech.theme) cmsInfo.innerHTML += `<li><strong>Theme:</strong> ${tech.theme}</li>`;
        if (tech.plugins) cmsInfo.innerHTML += `<li><strong>Plugins:</strong> ${tech.plugins.join(', ')}</li>`;
      } else {
        cmsInfo.innerHTML = `<p>No CMS detected</p>`;
      }
  
      // Handle JavaScript libraries and frameworks
      if (tech.jsFramework || tech.jsLibrary) {
        let jsOutput = '<ul>';
        if (tech.jsFramework) jsOutput += `<li><strong>Framework:</strong> ${tech.jsFramework}</li>`;
        if (tech.jsLibrary) jsOutput += `<li><strong>Library:</strong> ${tech.jsLibrary}</li>`;
        jsOutput += '</ul>';
        jsInfo.innerHTML = jsOutput;
      } else {
        jsInfo.innerHTML = `<p>No JavaScript libraries detected</p>`;
      }
  
      // Handle Hosting and Caching
      if (tech.hosting || tech.caching) {
        let hostingOutput = '<ul>';
        if (tech.hosting) hostingOutput += `<li><strong>Hosting:</strong> ${tech.hosting}</li>`;
        if (tech.caching) hostingOutput += `<li><strong>Caching:</strong> ${tech.caching}</li>`;
        hostingOutput += '</ul>';
        hostingInfo.innerHTML = hostingOutput;
      } else {
        hostingInfo.innerHTML = `<p>No hosting/caching detected</p>`;
      }
  
      // Handle SEO meta tags and performance metrics
      if (tech.metaDescription || tech.ogTitle || tech.canonicalURL || tech.ttfb || tech.pageLoadTime) {
        let seoOutput = '<ul>';
        if (tech.metaDescription) seoOutput += `<li><strong>Meta Description:</strong> ${tech.metaDescription}</li>`;
        if (tech.ogTitle) seoOutput += `<li><strong>OG Title:</strong> ${tech.ogTitle}</li>`;
        if (tech.canonicalURL) seoOutput += `<li><strong>Canonical URL:</strong> ${tech.canonicalURL}</li>`;
        if (tech.ttfb) seoOutput += `<li><strong>TTFB:</strong> ${tech.ttfb}</li>`;
        if (tech.pageLoadTime) seoOutput += `<li><strong>Page Load Time:</strong> ${tech.pageLoadTime}</li>`;
        seoOutput += '</ul>';
        seoInfo.innerHTML = seoOutput;
      } else {
        seoInfo.innerHTML = `<p>No SEO or performance metrics detected</p>`;
      }
  
      // Handle SSL information
      if (tech.sslIssuer || tech.sslValidUntil) {
        let sslOutput = '<ul>';
        if (tech.sslIssuer) sslOutput += `<li><strong>SSL Issuer:</strong> ${tech.sslIssuer}</li>`;
        if (tech.sslValidUntil) sslOutput += `<li><strong>Valid Until:</strong> ${tech.sslValidUntil}</li>`;
        sslOutput += '</ul>';
        sslInfo.innerHTML = sslOutput;
      } else {
        sslInfo.innerHTML = `<p>No SSL information detected</p>`;
      }
    });
  
    // Fetch error details, if any
    chrome.storage.local.get('error', (data) => {
      if (data.error) {
        // Display error message if any errors occurred during detection
        const errorDisplay = document.createElement('p');
        errorDisplay.textContent = `Error: ${data.error}`;
        document.body.appendChild(errorDisplay);
      }
    });
  });
  