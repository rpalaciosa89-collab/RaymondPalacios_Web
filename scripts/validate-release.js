/** Production-only gate. Draft builds may work, but main/release must not ship unresolved owner data. */
import fs from 'node:fs';
const errors=[];
const script=fs.readFileSync('script.js','utf8');
const privacy=fs.readFileSync('privacy.html','utf8');
if(/links:\{email:'',linkedin:'',github:'',resume:''\}/.test(script))errors.push('SITE_CONFIG links still contain empty owner values.');
if(/\[CONTENT REQUIRED:/i.test(privacy))errors.push('Privacy Notice still contains [CONTENT REQUIRED] fields.');
if(!fs.existsSync('assets/documents/raymond-palacios-resume.pdf'))errors.push('Public résumé file is missing at assets/documents/raymond-palacios-resume.pdf.');
if(!fs.existsSync('assets/images/og-card.webp'))errors.push('Open Graph image is missing at assets/images/og-card.webp.');
if(errors.length){console.error('Production release blocked:\n- '+errors.join('\n- '));process.exit(1)}
console.log('Production owner-content gate passed.');
