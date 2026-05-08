import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BookOpen, Mail, HelpCircle, Users, Sun, Moon, LogOut, LogIn } from 'lucide-react';
import './AnimatedMenu.css';

export default function AnimatedMenu({ user = null, onSignOut, onGoogleSignIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: BookOpen, label: 'Programs', href: '#programs' },
    { icon: Mail, label: 'Contact Us', href: '#contact' },
    { icon: HelpCircle, label: 'Help', href: '#help' },
    { icon: Users, label: 'About Us', href: '#about' },
  ];

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) {
      setIsOpen(false);
    }
  };

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 30,
        mass: 0.8,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 30,
        mass: 0.8,
      },
    },
  };

  const itemVariants = {
    closed: { x: -50, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.1 + i * 0.08,
        type: 'spring',
        stiffness: 250,
        damping: 25,
      },
    }),
  };

  const overlayVariants = {
    closed: { 
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: { 
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className={`animated-menu-wrapper`}>
      {/* Header */}
      <header className="animated-menu-header">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="menu-toggle-btn"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="menu-header-title"
        >
          EduChainNP
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className="theme-toggle-btn"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </motion.button>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsOpen(false)}
            className="menu-overlay"
          />
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <motion.nav
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        drag="x"
        dragConstraints={{ left: -450, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="animated-side-menu"
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(false)}
          className="menu-close-btn"
          aria-label="Close menu"
        >
          <X size={24} />
        </motion.button>

        <div className="menu-content">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className="menu-header-section"
          >
            <h2 className="menu-nav-title">Navigation</h2>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
              className="menu-underline"
            />
          </motion.div>

          <ul className="menu-items-list">
            {menuItems.map((item, i) => (
              <motion.li
                key={item.label}
                custom={i}
                variants={itemVariants}
                initial="closed"
                animate={isOpen ? 'open' : 'closed'}
              >
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="menu-item-link"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    whileTap={{ scale: 0.95 }}
                    className="menu-item-icon-wrapper"
                  >
                    <item.icon size={24} />
                  </motion.div>
                  <span className="menu-item-label">{item.label}</span>
                </a>
              </motion.li>
            ))}
          </ul>

          {/* User Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="menu-user-section"
          >
            {user ? (
              <>
                <p className="menu-user-name">👤 {user.displayName || 'User'}</p>
                <button
                  onClick={() => {
                    onSignOut();
                    setIsOpen(false);
                  }}
                  className="menu-auth-btn logout-btn"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onGoogleSignIn();
                  setIsOpen(false);
                }}
                className="menu-auth-btn login-btn"
              >
                <LogIn size={18} /> Sign In
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="menu-footer-hint"
          >
            <p>💡 Drag left to close</p>
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
