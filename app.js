const DB_KEY="promova_ai_projects_v1";
const SETTINGS_KEY="promova_ai_settings_v1";
let projects=loadProjects();
let currentOutput="";
let productImageData="";
let productImageName="";
let selectedCreativeStyle=localStorage.getItem("promova_ai_style_v1")||"Product Commercial";

function loadProjects(){try{return JSON.parse(localStorage.getItem(DB_KEY)||"[]")}catch{return []}}
function saveProjects(){localStorage.setItem(DB_KEY,JSON.stringify(projects));renderProjects()}
function loadSettings(){try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||"{}")}catch{return {}}}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>t.classList.remove("show"),2300)}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function go(page){if(page==="workspace"&&typeof renderWorkspace==="function")renderWorkspace();document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));window.scrollTo({top:0,behavior:"smooth"})}
document.addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b){e.preventDefault();go(b.dataset.page)}});
const moreToggle=document.getElementById("more-menu-toggle");
const moreMenu=document.getElementById("more-menu");
moreToggle.addEventListener("click",()=>{const open=moreMenu.classList.toggle("hidden")===false;moreToggle.setAttribute("aria-expanded",String(open))});
document.getElementById("more-menu-close").addEventListener("click",()=>{moreMenu.classList.add("hidden");moreToggle.setAttribute("aria-expanded","false")});
moreMenu.addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b){moreMenu.classList.add("hidden");moreToggle.setAttribute("aria-expanded","false")}});

function saveProject(title,type,content,extra={}){const p={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title,type,content,createdAt:new Date().toISOString(),...extra};projects.unshift(p);saveProjects();toast("Proyek berhasil disimpan");return p}
function copyText(text){if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>toast("Berhasil disalin")).catch(()=>fallbackCopy(text))}else fallbackCopy(text)}
function fallbackCopy(text){const a=document.createElement("textarea");a.value=text;document.body.appendChild(a);a.select();try{document.execCommand("copy");toast("Berhasil disalin")}catch{toast("Tidak dapat menyalin otomatis")}a.remove()}
function block(title,text){return `<div class="output-block"><h4>${esc(title)}</h4><pre>${esc(text)}</pre><button class="copy-btn" data-copy="${encodeURIComponent(text)}">Salin bagian ini</button></div>`}
document.addEventListener("click",e=>{const b=e.target.closest("[data-copy]");if(b)copyText(decodeURIComponent(b.dataset.copy));const del=e.target.closest("[data-delete]");if(del){if(confirm("Hapus proyek ini?")){projects=projects.filter(p=>p.id!==del.dataset.delete);saveProjects();toast("Proyek dihapus")}}const open=e.target.closest("[data-open]");if(open){const p=projects.find(x=>x.id===open.dataset.open);if(p){go("projects");showProject(p)}}});
let galleryFilter="all";
function projectMatchesFilter(p,filter){
 const type=(p.type||"").toLowerCase(),content=(p.content||"").toLowerCase();
 if(filter==="all")return true;
 if(filter==="images")return !!p.imageData||type.includes("image")||content.includes("image prompt");
 if(filter==="videos")return type.includes("video")||content.includes("video generation prompt")||content.includes("video prompt");
 if(filter==="prompts")return type.includes("prompt")||content.includes("master content production prompt")||content.includes("image prompt")||content.includes("video generation prompt");
 return true;
}
function renderProjects(){const card=p=>`<article class="project-card"><span class="project-type">${esc(p.type)}</span><b>${esc(p.title)}</b><small>${new Date(p.createdAt).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}</small><div class="project-actions"><button class="mini-btn" data-open="${esc(p.id)}">Lihat</button><button class="mini-btn" data-delete="${esc(p.id)}">Hapus</button></div></article>`;
document.getElementById("recent-projects").innerHTML=projects.slice(0,3).map(card).join("")||`<div class="empty-state"><b>Belum ada proyek</b><p>Proyek yang kamu simpan akan tampil di sini.</p></div>`;
const gallery=document.getElementById("creation-gallery");
if(gallery){
 const visible=projects.filter(p=>projectMatchesFilter(p,galleryFilter)).slice(0,12);
 gallery.innerHTML=visible.map((p,i)=>{const art=p.imageData?`<img src="${p.imageData}" alt="Foto referensi ${esc(p.title)}" loading="lazy">`:`<div class="creation-art art-${i%5}"><span>${(p.type||"").toLowerCase().includes("video")?"▶":(p.type||"").toLowerCase().includes("prompt")?"⌘":"✦"}</span><small>PROMOVA AI</small></div>`;return `<article class="creation-card"><button class="creation-open" data-open="${esc(p.id)}" aria-label="Buka ${esc(p.title)}">${art}<span class="creation-overlay"><b>${esc(p.title)}</b><small>${esc(p.type)}</small></span></button><div class="creation-meta"><span>${new Date(p.createdAt).toLocaleDateString("id-ID",{day:"numeric",month:"short"})}</span><button class="creation-view" data-open="${esc(p.id)}">Buka ↗</button></div></article>`}).join("")||`<div class="gallery-empty"><div class="gallery-empty-icon">✦</div><b>${galleryFilter==="all"?"Belum ada karya di galeri":"Belum ada karya dalam kategori ini"}</b><p>${galleryFilter==="all"?"Hasil produksi yang kamu simpan akan muncul di sini.":"Simpan proyek yang sesuai kategori ini untuk melihatnya di sini."}</p>${galleryFilter==="all"?'<button class="primary-btn" data-page="create">✦ Buat karya pertama</button>':""}</div>`;
 document.querySelectorAll("[data-gallery-filter]").forEach(b=>{const active=b.dataset.galleryFilter===galleryFilter;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});
}
document.getElementById("all-projects").innerHTML=projects.map(card).join("");document.getElementById("projects-empty").classList.toggle("hidden",projects.length>0);if(document.getElementById("workspace-projects"))renderWorkspace()}
document.addEventListener("click",e=>{const f=e.target.closest("[data-gallery-filter]");if(f){galleryFilter=f.dataset.galleryFilter;renderProjects()}});
function renderWorkspace(){
 const list=projects.filter(p=>p.type==="Content Production Pack");
 // Migrate older V1.3 packs by recovering their platform/style from the saved brief.
 let migrated=false;
 list.forEach(p=>{
   const source=String(p.brief||p.content||"");
   if(!p.platform){const m=source.match(/(?:Primary platform|Platform):\\s*([^\\n]+)/i);if(m){p.platform=m[1].trim();migrated=true}}
   if(!p.style){const m=source.match(/(?:Visual style preset|Gaya visual):\\s*([^\\n]+)/i);if(m){p.style=m[1].trim();migrated=true}}
   if(!p.productionStatus){p.productionStatus="Draft";migrated=true}
 });
 if(migrated)localStorage.setItem(DB_KEY,JSON.stringify(projects));
 const stats=[["TOTAL PAKET",list.length],["DENGAN REFERENSI",list.filter(p=>!!p.imageData).length],["SIAP PUBLIKASI",list.filter(p=>p.productionStatus==="Ready to publish").length]];
 document.getElementById("workspace-stats").innerHTML=stats.map(x=>`<div class="workspace-stat"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("");
 const root=document.getElementById("workspace-projects");
 root.innerHTML=list.map(p=>{const hasPublishingKit=String(p.content||"").includes("PUBLISHING KIT");return `<article class="workspace-card"><div class="workspace-card-top"><span class="workspace-type">CONTENT PRODUCTION</span><span class="workspace-status">${esc(p.productionStatus||"Draft")}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.platform||"Platform belum ditentukan")} · ${esc(p.style||"Style belum dipilih")}</p><div class="workspace-assets"><span>${p.imageData?"▧ Referensi tersedia":"＋ Tanpa referensi"}</span><span>✦ Brief & prompt</span>${hasPublishingKit?"<span>▤ Publishing kit</span>":"<span>＋ Publishing kit belum tersedia</span>"}</div><div class="workspace-actions"><button class="mini-btn" data-workspace-open="${esc(p.id)}">Buka paket</button><button class="mini-btn" data-workspace-status="${esc(p.id)}">${p.productionStatus==="Ready to publish"?"Tandai draft":"Siap publikasi"}</button></div></article>`}).join("")||`<div class="gallery-empty"><div class="gallery-empty-icon">▣</div><b>Belum ada paket produksi</b><p>Buat Content Production Pack untuk mulai mengelola proyek di sini.</p><button class="primary-btn" data-page="create">＋ Buat proyek pertama</button></div>`;
}
document.getElementById("workspace-projects").addEventListener("click",e=>{
 const open=e.target.closest("[data-workspace-open]");if(open){const p=projects.find(x=>x.id===open.dataset.workspaceOpen);if(p){showProject(p);go("projects")}return}
 const status=e.target.closest("[data-workspace-status]");if(status){const p=projects.find(x=>x.id===status.dataset.workspaceStatus);if(p){p.productionStatus=p.productionStatus==="Ready to publish"?"Draft":"Ready to publish";saveProjects();renderWorkspace();toast("Status produksi diperbarui")}}
});
function showProject(p){const area=document.getElementById("all-projects");area.innerHTML=`<div class="form-panel"><button class="text-btn" id="back-projects">← Kembali</button><h2>${esc(p.title)}</h2><p class="muted">${esc(p.type)} • ${new Date(p.createdAt).toLocaleString("id-ID")}</p>${p.imageData?`<div class="output-block"><h4>FOTO REFERENSI PRODUK</h4><img src="${p.imageData}" alt="Foto referensi" style="max-width:100%;max-height:240px;object-fit:contain;border-radius:12px"><p>${esc(p.imageName||"Foto referensi")}</p></div>`:""}${block("Isi proyek",p.content)}</div>`;document.getElementById("back-projects").onclick=renderProjects}
function output(target,title,parts){const el=document.getElementById(target);el.classList.remove("hidden");el.innerHTML=`<h3>${esc(title)}</h3>${parts.map(x=>block(x[0],x[1])).join("")}`}
function setCreativeStyle(style){selectedCreativeStyle=style;localStorage.setItem("promova_ai_style_v1",style);const select=document.getElementById("content-style-preset");if(select)select.value=style;document.querySelectorAll("[data-style]").forEach(b=>b.classList.toggle("selected",b.dataset.style===style));}
document.querySelectorAll("[data-style]").forEach(b=>b.addEventListener("click",()=>setCreativeStyle(b.dataset.style)));
document.getElementById("content-style-preset").addEventListener("change",e=>setCreativeStyle(e.target.value));
document.getElementById("apply-style-library").addEventListener("click",()=>{setCreativeStyle(selectedCreativeStyle);go("create");toast("Gaya "+selectedCreativeStyle+" diterapkan")});
setCreativeStyle(selectedCreativeStyle);
function buildContentPrompt(d){return `You are a senior ethical affiliate marketing strategist and short-form content producer. Create a complete content production pack using ONLY the supplied facts. Never invent specifications, prices, discounts, ratings, awards, availability, certifications, results, testimonials, or performance claims. Mark missing information as [NEED CONFIRMATION].

PROJECT BRIEF
Object type: ${d.type}
Name: ${d.name}
Description / verified facts: ${d.desc||"Not provided"}
Target audience: ${d.audience||"Not specified"}
Goal: ${d.goal}
Primary platform: ${d.platform}
Tone: ${d.tone}
Visual style preset: ${d.style}
Apply the selected style consistently to visual direction, composition, lighting, pacing and mood. Do not let style change verified product facts.
Output language: ${d.language}
Affiliate / paid promotion disclosure: ${d.disclosure?"Include a clear disclosure where relevant":"Include disclosure if required by law or platform rules"}
Visual reference: ${d.hasImage?"The user will attach the uploaded reference image to the AI chat. Inspect visible appearance only; preserve product shape, color, labels and proportions.":"No reference image supplied."}

CREATE THIS COMPLETE CONTENT PACK:
1. Content strategy and audience insight.
2. Three distinct ethical content angles.
3. Five short opening hooks.
4. One ready-to-edit platform-appropriate caption.
5. Persuasive sales copy without unsupported claims.
6. A 30-second video script with scene timing, visuals, on-screen text, voice-over and CTA.
7. A detailed image-generation prompt using the attached reference image if provided; preserve product identity and do not fabricate text or logos.
8. A scene-based AI video prompt with camera, lighting, action and product continuity.
9. Three CTA options.
10. Relevant hashtags.
11. Fact-check checklist of claims needing confirmation.
12. Affiliate / paid-promotion disclosure when relevant.

Use clear headings and ${d.language}. Be engaging but truthful. Do not claim personal testing unless the user says so.`}
const imageInput=document.getElementById("product-image");
imageInput.addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;if(!file.type.startsWith("image/")){toast("Pilih file gambar");return}try{productImageData=await compressImage(file);productImageName=file.name;document.getElementById("product-image-preview").src=productImageData;document.getElementById("image-file-name").textContent=file.name;document.getElementById("image-file-size").textContent="Foto terkompresi • "+Math.round(productImageData.length/1024)+" KB";document.getElementById("upload-placeholder").classList.add("hidden");document.getElementById("image-preview-wrap").classList.remove("hidden");toast("Foto referensi siap digunakan")}catch{toast("Gagal memproses gambar")}});
document.getElementById("remove-product-image").addEventListener("click",()=>{productImageData="";productImageName="";imageInput.value="";document.getElementById("upload-placeholder").classList.remove("hidden");document.getElementById("image-preview-wrap").classList.add("hidden")});
function compressImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const max=900,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement("canvas");canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL("image/jpeg",.68))};img.src=reader.result};reader.readAsDataURL(file)})}
document.getElementById("content-form").addEventListener("submit",e=>{e.preventDefault();const d={style:document.getElementById("content-style-preset").value,type:document.getElementById("content-type").value,name:document.getElementById("content-name").value.trim(),desc:document.getElementById("content-desc").value.trim(),audience:document.getElementById("content-audience").value.trim(),goal:document.getElementById("content-goal").value,platform:document.getElementById("content-platform").value,tone:document.getElementById("content-tone").value,language:document.getElementById("content-language").value,disclosure:document.getElementById("affiliate-disclosure").checked,hasImage:!!productImageData};const prompt=buildContentPrompt(d);const brief=`${d.name}\nJenis: ${d.type}\nTujuan: ${d.goal}\nPlatform: ${d.platform}\nTarget: ${d.audience||"Belum ditentukan"}\nDeskripsi: ${d.desc||"Belum diisi"}\nGaya komunikasi: ${d.tone}\nGaya visual: ${d.style}\nFoto referensi: ${d.hasImage?"Terlampir: "+productImageName:"Tidak ada"}`;const imagePrompt=`Create a ${d.style} visual for ${d.name}. ${d.hasImage?"Use the attached reference image as the exact product identity reference. Preserve shape, proportions, color, materials, labels and recognizable details. Do not redesign or invent branding.":"No reference image supplied; use only the description provided."} Visual direction: ${d.style}. Context: ${d.desc||"Use a clean suitable product setting."} Audience: ${d.audience||"general audience"}. Avoid fake claims, labels, watermarks and garbled text.`;const videoPrompt=`Create a short-form ${d.platform} advertisement for ${d.name}. ${d.hasImage?"Use the attached reference image to lock the exact product appearance throughout every shot. No shape, color, label or logo changes.":""} Tone: ${d.tone}. Visual style: ${d.style}. Build a strong hook, product-focused scenes, natural camera movement, consistent lighting, readable minimal on-screen text and clear CTA. Use only these facts: ${d.desc||"No verified facts supplied; avoid specific claims."} Target: ${d.audience||"general audience"}. Do not fabricate performance claims or testimonials.`;const publishingKit=`PUBLISHING KIT\nPlatform: ${d.platform}\nCaption draft: ${d.name} — ${d.desc||"[Tambahkan manfaat yang sudah diverifikasi]"}\nCTA: Lihat informasi selengkapnya melalui tautan yang tersedia.\nHashtags: #${d.platform.replace(/[^a-z0-9]/gi,"")} #Rekomendasi #${d.name.replace(/[^a-z0-9]/gi,"")}\nDisclosure: ${d.disclosure?"Cantumkan bahwa konten mengandung tautan afiliasi atau promosi berbayar bila relevan.":"Periksa kewajiban disclosure sebelum publikasi."}\nChecklist: verifikasi harga, spesifikasi, stok, tautan, hak penggunaan aset, dan disclosure sebelum tayang.`;const parts=[["CONTENT BRIEF",brief],["MASTER CONTENT PRODUCTION PROMPT",prompt],["IMAGE PROMPT",imagePrompt],["VIDEO GENERATION PROMPT",videoPrompt],["PUBLISHING KIT",publishingKit]];currentOutput=prompt;output("content-output","Content Production Pack berhasil disusun",parts);document.getElementById("content-empty").classList.add("hidden");saveProject(d.name,"Content Production Pack",parts.map(x=>x[0]+"\n"+x[1]).join("\n\n"),{brief,imageName:productImageName||"",imageData:productImageData||"",style:d.style,platform:d.platform,goal:d.goal,productionStatus:"Draft",publishingKit})});
document.getElementById("analyze-btn").addEventListener("click",()=>{const n=document.getElementById("an-name").value.trim(),facts=document.getElementById("an-facts").value.trim(),aud=document.getElementById("an-audience").value.trim();if(!n){toast("Masukkan nama produk atau objek");return}const res=`OBJEK: ${n}\nFAKTA DARI PENGGUNA:\n${facts||"Belum ada fakta"}\nTARGET AUDIENS: ${aud||"Belum ditentukan"}\n\nANALISIS YANG PERLU DIKERJAKAN:\n1. Kelompokkan fakta menjadi fitur, manfaat, dan bukti.\n2. Identifikasi masalah atau kebutuhan audiens yang relevan.\n3. Susun tiga sudut promosi yang berbeda.\n4. Catat pertanyaan yang perlu dikonfirmasi sebelum publikasi.\n5. Hindari klaim yang tidak didukung fakta.\n\nCatatan: ini kerangka analisis berdasarkan input pengguna, bukan verifikasi independen.`;output("an-output","Kerangka analisis promosi",[["ANALYSIS BRIEF",res]]);saveProject(n,"Product Analysis",res)});
document.getElementById("video-btn").addEventListener("click",()=>{const n=document.getElementById("vid-name").value.trim(),style=document.getElementById("vid-style").value,dur=document.getElementById("vid-duration").value,info=document.getElementById("vid-info").value.trim();if(!n){toast("Masukkan nama produk atau topik");return}const prompt=`Act as a short-form video creative director. Create a ${dur} ${style} video script about: ${n}.\nVerified information: ${info||"Not provided"}.\nReturn: (1) concept and audience, (2) opening hook, (3) scene-by-scene storyboard with approximate timing, visuals, on-screen text and voice-over, (4) CTA, (5) production notes. Keep claims factual; flag missing facts. Write in Indonesian.`;output("video-output","Video script prompt",[["VIDEO PRODUCTION PROMPT",prompt]]);saveProject(n,"Video Script",prompt)});
document.getElementById("prompt-btn").addEventListener("click",()=>{const n=document.getElementById("pr-name").value.trim(),kind=document.getElementById("pr-kind").value,style=document.getElementById("pr-style").value,details=document.getElementById("pr-details").value.trim(),ratio=document.getElementById("pr-ratio").value;if(!n){toast("Masukkan nama objek atau produk");return}const prompt=`Create an original ${kind} featuring ${n}. Visual style: ${style}. Composition: ${ratio}. Additional direction: ${details||"Use a clean, professional composition appropriate to the subject."} Preserve the real product identity and proportions when a reference image is supplied. Do not add fake logos, labels, specifications, or text. High-quality lighting, intentional composition, polished commercial visual.`;output("prompt-output","Visual prompt siap digunakan",[["IMAGE / VIDEO PROMPT",prompt]]);saveProject(n,"Visual Prompt",prompt)});
document.getElementById("pub-copy").addEventListener("click",()=>{const text=`${document.getElementById("pub-name").value}\n\n${document.getElementById("pub-caption").value}\n\n${document.getElementById("pub-cta").value}\n${document.getElementById("pub-link").value}\n\n${document.getElementById("pub-tags").value}\n\n${document.getElementById("pub-disclosure").checked?"Konten promosi/afiliasi. Saya dapat menerima komisi dari pembelian melalui tautan ini jika berlaku.":""}`;if(!document.getElementById("pub-name").value.trim()){toast("Isi nama kampanye terlebih dahulu");return}copyText(text);saveProject(document.getElementById("pub-name").value,"Publishing Kit",text)});
document.getElementById("new-project").addEventListener("click",()=>go("create"));
document.getElementById("save-settings").addEventListener("click",()=>{localStorage.setItem(SETTINGS_KEY,JSON.stringify({brand:document.getElementById("setting-brand").value,bio:document.getElementById("setting-bio").value}));toast("Profil tersimpan")});
document.getElementById("export-data").addEventListener("click",()=>{const data={app:"PROMOVA AI",version:"1.0.0",exportedAt:new Date().toISOString(),projects,settings:loadSettings()};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="promova-ai-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup berhasil dibuat")});
document.getElementById("import-data").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d.projects))throw Error();if(!confirm("Impor backup dan mengganti data proyek lokal saat ini?"))return;projects=d.projects;saveProjects();if(d.settings)localStorage.setItem(SETTINGS_KEY,JSON.stringify(d.settings));toast("Backup berhasil diimpor")}catch{toast("File backup tidak valid")}e.target.value=""});
document.getElementById("clear-data").addEventListener("click",()=>{if(confirm("Yakin menghapus semua proyek dan pengaturan lokal? Tindakan ini tidak dapat dibatalkan.")){localStorage.removeItem(DB_KEY);localStorage.removeItem(SETTINGS_KEY);projects=[];renderProjects();toast("Data lokal dihapus")}});
const settings=loadSettings();document.getElementById("setting-brand").value=settings.brand||"";document.getElementById("setting-bio").value=settings.bio||"";
renderProjects();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
