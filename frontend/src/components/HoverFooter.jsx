import React, { useRef, useEffect, useState } from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaGlobe,
} from 'react-icons/fa';
import './HoverFooter.css';

export const TextHoverEffect = ({
  text,
  duration = 0.5,
  className = '',
}) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={`text-hover-svg ${className}`}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#80eeb4" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          cx={maskPosition.cx}
          cy={maskPosition.cy}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>
      
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="text-hover-outline"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="text-hover-animated"
        style={{
          animation: 'textStrokeDash 4s ease-in-out forwards'
        }}
      >
        {text}
      </text>
      
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="text-hover-gradient"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div className="footer-background-gradient" />
  );
};

function HoverFooter() {
  const footerLinks = [
    {
      title: 'About Us',
      links: [
        { label: 'Company History', href: '#' },
        { label: 'Meet the Team', href: '#' },
        { label: 'How It Works', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Helpful Links',
      links: [
        { label: 'FAQs', href: '#' },
        { label: 'Support', href: '#' },
        {
          label: 'Live Chat',
          href: '#',
          pulse: true,
        },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <FaEnvelope size={18} className="contact-icon" />,
      text: 'hello@educhain.np',
      href: 'mailto:hello@educhain.np',
    },
    {
      icon: <FaPhone size={18} className="contact-icon" />,
      text: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: <FaMapMarkerAlt size={18} className="contact-icon" />,
      text: 'Global Community',
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook size={20} />, label: 'Facebook', href: '#' },
    { icon: <FaInstagram size={20} />, label: 'Instagram', href: '#' },
    { icon: <FaTwitter size={20} />, label: 'Twitter', href: '#' },
    { icon: <FaGithub size={20} />, label: 'GitHub', href: '#' },
    { icon: <FaGlobe size={20} />, label: 'Website', href: '#' },
  ];

  return (
    <footer className="hover-footer">
      <div className="hover-footer-container">
        <div className="hover-footer-content">
          <div className="hover-footer-grid">
            {/* Brand section */}
            <div className="footer-brand-section">
              <div className="footer-brand-logo">
                <span className="logo-mark">DAO</span>
              </div>
              <h3 className="footer-brand-title">EduChainNP</h3>
              <p className="footer-brand-description">
                Decentralized learning platform empowering students worldwide with blockchain-based credentials and community rewards.
              </p>
            </div>

            {/* Footer link sections */}
            {footerLinks.map((section) => (
              <div key={section.title} className="footer-links-section">
                <h4 className="footer-section-title">{section.title}</h4>
                <ul className="footer-links-list">
                  {section.links.map((link) => (
                    <li key={link.label} className="footer-link-item">
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                      {link.pulse && (
                        <span className="pulse-dot"></span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact section */}
            <div className="footer-contact-section">
              <h4 className="footer-section-title">Contact Us</h4>
              <ul className="footer-contact-list">
                {contactInfo.map((item, i) => (
                  <li key={i} className="footer-contact-item">
                    {item.icon}
                    {item.href ? (
                      <a href={item.href} className="footer-contact-link">
                        {item.text}
                      </a>
                    ) : (
                      <span className="footer-contact-text">{item.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="footer-divider" />

          {/* Footer bottom */}
          <div className="footer-bottom-section">
            {/* Social icons */}
            <div className="footer-social-icons">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="social-icon-link"
                  title={label}
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} EduChainNP. All rights reserved.
            </p>
          </div>
        </div>

        {/* Text hover effect */}
        <div className="text-hover-effect-wrapper">
          <TextHoverEffect text="EduChainNP" className="text-hover-custom" />
        </div>
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
