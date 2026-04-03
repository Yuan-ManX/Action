'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-warm-cream overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,189,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,211,253,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        {/* Multiple Animated Gradient Orbs */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.4, 1],
            x: [0, 80, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,189,65,0.15) 0%, rgba(251,189,65,0) 70%)',
            filter: 'blur(60px)'
          }}
        ></motion.div>

        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
            y: [0, -40, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-50 -right-50 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,211,253,0.12) 0%, rgba(59,211,253,0) 70%)',
            filter: 'blur(70px)'
          }}
        ></motion.div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(193,176,255,0.18) 0%, rgba(193,176,255,0) 70%)',
            filter: 'blur(50px)'
          }}
        ></motion.div>

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.4, 0.15]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 left-1/3 w-56 h-56 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,211,253,0.15) 0%, rgba(59,211,253,0) 70%)',
            filter: 'blur(45px)'
          }}
        ></motion.div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => {
          const positions = [
            { left: '10%', top: '15%' }, { left: '25%', top: '70%' },
            { left: '45%', top: '25%' }, { left: '65%', top: '80%' },
            { left: '85%', top: '35%' }, { left: '15%', top: '55%' },
            { left: '35%', top: '90%' }, { left: '55%', top: '45%' },
            { left: '75%', top: '65%' }, { left: '95%', top: '20%' },
            { left: '5%', top: '40%' }, { left: '30%', top: '10%' },
            { left: '50%', top: '60%' }, { left: '70%', top: '15%' },
            { left: '90%', top: '75%' }, { left: '20%', top: '85%' },
            { left: '40%', top: '50%' }, { left: '60%', top: '30%' },
            { left: '80%', top: '55%' }, { left: '12%', top: '28%' }
          ]
          const pos = positions[i % positions.length]
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-lemon-400/30 rounded-full"
              style={{ left: pos.left, top: pos.top }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + (i * 0.3) % 4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            ></motion.div>
          )
        })}

        <div className="relative z-10 text-center px-6 py-20 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            {/* Logo with 007 Camera Reveal Animation */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ 
                scale: [0.3, 1.15, 1, 1.04, 1],
                opacity: [0, 1, 1, 1, 1]
              }}
              transition={{ 
                duration: 2.5,
                times: [0, 0.4, 0.6, 0.8, 1],
                ease: "easeOut"
              }}
              className="inline-block mb-12"
            >
              <div className="w-36 h-36 relative mx-auto">
                {/* Outer Glow Ring - Expanding Effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.8, 1.3, 1.1, 1],
                    opacity: [0, 0.6, 0.3, 0.2, 0.15]
                  }}
                  transition={{ 
                    duration: 2.5,
                    times: [0, 0.35, 0.55, 0.75, 1],
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(251,189,65,0.4) 0%, rgba(59,211,253,0.2) 50%, transparent 70%)',
                    filter: 'blur(20px)'
                  }}
                ></motion.div>

                {/* Camera Lens Rings - 007 Style */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: [0, 1.2, 1], rotate: [-90, 0] }}
                  transition={{ duration: 1.2, times: [0, 0.6, 1], ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-2 border-lemon-500/40"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(251,189,65,0.2)'
                  }}
                ></motion.div>

                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: [0, 1.3, 1], rotate: [-90, 0] }}
                  transition={{ duration: 1.4, times: [0, 0.55, 1], ease: "easeOut", delay: 0.05 }}
                  className="absolute inset-2 rounded-full border-2 border-slushie-500/30"
                ></motion.div>

                {/* Main Icon Container - Glassmorphism */}
                <div className="relative w-full h-full bg-white/[0.06] backdrop-blur-xl rounded-full flex items-center justify-center border border-white/[0.12] shadow-2xl overflow-hidden">
                  {/* Animated Conic Border - Like Camera Aperture */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full p-[2px]"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 0%, rgba(251,189,65,0.6) 20%, transparent 40%, rgba(59,211,253,0.6) 60%, transparent 80%, rgba(193,176,255,0.4) 100%)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)'
                    }}
                  >
                    <div className="w-full h-full bg-[#0a0a0a] rounded-full"></div>
                  </motion.div>

                  {/* Inner Lens Reflection */}
                  <motion.div
                    initial={{ opacity: 0, x: '-100%' }}
                    animate={{ opacity: [0, 0.8, 0.4, 0.7], x: ['100%', '-100%', '100%', '-100%'] }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)'
                    }}
                  ></motion.div>
                  
                  {/* Shine Sweep Effect */}
                  <motion.div
                    initial={{ x: '-150%', opacity: 0 }}
                    animate={{ x: ['250%', '-150%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)',
                      transform: 'skewX(-20deg)'
                    }}
                  ></motion.div>

                  {/* Camera Icon with Pulse */}
                  <motion.span
                    animate={{ 
                      scale: [1, 1.08, 1],
                      textShadow: [
                        '0 0 20px rgba(251,189,65,0.5)',
                        '0 0 40px rgba(59,211,253,0.3)',
                        '0 0 20px rgba(251,189,65,0.5)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-7xl relative z-10 block"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(251,189,65,0.3))' }}
                  >🎬</motion.span>
                </div>

                {/* Flash Effect on Load */}
                <motion.div
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{ opacity: [1, 0.8, 0], scale: [0, 2, 3] }}
                  transition={{ duration: 1.2, times: [0, 0.15, 1], ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-white/80 via-lemon-400/60 to-transparent pointer-events-none"
                  style={{ mixBlendMode: 'overlay' }}
                ></motion.div>
              </div>
            </motion.div>

            {/* Main Heading with Gradient Text */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-display-hero mt-8 mb-6 font-roobert relative inline-block leading-tight"
            >
              <span className="bg-gradient-to-r from-pure-white via-white to-white/90 bg-clip-text text-transparent">
                Action
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8, type: "spring", stiffness: 80 }}
                className="absolute -bottom-3 left-0 right-0 h-1 rounded-full"
                style={{
                  background: 'linear-gradient(to right, #fbbd41, #3bd3fd, #c1b0ff, #3bd3fd, #fbbd41)',
                  backgroundSize: '200% 100%'
                }}
              ></motion.div>
            </motion.h1>

            {/* Subtitle - Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.85) 50%, #e0e0e0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              An AI-Native Interactive Video Agent
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="text-lg md:text-xl text-white/60 mb-16 max-w-2xl mx-auto leading-relaxed font-light italic"
            >
              Where your imagination meets intelligent creation — transforming every idea into immersive, interactive creative stories
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              className="flex items-center justify-center gap-5 flex-wrap"
            >
              {/* Primary CTA Button */}
              <Link href="/dashboard">
                <motion.button
                  whileHover={{
                    rotateZ: -6,
                    y: -16,
                    boxShadow: '0 20px 60px rgba(251,189,65,0.35), 0 0 0 1px rgba(251,189,65,0.3)',
                    scale: 1.03
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative px-14 py-5 bg-gradient-to-r from-lemon-500 via-yellow-400 to-slushie-500 text-clay-black font-bold rounded-pill shadow-2xl hover:shadow-[0_20px_60px_rgba(251,189,65,0.35)] transition-all clay-focus overflow-hidden"
                  style={{ fontSize: '17px', fontWeight: '700' }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Creating Free
                    <motion.span
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                  </span>
                  
                  {/* Button Inner Glow */}
                  <motion.div
                    initial={{ x: '-150%' }}
                    whileHover={{ x: '250%' }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  ></motion.div>
                  
                  {/* Top Highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                </motion.button>
              </Link>

              {/* Secondary Ghost Button */}
              <motion.button
                whileHover={{
                  rotateZ: -4,
                  y: -10,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  boxShadow: '0 10px 40px rgba(59,211,253,0.15)'
                }}
                whileTap={{ scale: 0.97 }}
                className="group px-9 py-5 bg-transparent border border-white/15 text-white/80 font-semibold rounded-card hover:text-white hover:border-white/30 transition-all clay-focus"
                style={{ fontSize: '16px', fontWeight: '600' }}
              >
                Watch Demo
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block ml-2"
                >
                  ▶
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Feature Preview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9, type: "spring", stiffness: 80 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto"
          >
            {/* Card 1 - AI Native Content Creation */}
            <motion.div
              whileHover={{
                y: -14,
                boxShadow: '0 25px 60px rgba(251,189,65,0.2), 0 0 0 1px rgba(251,189,65,0.15)',
                borderColor: 'rgba(251,189,65,0.3)'
              }}
              className="group bg-ube-800/20 backdrop-blur-sm rounded-feature p-7 border border-ube-400/25 shadow-2xl relative overflow-hidden cursor-pointer transition-colors"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-lemon-500/10 to-transparent pointer-events-none"
              ></motion.div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotateZ: 12, scale: 1.12 }}
                  className="w-14 h-14 bg-gradient-to-br from-lemon-500 to-orange-500 rounded-feature flex items-center justify-center mb-5 shadow-lg shadow-lemon-500/30 relative overflow-hidden"
                >
                  <span className="text-2xl relative z-10">💡</span>
                  <motion.div
                    initial={{ x: '-100%', opacity: 0.5 }}
                    whileHover={{ x: '200%', opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  ></motion.div>
                </motion.div>

                <motion.h3
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="text-lg font-bold mb-2 group-hover:text-lemon-400 transition-colors"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #ffffff, #fbbd41, #ffffff)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  AI Native Content Creation
                </motion.h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Generate scripts, storylines & visual concepts through intelligent dialogue
                </p>
              </div>
            </motion.div>

            {/* Card 2 - AI Video Agent */}
            <motion.div
              whileHover={{
                y: -14,
                boxShadow: '0 25px 60px rgba(59,211,253,0.2), 0 0 0 1px rgba(59,211,253,0.15)',
                borderColor: 'rgba(59,211,253,0.3)'
              }}
              className="group bg-white/[0.04] backdrop-blur-sm rounded-feature p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden cursor-pointer transition-colors"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-slushie-500/10 to-transparent pointer-events-none"
              ></motion.div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotateZ: -12, scale: 1.12 }}
                  className="w-14 h-14 bg-gradient-to-br from-slushie-500 to-blueberry-800 rounded-feature flex items-center justify-center mb-5 shadow-lg shadow-slushie-500/30 relative overflow-hidden"
                >
                  <span className="text-2xl relative z-10">🎬</span>
                  <motion.div
                    initial={{ x: '-100%', opacity: 0.5 }}
                    whileHover={{ x: '200%', opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  ></motion.div>
                </motion.div>

                <motion.h3
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1.3 }}
                  className="text-lg font-bold mb-2 group-hover:text-slushie-400 transition-colors"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #ffffff, #3bd3fd, #ffffff)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  AI Video Agent
                </motion.h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Conversational video creation powered by advanced AI intelligence
                </p>
              </div>
            </motion.div>

            {/* Card 3 - AI Smart Editing */}
            <motion.div
              whileHover={{
                y: -14,
                boxShadow: '0 25px 60px rgba(193,176,255,0.2), 0 0 0 1px rgba(193,176,255,0.15)',
                borderColor: 'rgba(193,176,255,0.3)'
              }}
              className="group bg-white/[0.04] backdrop-blur-sm rounded-feature p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden cursor-pointer transition-colors"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-ube-500/10 to-transparent pointer-events-none"
              ></motion.div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotateZ: 18, scale: 1.12 }}
                  className="w-14 h-14 bg-gradient-to-br from-[#c1b0ff] to-ube-600 rounded-feature flex items-center justify-center mb-5 shadow-lg shadow-ube-500/30 relative overflow-hidden"
                >
                  <span className="text-2xl relative z-10">🎞️</span>
                  <motion.div
                    initial={{ x: '-100%', opacity: 0.5 }}
                    whileHover={{ x: '200%', opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  ></motion.div>
                </motion.div>

                <motion.h3
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2.6 }}
                  className="text-lg font-bold mb-2 group-hover:text-ube-300 transition-colors"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #ffffff, #c1b0ff, #ffffff)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  AI Smart Editing
                </motion.h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Intelligent timeline editor with multi-track support & precision tools
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ==================== TRUSTED BY SECTION (HIDDEN - Coming Soon) ==================== */}
      {false && (
      <div className="py-20 px-8 bg-pure-white border-y border-oat-border">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-small text-warm-silver mb-12 uppercase tracking-widest font-semibold"
          >
            Trusted by creators & teams worldwide
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
            {['Netflix', 'Spotify', 'Airbnb', 'Stripe', 'Notion', 'Vercel'].map((company, idx) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center text-2xl font-bold text-dark-charcoal/40 hover:text-dark-charcoal/70 transition-colors cursor-pointer"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* ==================== FEATURES OVERVIEW SECTION ==================== */}
      <div className="py-24 px-8 bg-warm-cream">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span
              animate={{ rotateZ: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block text-5xl mb-6"
            >
              🚀
            </motion.span>
            <h2 className="text-section-heading text-clay-black font-roobert mb-4">
              Everything You Need to Create Stunning Videos
            </h2>
            <p className="text-body-large text-warm-silver max-w-3xl mx-auto">
              From ideation to export, Action provides a complete AI-powered video creation ecosystem
            </p>
          </motion.div>

          {/* Features Grid - 2x4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI-Native Video Agent',
                description: 'Conversational interface that understands natural language. Simply describe what you want, and watch your vision come to life through intelligent dialogue.',
                gradient: 'from-lemon-500 to-slushie-500',
                features: ['Multi-LLM Intelligence', 'Context-Aware Responses', 'Iterative Refinement']
              },
              {
                icon: '🎬',
                title: 'Professional Timeline Editor',
                description: 'Full-featured multi-track editor with drag-and-drop interface, precision controls, and professional-grade tools for frame-perfect editing.',
                gradient: 'from-slushie-500 to-blueberry-800',
                features: ['Multi-Track Support (Video/Audio/Text)', '50+ Undo/Redo States', 'Keyboard Shortcuts']
              },
              {
                icon: '✨',
                title: 'Effects & Transitions Library',
                description: 'Comprehensive collection of visual effects, audio effects, and transitions organized in intuitive categories for one-click application.',
                gradient: 'from-ube-300 to-ube-800',
                features: ['Visual Effects (Blur, Glow, Sepia)', 'Audio Effects (Reverb, Echo)', '12+ Transitions']
              },
              {
                icon: '📝',
                title: 'Intelligent Script Generation',
                description: 'Auto-generate compelling storylines, narration, and visual suggestions based on your themes with smart content analysis.',
                gradient: 'from-matcha-300 to-matcha-600',
                features: ['Storyline Generation', 'Scene Suggestions', 'Narration Writing']
              },
              {
                icon: '🎵',
                title: 'Advanced Audio Processing',
                description: 'Intelligent music recommendations, beat syncing, voice profiles, and automatic speech recognition with Whisper integration.',
                gradient: 'from-pomegranate-400 to-red-600',
                features: ['Beat Synchronization', 'Voice Profiles', 'ASR Speech Recognition']
              },
              {
                icon: '💾',
                title: 'Smart Media Library',
                description: 'Unified media management with intelligent tagging, drag-and-drop upload, advanced search, and bulk operations.',
                gradient: 'from-blueberry-600 to-blueberry-900',
                features: ['Smart Tagging System', 'Grid/List Views', 'Metadata Management']
              },
              {
                icon: '🎯',
                title: 'Skill-Based Workflows',
                description: 'Pre-built and custom skills for common video patterns. Save workflows as reusable templates for consistent results.',
                gradient: 'from-lemon-400 to-orange-500',
                features: ['7+ Built-in Skills', 'Custom Skill Creation', 'Batch Processing']
              },
              {
                icon: '🌐',
                title: 'Web Intelligence & Research',
                description: 'Built-in web search, scraping, and research capabilities to gather context, find media, and analyze trends.',
                gradient: 'from-teal-400 to-cyan-600',
                features: ['DuckDuckGo Integration', 'Web Scraping', 'Competitive Analysis']
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{
                  y: -12,
                  boxShadow: 'rgba(0,0,0,0.12) 0px 20px 40px'
                }}
                className="group bg-pure-white rounded-section p-8 border-2 border-oat-border shadow-clay relative overflow-hidden cursor-pointer"
              >
                {/* Gradient Glow on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} pointer-events-none`}
                ></motion.div>

                <div className="relative z-10">
                  <div className="flex items-start gap-5 mb-5">
                    <motion.div
                      whileHover={{ rotateZ: 15, scale: 1.15 }}
                      className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-feature flex items-center justify-center text-3xl shadow-clay flex-shrink-0`}
                    >
                      {feature.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-sub-heading text-clay-black font-semibold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-dark-charcoal group-hover:to-warm-charcoal transition-all">
                        {feature.title}
                      </h3>
                      <p className="text-body text-warm-silver leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {feature.features.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3 py-1 bg-oat-light text-dark-charcoal text-xs rounded-badge font-medium"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <div className="py-24 px-8 bg-gradient-to-br from-slushie-800 via-blueberry-900 to-slushie-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.15, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-lemon-400/10 rounded-full blur-3xl"
        ></motion.div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-section-heading text-pure-white font-roobert mb-4">
              From Idea to Video in 4 Simple Steps
            </h2>
            <p className="text-body-large text-white/80 max-w-2xl mx-auto">
              No editing experience required. Just talk to our AI agent and watch the magic happen.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                icon: '💬',
                title: 'Describe Your Vision',
                description: 'Tell Action what kind of video you want to create using natural language. Be as detailed or as simple as you like.',
                color: 'lemon-500'
              },
              {
                step: '02',
                icon: '🤖',
                title: 'AI Generates Script',
                description: 'Our intelligent agent analyzes your request, generates a complete script with scenes, narration, and visual suggestions.',
                color: 'slushie-500'
              },
              {
                step: '03',
                icon: '✏️',
                title: 'Refine & Customize',
                description: 'Review the generated content, make adjustments through conversation, apply effects, and perfect every detail.',
                color: 'ube-400'
              },
              {
                step: '04',
                icon: '🚀',
                title: 'Export & Share',
                description: 'Render your final video in stunning quality (up to 4K) and share directly to social platforms or download.',
                color: 'matcha-500'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative"
              >
                {/* Connector Line (not for last item) */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent"></div>
                )}

                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-sm rounded-section p-6 border border-white/20 relative"
                >
                  {/* Step Number */}
                  <div className={`absolute -top-4 left-6 px-4 py-1 bg-${item.color} text-clay-black text-sm font-bold rounded-badge shadow-hard`}>
                    Step {item.step}
                  </div>

                  {/* Icon */}
                  <div className="text-5xl mb-4">{item.icon}</div>

                  {/* Content */}
                  <h3 className="text-sub-heading text-pure-white font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== AI AGENT SHOWCASE SECTION ==================== */}
      <div className="py-24 px-8 bg-pure-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Chat Interface Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Mock Chat Window */}
              <div className="bg-[#121212] rounded-section shadow-hard border-2 border-oat-border overflow-hidden">
                {/* Chat Header */}
                <div className="bg-[#1e1e1e] px-6 py-4 border-b border-[#333333] flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-lemon-500 to-slushie-500 rounded-full flex items-center justify-center text-lg">
                    🤖
                  </div>
                  <div>
                    <p className="text-pure-white font-semibold text-sm">AI Video Agent</p>
                    <p className="text-green-400 text-xs">● Online</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 min-h-[350px]">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-slushie-500 text-clay-black px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm">
                      Create a 60-second product review video for wireless headphones focusing on sound quality
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-[#2a2a2a] text-pure-white px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm space-y-2">
                      <p>Perfect! I'll create a compelling product review video for you. Here's my plan:</p>
                      <ul className="space-y-1 text-white/80 text-xs ml-4 mt-2">
                        <li>• Dynamic intro with product showcase</li>
                        <li>• Sound quality demonstration segments</li>
                        <li>• Battery life highlights with visuals</li>
                        <li>• Professional call-to-action ending</li>
                      </ul>
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-slushie-500 text-clay-black px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm">
                      Make it more energetic and add upbeat background music! 🎵
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex justify-start">
                    <div className="bg-[#2a2a2a] px-4 py-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 bg-lemon-500 rounded-full"
                        ></motion.div>
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                          className="w-2 h-2 bg-slushie-500 rounded-full"
                        ></motion.div>
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                          className="w-2 h-2 bg-lemon-500 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 border-t border-[#333333] bg-[#1a1a1a]">
                  <div className="flex items-center gap-3 bg-[#2a2a2a] rounded-full px-4 py-3">
                    <input
                      type="text"
                      placeholder="Ask AI to create or edit..."
                      className="flex-1 bg-transparent text-pure-white text-sm outline-none placeholder:text-gray-500"
                      disabled
                    />
                    <button className="w-8 h-8 bg-gradient-to-r from-lemon-500 to-slushie-500 rounded-full flex items-center justify-center text-clay-black text-sm font-bold">
                      →
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 w-20 h-20 bg-lemon-400/30 rounded-full blur-xl"
              ></motion.div>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-slushie-500/30 rounded-full blur-xl"
              ></motion.div>
            </motion.div>

            {/* Right: Feature List */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-caption text-lemon-600 font-bold uppercase tracking-wider">
                Powered by Advanced AI
              </span>
              <h2 className="text-section-heading text-clay-black font-roobert mt-3 mb-6">
                Meet Your AI Video Creation Partner
              </h2>
              <p className="text-body-large text-warm-silver mb-10 leading-relaxed">
                Our intelligent agent doesn't just follow commands—it understands context, learns your preferences, and collaborates with you to create exactly what you envision.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: '🧠',
                    title: 'Multi-LLM Intelligence',
                    desc: 'Powered by state-of-the-art AI models through advanced integration'
                  },
                  {
                    icon: '🔧',
                    title: 'Extensive Tool System',
                    desc: 'Web search, file management, data analysis, media processing, and more at its disposal'
                  },
                  {
                    icon: '💭',
                    title: 'Conversational Memory',
                    desc: 'Remembers context, tracks entities, recognizes topics, and learns your preferences over time'
                  },
                  {
                    icon: '🔒',
                    title: 'Secure Execution',
                    desc: 'Built-in security contexts with tool limits, sensitive operation tracking, and safe environments'
                  },
                  {
                    icon: '⚡',
                    title: 'Real-Time Collaboration',
                    desc: 'See changes instantly as you chat. Iterate, refine, and perfect your video through natural dialogue'
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 group cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ rotateZ: 10, scale: 1.15 }}
                      className="w-12 h-12 bg-gradient-to-br from-oat-light to-oat-border rounded-card flex items-center justify-center text-2xl flex-shrink-0 group-hover:shadow-clay transition-shadow"
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h4 className="text-sub-heading text-dark-charcoal font-semibold mb-1 group-hover:text-lemon-700 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-body text-warm-silver">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ==================== PRODUCT SHOWCASE / EDITOR PREVIEW ==================== */}
      <div className="py-24 px-8 bg-warm-cream">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-section-heading text-clay-black font-roobert mb-4">
              Professional Editor, Simplified
            </h2>
            <p className="text-body-large text-warm-silver max-w-2xl mx-auto">
              A powerful timeline editor that gives you complete control without the complexity
            </p>
          </motion.div>

          {/* Editor Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎞️',
                title: 'Multi-Track Timeline',
                description: 'Organize video, audio, text, and effects across multiple tracks with drag-and-drop simplicity.',
                stats: '50+ undo states'
              },
              {
                icon: '🎨',
                title: 'Effects Library',
                description: 'Apply professional effects and transitions with one click. Blur, glow, sepia, and more.',
                stats: '30+ effects'
              },
              {
                icon: '👁️',
                title: 'Real-Time Preview',
                description: 'See your changes instantly with frame-accurate playback and waveform visualization.',
                stats: '60fps preview'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{
                  y: -16,
                  boxShadow: 'rgba(0,0,0,0.12) 0px 24px 48px'
                }}
                className="group bg-pure-white rounded-section p-8 border-2 border-oat-border shadow-clay text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotateZ: 10 }}
                  className="w-20 h-20 bg-gradient-to-br from-lemon-400 to-slushie-500 rounded-section flex items-center justify-center text-5xl mx-auto mb-6 shadow-clay"
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-sub-heading text-clay-black font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-body text-warm-silver mb-6 leading-relaxed">
                  {item.description}
                </p>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-lemon-400/20 to-slushie-500/20 rounded-badge">
                  <span className="text-small text-dark-charcoal font-bold">{item.stats}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <div className="py-24 px-8 bg-gradient-to-r from-lemon-500 via-slushie-500 to-lemon-500 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"
        ></motion.div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-section-heading text-clay-black font-roobert mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-body-large text-dark-charcoal/80 max-w-2xl mx-auto">
              See what our community is saying about their experience with Action
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Action has completely transformed our video workflow. What used to take hours now takes minutes. The AI agent understands exactly what we need.",
                author: 'Sarah Chen',
                role: 'Content Creator',
                company: '@sarahcreates',
                avatar: '👩‍💼'
              },
              {
                quote: "As someone with zero editing experience, I was amazed at how easily I could create professional-quality videos. The conversational interface is genius!",
                author: 'Marcus Johnson',
                role: 'Marketing Manager',
                company: 'TechStartup Inc.',
                avatar: '👨‍💻'
              },
              {
                quote: "The skill-based workflows are a game-changer. We've standardized our entire video production process and cut production time by 70%.",
                author: 'Emily Rodriguez',
                role: 'Creative Director',
                company: 'StudioVerse',
                avatar: '👩‍🎨'
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{
                  y: -12,
                  boxShadow: 'rgba(0,0,0,0.15) 0px 20px 40px'
                }}
                className="bg-pure-white rounded-section p-8 shadow-hard border-2 border-white/40"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lemon-500 text-lg">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-body text-dark-charcoal leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-6 border-t border-oat-border">
                  <div className="w-12 h-12 bg-gradient-to-br from-lemon-400 to-slushie-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-dark-charcoal text-small">{testimonial.author}</p>
                    <p className="text-caption text-warm-silver">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== STATS / METRICS SECTION ==================== */}
      <div className="py-24 px-8 bg-clay-black relative overflow-hidden">
        {/* Animated Background Pattern */}
        <motion.div
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,189,65,0.1),transparent_50%)]"
        ></motion.div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Active Creators' },
              { value: '1M+', label: 'Videos Created' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9★', label: 'User Rating' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-display-hero text-transparent bg-clip-text bg-gradient-to-r from-lemon-500 to-slushie-500 font-roobert mb-2"
                >
                  {stat.value}
                </motion.div>
                <p className="text-body text-warm-silver">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== PRICING PREVIEW SECTION ==================== */}
      <div className="py-24 px-8 bg-warm-cream">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-section-heading text-clay-black font-roobert mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-body-large text-warm-silver max-w-2xl mx-auto">
              Start free, upgrade when you're ready. No hidden fees, no surprises.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: [
                  '5 videos per month',
                  '720p export quality',
                  'Basic AI agent access',
                  'Standard effects library',
                  'Community support'
                ],
                cta: 'Get Started',
                popular: false,
                gradient: 'from-oat-light to-oat-border'
              },
              {
                name: 'Pro',
                price: '$19',
                period: '/month',
                features: [
                  'Unlimited videos',
                  '4K export quality',
                  'Advanced AI Intelligence',
                  'Premium effects & transitions',
                  'Priority rendering',
                  'Email support'
                ],
                cta: 'Start Pro Trial',
                popular: true,
                gradient: 'from-lemon-500 to-slushie-500'
              },
              {
                name: 'Enterprise',
                price: '$49',
                period: '/month',
                features: [
                  'Everything in Pro',
                  'Custom AI model training',
                  'Team collaboration tools',
                  'API access',
                  'Dedicated account manager',
                  'SLA guarantee'
                ],
                cta: 'Contact Sales',
                popular: false,
                gradient: 'from-ube-400 to-ube-800'
              }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{
                  y: -16,
                  boxShadow: plan.popular ? 'rgba(251,189,65,0.3) 0px 24px 48px' : 'rgba(0,0,0,0.1) 0px 16px 32px'
                }}
                className={`relative bg-pure-white rounded-section p-8 border-2 ${
                  plan.popular ? 'border-lemon-500 shadow-hard' : 'border-oat-border shadow-clay'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-lemon-500 to-slushie-500 text-clay-black text-small font-bold rounded-badge shadow-hard">
                    Most Popular ⭐
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-sub-heading text-dark-charcoal font-semibold mb-3">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-clay-black font-roobert">{plan.price}</span>
                    <span className="text-body text-warm-silver">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-body text-dark-charcoal">
                      <span className="text-lemon-600 font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: plan.popular ? 1.02 : 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-card font-semibold transition-all clay-focus ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.gradient} text-clay-black shadow-hard`
                        : 'bg-oat-light text-dark-charcoal hover:bg-oat-border border-2 border-oat-border'
                    }`}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slushie-800 via-blueberry-900 to-slushie-800 py-32 px-8">
        {/* Animated Background Elements */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-lemon-400/10 rounded-full blur-3xl"
        ></motion.div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotateZ: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-8"
            >
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-section flex items-center justify-center mx-auto shadow-hard border-2 border-white/30">
                <span className="text-6xl">🎬</span>
              </div>
            </motion.div>

            <h2 className="text-display-hero text-pure-white font-roobert mb-6">
              Ready to Transform Your Ideas into Reality?
            </h2>
            <p className="text-body-large text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of creators who are already using Action to bring their visions to life. No credit card required.
            </p>

            <div className="flex items-center justify-center gap-6 flex-wrap">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{
                    rotateZ: -8,
                    y: -20,
                    boxShadow: 'rgb(0,0,0) -9px 9px',
                    scale: 1.05
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-16 py-5 bg-gradient-to-r from-pure-white to-light-frost text-clay-black font-semibold rounded-pill shadow-hard hover:shadow-lg transition-all clay-focus overflow-hidden"
                  style={{ fontSize: '18px', fontWeight: '600' }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Creating Now — It's Free
                    <motion.span
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
                  ></motion.div>
                </motion.button>
              </Link>
            </div>

            <p className="mt-8 text-body text-white/60">
              ✨ No credit card required • ✨ Free forever plan • ✨ Cancel anytime
            </p>
          </motion.div>
        </div>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-clay-black text-pure-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-lemon-500 to-slushie-500 rounded-feature flex items-center justify-center text-xl shadow-clay">
                  🎬
                </div>
                <span className="text-2xl font-bold font-roobert">Action</span>
              </div>
              <p className="text-body text-warm-silver mb-6 leading-relaxed max-w-md">
                An AI-Native Interactive Video Agent. Where imagination meets AI intelligence — empowering creators to transform ideas into immersive, interactive creative stories through the power of conversational video creation.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                {['Twitter', 'GitHub', 'Discord'].map((social) => (
                  <motion.button
                    key={social}
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="w-10 h-10 bg-white/10 rounded-card flex items-center justify-center text-sm hover:bg-lemon-500 hover:text-clay-black transition-all"
                  >
                    {social[0]}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-small mb-4 text-lemon-400">Product</h4>
              <ul className="space-y-3">
                {['Features', 'AI Studio', 'Pricing', 'Changelog', 'Roadmap'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-body text-warm-silver hover:text-pure-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-small mb-4 text-slushie-400">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'API Reference', 'Tutorials', 'Blog', 'Community'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-body text-warm-silver hover:text-pure-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-small mb-4 text-ube-300">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Contact', 'Privacy Policy', 'Terms'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-body text-warm-silver hover:text-pure-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-caption text-warm-silver">
              © 2026 Action. All rights reserved. Made with ❤️ by the Action Team
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-caption text-warm-silver hover:text-pure-white transition-colors">Privacy</a>
              <a href="#" className="text-caption text-warm-silver hover:text-pure-white transition-colors">Terms</a>
              <a href="#" className="text-caption text-warm-silver hover:text-pure-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
