\# 🎭 Deepfake Detector - Advanced Chrome Extension



Real-time deepfake detection with ML-powered analysis.



\## Features

\- Real-time video frame capture and analysis

\- Multiple detection methods (face warping, eye blink, lighting, skin texture)

\- Confidence scoring with color-coded indicators

\- Works on YouTube, TikTok, Instagram, and any HTML5 video

\- Export analysis reports

\- Privacy-first - all processing locally



\## Installation



1\. Clone or download this folder

2\. Open Chrome and go to `chrome://extensions/`

3\. Enable "Developer mode" (top right)

4\. Click "Load unpacked"

5\. Select this folder (`deepfake-detector-advanced/extension`)

6\. Extension icon appears in toolbar



\## Usage



1\. Go to YouTube or any video site

2\. Play any video

3\. Click the extension icon in Chrome toolbar

4\. Click "Activate on This Page"

5\. A panel appears on the video showing real-time analysis

6\. Watch the confidence score update as you watch!



\## Detection Methods



| Method | What It Detects |

|--------|-----------------|

| Face Warping | Unnatural facial distortions |

| Eye Blink | Abnormal blink patterns |

| Lighting | Inconsistent shadows/lighting |

| Skin Texture | Overly smooth or unnatural skin |



\## Color Guide



\- 🟢 \*\*0-35%\*\* - Likely Authentic

\- 🟡 \*\*35-65%\*\* - Suspicious  

\- 🔴 \*\*65-100%\*\* - Potential Deepfake



\## Tech Stack



\- Chrome Extension Manifest V3

\- JavaScript ES6

\- Canvas API for video capture

\- Chrome Storage API



\## File Structure



