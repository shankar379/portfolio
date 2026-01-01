# Grid Scene Documentation

## Overview
The Grid Scene is a 3D interactive section in the portfolio that displays skill icons as 3D boxes on a reflective grid surface. It provides an immersive way to showcase technical skills and technologies.

## Visual Design

### Scene Layout
- **Background**: Pure black (#000000)
- **Grid Floor**: 
  - Dark reflective surface (color: `0x0a0a0a`)
  - Highly metallic (metalness: 0.95, roughness: 0.05)
  - 30x30 grid with subtle grey grid lines (opacity: 0.5)
  - Grid lines: `0x888888` (primary), `0x444444` (secondary)

### Lighting
- **Ambient Light**: Very subtle white light (intensity: 0.1)
- **Main Directional Light**: 
  - Position: Directly above (0, 20, 0)
  - Intensity: 2.4 (very bright)
  - Creates strong top-down lighting with dramatic shadows
  - Shadow map size: 2048x2048 for high quality

### Camera
- **View**: Isometric/three-quarter perspective
- **Position**: (14, 11, 14) looking at center (0, 0, 0)
- **Field of View**: 50 degrees
- **Interactive**: Users can drag to rotate the camera around the scene

## Icon Boxes

### Design
Each skill is represented by a **two-layer 3D box**:

1. **Base Layer** (Bottom):
   - Size: 1.0 x 0.12 x 1.0 units
   - Color: Light silver/metallic grey (`0xd0d0d0`)
   - Material: Highly reflective
     - Metalness: 0.98
     - Roughness: 0.02
     - Environment map intensity: 2.0
   - Creates a polished, mirror-like appearance

2. **Top Layer** (Icon Display):
   - Size: 0.75 x 0.15 x 0.75 units
   - Color: White (`0xffffff`) - changes to theme purple on hover
   - Material: Semi-metallic
     - Metalness: 0.3
     - Roughness: 0.4
   - Displays the skill icon as a texture on the top face

### Positioning
Icon boxes are spread across the grid in a scattered pattern:
- 14 icon boxes total (one for each skill)
- Positions range from -4 to 4 on both X and Z axes
- Each box sits directly on the grid floor
- Non-symmetrical, organic arrangement

### Interactive Features
- **Hover Effect**: 
  - When mouse hovers over an icon box, the top layer changes color
  - Normal color: White (`0xffffff`)
  - Hover color: Theme purple (`#a78bfa` / `0xa78bfa`)
  - Uses Three.js Raycaster for precise hover detection

## Skill Icons Displayed

The scene displays **14 different skill icons**:

1. **React** - React.js framework icon
2. **Tailwind** - Tailwind CSS icon
3. **Django** - Django web framework icon
4. **Python** - Python programming language icon
5. **Java** - Java programming language icon (custom SVG)
6. **Android Studio** - Android Studio IDE icon
7. **React Native + Expo** - Expo/React Native icon
8. **GitHub** - GitHub version control icon
9. **Three.js** - Three.js 3D library icon
10. **Figma** - Figma design tool icon
11. **Blender** - Blender 3D software icon
12. **Unreal Engine** - Unreal Engine game engine icon
13. **AWS EC2 + CI/CD** - Amazon EC2 cloud service icon
14. **Firebase** - Firebase platform icon

### Icon Rendering
- Icons are rendered as **canvas textures** using React components
- Each icon is:
  - Rendered to a 512x512 canvas
  - Displayed on a white background
  - Scaled to fit the top face of the box (307x307 pixels)
  - Loaded asynchronously to prevent blocking

## Technical Implementation

### Technologies Used
- **Three.js**: 3D rendering engine
- **React**: Component framework
- **React Icons**: Icon library (Simple Icons, Font Awesome)
- **Canvas API**: Icon texture generation

### Performance Optimizations
- Shadow map resolution: 2048x2048
- Pixel ratio capped at 2 for performance
- Efficient geometry disposal on cleanup
- Asynchronous texture loading

### User Interactions
1. **Camera Rotation**: 
   - Click and drag to rotate
   - Touch support for mobile devices
   - Smooth interpolation for camera movement
   - Vertical rotation limited to ±60 degrees

2. **Hover Detection**:
   - Real-time raycasting
   - Only active when not dragging
   - Smooth color transitions

## File Structure
- **Component**: `src/components/GridScene.jsx`
- **Styles**: `src/components/GridScene.css`
- **Section Wrapper**: `src/components/GridSection.jsx`
- **Section Styles**: `src/components/GridSection.css`

## Color Scheme
- **Background**: `#000000` (Black)
- **Grid Floor**: `#0a0a0a` (Very dark grey)
- **Base Layer**: `#d0d0d0` (Light silver)
- **Top Layer (Normal)**: `#ffffff` (White)
- **Top Layer (Hover)**: `#a78bfa` (Theme purple)
- **Grid Lines**: `#888888` / `#444444` (Medium grey)

## Responsive Behavior
- Scene adapts to window resize
- Camera aspect ratio updates automatically
- Renderer size adjusts to container dimensions

## Browser Compatibility
- Requires WebGL support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile device support with touch controls

