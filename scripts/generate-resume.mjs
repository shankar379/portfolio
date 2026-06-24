// Generates public/Profile.pdf — the downloadable resume linked from the Hero.
// Run with: node scripts/generate-resume.mjs
// Content is kept in sync with public/Durga_Shankar_Resume.html / .txt.

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'Profile.pdf');

const ORANGE = '#ff6d00';
const DARK = '#2a3442';
const GRAY = '#555f6b';

const doc = new PDFDocument({ size: 'A4', margins: { top: 34, bottom: 30, left: 50, right: 50 } });
doc.pipe(fs.createWriteStream(OUT));

const PAGE_W = doc.page.width - doc.page.margins.left - doc.page.margins.right;
const LEFT = doc.page.margins.left;

const sectionTitle = (text) => {
  doc.moveDown(0.38);
  doc.fillColor(ORANGE).font('Helvetica-Bold').fontSize(11.5).text(text.toUpperCase());
  const y = doc.y + 2;
  doc.moveTo(LEFT, y).lineTo(LEFT + PAGE_W, y).lineWidth(1).strokeColor('#e4c9b0').stroke();
  doc.moveDown(0.32);
};

const body = (text, opts = {}) =>
  doc.fillColor(opts.color || GRAY).font(opts.font || 'Helvetica').fontSize(opts.size || 9)
    .text(text, { lineGap: 1.2, ...opts });

// Flowing bullet with a hanging indent — handles page breaks cleanly (no
// absolute positioning, so the bullet and its text never split across pages).
const bulletLine = (text) => {
  doc.fillColor(GRAY).font('Helvetica').fontSize(9)
    .text('•  ' + text, LEFT + 6, doc.y, { width: PAGE_W - 6, lineGap: 1.2, indent: 0, align: 'left', paragraphGap: 1.5 });
};

// ── Header ────────────────────────────────────────────────────────────────
doc.fillColor(DARK).font('Helvetica-Bold').fontSize(22).text('GUTTULA DURGA SHANKAR', { align: 'left' });
doc.fillColor(ORANGE).font('Helvetica-Bold').fontSize(11)
  .text('React Native Mobile Developer  |  Android  |  iOS  |  Full Stack');
doc.moveDown(0.25);
doc.fillColor(GRAY).font('Helvetica').fontSize(9)
  .text('durga369shankar@gmail.com  ·  +91 6303449205  ·  Rajahmundry, Andhra Pradesh');
doc.fillColor(GRAY).font('Helvetica').fontSize(9)
  .text('Portfolio: durga-shankar-portfolio.web.app  ·  GitHub: github.com/shankar379  ·  LinkedIn: durga-shankar-react-native-developer');
const hy = doc.y + 6;
doc.moveTo(LEFT, hy).lineTo(LEFT + PAGE_W, hy).lineWidth(1.4).strokeColor(ORANGE).stroke();
doc.moveDown(0.5);

// ── Summary ───────────────────────────────────────────────────────────────
sectionTitle('Professional Summary');
body('React Native Developer with nearly one year of professional experience building and maintaining production Android and iOS applications at Elevents Metaestate Pvt Ltd — including the white-label flavors Tickets99, EventTitans and Poultry India, plus the QuickStaff staffing platform. Experienced in React Native, TypeScript, REST APIs, Firebase, AWS and mobile performance optimization, with hands-on work in payments, NFC, Bluetooth printing and biometric authentication. Regularly uses AI-assisted tools (Claude Code, Cursor AI, GitHub Copilot) to improve development speed and code quality.');

// ── Skills ────────────────────────────────────────────────────────────────
sectionTitle('Technical Skills');
const skillRow = (label, val) => {
  const y = doc.y;
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9).text(label, LEFT, y, { width: 118 });
  doc.fillColor(GRAY).font('Helvetica').fontSize(9).text(val, LEFT + 122, y, { width: PAGE_W - 122, lineGap: 1.1 });
  doc.moveDown(0.1);
};
skillRow('Mobile', 'React Native, Expo, React Navigation, Android Studio, Gradle, EAS Build & Submit');
skillRow('Languages', 'JavaScript, TypeScript, Java, Kotlin, Python');
skillRow('Backend', 'Node.js, Express.js, REST APIs, JWT Auth, Python FastAPI');
skillRow('Databases', 'Firebase Firestore, MongoDB, PostgreSQL, SQLite');
skillRow('Cloud & DevOps', 'AWS EC2, AWS S3, GitHub Actions, CI/CD');
skillRow('Auth & Security', 'JWT, OAuth2, OTP, Face ID, Fingerprint, Secure Storage');
skillRow('Payments', 'Razorpay, Stripe, Google Pay, Apple Pay');
skillRow('Hardware', 'Bluetooth, NFC, QR Scanner, Camera APIs, ML Kit');
skillRow('Tools', 'Git, GitHub, Expo CLI, Firebase Console, VS Code, Cursor AI, Claude Code, GitHub Copilot');

// ── Experience ────────────────────────────────────────────────────────────
sectionTitle('Professional Experience');
doc.fillColor(DARK).font('Helvetica-Bold').fontSize(10.5).text('React Native Developer', { continued: true })
  .fillColor(GRAY).font('Helvetica').fontSize(9.5).text('   Elevents Metaestate Pvt Ltd, Hyderabad');
doc.fillColor(GRAY).font('Helvetica-Oblique').fontSize(9).text('June 2025 – Present');
doc.moveDown(0.2);
[
  'Develop and maintain Android & iOS apps using React Native and Expo, shipped via EAS Build.',
  'Build and maintain multiple white-label flavors (Tickets99, EventTitans, Poultry India) from a single codebase.',
  'Migrate native Android features into the unified React Native codebase.',
  'Integrate REST APIs, payments (Razorpay/Stripe), NFC, Bluetooth printing, QR scanning and biometric auth.',
  'Optimize performance, memory and rendering; publish and maintain apps on Google Play and the App Store.',
].forEach(bulletLine);
doc.moveDown(0.1);
doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9.5).text('Key products: ', { continued: true })
  .fillColor(GRAY).font('Helvetica').fontSize(9.5).text('Tickets99, EventTitans, Poultry India, QuickStaff');

doc.moveDown(0.3);
doc.fillColor(DARK).font('Helvetica-Bold').fontSize(10.5).text('Freelance Full Stack Developer');
doc.fillColor(GRAY).font('Helvetica-Oblique').fontSize(9).text('August 2023 – May 2025');
doc.moveDown(0.2);
[
  'Built full-stack applications with React, Node.js, Express.js, Firebase and MongoDB.',
  'Designed RESTful APIs, authentication and role-based access; handled deployment and cloud hosting.',
].forEach(bulletLine);

// ── Projects ──────────────────────────────────────────────────────────────
sectionTitle('Key Projects');
const project = (name, tech, desc) => {
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9.5).text(name);
  doc.fillColor(ORANGE).font('Helvetica-Oblique').fontSize(8).text(tech);
  doc.fillColor(GRAY).font('Helvetica').fontSize(9).text(desc, { lineGap: 1.1 });
  doc.moveDown(0.18);
};
project('White-Label Event Apps  (Tickets99 · EventTitans · Poultry India)',
  'React Native, Expo, TypeScript, Firebase, AWS',
  'One React Native codebase shipped as multiple branded flavors, each with its own store listing. Payments, NFC, Bluetooth printing, QR check-in and biometric authentication; published to Google Play and the App Store.');
project('QuickStaff — Event Staffing Platform',
  'React Native, Node.js, PostgreSQL, Python FastAPI, AWS',
  'Multi-role platform with dashboards for workers, agencies, organizers and managers. Facial verification, in-app wallet, attendance tracking and push notifications on a scalable AWS backend.');
project('Multi-Printer Bluetooth Integration',
  'React Native, Bluetooth Classic, ESC/POS, ZPL',
  'Cross-platform printing across Zebra, TVS, SUNMI, Brother and DCode printers with auto-reconnect and device discovery.');
project('SETHU Web App',
  'React, Node.js, Firebase',
  'Public-facing storytelling site serving 5k+ monthly users with optimized performance and responsive design.');

// ── Education & Certifications ─────────────────────────────────────────────
sectionTitle('Education');
doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9.5).text('B.Tech, Computer Science & Engineering', { continued: true })
  .fillColor(GRAY).font('Helvetica').fontSize(9.5).text('   Rajamahendri Institute of Engineering & Technology (JNTUK)');
doc.fillColor(GRAY).font('Helvetica-Oblique').fontSize(9).text('2021 – 2025');

sectionTitle('Certifications');
bulletLine('Deep Learning — Young Minds Co, Vijayawada');
bulletLine('Django with Machine Learning — DATA POINT, Hyderabad');

doc.end();
console.log('Generated', OUT);
