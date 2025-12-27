import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SiDjango, 
  SiFigma, 
  SiReact, 
  SiTailwindcss, 
  SiThreedotjs,
  SiPython,
  SiBlender,
  SiOpenai,
  SiGoogle
} from 'react-icons/si';
import { FaGithub, FaCode, FaCube, FaRobot, FaEdit } from 'react-icons/fa';
import './Skills.css';

// Custom Java Icon
// eslint-disable-next-line react/prop-types
const JavaIcon = ({ style }) => (
  <svg 
    stroke="currentColor" 
    fill="currentColor" 
    strokeWidth="0" 
    viewBox="0 0 384 512" 
    height="1em" 
    width="1em" 
    xmlns="http://www.w3.org/2000/svg" 
    style={style}
  >
    <path d="M277.74 312.9c9.8-6.7 23.4-12.5 23.4-12.5s-38.7 7-77.2 10.2c-47.1 3.9-97.7 4.7-123.1 1.3-60.1-8 33-30.1 33-30.1s-36.1-2.4-80.6 19c-52.5 25.4 130 37 224.5 12.1zm-85.4-32.1c-19-42.7-83.1-80.2 0-145.8C296 53.2 242.84 0 242.84 0c21.5 84.5-75.6 110.1-110.7 162.6-23.9 35.9 11.7 74.4 60.2 118.2zm114.6-176.2c.1 0-175.2 43.8-91.5 140.2 24.7 28.4-6.5 54-6.5 54s62.7-32.4 33.9-72.9c-26.9-37.8-47.5-56.6 64.1-121.3zm-6.1 270.5a12.19 12.19 0 0 1-2 2.6c128.3-33.7 81.1-118.9 19.8-97.3a17.33 17.33 0 0 0-8.2 6.3 70.45 70.45 0 0 1 11-3c31-6.5 75.5 41.5-20.6 91.4zM348 437.4s14.5 11.9-15.9 21.2c-57.9 17.5-240.8 22.8-291.6.7-18.3-7.9 16-19 26.8-21.3 11.2-2.4 17.7-2 17.7-2-20.3-14.3-131.3 28.1-56.4 40.2C232.84 509.4 401 461.3 348 437.4zM124.44 396c-78.7 22 47.9 67.4 148.1 24.5a185.89 185.89 0 0 1-28.2-13.8c-44.7 8.5-65.4 9.1-106 4.5-33.5-3.8-13.9-15.2-13.9-15.2zm179.8 97.2c-78.7 14.8-175.8 13.1-233.3 3.6 0-.1 11.8 9.7 72.4 13.6 92.2 5.9 233.8-3.3 237.1-46.9 0 0-6.4 16.5-76.2 29.7zM260.64 353c-59.2 11.4-93.5 11.1-136.8 6.6-33.5-3.5-11.6-19.7-11.6-19.7-86.8 28.8 48.2 61.4 169.5 25.9a60.37 60.37 0 0 1-21.1-12.8z"></path>
  </svg>
);

// Custom DeepSeek Icon
// eslint-disable-next-line react/prop-types
const DeepSeekIcon = ({ style }) => (
  <svg 
    stroke="currentColor" 
    fill="currentColor" 
    strokeWidth="0" 
    viewBox="0 0 384 512" 
    height="1em" 
    width="1em" 
    xmlns="http://www.w3.org/2000/svg" 
    style={style}
  >
    <path d="M222.5 86.4c-25.3-5.2-51.1-7.8-77.3-7.8-53.6 0-105.3 12.6-153.3 36.7C-16.4 129-8.9 159 10.3 174.2L192 303.1l181.7-128.9c19.1-15.2 26.7-45.2 18.1-68.4-34.6-93-130.6-156.7-231.1-149.2-58.9 4.4-115.2 27.3-159.6 64.8C-2.8 46.9-10.1 73.8 4.6 95.2l13.2 20.7c14.7 21.4 41.5 28.7 64.2 16.3 37.8-20.7 82.7-32.7 128.9-32.7 18.8 0 37.5 1.8 56 5.4-19.6-8.9-40.4-14.7-61.4-17.5zM13.4 293.1c-1.9 10.8-.6 21.8 3.7 32l.1.3c4.9 13.1 13.1 24.9 23.4 34.7 25.1 24.1 59.7 37.4 95.3 37.4 25.3 0 50.8-6.7 73.7-19.8 10.4-5.9 20.2-13.1 29.2-21.4 9-8.3 17.1-17.5 24.1-27.5l-89.4-63.3L13.4 293.1zm357.3 0l-151.1 89.4-89.4-63.3c7 10 15.1 19.2 24.1 27.5 9 8.3 18.8 15.5 29.2 21.4 22.9 13.1 48.4 19.8 73.7 19.8 35.6 0 70.2-13.3 95.3-37.4 10.3-9.8 18.5-21.6 23.4-34.7l.1-.3c4.3-10.2 5.6-21.2 3.7-32l-7.9-47.2zM192 448l-89.4-63.3L13.4 385.1c-1.9 10.8-.6 21.8 3.7 32l.1.3c4.9 13.1 13.1 24.9 23.4 34.7 25.1 24.1 59.7 37.4 95.3 37.4 35.6 0 70.2-13.3 95.3-37.4 10.3-9.8 18.5-21.6 23.4-34.7l.1-.3c4.3-10.2 5.6-21.2 3.7-32l-89.2-47.2L192 448z"></path>
  </svg>
);

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const allSkills = [
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Python', icon: SiPython, color: '#3776AB' },
    { name: 'Django', icon: SiDjango, color: '#092e20' },
    { name: 'Three.js', icon: SiThreedotjs, color: '#000000' },
    { name: 'Java', icon: JavaIcon, color: '#ED8B00' },
    { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
    { name: 'Blender 3D', icon: SiBlender, color: '#F5792A' },
    { name: 'GitHub', icon: FaGithub, color: '#181717' },
    { name: 'ChatGPT', icon: SiOpenai, color: '#10A37F' },
    { name: 'Claude', icon: FaRobot, color: '#D97757' },
    { name: 'Gemini', icon: SiGoogle, color: '#4285F4' },
    { name: 'DeepSeek', icon: DeepSeekIcon, color: '#1E40AF' },
    { name: 'Cursor AI', icon: FaEdit, color: '#a78bfa' },
    { name: '3D Modeling', icon: FaCube, color: '#a78bfa' },
    { name: 'Animation', icon: FaCode, color: '#a78bfa' }
  ];



  return (
    <section id="skills" className="skills">
      <div className="skills-background-text">SKILLS</div>
      <div className="skills-container">
        <motion.div
          className="skills-room"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {allSkills.map((skill, index) => {
            const IconComponent = skill.icon;
            const isHovered = hoveredSkill === index;
            
            return (
              <motion.div
                key={index}
                className={`skill-platform ${isHovered ? 'hovered' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredSkill(index)}
                onMouseLeave={() => setHoveredSkill(null)}
                whileHover={{ scale: 1.1, y: -10 }}
              >
                <div className="platform-glow"></div>
                <div className="platform-base"></div>
                <div className="skill-icon-container">
                  <IconComponent 
                    className="skill-icon"
                    style={{ color: isHovered ? '#a78bfa' : skill.color }} 
                  />
                </div>
                {isHovered && (
                  <motion.div
                    className="skill-name-label"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill.name}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
