/**
 * Vercel Web Analytics for Static Sites
 * This script initializes Vercel Web Analytics for vanilla JavaScript/HTML sites.
 * 
 * Installation: Include this script in all HTML pages before </body>
 * <script src="js/vercel-analytics.js"></script>
 * 
 * Note: After deploying to Vercel, you must enable Web Analytics in your 
 * Vercel dashboard (Analytics tab) for tracking to begin.
 */

(function() {
  // Initialize Vercel Analytics queue
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
  
  // Load the Vercel Analytics script
  // The unique path will be automatically configured by Vercel after deployment
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  
  // Append the script to the document
  var firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
})();
