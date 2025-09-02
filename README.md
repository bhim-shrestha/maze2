# 🏙️ City Maze - Advanced Maze Game

A modern, feature-rich maze game built with Next.js, TypeScript, and Tailwind CSS. Navigate through dynamic mazes, collect power-ups, avoid accidents, and challenge yourself through 99 increasingly difficult levels!

## ✨ Features

### 🎮 Core Gameplay
- **99 Progressive Levels** - Mazes get larger and more complex as you advance
- **Dynamic Path Changes** - Paths change every 7 seconds to keep you on your toes
- **Accident System** - Random accidents appear that you must avoid
- **Time Pressure** - 60 seconds per level adds urgency

### 🚀 Power-ups
- ⚡ **Speed Boost** - Move faster for 10 seconds
- ⏰ **Extra Time** - Add 15 seconds to your timer
- 🛡️ **Accident Shield** - Immunity to accidents for 15 seconds  
- 👁️ **Path Preview** - See upcoming path changes
- ✨ **Score Multiplier** - 2x score for 20 seconds

### 🎯 Advanced Features
- **High Score System** - Track your best performances
- **Combo System** - Chain power-up collections for bonus points
- **Multiple Control Methods** - Keyboard (WASD/Arrows), touch, and on-screen buttons
- **Audio & Haptic Feedback** - Sound effects and vibration feedback
- **Responsive Design** - Works perfectly on desktop and mobile
- **Settings Persistence** - Your preferences are saved locally

### 🎨 Modern UI/UX
- **Gradient Backgrounds** - Beautiful visual design
- **Smooth Animations** - Polished transitions and effects
- **Real-time Stats** - Live power-up timers and game info
- **Modal System** - Elegant game over and high score displays
- **Pause Functionality** - Pause/resume with spacebar

## 🛠️ Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Local Storage API** - Persistent data storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd maze2

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to play!

## 🎮 How to Play

### Controls
- **Keyboard**: Use WASD or Arrow Keys to move
- **Mobile**: Swipe to move or use on-screen buttons
- **Spacebar**: Pause/Resume game

### Objective
1. Navigate from the green home (top-left) to the red flag (bottom-right)
2. Avoid red accident markers unless you have a shield
3. Collect power-ups (floating emojis) for advantages
4. Complete levels quickly for higher scores
5. Chain power-ups for combo bonuses

### Scoring
- Base score: 5000 points
- -1 point per move (unless multiplier is active)
- +500 points per power-up collected
- Combo bonuses for consecutive power-ups
- Time bonuses for quick completion

## 🏆 Game Tips

1. **Plan Ahead** - Watch for upcoming path changes (orange borders)
2. **Power-up Strategy** - Save shields for accident-heavy areas
3. **Speed vs Safety** - Balance quick movement with careful navigation
4. **Combo Building** - Collect multiple power-ups quickly for bonus points
5. **Path Memory** - Remember maze layouts as they partially repeat

## 📱 Mobile Optimization

- Touch-friendly controls
- Responsive maze sizing
- Optimized button placement
- Haptic feedback support
- Portrait/landscape compatibility

## 🔧 Technical Architecture

```
maze2/
├── types/game.ts          # TypeScript type definitions
├── lib/
│   ├── storage.ts         # Local storage utilities
│   ├── powerUps.ts        # Power-up system logic
│   └── audio.ts           # Sound and vibration
├── components/
│   ├── ui/Controls.tsx    # Game controls
│   └── modals/           # Modal components
├── mazeUtils.ts          # Maze generation algorithms
└── ClientMaze.tsx        # Main game component
```

## 🎯 Future Enhancements

- [ ] Multiplayer mode
- [ ] Daily challenges
- [ ] Achievement system
- [ ] Custom maze editor
- [ ] Leaderboards (online)
- [ ] More power-up types
- [ ] Theme customization
- [ ] Maze sharing feature

## 🐛 Known Issues

- Audio may not work in some browsers due to autoplay policies
- Vibration only works on supported mobile devices

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Enjoy playing City Maze!** 🎮✨