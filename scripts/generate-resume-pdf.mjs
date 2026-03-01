import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

const projectRoot = process.cwd();
const txtPath = path.join(projectRoot, 'public', 'Durga_Shankar_Resume.txt');
const outPath = path.join(projectRoot, 'public', 'Profile.pdf');

if (!fs.existsSync(txtPath)) {
  throw new Error(`Resume text not found: ${txtPath}`);
}

const raw = fs.readFileSync(txtPath, 'utf8').replace(/\r\n/g, '\n');
const lines = raw.split('\n');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 52, left: 50, right: 50, bottom: 50 },
  info: {
    Title: 'Durga Shankar - ATS Resume',
    Author: 'Durga Shankar Guttula',
    Subject: 'ATS Friendly Resume',
  },
});

const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

const colors = {
  heading: '#D9480F',
  body: '#1F2937',
  muted: '#4B5563',
  divider: '#FDBA74',
};

const isSectionHeader = (line) => /^[A-Z][A-Z\s&-]+$/.test(line.trim());
const isBullet = (line) => line.trim().startsWith('- ');
const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

const ensureSpace = (needed = 30) => {
  if (doc.y + needed > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
};

// Header block (first two lines are expected as name + title)
const name = lines[0] || 'Durga Shankar Guttula';
const role = lines[1] || 'React Native and Full-Stack Developer';

doc.fillColor(colors.heading).font('Helvetica-Bold').fontSize(22).text(name, { width: contentWidth });
doc.moveDown(0.2);
doc.fillColor(colors.muted).font('Helvetica').fontSize(11.5).text(role, { width: contentWidth });
doc.moveDown(0.7);
doc
  .strokeColor(colors.divider)
  .lineWidth(1.2)
  .moveTo(doc.page.margins.left, doc.y)
  .lineTo(doc.page.width - doc.page.margins.right, doc.y)
  .stroke();
doc.moveDown(0.6);

let startIndex = 2;

for (let i = startIndex; i < lines.length; i += 1) {
  const line = lines[i];
  const trimmed = line.trim();

  if (!trimmed) {
    doc.moveDown(0.3);
    continue;
  }

  if (isSectionHeader(trimmed)) {
    ensureSpace(42);
    doc.moveDown(0.4);
    doc.fillColor(colors.heading).font('Helvetica-Bold').fontSize(12).text(trimmed, { width: contentWidth });
    doc.moveDown(0.15);
    doc
      .strokeColor(colors.divider)
      .lineWidth(0.8)
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();
    doc.moveDown(0.45);
    continue;
  }

  if (isBullet(trimmed)) {
    ensureSpace(22);
    doc.fillColor(colors.body).font('Helvetica').fontSize(10.5);
    doc.text(`• ${trimmed.slice(2)}`, {
      width: contentWidth - 10,
      indent: 10,
      paragraphGap: 2,
      lineGap: 1,
    });
    continue;
  }

  const isLabelLine = trimmed.includes(':') && trimmed.split(':')[0].length < 22;
  doc.fillColor(isLabelLine ? colors.body : colors.muted).font('Helvetica').fontSize(10.5);
  ensureSpace(20);
  doc.text(trimmed, {
    width: contentWidth,
    lineGap: 1,
    paragraphGap: 2,
  });
}

doc.end();

stream.on('finish', () => {
  process.stdout.write(`Generated resume PDF at ${outPath}\n`);
});
