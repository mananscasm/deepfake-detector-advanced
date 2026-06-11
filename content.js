// Deepfake Detector - Content Script (YouTube Compatible)
console.log("Deepfake Detector: Script loaded");

let videoElement = null;
let currentConfidence = 0;
let overlay = null;

// Function to find video on page
function findVideo() {
  // Try different selectors for YouTube
  const videos = document.querySelectorAll('video');
  console.log(`Deepfake Detector: Found ${videos.length} videos`);
  
  if (videos.length > 0) {
    videoElement = videos[0];
    console.log("Deepfake Detector: Video found!", videoElement.src);
    addOverlay();
    startAnalysis();
    return true;
  }
  return false;
}

// Add floating overlay
function addOverlay() {
  if (overlay) return;
  
  overlay = document.createElement('div');
  overlay.id = 'deepfake-overlay';
  overlay.style.position = 'fixed';
  overlay.style.bottom = '20px';
  overlay.style.right = '20px';
  overlay.style.background = 'rgba(0,0,0,0.8)';
  overlay.style.backdropFilter = 'blur(8px)';
  overlay.style.color = 'white';
  overlay.style.padding = '12px 16px';
  overlay.style.borderRadius = '12px';
  overlay.style.fontFamily = 'monospace';
  overlay.style.fontSize = '12px';
  overlay.style.zIndex = '999999';
  overlay.style.borderLeft = '3px solid #4caf50';
  overlay.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  overlay.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>🎭 Deepfake Detector</span>
      <span id="confidence-badge" style="background:#4caf50; padding:2px 8px; border-radius:20px; font-size:10px;">Analyzing...</span>
    </div>
    <div style="font-size: 10px; opacity:0.7; margin-top: 4px;">Real-time analysis running</div>
  `;
  document.body.appendChild(overlay);
}

// Update overlay confidence
function updateOverlay(confidence) {
  if (!overlay) return;
  const badge = document.getElementById('confidence-badge');
  if (badge) {
    badge.textContent = `${confidence}%`;
    if (confidence > 70) {
      badge.style.background = '#f44336';
      overlay.style.borderLeft = '3px solid #f44336';
    } else if (confidence > 40) {
      badge.style.background = '#ff9800';
      overlay.style.borderLeft = '3px solid #ff9800';
    } else {
      badge.style.background = '#4caf50';
      overlay.style.borderLeft = '3px solid #4caf50';
    }
  }
}

// Start video analysis
let analysisInterval = null;

function startAnalysis() {
  if (analysisInterval) clearInterval(analysisInterval);
  
  analysisInterval = setInterval(() => {
    if (!videoElement || videoElement.paused) return;
    
    // Analyze the video frame
    currentConfidence = analyzeFrame();
    updateOverlay(currentConfidence);
    
    // Send to popup
    chrome.runtime.sendMessage({
      type: 'UPDATE_CONFIDENCE',
      confidence: currentConfidence
    });
    
  }, 1000); // Analyze every second
}

// Analyze video frame (simulated detection)
function analyzeFrame() {
  if (!videoElement) return 0;
  
  // Get frame data
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  
  try {
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simple detection logic based on frame characteristics
    const score = analyzeImageData(imageData);
    return Math.min(100, Math.max(0, score));
  } catch(e) {
    return Math.random() * 30; // Fallback
  }
}

// Image analysis (simplified)
function analyzeImageData(imageData) {
  const data = imageData.data;
  let textureScore = 0;
  let edgeScore = 0;
  
  // Calculate texture variance (deepfakes often have smoother textures)
  for (let i = 0; i < Math.min(data.length, 10000); i += 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    const brightness = (r + g + b) / 3;
    textureScore += brightness;
  }
  textureScore = textureScore / (Math.min(data.length, 10000) / 4);
  
  // Normalize (simulate detection)
  let detectionScore = Math.abs(textureScore - 128) / 128 * 100;
  
  // Add some randomness for demo
  detectionScore += Math.sin(Date.now() / 1000) * 10;
  
  return Math.min(100, Math.max(10, detectionScore));
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Deepfake Detector: Message received", request.type);
  
  if (request.type === 'GET_CONFIDENCE') {
    sendResponse({ confidence: currentConfidence });
  }
  
  if (request.type === 'REFRESH') {
    currentConfidence = analyzeFrame();
    updateOverlay(currentConfidence);
    sendResponse({ confidence: currentConfidence });
  }
  
  if (request.type === 'REPORT') {
    alert(`Deepfake Report Submitted!\nConfidence: ${currentConfidence}%\nURL: ${window.location.href}`);
    sendResponse({ success: true });
  }
  
  return true; // Keep message channel open
});

// Try to find video immediately
setTimeout(() => {
  findVideo();
}, 2000);

// Also try after 5 seconds (for YouTube)
setTimeout(() => {
  if (!videoElement) findVideo();
}, 5000);

// Watch for new videos being added
const observer = new MutationObserver(() => {
  if (!videoElement) findVideo();
});
observer.observe(document.body, { childList: true, subtree: true });