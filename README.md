# Music Visualizer

A dynamic, interactive music visualization application built with React and Three.js that transforms your audio files into stunning, reactive visual experiences.

## Features

- **Audio File Playback**: Upload and play your own audio files
- **Real-time Frequency Analysis**: Powered by Web Audio API
- **Three Distinct Visualizations**:
  - **Sphere Visualizer**: A responsive particle sphere that morphs to the music
  - **Speaker Rings**: Orbiting speaker visualizations that react to different frequency ranges
  - **Background Starfield**: Ambient stars that pulse with the music's overall energy
- **Playback Controls**: Play/pause, seek through tracks, and view time information
- **Responsive Design**: Adapts to different screen sizes
- **Real-time Rendering**: Smooth animations powered by Three.js

## Technologies Used

- **React**: Front-end UI and component architecture
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics rendering
- **Web Audio API**: Audio processing and frequency analysis
- **CSS**: Styling and animations

## Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/music-viz.git
   cd music-viz
2. Using npm
    ```bash 
    npm install 
    npm run dev
3. Using yarn
    ```bash 
    yarn install 
    yarn dev
4. Open your browser and navigate to http://localhost:3000


### Usage
1. Click "Choose Audio File" to upload an audio file (MP3, WAV, OGG, etc.)
2. Once loaded, use the play button to start the visualization
3. The visualization will react to different frequency ranges in the audio:
    - Low frequencies (bass): Affect the orange speaker rings
    - Mid frequencies: Control the cyan speaker rings
    - High frequencies (treble): Animate the blue speaker rings
    - Overall energy: Influences the sphere and background particles
### How It Works
The application works by:
1. Audio Processing:
    - Loading the selected audio file
    - Creating an Audio Context and Analyser Node
    - Sampling frequency data in real-time
2. Visualization:
    - Mapping frequency data to particle positions, colors, and sizes
    - Updating the 3D scene at 60fps
    - Applying mathematical transformations to create organic movement
3. Rendering:
    - Using Three.js WebGL renderer for hardware-accelerated graphics
    - Managing scene objects, lighting, and camera perspective

### Code Structure
 - MusicViz.tsx: Main component handling audio setup and visualization coordination
 - components/Sphere.ts: Creates and animates the central particle sphere
 - components/Speakers.ts: Manages the orbiting speaker ring visualizations
 - components/Background.ts: Controls the ambient starfield particles

### Performance Considerations
 - The visualization is optimized for modern browsers and devices
 - Heavy calculations are minimized during animation loops
 - Particle counts are balanced for visual quality and performance

### Future Enhancements
 - Additional visualization types
 - Audio effects processing
 - Preset visualization styles
 - Ability to save and share visualizations
 - VR mode for immersive visualization experiences

### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments
 - Inspired by music visualizers from various media players
 - Three.js community for excellent documentation and examples
 - Web Audio API for powerful audio processing capabilities