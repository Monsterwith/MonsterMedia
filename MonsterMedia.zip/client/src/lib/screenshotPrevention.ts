/**
 * Screenshot prevention utilities
 * 
 * This file contains functions to prevent or detect screenshot attempts
 * across different devices and platforms.
 */

// Prevent screenshots on desktop via CSS and JavaScript
export function preventScreenshots() {
  // Apply CSS to prevent simple screenshots
  const style = document.createElement('style');
  style.innerHTML = `
    /* Prevent standard selection */
    body {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* Prevent right-click context menu */
    body {
      -webkit-touch-callout: none;
    }
    
    /* Add CSS to prevent print screenshots */
    @media print {
      html, body {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Prevent keyboard shortcuts for screenshots
  document.addEventListener('keydown', (e) => {
    // Windows: PrintScreen, Alt+PrintScreen
    // macOS: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
    const isPrintScreen = e.key === 'PrintScreen';
    const isMacScreenshot = 
      (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'));
      
    if (isPrintScreen || isMacScreenshot) {
      e.preventDefault();
      showScreenshotWarning();
      return false;
    }
  });
  
  // Prevent right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
  
  // Listen for visibility change (detects when user switches tabs to screenshot tools)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // User might be switching to a screenshot tool
      // No action needed, just logging for awareness
    }
  });
  
  // Block browser's native screenshot API if available
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
    navigator.mediaDevices.getDisplayMedia = function(constraints) {
      showScreenshotWarning();
      return Promise.reject(new Error('Screenshots are not allowed on this site'));
    };
  }
}

// Show warning message when screenshot attempt is detected
function showScreenshotWarning() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.transform = 'translate(-50%, -50%)';
  container.style.background = 'rgba(0, 0, 0, 0.8)';
  container.style.color = 'white';
  container.style.padding = '20px';
  container.style.borderRadius = '10px';
  container.style.zIndex = '9999';
  container.style.textAlign = 'center';
  container.style.maxWidth = '400px';
  container.style.fontFamily = 'sans-serif';
  
  container.innerHTML = `
    <h3 style="margin-top: 0; color: #FF4081;">Screenshot Blocked</h3>
    <p>Screenshots are not allowed on MONSTERWITH to protect content.</p>
    <p>Please respect our content policy.</p>
    <button style="background: #7C4DFF; border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
      Dismiss
    </button>
  `;
  
  document.body.appendChild(container);
  
  // Remove the warning after clicking the button
  const dismissButton = container.querySelector('button');
  if (dismissButton) {
    dismissButton.addEventListener('click', () => {
      document.body.removeChild(container);
    });
  }
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }, 5000);
}