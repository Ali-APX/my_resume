(() => {
  const lang = document.documentElement.lang === 'fa' ? 'fa' : 'en';
  const fa = lang === 'fa';
  const formLogin = document.querySelector('#login-form');
  const loginMessage = document.querySelector('#login-message');
  const area = document.querySelector('#admin-content');

  const words = {
    overview:['Overview','نمای کلی'], home:['Homepage','صفحه اصلی'], projects:['Projects','پروژه‌ها'], pages:['Pages','صفحه‌ها'], resume:['Resume exports','تنظیمات رزومه'],
    capabilities:['Capabilities','توانمندی‌ها'], skills:['Skills','مهارت‌ها'], achievements:['Achievements','دستاوردها'],
    experience:['Experience','تجربه'], certificates:['Education & certificates','آموزش و گواهی‌ها'], socials:['Social links','شبکه‌های اجتماعی'],
    contact:['Contact','تماس'], settings:['Global settings','تنظیمات کلی'], media:['Media library','رسانه‌ها'],
    defaultLanguage:['Default website language','زبان پیش‌فرض وب‌سایت'], sectionOrder:['Homepage section order','ترتیب بخش‌های صفحهٔ اصلی'],
    name:['Name','نام'], title:['Title','عنوان'], description:['Description','توضیحات'], body:['Page content','متن صفحه'],
    slug:['URL slug','شناسه نشانی'], visible:['Visible on website','نمایش در وب‌سایت'], showInNav:['Show in navigation','نمایش در منو'],
    order:['Display order','ترتیب نمایش'], featured:['Feature on homepage','نمایش در صفحه اصلی'], image:['Primary image','تصویر اصلی'],
    gallery:['Gallery images','تصاویر گالری'], file:['PDF document','فایل PDF'], images:['Supporting images','تصاویر تکمیلی'],
    technologies:['Technologies','فناوری‌ها'], category:['Category','دسته‌بندی'], status:['Status','وضعیت'], date:['Date','تاریخ'],
    organization:['Organization','سازمان'], role:['Role','نقش'], dates:['Dates','بازه زمانی'], platform:['Platform','پلتفرم'],
    url:['URL','نشانی وب'], label:['Link label','عنوان پیوند'], icon:['Icon','نماد'], email:['Email','ایمیل'], phone:['Phone','تلفن'],
    slogan:['Brand slogan','شعار برند'], theme:['Default theme','پوسته پیش‌فرض'], accent:['Brand color','رنگ برند'],
    portrait:['Portrait','تصویر پرتره'], portraitAlt:['Portrait alternative text','متن جایگزین پرتره'], portraitPosition:['Portrait crop position','جایگاه برش پرتره'],
    defaultDescription:['Default SEO description','توضیحات پیش‌فرض سئو'], defaultImage:['Default sharing image','تصویر پیش‌فرض اشتراک‌گذاری'],
    logo:['Logo','لوگو'], favicon:['Favicon','فاوآیکن'], nav:['Show navigation','نمایش منو'],
    statusCompleted:['Completed','تکمیل‌شده'], ongoing:['In progress','در حال انجام'], kind:['Link type','نوع پیوند'],
    settings:['Global settings','تنظیمات کلی'], add:['Add item','افزودن مورد'], save:['Save changes','ذخیره تغییرات'], cancel:['Cancel','لغو'],
    addLink:['Add link','افزودن پیوند'], remove:['Remove','حذف'], chooseMedia:['Choose existing file','انتخاب فایل موجود'], upload:['Upload new file','بارگذاری فایل جدید'],
    search:['Search','جست‌وجو'], english:['English content','محتوای انگلیسی'], persian:['Persian content','محتوای فارسی'], common:['General details','اطلاعات اصلی'],
    none:['None','هیچ‌کدام'], noItems:['No entries yet. Add your first item.','هنوز موردی ثبت نشده است.'],
    nameEn:['Name in English','نام به انگلیسی'], nameFa:['Name in Persian','نام به فارسی'], titleEn:['English title','عنوان انگلیسی'], titleFa:['Persian title','عنوان فارسی'], introEn:['English introduction','معرفی انگلیسی'], introFa:['Persian introduction','معرفی فارسی'],
    contactMessageEn:['English contact message','پیام تماس انگلیسی'], contactMessageFa:['Persian contact message','پیام تماس فارسی'],
    aboutEn:['About text in English','متن درباره به انگلیسی'], aboutFa:['About text in Persian','متن درباره به فارسی'],
    projectsButton:['Projects button label','عنوان دکمه پروژه‌ها'], contactButton:['Contact button label','عنوان دکمه تماس'],
    homeCapabilities:['Capability strip','نوار توانمندی‌ها'], homeProjects:['Featured projects','پروژه‌های منتخب'], homeRecognition:['Achievements & learning','دستاوردها و آموزش'], homeAbout:['About section','بخش درباره'], homeContact:['Contact section','بخش تماس'], homeSkills:['Skills section','بخش مهارت‌ها'],
    resumeEnabled:['Enable resume downloads','فعال‌سازی دریافت رزومه'], resumeLanguage:['Default resume language','زبان پیش‌فرض رزومه'], resumeOrientation:['Default page orientation','جهت پیش‌فرض صفحه'], resumePdf:['PDF format','قالب PDF'], resumeDocx:['Word (DOCX) format','قالب Word (DOCX)'], resumeAccent:['PDF accent color','رنگ تأکیدی PDF'], resumeFilenameEn:['English filename (without extension)','نام فایل انگلیسی (بدون پسوند)'], resumeFilenameFa:['Persian filename (without extension)','نام فایل فارسی (بدون پسوند)'], resumeTitleEn:['English document title','عنوان سند انگلیسی'], resumeTitleFa:['Persian document title','عنوان سند فارسی'], resumeOrder:['Resume section order','ترتیب بخش‌های رزومه'], moveUp:['Move up','انتقال به بالا'], moveDown:['Move down','انتقال به پایین'], resumeSummary:['Professional summary','خلاصه حرفه‌ای'], resumeAbout:['About','درباره من'], resumeInterests:['Areas of focus','حوزه‌های تخصصی'], resumeSkills:['Technical skills','مهارت‌های فنی'], resumeExperience:['Experience and activities','تجربه و فعالیت‌ها'], resumeProjects:['Projects','پروژه‌ها'], resumeAchievements:['Awards and achievements','جوایز و دستاوردها'], resumeEducation:['Education and training','آموزش و دوره‌ها'], resumeLinks:['Professional links','پیوندهای حرفه‌ای'], resumeContact:['Contact','اطلاعات تماس'],
    settingsGeneral:['General settings','تنظیمات عمومی'], settingsAppearance:['Appearance','ظاهر'], settingsLocalization:['Localization & footer','زبان و پانوشت'], settingsSeo:['SEO & social sharing','سئو و اشتراک‌گذاری'], settingsProfile:['Profile photograph & crops','عکس پروفایل و برش‌ها'],
    cropHome:['Homepage profile crop','برش تصویر صفحهٔ اصلی'], cropPortrait:['Portrait resume crop','برش رزومهٔ عمودی'], cropLandscape:['Landscape resume crop','برش رزومهٔ افقی'], cropSourceRequired:['Select and save a profile photograph before editing its crops.','برای ویرایش برش‌ها، ابتدا عکس پروفایل را انتخاب و ذخیره کنید.'], editCrop:['Edit crop','ویرایش برش'], editImage:['Edit image','ویرایش تصویر'], translationMissing:['Translation missing','ترجمه موجود نیست'],
    cropTitle:['Edit image crop','ویرایش برش تصویر'], zoom:['Zoom','بزرگ‌نمایی'], cropRatio:['Crop ratio','نسبت برش'], cropReset:['Reset crop','بازنشانی برش'], cropSave:['Save crop','ذخیره برش'], cropCancel:['Cancel','لغو'], cropRound:['Circular preview','پیش‌نمایش دایره‌ای'], cropRect:['Rectangle preview','پیش‌نمایش مستطیلی'], cropRotate:['Rotate 90°','چرخش ۹۰ درجه'], cropError:['Could not save this crop.','ذخیرهٔ برش انجام نشد.'],
    unsavedChanges:['You have unsaved changes. Leave this form?','تغییرات ذخیره‌نشده دارید. از این فرم خارج می‌شوید؟'],
    projectsUrl:['Projects button destination','نشانی دکمه پروژه‌ها'], contactUrl:['Contact button destination','نشانی دکمه تماس'],
    selectIcon:['Select an icon','انتخاب نماد'], published:['Visible','نمایش داده می‌شود'], hidden:['Hidden','پنهان'],
    password:['Password','گذرواژه'], login:['Sign in securely','ورود امن'], dashboard:['Dashboard','پیشخوان'],
    noMedia:['No files yet','هنوز فایلی وجود ندارد'], fileLimit:['Files must be 5 MB or smaller.','اندازه فایل باید حداکثر ۵ مگابایت باشد.'],
    confirmDelete:['Delete this item?','این مورد حذف شود؟'], saveError:['Could not save changes.','ذخیره تغییرات انجام نشد.'],
    invalidSlug:['Use lowercase letters, numbers, and hyphens in the URL slug.','برای نشانی فقط از حروف کوچک، عدد و خط تیره استفاده کنید.'],
    recent:['Content is saved as you edit and appears on the site immediately.','تغییرات پس از ذخیره بلافاصله در وب‌سایت نمایش داده می‌شوند.']
  };
  const say = (key) => words[key]?.[fa ? 1 : 0] || key;
  const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uiIcon = (name) => {
    const path={up:'<path d="m6 14 6-6 6 6"/>',down:'<path d="m6 10 6 6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',spark:'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',chart:'<path d="M4 19V5m0 14h17M8 15l3-4 3 2 5-7"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',external:'<path d="M14 4h6v6m-11 4 11-10"/><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/>',remove:'<path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/>'};
    return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path[name]||path.external}</svg>`;
  };
  const clone = value => structuredClone(value);

  formLogin?.addEventListener('submit', async event => {
    event.preventDefault();
    loginMessage.textContent = fa ? 'در حال بررسی…' : 'Checking…';
    try {
      const response = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password:new FormData(formLogin).get('password')}) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Sign in failed');
      location.href = `/admin?lang=${lang}`;
    } catch (error) { loginMessage.textContent = error.message; }
  });
  if (!area) return;

  const collectionSections = ['projects','pages','capabilities','skills','achievements','experience','certificates','socials'];
  const schemas = {
    home:[
      {key:'name',label:'nameEn',type:'text'}, {key:'nameFa',label:'nameFa',type:'text'}, {key:'title.en',label:'titleEn',type:'text',group:'en'}, {key:'title.fa',label:'titleFa',type:'text',group:'fa'},
      {key:'intro.en',label:'introEn',type:'textarea',group:'en'}, {key:'intro.fa',label:'introFa',type:'textarea',group:'fa'},
      {key:'buttons.projects.en',label:'projectsButton',type:'text',group:'en'}, {key:'buttons.projects.fa',label:'projectsButton',type:'text',group:'fa'},
      {key:'buttons.projectsUrl',label:'projectsUrl',type:'path'}, {key:'buttons.contact.en',label:'contactButton',type:'text',group:'en'},
      {key:'buttons.contact.fa',label:'contactButton',type:'text',group:'fa'}, {key:'buttons.contactUrl',label:'contactUrl',type:'path'},
      {key:'about.en',label:'aboutEn',type:'textarea',group:'en'}, {key:'about.fa',label:'aboutFa',type:'textarea',group:'fa'},
      {key:'sections.capabilities',label:'homeCapabilities',type:'toggle'}, {key:'sections.projects',label:'homeProjects',type:'toggle'}, {key:'sections.recognition',label:'homeRecognition',type:'toggle'}, {key:'sections.about',label:'homeAbout',type:'toggle'}, {key:'sections.contact',label:'homeContact',type:'toggle'}, {key:'sections.skills',label:'homeSkills',type:'toggle'}, {key:'sectionOrder',label:'sectionOrder',type:'homeOrder'},
      {key:'aboutVisible',type:'toggle'}, {key:'visible',type:'toggle'}
    ],
    settings:[
      {key:'siteName',type:'text',category:'settingsGeneral'}, {key:'defaultLanguage',label:'defaultLanguage',type:'select',options:['en','fa'],category:'settingsGeneral'}, {key:'theme',type:'select',options:['dark','light'],category:'settingsGeneral'}, {key:'nav',type:'toggle',category:'settingsGeneral'},
      {key:'accent',type:'color',category:'settingsAppearance'}, {key:'logo',type:'media',accept:'image',category:'settingsAppearance'}, {key:'favicon',type:'media',accept:'image',category:'settingsAppearance'},
      {key:'portrait',type:'media',accept:'image',category:'settingsProfile',crop:false}, {key:'portraitCrops',type:'profileCrops',label:'settingsProfile',category:'settingsProfile'},
      {key:'portraitAlt.en',label:'portraitAlt',type:'text',group:'en',category:'settingsProfile'}, {key:'portraitAlt.fa',label:'portraitAlt',type:'text',group:'fa',category:'settingsProfile'}, {key:'portraitPosition',type:'text',category:'settingsProfile'},
      {key:'slogan.en',label:'slogan',type:'text',group:'en',category:'settingsLocalization'}, {key:'slogan.fa',label:'slogan',type:'text',group:'fa',category:'settingsLocalization'},
      {key:'defaultDescription.en',label:'defaultDescription',type:'textarea',group:'en',category:'settingsSeo'}, {key:'defaultDescription.fa',label:'defaultDescription',type:'textarea',group:'fa',category:'settingsSeo'}, {key:'defaultImage',type:'media',accept:'image',category:'settingsSeo'}
    ],
    resume:[
      {key:'settings.resume.enabled',label:'resumeEnabled',type:'toggle'},
      {key:'settings.resume.defaultLanguage',label:'resumeLanguage',type:'select',options:['en','fa']},
      {key:'settings.resume.defaultOrientation',label:'resumeOrientation',type:'select',options:['portrait','landscape']},
      {key:'settings.resume.formats.pdf',label:'resumePdf',type:'toggle'},{key:'settings.resume.formats.docx',label:'resumeDocx',type:'toggle'},
      {key:'settings.resume.accent',label:'resumeAccent',type:'color'},
      {key:'settings.resume.filename.en',label:'resumeFilenameEn',type:'text'}, {key:'settings.resume.filename.fa',label:'resumeFilenameFa',type:'text'},
      {key:'settings.resume.documentTitle.en',label:'resumeTitleEn',type:'text'}, {key:'settings.resume.documentTitle.fa',label:'resumeTitleFa',type:'text'},
      {key:'settings.resume.sections.summary',label:'resumeSummary',type:'toggle'},{key:'settings.resume.sections.about',label:'resumeAbout',type:'toggle'},
      {key:'settings.resume.sections.interests',label:'resumeInterests',type:'toggle'},{key:'settings.resume.sections.skills',label:'resumeSkills',type:'toggle'},
      {key:'settings.resume.sections.experience',label:'resumeExperience',type:'toggle'},{key:'settings.resume.sections.projects',label:'resumeProjects',type:'toggle'},
      {key:'settings.resume.sections.achievements',label:'resumeAchievements',type:'toggle'},{key:'settings.resume.sections.education',label:'resumeEducation',type:'toggle'},
      {key:'settings.resume.sections.links',label:'resumeLinks',type:'toggle'},{key:'settings.resume.sections.contact',label:'resumeContact',type:'toggle'},
      {key:'settings.resume.order',label:'resumeOrder',type:'resumeOrder'}
    ],
    contact:[{key:'email',type:'email'},{key:'phone',type:'tel'},{key:'message.en',label:'contactMessageEn',type:'textarea',group:'en'},{key:'message.fa',label:'contactMessageFa',type:'textarea',group:'fa'}],
    projects:[
      {key:'name',type:'text',required:true},{key:'slug',type:'slug',required:true},
      {key:'description.en',label:'description',type:'textarea',group:'en'},{key:'description.fa',label:'description',type:'textarea',group:'fa'},
      {key:'technologies',type:'tags'},{key:'category',type:'select',options:['Project','Web app','Game','AI & Data','Other']},{key:'status',type:'select',options:['In progress','Live','Archived']},
      {key:'image',type:'media',accept:'image'},{key:'gallery',type:'mediaList',accept:'image'},
      {key:'featured',type:'toggle'},{key:'visible',type:'toggle'},{key:'order',type:'number'},{key:'links',type:'links'}
    ],
    pages:[
      {key:'slug',type:'slug',required:true},{key:'title.en',label:'titleEn',type:'text',group:'en',required:true},{key:'title.fa',label:'titleFa',type:'text',group:'fa'},
      {key:'body.en',label:'body',type:'textarea',group:'en'},{key:'body.fa',label:'body',type:'textarea',group:'fa'},
      {key:'description.en',label:'description',type:'textarea',group:'en'},{key:'description.fa',label:'description',type:'textarea',group:'fa'},
      {key:'visible',type:'toggle'},{key:'showInNav',type:'toggle'}
    ],
    capabilities:[{key:'label.en',label:'label',type:'text',group:'en',required:true},{key:'label.fa',label:'label',type:'text',group:'fa'},{key:'icon',type:'icon'},{key:'visible',type:'toggle'},{key:'order',type:'number'}],
    skills:[{key:'name',type:'text',required:true},{key:'category',type:'select',options:['Technology','Programming','AI & Data','Systems','Other']},{key:'description',type:'textarea'},{key:'visible',type:'toggle'},{key:'order',type:'number'}],
    achievements:[
      {key:'title.en',label:'titleEn',type:'text',group:'en',required:true},{key:'title.fa',label:'titleFa',type:'text',group:'fa'},
      {key:'description.en',label:'description',type:'textarea',group:'en'},{key:'description.fa',label:'description',type:'textarea',group:'fa'},
      {key:'category',type:'select',options:['Competition','Research','Award','Education','Other']},{key:'date',type:'text'},{key:'image',type:'media',accept:'image'},
      {key:'images',label:'images',type:'mediaList',accept:'image'},{key:'visible',type:'toggle'},{key:'order',type:'number'}
    ],
    experience:[
      {key:'organization',type:'text',required:true},{key:'role.en',label:'role',type:'text',group:'en'},{key:'role.fa',label:'role',type:'text',group:'fa'},
      {key:'description.en',label:'description',type:'textarea',group:'en'},{key:'description.fa',label:'description',type:'textarea',group:'fa'},
      {key:'dates',type:'text'},{key:'link',type:'url'},{key:'visible',type:'toggle'},{key:'order',type:'number'}
    ],
    certificates:[
      {key:'title.en',label:'titleEn',type:'text',group:'en',required:true},{key:'title.fa',label:'titleFa',type:'text',group:'fa'},
      {key:'organization',type:'text'},{key:'description.en',label:'description',type:'textarea',group:'en'},{key:'description.fa',label:'description',type:'textarea',group:'fa'},
      {key:'status',type:'select',options:['completed','ongoing']},{key:'date',type:'text'},{key:'image',type:'media',accept:'image'},
      {key:'images',label:'images',type:'mediaList',accept:'image'},{key:'file',type:'media',accept:'pdf'},
      {key:'visible',type:'toggle'},{key:'order',type:'number'}
    ],
    socials:[
      {key:'platform',type:'select',options:['GitHub','LinkedIn','Aparat','YouTube','Website','Other']},
      {key:'label',type:'text'},{key:'url',type:'url',required:true},{key:'visible',type:'toggle'},{key:'order',type:'number'}
    ]
  };

  const labels = Object.fromEntries(Object.keys(schemas).map(key => [key, say(key)]));
  let data;
  let active = 'overview';
  let selectedIndex = 0;
  let mediaFiles = [];
  let pendingLinks = null;
  let formDirty = false;
  const mediaSelections = new Map();
  document.addEventListener('input',event=>{if(event.target.closest('#content-form'))formDirty=true;});
  document.addEventListener('change',event=>{if(event.target.closest('#content-form'))formDirty=true;});
  window.addEventListener('beforeunload',event=>{if(formDirty){event.preventDefault();event.returnValue='';}});

  function notify(text, bad=false) {
    const node = document.querySelector('#admin-message');
    if (!node) return;
    node.textContent = text;
    node.className = bad ? 'notice error' : 'notice success';
    setTimeout(() => { node.textContent = ''; node.className = ''; }, 4000);
  }
  async function api(url, options={}) {
    const response = await fetch(url, { ...options, headers:{...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})} });
    const result = await response.json().catch(() => ({}));
    if (response.status === 401) { location.href = `/admin?lang=${lang}`; throw new Error('Session expired'); }
    if (!response.ok) throw new Error(result.error || say('saveError'));
    return result;
  }
  async function persist() {
    await api('/api/content', {method:'PUT', body:JSON.stringify(data)});
    notify(fa ? 'تغییرات ذخیره شد' : 'Changes saved');
  }
  async function fetchMedia() { mediaFiles = await api('/api/media'); return mediaFiles; }
  const pathValue = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
  function setPath(object, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const parent = parts.reduce((value,key) => value[key] ||= {}, object);
    parent[last] = value;
  }
  function titleOf(section, item) {
    const value = item.name || item.organization || item.platform || item.slug || item.title || item.label || item.role || say('add');
    return typeof value === 'object' ? value[lang] || value.en || value.fa || say('add') : value;
  }
  function newRecord(section) {
    const id = `${section}-${Date.now()}`;
    const defaults = {
      projects:{id,slug:'new-project',name:'New project',description:{en:'',fa:''},technologies:[],category:'',status:'In progress',image:'',gallery:[],featured:false,visible:true,order:data.projects.length+1,links:[]},
      pages:{id,slug:'new-page',title:{en:'New page',fa:''},body:{en:'',fa:''},description:{en:'',fa:''},visible:true,showInNav:false},
      capabilities:{id,label:{en:'New capability',fa:''},icon:'code',visible:true,order:data.capabilities.length+1},
      skills:{id,name:'New skill',category:'',description:'',visible:true,order:data.skills.length+1},
      achievements:{id,title:{en:'New achievement',fa:''},description:{en:'',fa:''},category:'',date:'',image:'',images:[],visible:true,order:data.achievements.length+1},
      experience:{id,organization:'New organization',role:{en:'',fa:''},description:{en:'',fa:''},dates:'',link:'',visible:true,order:data.experience.length+1},
      certificates:{id,title:{en:'New certificate',fa:''},organization:'',description:{en:'',fa:''},status:'completed',date:'',image:'',images:[],file:'',visible:true,order:data.certificates.length+1},
      socials:{id,platform:'Website',url:'https://',label:'',visible:true,order:data.socials.length+1}
    };
    return defaults[section];
  }
  function mediaControl(field, value) {
    const list = mediaFiles.filter(file => field.accept==='pdf' ? file.name.endsWith('.pdf') : !file.name.endsWith('.pdf'));
    const options = list.map(file => `<option value="${esc(file.url)}" ${value===file.url?'selected':''}>${esc(file.name)}</option>`).join('');
    const current = value && !list.some(file=>file.url===value) ? `<option value="${esc(value)}" selected>${esc(value)}</option>` : '';
    return `<div class="media-control"><select name="${esc(field.key)}" ${field.required?'required':''}><option value="">${say('none')}</option>${current}${options}</select><button class="button button-secondary media-upload-trigger" type="button" data-upload-trigger data-target="${esc(field.key)}">${say('upload')}</button>${field.accept!=='pdf'&&field.crop!==false?`<button class="button button-secondary" type="button" data-image-crop="${esc(field.key)}" ${value?'':'disabled'}>${say('editCrop')}</button>`:''}<input class="media-file-input" type="file" hidden accept="${field.accept==='pdf'?'application/pdf':'image/png,image/jpeg,image/webp,image/gif'}" data-target="${esc(field.key)}"><div class="media-preview">${value?(value.endsWith('.pdf')?`<a href="${esc(value)}" target="_blank" rel="noopener noreferrer">PDF · ${say('chooseMedia')}</a>`:`<img src="${esc(value)}" alt="">`):''}</div></div>`;
  }
  const galleryKey = field => `${active}:${selectedIndex}:${field.key}`;
  function galleryMarkup(field, urls) {
    return urls.map((url,index)=>`<div class="gallery-item"><img src="${esc(url)}" alt=""><div><button class="icon-button gallery-move" type="button" data-field="${esc(field.key)}" data-index="${index}" data-delta="-1" aria-label="Move up">${uiIcon('up')}</button><button class="icon-button gallery-move" type="button" data-field="${esc(field.key)}" data-index="${index}" data-delta="1" aria-label="Move down">${uiIcon('down')}</button><button class="icon-button gallery-remove" type="button" data-field="${esc(field.key)}" data-url="${esc(url)}" aria-label="${say('remove')}">${uiIcon('remove')}</button></div></div>`).join('');
  }
  function refreshGallery(field, urls) {
    const preview=document.querySelector(`[data-gallery-preview="${CSS.escape(field.key)}"]`);
    if(preview)preview.innerHTML=galleryMarkup(field,urls);
  }
  function fieldMarkup(field, object) {
    const value = pathValue(object, field.key);
    const label = say(field.label || field.key.split('.').at(-1));
    const id = `field-${field.key.replaceAll('.','-')}`;
    const missing=field.group&&!(String(value||'').trim())&&String(pathValue(object,field.key.replace(/\.(en|fa)$/,`.${field.group==='en'?'fa':'en'}`))||'').trim();
    const translationNote=missing?`<small class="translation-missing">${say('translationMissing')}</small>`:'';
    if(field.type==='profileCrops'){
      const crops=pathValue(object,field.key)||{};const source=object.portrait||'';
      const modes=[['homepage','cropHome','4:5'],['resumePortrait','cropPortrait','4:5'],['resumeLandscape','cropLandscape','4:3']];
      return `<div class="field full"><label>${say('settingsProfile')}</label><p class="editor-hint">${source?esc(source):say('cropSourceRequired')}</p><div class="profile-crop-grid">${modes.map(([mode,label,ratio])=>`<article class="profile-crop-card"><div class="profile-crop-preview">${crops[mode]?`<img src="${esc(crops[mode])}" alt="">`:source?`<img src="${esc(source)}" alt="">`:'<span>—</span>'}</div><strong>${say(label)}</strong><button class="button button-secondary" type="button" data-profile-crop="${mode}" data-ratio="${ratio}" ${source?'':'disabled'}>${say('editCrop')}</button></article>`).join('')}</div></div>`;
    }
    if(field.type==='homeOrder'){
      const valueOrder=Array.isArray(value)?value:[];const titles={capabilities:'homeCapabilities',projects:'homeProjects',recognition:'homeRecognition',about:'homeAbout',contact:'homeContact',skills:'homeSkills'};
      return `<div class="field full"><label>${label}</label><ol class="resume-order" data-home-order>${valueOrder.map((section,index)=>`<li draggable="true" data-home-item="${esc(section)}"><span><span class="drag-handle" aria-hidden="true">⠿</span> <span class="order-label">${index+1}. ${say(titles[section]||section)}</span></span></li>`).join('')}</ol><input type="hidden" name="${esc(field.key)}" value="${esc(JSON.stringify(valueOrder))}"></div>`;
    }
    if(field.type==='resumeOrder'){
      const orderValue=Array.isArray(value)?value:[];
      const titles={summary:'resumeSummary',about:'resumeAbout',interests:'resumeInterests',skills:'resumeSkills',experience:'resumeExperience',projects:'resumeProjects',achievements:'resumeAchievements',education:'resumeEducation',links:'resumeLinks',contact:'resumeContact'};
      return `<div class="field full"><label>${label}</label><ol class="resume-order" data-resume-order>${orderValue.map((section,index)=>`<li draggable="true" data-resume-item="${esc(section)}"><span><span class="drag-handle" aria-hidden="true">⠿</span> <span class="order-label">${index+1}. ${say(titles[section]||section)}</span></span></li>`).join('')}</ol><input type="hidden" name="${esc(field.key)}" value="${esc(JSON.stringify(orderValue))}"></div>`;
    }
    if (field.type==='links') return `<div class="field full"><div class="field-label">${say('addLink')}</div><div class="link-editor">${(pendingLinks||value||[]).map((link,index)=>linkRow(link,index)).join('')}</div><button class="button button-secondary add-link" type="button">${say('addLink')} +</button></div>`;
    if (field.type==='media') return `<div class="field ${field.type==='textarea'?'full':''}"><label for="${id}">${label}${field.required?' *':''}</label>${mediaControl(field,value||'')}</div>`;
    if (field.type==='mediaList') {
      const selected = Array.isArray(value)?value:[];
      const ordered=mediaSelections.get(galleryKey(field))||selected;
      if(!mediaSelections.has(galleryKey(field)))mediaSelections.set(galleryKey(field),[...selected]);
      const list = mediaFiles.filter(file=>field.accept==='pdf'?file.name.endsWith('.pdf'):!file.name.endsWith('.pdf'));
      return `<div class="field full"><label for="${id}">${label}</label><select id="${id}" name="${esc(field.key)}" multiple size="${Math.min(5, Math.max(2, list.length))}">${list.map(file=>`<option value="${esc(file.url)}" ${ordered.includes(file.url)?'selected':''}>${esc(file.name)}</option>`).join('')}</select><small>${fa?'برای چند مورد، کلید Ctrl را نگه دارید.':'Hold Ctrl/Cmd to select multiple files. Selected images can be reordered below.'}</small><div class="media-gallery-preview" data-gallery-preview="${esc(field.key)}">${galleryMarkup(field,ordered)}</div><div class="gallery-upload"><button class="button button-secondary" type="button" data-upload-trigger data-target="${esc(field.key)}">${say('upload')}</button><input class="media-file-input" type="file" hidden accept="${field.accept==='pdf'?'application/pdf':'image/png,image/jpeg,image/webp,image/gif'}" data-target="${esc(field.key)}"></div></div>`;
    }
    if (field.type==='toggle') return `<label class="field-toggle"><input type="checkbox" name="${esc(field.key)}" ${value?'checked':''}><span class="toggle-track"></span><span>${label}</span></label>`;
    if (field.type==='tags') return `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${esc(field.key)}" value="${esc((value||[]).join(', '))}" placeholder="${fa?'با ویرگول جدا کنید':'Separate with commas'}"></div>`;
    if(field.type==='icon')return `<fieldset class="field full icon-picker"><legend>${label}</legend>${['code','spark','chart','search'].map(option=>`<label class="icon-choice"><input type="radio" name="${esc(field.key)}" value="${option}" ${value===option?'checked':''}><span>${uiIcon(option)}</span><span>${option}</span></label>`).join('')}</fieldset>`;
    if (field.type==='select') return `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${esc(field.key)}">${value&&!field.options.includes(value)?`<option value="${esc(value)}" selected>${esc(value)}</option>`:''}${field.options.map(option=>`<option value="${esc(option)}" ${value===option?'selected':''}>${esc(option==='completed'?say('statusCompleted'):option==='ongoing'?say('ongoing'):option)}</option>`).join('')}</select></div>`;
    if (field.type==='color') return `<div class="field"><label for="${id}">${label}</label><div class="color-field"><input id="${id}" name="${esc(field.key)}" type="color" value="${/^#[\da-f]{6}$/i.test(value||'')?value:'#7059d6'}"><span>${esc(value||'')}</span></div></div>`;
    if (field.type==='textarea') return `<div class="field full"><label for="${id}">${label}${field.required?' *':''}</label>${translationNote}<textarea id="${id}" name="${esc(field.key)}" rows="4" ${field.required?'required':''}>${esc(value||'')}</textarea></div>`;
    const inputType = ({email:'email',tel:'tel',url:'url',number:'number',slug:'text',path:'text'})[field.type] || 'text';
    return `<div class="field"><label for="${id}">${label}${field.required?' *':''}</label>${translationNote}<input id="${id}" name="${esc(field.key)}" type="${inputType}" value="${esc(value??'')}" ${field.required?'required':''} ${field.type==='number'?'step="1"':''} ${field.type==='slug'?'pattern="[a-z0-9]+(?:-[a-z0-9]+)*"':''} ${field.type==='path'?'placeholder="/projects"':''}></div>`;
  }
  function linkRow(link={}, index=0) {
    return `<div class="link-row" data-link-row data-index="${index}"><input data-link-label aria-label="${fa?'عنوان پیوند':'Link label'}" placeholder="${fa?'عنوان':'Label'}" value="${esc(link.label||'')}"><input data-link-url type="url" aria-label="URL" placeholder="https://…" value="${esc(link.url||'')}"><select data-link-kind aria-label="${say('kind')}"><option value="demo" ${link.kind==='demo'?'selected':''}>Demo</option><option value="github" ${link.kind==='github'?'selected':''}>GitHub</option><option value="docs" ${link.kind==='docs'?'selected':''}>Documentation</option><option value="external" ${link.kind==='external'?'selected':''}>Website</option></select><button type="button" class="icon-button remove-link" aria-label="${say('remove')}">${uiIcon('remove')}</button></div>`;
  }
  function sectionForm(section, object) {
    const fields = schemas[section];
    const common = fields.filter(field=>!field.group);
    const english = fields.filter(field=>field.group==='en');
    const persian = fields.filter(field=>field.group==='fa');
    const controls = list => list.map(field=>fieldMarkup(field,object)).join('');
    if(section==='settings'){
      const categories=[...new Set(fields.map(field=>field.category||'settingsGeneral'))];
      const groups=categories.map(category=>{const selected=fields.filter(field=>(field.category||'settingsGeneral')===category);return `<div class="form-section settings-category"><h2>${say(category)}</h2><div class="form-grid">${controls(selected.filter(field=>!field.group))}</div>${['en','fa'].map(code=>{const localized=selected.filter(field=>field.group===code);return localized.length?`<div class="language-section" lang="${code}" dir="${code==='fa'?'rtl':'ltr'}"><h3>${say(code==='en'?'english':'persian')}</h3><div class="form-grid">${controls(localized)}</div></div>`:''}).join('')}</div>`}).join('');
      return `<form class="content-form" id="content-form" novalidate>${groups}<div class="form-footer"><span class="editor-hint">${say('recent')}</span><div><button class="button button-secondary" id="cancel-edit" type="button">${say('cancel')}</button><button class="button button-primary" type="submit">${say('save')}</button></div></div></form>`;
    }
    return `<form class="content-form" id="content-form" novalidate><div class="form-section"><h2>${say('common')}</h2><div class="form-grid">${controls(common)}</div></div>${english.length?`<div class="form-section language-section" lang="en" dir="ltr"><h2>${say('english')}</h2><div class="form-grid">${controls(english)}</div></div>`:''}${persian.length?`<div class="form-section language-section" lang="fa" dir="rtl"><h2>${say('persian')}</h2><div class="form-grid">${controls(persian)}</div></div>`:''}<div class="form-footer"><span class="editor-hint">${say('recent')}</span><div><button class="button button-secondary" id="cancel-edit" type="button">${say('cancel')}</button><button class="button button-primary" type="submit">${say('save')}</button></div></div></form>`;
  }
  function dashboard() {
    return `<div class="admin-heading"><div><div class="eyebrow">${fa?'مدیریت محتوا':'CONTENT MANAGEMENT'}</div><h1>${say('dashboard')}</h1><p>${say('recent')}</p></div></div><div class="stat-grid">${['projects','skills','achievements','certificates'].map(key=>`<div class="stat-card"><span>${say(key)}</span><strong>${data[key].length}</strong></div>`).join('')}</div><div class="admin-panel"><h2>${fa?'ویرایش محتوا':'Manage content'}</h2><div class="quick-grid">${Object.keys(labels).filter(key=>key!=='overview').map(key=>`<button class="quick-link" data-tab="${key}">${labels[key]} ${uiIcon('right')}</button>`).join('')}</div></div><div class="admin-panel"><h2>${say('media')}</h2>${mediaTools()}</div>`;
  }
  function mediaTools() {
    return `<div class="upload-row"><input id="media-upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"><button class="button button-secondary" id="upload-button">${say('upload')}</button></div><div id="media-list" class="media-list">${mediaFiles.map(file=>mediaCard(file)).join('')||`<p class="empty-state">${say('noMedia')}</p>`}</div>`;
  }
  function mediaCard(file) {
    return `<div class="media-card"><button class="media-item" type="button" data-url="${esc(file.url)}">${file.name.endsWith('.pdf')?'<span class="file-icon">PDF</span>':`<img src="${esc(file.url)}" alt="">`}<span>${esc(file.name)}</span></button><button class="media-delete" type="button" data-name="${esc(file.name)}">${say('remove')}</button></div>`;
  }
  function recordList(section) {
    const rows = data[section] || [];
    return `<div class="admin-heading"><div><div class="eyebrow">${fa?'مدیریت محتوا':'CONTENT EDITOR'}</div><h1>${labels[section]}</h1></div><button class="button button-primary" id="add-record">${say('add')} +</button></div><input class="collection-search" id="collection-search" type="search" placeholder="${say('search')}…"><div class="record-list">${rows.map((item,index)=>`<article class="record-row" data-search="${esc(String(titleOf(section,item)).toLowerCase())}"><button class="record-name" data-edit-index="${index}"><strong>${esc(titleOf(section,item))}</strong><span>${item.visible===false?say('hidden'):say('published')}</span></button><div class="record-actions"><button class="text-link" data-edit-index="${index}">${fa?'ویرایش':'Edit'}</button><button class="icon-button" data-move-index="${index}" data-move-delta="-1" aria-label="Move up">${uiIcon('up')}</button><button class="icon-button" data-move-index="${index}" data-move-delta="1" aria-label="Move down">${uiIcon('down')}</button><button class="text-link danger-link" data-delete-index="${index}">${say('remove')}</button></div></article>`).join('')||`<p class="empty-state">${say('noItems')}</p>`}</div>${rows[selectedIndex]?`<div class="record-edit-card"><div class="record-title"><div><div class="eyebrow">${labels[section]}</div><h2>${esc(titleOf(section,rows[selectedIndex]))}</h2></div></div>${sectionForm(section,rows[selectedIndex])}</div>`:''}`;
  }
  async function render(section=active) {
    if(section!==active&&formDirty&&!confirm(say('unsavedChanges')))return;
    if (section!==active) { selectedIndex=0; pendingLinks=null; }
    active=section;
    document.querySelectorAll('[data-tab]').forEach(button=>button.classList.toggle('active',button.dataset.tab===section));
    if (schemas[section]?.some(field=>field.type==='media'||field.type==='mediaList')) await fetchMedia();
    formDirty=false;
    area.innerHTML = section==='overview' ? dashboard() : collectionSections.includes(section) ? recordList(section) : schemas[section] ? `<div class="admin-heading"><div><div class="eyebrow">${fa?'مدیریت محتوا':'CONTENT EDITOR'}</div><h1>${labels[section]}</h1></div></div>${sectionForm(section,section==='resume'?data:data[section])}` : dashboard();
    bind(section);
  }
  function bind(section) {
    document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>render(button.dataset.tab)));
    document.querySelectorAll('[data-edit-index]').forEach(button=>button.addEventListener('click',()=>{selectedIndex=Number(button.dataset.editIndex);pendingLinks=null;render(active);}));
    document.querySelector('#add-record')?.addEventListener('click',async()=>{data[active].push(newRecord(active));selectedIndex=data[active].length-1;pendingLinks=null;await persist();render(active);});
    document.querySelectorAll('[data-delete-index]').forEach(button=>button.addEventListener('click',async()=>{if(!confirm(say('confirmDelete')))return;data[active].splice(Number(button.dataset.deleteIndex),1);selectedIndex=Math.max(0,Math.min(selectedIndex,data[active].length-1));await persist();render(active);}));
    document.querySelectorAll('[data-move-index]').forEach(button=>button.addEventListener('click',async()=>{const from=Number(button.dataset.moveIndex),to=from+Number(button.dataset.moveDelta);if(to<0||to>=data[active].length)return;const [item]=data[active].splice(from,1);data[active].splice(to,0,item);data[active].forEach((entry,index)=>{if('order' in entry)entry.order=index+1;});selectedIndex=to;await persist();render(active);}));
    document.querySelector('#collection-search')?.addEventListener('input',event=>{const term=event.target.value.toLowerCase();document.querySelectorAll('.record-row').forEach(row=>row.hidden=!row.dataset.search.includes(term));});
    document.querySelector('#content-form')?.addEventListener('submit',saveForm);
    bindSortable('[data-home-order]','[data-home-item]','sectionOrder');
    bindSortable('[data-resume-order]','[data-resume-item]','settings.resume.order');
    document.querySelectorAll('[data-image-crop]').forEach(button=>button.addEventListener('click',()=>openFieldCrop(button.dataset.imageCrop)));
    document.querySelectorAll('[data-profile-crop]').forEach(button=>button.addEventListener('click',()=>openProfileCrop(button.dataset.profileCrop,button.dataset.ratio)));
    document.querySelector('#content-form')?.addEventListener('click',event=>{
      const crop=event.target.closest('[data-image-crop]');if(crop){openFieldCrop(crop.dataset.imageCrop);return;}
      const move=event.target.closest('.gallery-move');
      const remove=event.target.closest('.gallery-remove');
      const button=move||remove;if(!button)return;
      const field=(schemas[active]||[]).find(item=>item.key===button.dataset.field);if(!field)return;
      const key=galleryKey(field);const urls=mediaSelections.get(key)||[];
      if(move){const from=Number(button.dataset.index),to=from+Number(button.dataset.delta);if(to<0||to>=urls.length)return;[urls[from],urls[to]]=[urls[to],urls[from]];mediaSelections.set(key,urls);refreshGallery(field,urls);}
      if(remove){const next=urls.filter(url=>url!==button.dataset.url);mediaSelections.set(key,next);const select=document.querySelector(`select[name="${CSS.escape(field.key)}"]`);if(select){const option=[...select.options].find(item=>item.value===button.dataset.url);if(option)option.selected=false;}refreshGallery(field,next);}
    });
    document.querySelector('#cancel-edit')?.addEventListener('click',()=>{if(formDirty&&!confirm(say('unsavedChanges')))return;pendingLinks=null;formDirty=false;render(active);});
    document.querySelector('.add-link')?.addEventListener('click',()=>{pendingLinks=[...readLinks(),{label:'',url:'',kind:'demo'}];render(active);});
    document.querySelectorAll('.remove-link').forEach(button=>button.addEventListener('click',()=>{pendingLinks=readLinks();pendingLinks.splice(Number(button.closest('[data-link-row]').dataset.index),1);render(active);}));
    document.querySelectorAll('[data-upload-trigger]').forEach(button=>button.addEventListener('click',()=>document.querySelector(`[data-target="${CSS.escape(button.dataset.target)}"].media-file-input`)?.click()));
    document.querySelectorAll('.media-file-input').forEach(input=>input.addEventListener('change',()=>uploadIntoField(input)));
    document.querySelector('#upload-button')?.addEventListener('click',uploadToLibrary);
    document.querySelectorAll('.media-delete').forEach(button=>button.addEventListener('click',()=>deleteMedia(button.dataset.name)));
    document.querySelectorAll('.media-item').forEach(button=>button.addEventListener('click',()=>navigator.clipboard?.writeText(button.dataset.url).then(()=>notify(fa?'نشانی فایل کپی شد':'Media URL copied'))));
    document.querySelector('#logout')?.addEventListener('click',logout);
    document.querySelectorAll('input[type=color]').forEach(input=>input.addEventListener('input',()=>{input.nextElementSibling.textContent=input.value;}));
    document.querySelectorAll('select[multiple]').forEach(select=>select.addEventListener('change',()=>{const field=(schemas[active]||[]).find(item=>item.key===select.name);if(!field)return;const chosen=[...select.selectedOptions].map(option=>option.value);const key=galleryKey(field);const previous=mediaSelections.get(key)||[];const ordered=previous.filter(url=>chosen.includes(url)).concat(chosen.filter(url=>!previous.includes(url)));mediaSelections.set(key,ordered);refreshGallery(field,ordered);}));
  }
  function readLinks() {
    return [...document.querySelectorAll('[data-link-row]')].map(row=>({label:row.querySelector('[data-link-label]').value.trim(),url:row.querySelector('[data-link-url]').value.trim(),kind:row.querySelector('[data-link-kind]').value})).filter(link=>link.label||link.url);
  }
  function bindSortable(listSelector,itemSelector,fieldName) {
    document.querySelectorAll(listSelector).forEach(list=>{
      let dragged=null;
      list.querySelectorAll(itemSelector).forEach(item=>{
        item.addEventListener('dragstart',event=>{dragged=item;item.classList.add('is-dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain','reorder');});
        item.addEventListener('dragend',()=>{item.classList.remove('is-dragging');list.querySelectorAll('.drop-target').forEach(row=>row.classList.remove('drop-target'));dragged=null;});
        item.addEventListener('dragover',event=>{event.preventDefault();if(!dragged||dragged===item)return;const bounds=item.getBoundingClientRect();const before=event.clientY<bounds.top+bounds.height/2;list.insertBefore(dragged,before?item:item.nextSibling);list.querySelectorAll('.drop-target').forEach(row=>row.classList.remove('drop-target'));item.classList.add('drop-target');});
        item.addEventListener('drop',event=>{event.preventDefault();list.querySelectorAll('.drop-target').forEach(row=>row.classList.remove('drop-target'));const all=[...list.querySelectorAll(itemSelector)];all.forEach((row,index)=>{const label=row.querySelector('.order-label');if(label)label.textContent=`${index+1}. ${label.textContent.replace(/^\d+\.\s*/, '')}`;});const hidden=document.querySelector(`input[name="${CSS.escape(fieldName)}"]`);if(hidden)hidden.value=JSON.stringify(all.map(row=>row.dataset.homeItem||row.dataset.resumeItem));formDirty=true;});
      });
    });
  }
  async function saveForm(event) {
    event.preventDefault();
    const form=event.currentTarget;
    if(!form.reportValidity())return;
    const draft=clone(active==='resume'?data:collectionSections.includes(active)?data[active][selectedIndex]:data[active]);
    const formData=new FormData(form);
    for (const field of schemas[active]) {
      if (['links','mediaList'].includes(field.type)) continue;
      let value;
      if (field.type==='toggle') value=form.elements[field.key].checked;
      else if (field.type==='tags') value=String(formData.get(field.key)||'').split(/[\n,]/).map(item=>item.trim()).filter(Boolean);
      else if (field.type==='number') value=Number(formData.get(field.key)||0);
      else if (field.type==='resumeOrder'||field.type==='homeOrder') { try {value=JSON.parse(formData.get(field.key)||'[]');} catch {value=[];} }
      else value=String(formData.get(field.key)||'').trim();
      if (field.required&&!value) { form.elements[field.key]?.focus();notify(fa?'این فیلد الزامی است':'Please complete the required fields.',true);return; }
      if (field.type==='slug'&&value&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {form.elements[field.key].focus();notify(say('invalidSlug'),true);return;}
      if(field.type==='url'&&value&&!/^https:\/\//i.test(value)){form.elements[field.key].focus();notify(fa?'پیوند باید با https:// آغاز شود.':'Links must use https://.',true);return;}
      setPath(draft,field.key,value);
    }
    for(const field of schemas[active].filter(item=>item.type==='mediaList')) setPath(draft,field.key,mediaSelections.get(galleryKey(field))||[...form.elements[field.key].selectedOptions].map(option=>option.value));
    if (schemas[active].some(field=>field.type==='links')) draft.links=readLinks();
    if(collectionSections.includes(active)) data[active][selectedIndex]=draft; else if(active==='resume')data.settings=draft.settings; else data[active]=draft;
    try { await persist(); pendingLinks=null;render(active); }
    catch(error){notify(error.message||say('saveError'),true);}
  }
  async function uploadFile(file) {
    if(!file)return null;
    if(file.size>5*1024*1024){notify(say('fileLimit'),true);return null;}
    const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
    const uploaded=await api('/api/media',{method:'POST',body:JSON.stringify({name:file.name,data:dataUrl})});
    await fetchMedia();
    return uploaded.url;
  }
  async function uploadIntoField(input) {
    try {
      const url=await uploadFile(input.files?.[0]); if(!url)return;
      const field=input.dataset.target; const select=document.querySelector(`select[name="${CSS.escape(field)}"]`);
      if(select){let option=[...select.options].find(item=>item.value===url);if(!option){option=new Option(url,url);select.add(option);}if(select.multiple){option.selected=true;const schemaField=schemas[active].find(item=>item.key===field);const key=galleryKey(schemaField);const values=mediaSelections.get(key)||[...select.selectedOptions].map(item=>item.value);if(!values.includes(url))values.push(url);mediaSelections.set(key,values);refreshGallery(schemaField,values);}else select.value=url;}
      const preview=input.parentElement.querySelector('.media-preview');if(preview)preview.innerHTML=url.endsWith('.pdf')?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">PDF · ${say('chooseMedia')}</a>`:`<img src="${esc(url)}" alt="">`;
      notify(fa?'فایل بارگذاری و انتخاب شد':'File uploaded and selected');
    } catch(error){notify(error.message,true);}
  }
  async function uploadToLibrary() {
    const input=document.querySelector('#media-upload');
    try{const url=await uploadFile(input?.files?.[0]);if(!url)return;notify(fa?'فایل بارگذاری شد':'File uploaded');render(active);}catch(error){notify(error.message,true);}
  }
  async function deleteMedia(name) {
    if(!confirm(say('confirmDelete')))return;
    if(JSON.stringify(data).includes(`/media/${name}`)){notify(fa?'این فایل در محتوای منتشرشده استفاده می‌شود.':'This file is still referenced by published content.',true);return;}
    try{await api(`/api/media/${encodeURIComponent(name)}`,{method:'DELETE'});await fetchMedia();notify(fa?'فایل حذف شد':'File deleted');render(active);}catch(error){notify(error.message,true);}
  }
  async function logout() { await api('/api/logout',{method:'POST',body:'{}'}).catch(()=>{});location.href='/admin'; }

  document.querySelector('#logout')?.addEventListener('click',logout);
  api('/api/content').then(async result=>{data=result;await fetchMedia();await render('overview');}).catch(error=>{area.innerHTML=`<p class="notice error">${esc(error.message)}</p>`;});
})();
