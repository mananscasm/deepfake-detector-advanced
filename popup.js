// Deepfake Detector - Popup Script
const confidenceEl = document.getElementById('confidence');
const verdictEl = document.getElementById('verdict');
const statusEl = document.getElementById('status');

// Function to get confidence from current tab
function getConfidence() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    
    chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_CONFIDENCE' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Error:", chrome.runtime.lastError.message);
        confidenceEl.textContent = '--%';
        verdictEl.textContent = 'Click refresh to start';
        statusEl.textContent = 'No video detected';
        return;
      }
      
      if (response && response.confidence !== undefined) {
        updateDisplay(response.confidence);
      } else {
        confidenceEl.textContent = '--%';
        verdictEl.textContent = 'No video detected';
        statusEl.textContent = 'Open a YouTube video';
      }
    });
  });
}

function updateDisplay(confidence) {
  confidenceEl.textContent = Math.round(confidence) + '%';
  
  if (confidence > 70) {
    verdictEl.textContent = '⚠️ Potential Deepfake Detected!';
    verdictEl.style.color = '#ff6b6b';
    statusEl.textContent = 'High confidence of AI manipulation';
  } else if (confidence > 40) {
    verdictEl.textContent = '⚠️ Suspicious - May be AI generated';
    verdictEl.style.color = '#ffa502';
    statusEl.textContent = 'Medium confidence, review carefully';
  } else {
    verdictEl.textContent = '✅ Likely Authentic';
    verdictEl.style.color = '#4caf50';
    statusEl.textContent = 'Low probability of deepfake';
  }
}

// Get confidence when popup opens
getConfidence();

// Report button
document.getElementById('reportBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'REPORT' }, (response) => {
      if (response && response.success) {
        alert('Report submitted! Thank you for helping fight misinformation.');
      } else {
        alert('Could not report. Make sure you are on a video page.');
      }
    });
  });
});

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', () => {
  getConfidence();
});