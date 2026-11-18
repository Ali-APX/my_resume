import path from 'node:path';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import {
  AlignmentType, Document, ExternalHyperlink, Footer, ImageRun, PageNumber, PageOrientation,
  Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, SectionType,
} from 'docx';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SECTIONS = ['summary', 'about', 'interests', 'skills', 'experience', 'projects', 'achievements', 'education', 'links', 'contact'];
const SECTION_LABELS = {
  en: {summary:'Professional Summary',about:'About',interests:'Areas of Focus',skills:'Technical Skills',experience:'Experience & Activities',projects:'Selected Projects',achievements:'Awards & Achievements',education:'Education & Training',links:'Professional Links',contact:'Contact'},
  fa: {summary:'خلاصه حرفه‌ای',about:'درباره من',interests:'حوزه‌های تخصصی',skills:'مهارت‌های فنی',experience:'تجربه و فعالیت‌ها',projects:'پروژه‌های منتخب',achievements:'جوایز و دستاوردها',education:'آموزش و دوره‌ها',links:'پیوندهای حرفه‌ای',contact:'اطلاعات تماس'},
};
const htmlEscape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = (value, lang) => typeof value === 'string' ? value.trim() : String(value?.[lang] || '').trim();
const safeUrl = value => /^(https:\/\/|mailto:|tel:)/i.test(String(value || '')) ? String(value) : '';
const rows = list => (Array.isArray(list) ? list : []).filter(item => item && item.visible !== false).sort((a,b) => Number(a.order||0)-Number(b.order||0));
const defaults = () => ({enabled:true, defaultLanguage:'en', defaultOrientation:'portrait', formats:{pdf:true,docx:true}, accent:'#9b8afb', filename:{en:'Ali-Arefipoor-Resume-EN',fa:'Ali-Arefipoor-Resume-FA'}, sections:Object.fromEntries(SECTIONS.map(x=>[x,true])), order:[...SECTIONS]});
function browserOptions() {
  const candidates=[process.env.PUPPETEER_EXECUTABLE_PATH,process.env.CHROME_PATH,'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',process.env.LOCALAPPDATA&&path.join(process.env.LOCALAPPDATA,'Google','Chrome','Application','chrome.exe'),'/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/microsoft-edge'];
  const executablePath=candidates.find(candidate=>candidate&&existsSync(candidate));
  return {headless:true,args:['--no-sandbox','--disable-setuid-sandbox'],...(executablePath?{executablePath}:{})};
}

export function resumeModel(data, lang, orientation='portrait') {
  const config = {...defaults(), ...(data.settings.resume || {})};
  config.sections = {...defaults().sections, ...(data.settings.resume?.sections || {})};
  config.formats = {...defaults().formats, ...(data.settings.resume?.formats || {})};
  orientation=orientation==='landscape'?'landscape':'portrait';
  const cropKey=orientation==='landscape'?'resumeLandscape':'resumePortrait';
  const langTitle = text(data.home.title, lang);
  const contact = [safeUrl(data.contact.email ? `mailto:${data.contact.email}` : ''), safeUrl(data.contact.phone ? `tel:${data.contact.phone}` : '')].filter(Boolean);
  const model = {
    lang, dir:lang==='fa'?'rtl':'ltr', orientation, name:String(lang==='fa'?(data.home.nameFa||'\u0639\u0644\u06cc \u0639\u0627\u0631\u0641\u200c\u067e\u0648\u0631'):(data.home.name || data.settings.siteName || '')).trim(), title:langTitle,
    portrait:/^\/media\/[\w.-]+$/.test(data.settings.portraitCrops?.[cropKey] || '') ? data.settings.portraitCrops[cropKey] : /^\/media\/[\w.-]+$/.test(data.settings.portrait || '') ? data.settings.portrait : '',
    summary:text(data.home.intro,lang), about:data.home.aboutVisible === false ? '' : text(data.home.about,lang),
    interests:rows(data.capabilities).map(x=>text(x.label,lang)).filter(Boolean),
    skills:rows(data.skills).map(x=>[String(x.name||'').trim(), text(x.description,lang)].filter(Boolean).join(' — ')).filter(Boolean),
    experience:rows(data.experience).map(x=>({title:text(x.role,lang),org:String(x.organization||'').trim(),dates:String(x.dates||'').trim(),description:text(x.description,lang),link:safeUrl(x.link)})).filter(x=>x.title||x.org||x.description),
    projects:rows(data.projects).map(x=>({title:String(x.name||'').trim(),description:text(x.description,lang),image:/^\/media\/[\w.-]+$/.test(x.image||'')?x.image:'',technologies:(Array.isArray(x.technologies)?x.technologies:[]).filter(Boolean),links:(Array.isArray(x.links)?x.links:[]).map(l=>({label:String(l.label||'').trim(),url:safeUrl(l.url)})).filter(l=>l.url)})).filter(x=>x.title||x.description),
    achievements:rows(data.achievements).map(x=>({title:text(x.title,lang),description:text(x.description,lang),date:String(x.date||'').trim()})).filter(x=>x.title||x.description),
    education:rows(data.certificates).map(x=>({title:text(x.title,lang),org:String(x.organization||'').trim(),description:text(x.description,lang),date:String(x.date||'').trim()})).filter(x=>x.title||x.org||x.description),
    links:rows(data.socials).map(x=>({label:[x.platform,x.label].filter(Boolean).join(' · '),url:safeUrl(x.url)})).filter(x=>x.url),
    contact, config,
  };
  model.order = [...new Set([...(Array.isArray(config.order)?config.order:[]),...SECTIONS])].filter(section=>SECTIONS.includes(section)&&config.sections[section]&&hasSection(model,section));
  return model;
}
function hasSection(m, section) {
  return ({summary:()=>m.summary,about:()=>m.about,interests:()=>m.interests.length,skills:()=>m.skills.length,experience:()=>m.experience.length,projects:()=>m.projects.length,achievements:()=>m.achievements.length,education:()=>m.education.length,links:()=>m.links.length,contact:()=>m.contact.length})[section]?.();
}

async function imageData(url) {
  if (!/^\/media\/[\w.-]+$/.test(url || '')) return null;
  try {
    const file = await readFile(path.join(ROOT,'data','media',path.basename(url)));
    if (file.length > 5*1024*1024) return null;
    const mime = ({'.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.gif':'image/gif'})[path.extname(url).toLowerCase()];
    return mime ? {file,mime} : null;
  } catch { return null; }
}
async function projectImages(model) {
  let remaining=6*1024*1024;
  const result=[];
  for(const project of model.projects){
    if(!project.image||remaining<=0){result.push(null);continue;}
    const image=await imageData(project.image);
    if(image&&image.file.length<=remaining){remaining-=image.file.length;result.push(image);}else result.push(null);
  }
  return result;
}

function buildHtml(m, photo, projectPhotos=[]) {
  const labels=SECTION_LABELS[m.lang], accent=/^#[\da-f]{6}$/i.test(m.config.accent||'')?m.config.accent:'#9b8afb';
  const link = (label,url) => `<a href="${htmlEscape(url)}">${htmlEscape(label || url)}</a>`;
  const sections = {
    summary:()=>`<p class="lead">${htmlEscape(m.summary)}</p>`, about:()=>`<p>${htmlEscape(m.about)}</p>`,
    interests:()=>`<div class="chips">${m.interests.map(x=>`<span>${htmlEscape(x)}</span>`).join('')}</div>`,
    skills:()=>`<div class="chips">${m.skills.map(x=>`<span>${htmlEscape(x)}</span>`).join('')}</div>`,
    experience:()=>m.experience.map(x=>`<article class="entry"><div class="entry-head"><strong>${htmlEscape(x.title||x.org)}</strong>${x.dates?`<span>${htmlEscape(x.dates)}</span>`:''}</div>${x.title&&x.org?`<div class="subtle">${htmlEscape(x.org)}</div>`:''}${x.description?`<p>${htmlEscape(x.description)}</p>`:''}${x.link?link(x.link,x.link):''}</article>`).join(''),
    projects:()=>m.projects.map((x,index)=>`<article class="entry">${projectPhotos[index]?`<img class="project-photo" src="data:${projectPhotos[index].mime};base64,${projectPhotos[index].file.toString('base64')}" alt="">`:''}<strong>${htmlEscape(x.title)}</strong>${x.description?`<p>${htmlEscape(x.description)}</p>`:''}${x.technologies.length?`<div class="subtle">${x.technologies.map(htmlEscape).join(' · ')}</div>`:''}${x.links.length?`<div class="links">${x.links.map(l=>link(l.label,l.url)).join('')}</div>`:''}</article>`).join(''),
    achievements:()=>m.achievements.map(x=>`<article class="entry"><div class="entry-head"><strong>${htmlEscape(x.title)}</strong>${x.date?`<span>${htmlEscape(x.date)}</span>`:''}</div>${x.description?`<p>${htmlEscape(x.description)}</p>`:''}</article>`).join(''),
    education:()=>m.education.map(x=>`<article class="entry"><div class="entry-head"><strong>${htmlEscape(x.title)}</strong>${x.date?`<span>${htmlEscape(x.date)}</span>`:''}</div>${x.org?`<div class="subtle">${htmlEscape(x.org)}</div>`:''}${x.description?`<p>${htmlEscape(x.description)}</p>`:''}</article>`).join(''),
    links:()=>`<div class="link-list">${m.links.map(x=>link(x.label,x.url)).join('')}</div>`,
    contact:()=>`<div class="link-list">${m.contact.map(x=>link(x.replace(/^(mailto:|tel:)/,''),x)).join('')}</div>`,
  };
  return `<!doctype html><html lang="${m.lang}" dir="${m.dir}"><head><meta charset="utf-8"><title>${htmlEscape(m.config.documentTitle?.[m.lang]||`${m.name} Resume`)}</title><style>
@font-face{font-family:ResumeVazir;src:url(data:font/woff2;base64,${fontBase64('Vazir-Regular.woff2')}) format('woff2');font-weight:400}@font-face{font-family:ResumeVazir;src:url(data:font/woff2;base64,${fontBase64('Vazir-Medium.woff2')}) format('woff2');font-weight:500}@font-face{font-family:ResumeVazir;src:url(data:font/woff2;base64,${fontBase64('Vazir-Bold.woff2')}) format('woff2');font-weight:700}
@page{size:A4 ${m.orientation};margin:${m.orientation==='landscape'?'12mm 14mm 15mm':'16mm 17mm 18mm'}}*{box-sizing:border-box}body{font-family:${m.lang==='fa'?'ResumeVazir,':'Arial,'}sans-serif;color:#202535;font-size:10pt;line-height:1.55;margin:0;direction:${m.dir};-webkit-print-color-adjust:exact;print-color-adjust:exact}.top{display:flex;align-items:center;gap:18px;padding:0 0 16px;border-bottom:2px solid ${accent};margin-bottom:10px}.identity{flex:1}.name{font-size:27pt;line-height:1.2;margin:0 0 4px;color:#141a29;font-weight:700}.title{color:#5a6070;font-size:12pt;margin:0}.photo{width:${m.orientation==='landscape'?'116px':'86px'};height:${m.orientation==='landscape'?'116px':'86px'};object-fit:cover;border-radius:20px;border:2px solid ${accent}}.project-photo{float:${m.lang==='fa'?'right':'left'};width:46px;height:46px;object-fit:cover;border-radius:9px;margin:0 0 5px 10px}h2{font-size:12pt;color:#22283a;margin:0 0 8px;padding:0 0 5px;border-bottom:1px solid #dfe2e9;break-after:avoid-page;page-break-after:avoid}.resume-section{margin-bottom:${m.orientation==='landscape'?'12px':'0'};break-inside:avoid-page;page-break-inside:avoid}.resume-sections{display:block}.resume-sections.landscape{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 22px;align-items:start}.resume-sections.landscape .resume-section{border:1px solid #e5e7ee;border-inline-start:2px solid ${accent};border-radius:9px;padding:10px 12px;background:#fbfbfd}.resume-sections.landscape h2{color:#29273b}p{margin:4px 0 7px;white-space:pre-line}.lead{font-size:10.5pt;color:#353c4d}.entry{margin:0 0 10px;break-inside:avoid-page;page-break-inside:avoid}.entry-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.entry-head strong{font-size:10.5pt}.entry-head span,.subtle{font-size:9pt;color:#697083}.chips{display:flex;flex-wrap:wrap;gap:6px}.chips span{padding:3px 8px;border-radius:12px;background:#f1effc;color:#39334f;font-size:9pt}.links,.link-list{display:flex;flex-wrap:wrap;gap:8px 15px}.link-list a,.links a{min-width:0;max-width:100%;overflow-wrap:anywhere;word-break:break-word}a{color:#51449c;text-decoration:none;overflow-wrap:anywhere}.top,article{break-inside:avoid-page}
</style></head><body data-orientation="${m.orientation}"><header class="top">${photo?`<img class="photo" src="data:${photo.mime};base64,${photo.file.toString('base64')}" alt="">`:''}<div class="identity"><h1 class="name">${htmlEscape(m.name)}</h1>${m.title?`<p class="title">${htmlEscape(m.title)}</p>`:''}</div></header><div class="resume-sections ${m.orientation}">${m.order.map(s=>`<section class="resume-section"><h2>${htmlEscape(labels[s])}</h2>${sections[s]()}</section>`).join('')}</div></body></html>`;
}
let fontCache;
function fontBase64(name) { return fontCache?.[name] || ''; }
async function prepareFonts() {
  fontCache ||= Object.fromEntries(await Promise.all(['Vazir-Regular.woff2','Vazir-Medium.woff2','Vazir-Bold.woff2'].map(async name=>[name,(await readFile(path.join(ROOT,'public','fonts',name))).toString('base64')])));
}

export async function generateResumePdf(model) {
  const html=await renderResumeHtml(model);
  const browser = await puppeteer.launch(browserOptions());
  try {
    const page=await browser.newPage();
    await page.setContent(html,{waitUntil:'load',timeout:15000});
    await page.evaluate(()=>document.fonts.ready);
    const footer=`<div style="width:100%;font-family:Arial,sans-serif;font-size:8px;color:#818696;text-align:center">${htmlEscape(model.name)} · <span class="pageNumber"></span> / <span class="totalPages"></span></div>`;
    return await page.pdf({format:'A4',landscape:model.orientation==='landscape',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:footer,margin:{top:model.orientation==='landscape'?'12mm':'16mm',right:model.orientation==='landscape'?'14mm':'17mm',bottom:model.orientation==='landscape'?'15mm':'18mm',left:model.orientation==='landscape'?'14mm':'17mm'},timeout:30000});
  } finally { await browser.close(); }
}

export async function renderResumeHtml(model) {
  await prepareFonts();
  const photo=await imageData(model.portrait);
  const projectPhotos=await projectImages(model);
  return buildHtml(model,photo,projectPhotos);
}

function run(text, opts={}) { return new TextRun({text:String(text||''),font:opts.font||'Arial',size:opts.size||20,bold:!!opts.bold,color:opts.color||'252B3A',rightToLeft:opts.rtl||false}); }
function para(text, model, opts={}) { return new Paragraph({bidirectional:model.lang==='fa',alignment:model.lang==='fa'?AlignmentType.RIGHT:AlignmentType.LEFT,spacing:{after:opts.after??100,line:300},children:[run(text,{font:model.lang==='fa'?'Vazir':'Arial',size:opts.size||20,bold:opts.bold,color:opts.color,rtl:model.lang==='fa'})]}); }
function hyperlink(label,url,model) { return new Paragraph({bidirectional:model.lang==='fa',alignment:model.lang==='fa'?AlignmentType.RIGHT:AlignmentType.LEFT,spacing:{after:70},children:[new ExternalHyperlink({link:url,children:[run(label,{font:model.lang==='fa'?'Vazir':'Arial',size:18,color:'51449C',rtl:model.lang==='fa'})]})]}); }
function heading(title,model) { return new Paragraph({heading:HeadingLevel.HEADING_2,bidirectional:model.lang==='fa',alignment:model.lang==='fa'?AlignmentType.RIGHT:AlignmentType.LEFT,spacing:{before:220,after:90},border:{bottom:{style:BorderStyle.SINGLE,size:5,color:'DFE2E9',space:4}},children:[run(title,{font:model.lang==='fa'?'Vazir':'Arial',size:23,bold:true,color:'28283A',rtl:model.lang==='fa'})],keepNext:true}); }
function textEntry(items, model, children, photos=[]) {
  const p=[];
  for(const [index,item] of items.entries()){
    const photo=photos[index];
    if(photo)p.push(new Paragraph({alignment:model.lang==='fa'?AlignmentType.RIGHT:AlignmentType.LEFT,bidirectional:model.lang==='fa',spacing:{after:70},children:[new ImageRun({data:photo.file,transformation:{width:88,height:50},type:photo.mime==='image/png'?'png':'jpg'})]}));
    const title=[item.title,item.org].filter(Boolean).join(' · ');
    if(title)p.push(para(title,model,{bold:true,size:21,after:40}));
    if(item.dates)p.push(para(item.dates,model,{size:17,color:'697083',after:40}));
    if(item.description)p.push(para(item.description,model,{size:18,after:45}));
    for(const link of item.links||[])p.push(hyperlink(link.label||link.url,link.url,model));
    if(item.technologies?.length)p.push(para(item.technologies.join(' · '),model,{size:17,color:'697083',after:50}));
    p.push(new Paragraph({spacing:{after:50},children:[run(' ',{size:4})]}));
  }
  return p;
}
export async function generateResumeDocx(model) {
  const children=[];
  const vazir=await Promise.all(['Vazir.ttf','Vazir-Bold.ttf'].map(name=>readFile(path.join(ROOT,'vazir-font-v16.1.0',name))));
  const images=await toDocxImages([await imageData(model.portrait),...(await projectImages(model))]);
  const [photo,...projectPhotos]=images;
  if(photo)children.push(new Paragraph({alignment:model.lang==='fa'?AlignmentType.RIGHT:AlignmentType.LEFT,bidirectional:model.lang==='fa',children:[new ImageRun({data:photo.file,transformation:{width:88,height:88},type:photo.mime==='image/png'?'png':'jpg'})],spacing:{after:120}}));
  children.push(new Paragraph({alignment:model.lang==='fa'?AlignmentType.RIGHT:AlignmentType.LEFT,bidirectional:model.lang==='fa',spacing:{after:40},children:[run(model.name,{font:model.lang==='fa'?'Vazir':'Arial',size:38,bold:true,color:'171D2B',rtl:model.lang==='fa'})]}));
  if(model.title)children.push(para(model.title,model,{size:23,color:'5A6070',after:90}));
  children.push(new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:14,color:(/^#[\da-f]{6}$/i.test(model.config.accent||'')?model.config.accent:'#9b8afb').slice(1)}},spacing:{after:120},children:[run(' ',{size:2})]}));
  const builders={
    summary:()=>[para(model.summary,model,{size:21})],about:()=>[para(model.about,model,{size:20})],
    interests:()=>[para(model.interests.join('  ·  '),model,{size:19})],skills:()=>[para(model.skills.join('  ·  '),model,{size:19})],
    experience:()=>textEntry(model.experience,model),projects:()=>textEntry(model.projects,model,projectPhotos),achievements:()=>textEntry(model.achievements,model),education:()=>textEntry(model.education,model),
    links:()=>model.links.map(x=>hyperlink(x.label||x.url,x.url,model)),contact:()=>model.contact.map(x=>hyperlink(x.replace(/^(mailto:|tel:)/,''),x,model)),
  };
  for(const section of model.order)children.push(heading(SECTION_LABELS[model.lang][section],model),...builders[section]());
  const footer = new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[run(`${model.name} · `,{font:model.lang==='fa'?'Vazir':'Arial',size:16,color:'818696',rtl:model.lang==='fa'}),new TextRun({children:[PageNumber.CURRENT],font:model.lang==='fa'?'Vazir':'Arial',size:16,color:'818696'})]})]});
  const docxPage={size:model.orientation==='landscape'?{width:16838,height:11906,orientation:PageOrientation.LANDSCAPE}:{width:11906,height:16838,orientation:PageOrientation.PORTRAIT},margin:{top:850,right:900,bottom:900,left:900}};
  const docxSections=model.orientation==='landscape'?[{properties:{page:docxPage,type:SectionType.CONTINUOUS},children:children.slice(0,photo?4:3)},{properties:{page:docxPage,type:SectionType.CONTINUOUS,column:{count:2,space:540}},footers:{default:footer},children:children.slice(photo?4:3)}]:[{properties:{page:docxPage},footers:{default:footer},children}];
  const doc=new Document({creator:model.name,title:model.config.documentTitle?.[model.lang]||model.name,fonts:[{name:'Vazir',data:vazir[0],bold:vazir[1]}],styles:{default:{document:{run:{font:model.lang==='fa'?'Vazir':'Arial',size:20,color:'252B3A'},paragraph:{spacing:{line:300}}}}},sections:docxSections});
  return Packer.toBuffer(doc);
}

async function toDocxImages(images) {
  const result=[...images];const pending=images.map((photo,index)=>({photo,index})).filter(({photo})=>photo&&photo.mime!=='image/png'&&photo.mime!=='image/jpeg');
  if(!pending.length)return result;
  const browser=await puppeteer.launch(browserOptions());
  try{const page=await browser.newPage();for(const {photo,index} of pending){await page.setContent(`<img id="source" src="data:${photo.mime};base64,${photo.file.toString('base64')}" style="width:320px;height:320px;object-fit:cover">`);await page.$eval('#source',img=>img.decode());const base64=await page.$eval('#source',img=>{const canvas=document.createElement('canvas');canvas.width=320;canvas.height=320;const ctx=canvas.getContext('2d');const scale=Math.max(canvas.width/img.naturalWidth,canvas.height/img.naturalHeight);const width=img.naturalWidth*scale,height=img.naturalHeight*scale;ctx.drawImage(img,(canvas.width-width)/2,(canvas.height-height)/2,width,height);return canvas.toDataURL('image/png').split(',')[1]});result[index]={file:Buffer.from(base64,'base64'),mime:'image/png'};}return result;}finally{await browser.close();}
}

export function resumeFilename(model, format) {
  const source=model.config.filename?.[model.lang] || `Ali-Arefipoor-Resume-${model.lang.toUpperCase()}`;
  const safe=String(source).normalize('NFKD').replace(/[^\p{L}\p{N}._-]+/gu,'-').replace(/^-+|-+$/g,'').slice(0,90)||`Resume-${model.lang.toUpperCase()}`;
  return `${safe}-${model.orientation==='landscape'?'Landscape':'Portrait'}.${format}`;
}
