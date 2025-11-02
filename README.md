# 🎨 Art Beyond Sight
> 
> **Art is for everyone and everything is art.**  
> *Art Beyond Sight* redefines how we experience art by transforming images, from paintings and monuments to everyday scenes — into **immersive auditory and descriptive journeys**.
> **  This app is a reminder that technology’s highest purpose is to make the world more inclusive, creative, and human.
Through sound, we hope to give vision 
 through empathy, we hope to create art that everyone can feel.**
---

## 🌍 Vision

Art isn’t just something to look at — it’s something to **feel, hear, and experience**.  
Many art forms — like paintings, architecture, and landscapes — are confined to sight. But *Art Beyond Sight* opens art to all the senses.

We created a mobile app that allows users — regardless of background or ability — to experience art through **music, text and narration**.  
By turning images into melodies and spoken descriptions, we let everyone connect with art on a deeper emotional and sensory level.

> Because art isn’t just something to look at — it’s something to feel.

> More Description: https://www.hackathonparty.com/hackathons/26/projects/361

> Demo Link: https://www.youtube.com/watch?v=qBoSwC7vGdo&t=304s
---

## 📱 Overview

**Art Beyond Sight** is a cross-platform mobile app (Android & iOS) that implements **AI-driven workflow** to translate visual content into musical and narrative experiences.

**Key Capabilities:**
- 🖼️ **AI Image Understanding** — Identify visual elements, styles, and emotions.  
- 🎵 **Music Generation** — Compose melodies that reflect tone, color, and emotion.  
- 🗣️ **Narration with TTS** — Generate natural voice descriptions using text-to-speech.  
- 💾 **Smart Caching** — Stores analysis results for rapid retrieval.  
- ♿ **Inclusive Experience** — Designed for both visually impaired users and those seeking multisensory exploration.

---

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account
- API Keys: **Mistral Navigator**, **Suno AI**, **Unreal Speech**

---

### **Quick Start**

```bash
# 1. Clone Repository
git clone https://github.com/yourusername/ArtBeyondSight.git
cd ArtBeyondSight

# 2. Frontend Setup
npm install
npx expo start

# 3. Backend Setup
cd backend
pip install -r requirements.txt
python main.py
4. Environment Configuration
Create /backend/.env:

bash
Copy code
MONGODB_URI=your_mongodb_connection_string
MONGODB_PASSWORD=your_mongodb_password
MISTRAL_API_KEY=your_mistral_key
SUNO_API_KEY=your_suno_key
UNREAL_SPEECH_KEY=your_unreal_key
```
```
### **🏗️ Technical Architecture**

Main Workflow Pipeline
text
Copy code
User Takes or Uploads Photo (React Native + Expo)
     ↓
analyzeImage() in analyzeImageWithNavigator.ts
     ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Navigator AI Vision Analysis (Mistral Model)        │
│                                                             │
│ async function analyzeWithNavigator(                        │
│   imageUri: string,                                         │
│   mode: 'museum' | 'monuments' | 'landscape'                │
│ ): Promise<{                                                │
│   name: string;              // "Starry Night"              │
│   creator: string;           // "Vincent van Gogh"          │
│   category: string;          // "Post-Impressionism"        │
│   historicalPrompt: string;  // 500-char context            │
│   immersivePrompt: string;   // 400-char sensory narrative  │
│ }>                                                           │
│                                                             │
│ • Converts image to base64                                  │
│ • Sends prompts to Mistral API                              │
│ • Extracts structured metadata                              │
│ • Response time: ~8–12 sec                                  │
└─────────────────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Suno AI Music Generation                            │
│                                                             │
│ 1. Extract elements: colors, emotion, and movement           │
│ 2. Map them to musical attributes                            │
│ 3. Generate mode-specific music prompt                       │
│ 4. Submit to Suno API and poll for completion                │
│                                                             │
│ • Response time: ~60–120 sec                                │
│ • Returns streaming audio URL                               │
└─────────────────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Database Caching & Retrieval                        │
│                                                             │
│ ArtBeyondSightAPI.saveAnalysis() → MongoDB                  │
│                                                             │
│ FastAPI Endpoint: POST /api/image-analysis                  │
│      ↓                                                      │
│ MongoDB Collection: sight_data.artifacts                    │
│                                                             │
│ • If found: Return cached data (<0.5s)                      │
│ • If not found: Run full AI analysis                        │
└─────────────────────────────────────────────────────────────┘
```
---

## 🧠 Mode-Specific AI Prompting

Each mode in **Art Beyond Sight** tailors its AI pipeline to the type of visual input, combining historical analysis with immersive, emotion-driven storytelling.

| Mode | Metadata Extracted | Historical Prompt | Immersive Prompt | Music Style |
|------|--------------------|-------------------|------------------|--------------|
| **Museum** | Artwork title, artist, genre | Artistic context | Sensory, poetic color & emotion mapping | Classical |
| **Monuments** | Monument name, creator, type | Historical and cultural importance | Emotional grandeur of presence | Epic Orchestral, Cinematic |
| **Landscape** | Region, environment, geography | Ecology and natural elements | Atmosphere, textures, light, and soundscape | Ambient, Nature Sounds |
```
---
```
## 🗄️ Database Schema

### **MongoDB Structure**

```json
{
  "_id": "ObjectId(...)",
  "image_name": "Starry Night",
  "analysis_type": "museum",
  "descriptions": [
    "Historical: This artwork is 'The Starry Night,' created by Vincent van Gogh in 1889...",
    "Immersive: Vibrant cerulean skies swirl with golden stars lighting the quiet night..."
  ],
  "metadata": {
    "creator": "Vincent van Gogh",
    "category": "Post-Impressionism",
    "imageUri": "file:///path/to/image.jpg",
    "audioUri": "https://cdn.suno.ai/...",
    "historicalPrompt": "500-character museum description...",
    "immersivePrompt": "400-character sensory narrative...",
    "mode": "museum",
    "type": "painting",
    "emotions": ["dreamy", "melancholy", "serene"]
  },
  "created_at": "2025-10-26T12:00:00Z",
  "updated_at": "2025-10-26T12:00:00Z"
}
```
---


♿ Accessibility: Designed for Everyone
Art Beyond Sight is inclusive by design — made for people of all abilities, and for anyone who wants to hear, feel, and reimagine art.
```
--- 
🔊 Voice & Audio Integration
typescript
Copy code
function announceOrSpeak(text: string) {
  if (isScreenReaderEnabled) {
    AccessibilityInfo.announceForAccessibility(text);
  } else {
    speakWithUnrealSpeech(text);
  }
}
```
---

## Key Features

Dual TTS System (VoiceOver / TalkBack or Unreal Speech)

Adjustable speech rate (0.3–2.0×) and pitch (0.5–2.0×)

Automatic premium voice selection (Dan, Scarlett, Liv)

Haptic feedback and real-time screen reader detection

Audio layering (music + narration)

## 🧭 Context-Aware Narration
# Scenario	Example Narration
Mode Entry	“You are now in Museum Mode. Upload or take a photo to begin.”
During Analysis	“Analyzing painting… generating immersive description and music.”
Result Ready	“Results ready: Starry Night by Vincent van Gogh. Tap Historical for context or Immersive for experience.”

# 🪄 Accessible-First Components
```
typescript
Copy code
<VOPressable
  accessibilityLabel="Museum mode"
  accessibilityHint="Opens camera to explore artworks"
  onPress={() => openMode('museum')}
>
  <ModeButton label="Museum" icon="palette" />
</VOPressable>
```

## Benefits

WCAG AAA-compliant touch targets (≥44×44pt)

Screen reader focus management

Full keyboard and switch control

Audio + haptic feedback integration
```
## ⚙️ Accessibility Settings

┌─────────────────────────────────────────┐
│ Enable TTS                    [Toggle]  │
│ • Test Voice button for preview         │
├─────────────────────────────────────────┤
│ TTS Speed: [–] 0.85 [+]                 │
│ • Range: 0.30 - 2.00                    │
├─────────────────────────────────────────┤
│ TTS Pitch: [–] 1.00 [+]                 │
│ • Range: 0.50 - 2.00                    │
├─────────────────────────────────────────┤
│ [Save Settings]  [Reset Defaults]       │
└─────────────────────────────────────────┘
```

## 💡 Why It Matters and Key Learnings

We learned a lot about implemeting AI solutions in real life settings with this project. We started with building a ResNet model and realized the accuracy wasnt on par with our testing standards so we switched to UF sponsored Navigator API. 

Art Beyond Sight bridges technology, creativity, and accessibility — letting anyone experience art through sound, emotion, and storytelling.

Whether you’re an artist, educator, traveler, or simply curious, the app enables exploration of art in new multisensory dimensions.

Art isn’t just something to look at — it’s something to feel, hear, and live.

## 🧩 Built With
React Native + Expo — Mobile frontend

FastAPI — Backend server

MongoDB Atlas — Cloud database

Mistral AI — Vision and text understanding

Suno AI — Music and emotion generation

Unreal Speech — Realistic TTS narration

## 💖 Credits
Built with ❤️ by the Art Beyond Sight Team
🏆 Created for Gator Hacks 2025
