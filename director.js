/* PROMOVA AI V1.12 — Hybrid AI Director
   Local-first storyboard orchestration. AI generation remains external/manual. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 const projectSelect=$("director-project");
 if(!projectSelect)return;
 let sceneDraft=[];
 const defaults=[
  {title:"Opening Hook",visual:"Perkenalkan kebutuhan atau situasi yang relevan dengan target audiens. Tampilkan produk secara jelas.",action:"Karakter membuka adegan secara natural dan memperlihatkan produk.",dialogue:"",onScreenText:"",camera:"Medium close-up, eye-level, natural handheld movement",lighting:"Soft natural commercial lighting",transition:"Cut"},
  {title:"Product Introduction",visual:"Tampilkan produk dan detail yang memang terlihat pada referensi. Jangan menambah spesifikasi yang tidak diberikan.",action:"Karakter memegang atau memperlihatkan produk dengan gerakan wajar.",dialogue:"",onScreenText:"",camera:"Slow push-in to product, stable focus",lighting:"Consistent soft lighting",transition:"Match cut"},
  {title:"Lifestyle / Demonstration",visual:"Tempatkan produk dalam konteks penggunaan sehari-hari yang masuk akal dan sesuai fakta.",action:"Perlihatkan interaksi sederhana dan realistis antara karakter dan produk.",dialogue:"",onScreenText:"",camera:"Natural medium shot with subtle camera movement",lighting:"Consistent location-motivated lighting",transition:"Cut"},
  {title:"Closing & CTA",visual:"Akhiri dengan komposisi bersih, produk tetap terlihat jelas, dan ruang untuk CTA.",action:"Karakter memberi ajakan yang wajar tanpa klaim berlebihan.",dialogue:"",onScreenText:"Cek produknya sekarang",camera:"Medium close-up, gentle push-in, hold final composition",lighting:"Match previous scenes",transition:"End hold"}
 ];
 function getProject(){return (window.projects||[]).find(p=>p.id===projectSelect.value)}
 function projectOptions(){
  const keep=projectSelect.value;
  const list=(window.projects||[]).filter(p=>p.type==="Content Production Pack");
  projectSelect.innerHTML='<option value="">Pilih proyek Content Production...</option>'+list.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.title)+'</option>').join("");
  if(list.some(p=>p.id===keep))projectSelect.value=keep;
 }
 function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
 function assignedIds(p){return p?.directorPlan?.characterIds||p?.characterIds||[]}
 function selectedCharacters(p){const ids=assignedIds(p);return (window.characters||[]).filter(c=>ids.includes(c.id))}
 function renderCharacters(p){
  const root=$("director-character-list");
  if(!p){root.innerHTML='<p class="helper">Pilih proyek untuk melihat karakter yang tersedia.</p>';return}
  const all=window.characters||[];
  if(!all.length){root.innerHTML='<div class="director-empty">Character Library masih kosong. Buat karakter melalui Character DNA Studio terlebih dahulu.</div>';return}
  const chosen=assignedIds(p);
  root.innerHTML=all.map(c=>'<label class="director-character-option"><input type="checkbox" data-director-character="'+esc(c.id)+'" '+(chosen.includes(c.id)?"checked":"")+'><img src="'+(c.photoData||c.masterSheetData||"")+'" alt="" '+(!(c.photoData||c.masterSheetData)?'class="hidden"':"")+'><span><b>'+esc(c.name)+'</b><small>'+esc(c.role||"Karakter")+' · '+esc(c.age||"Usia tidak ditentukan")+' · '+(c.masterSheetData?"Master Sheet tersedia":"Master Sheet belum ada")+'</small></span></label>').join("");
 }
 function projectFacts(p){
  const d=p.projectData||{};
  return {name:d.name||p.title||"Produk / objek",facts:d.desc||p.brief||"Tidak ada fakta terverifikasi yang disediakan.",audience:d.audience||"Belum ditentukan",platform:d.platform||p.platform||"TikTok",goal:d.goal||"Promosi",tone:d.tone||"Persuasif dan menjual",style:d.style||p.style||"Affiliate UGC",hasProductRef:!!p.imageData};
 }
 function getSelectedIds(){return [...document.querySelectorAll('[data-director-character]:checked')].map(x=>x.dataset.directorCharacter)}
 function dnaFor(ids){
  return (window.characters||[]).filter(c=>ids.includes(c.id)).map(c=>{
   const dna=typeof window.characterDNAText==="function"?window.characterDNAText(c):[
    "CHARACTER ID: "+c.id,"Character name: "+c.name,"Role: "+(c.role||"Not specified"),"Age: "+(c.age||"Not specified"),
    "Permanent physical identity: "+(c.appearance||"Use attached approved references."),
    "PRIMARY MASTER CHARACTER SHEET: "+(c.masterSheetData?"Attached; canonical identity reference.":"Not uploaded."),
    "SECONDARY ORIGINAL PHOTO: "+(c.photoData?"Attached; supporting resemblance reference only.":"Not uploaded."),
    "Personality: "+(c.personality||"Not specified"),"Voice: "+(c.voice||"Not specified"),"Visual style: "+(c.visualStyle||"Photorealistic")
   ].join("\n");
   return dna+"\nREFERENCE HANDLING: Master Character Sheet is PRIMARY. Original Photo is SECONDARY and must not override it. Preserve identity; vary outfit, expression, pose and action only as scene instructions.";
  }).join("\n\n");
 }
 function evenlyTimed(total,count){const base=Math.floor(total/count),rem=total%count;return Array.from({length:count},(_,i)=>base+(i<rem?1:0))}
 function makeDraft(){
  const p=getProject();if(!p){toast("Pilih proyek terlebih dahulu");return}
  const count=Number($("director-scene-count").value),dur=Number($("director-duration").value),times=evenlyTimed(dur,count);
  sceneDraft=Array.from({length:count},(_,i)=>{
   const d=defaults[Math.min(i,defaults.length-1)];
   return {id:"scene-"+(i+1)+"-"+Date.now(),title:d.title, duration:times[i],visual:d.visual,action:d.action,dialogue:d.dialogue,onScreenText:d.onScreenText,camera:d.camera,lighting:d.lighting,transition:d.transition};
  });
  renderScenes();$("director-ai-prompt").value=buildDirectorPrompt(p);toast("Draft storyboard dibuat. Edit setiap adegan sesuai kebutuhan.");
 }
 function buildDirectorPrompt(p){
  const f=projectFacts(p),ids=getSelectedIds(),dna=dnaFor(ids);
  const d=$("director-duration").value,count=$("director-scene-count").value,style=$("director-style").value,ratio=$("director-ratio").value;
  return [
   "You are a senior commercial film director, storyboard artist and ethical short-form advertising producer.",
   "Create a production-ready scene-by-scene storyboard for the project below. Use ONLY supplied facts. Never invent specifications, prices, discounts, ratings, awards, availability, certifications, results, testimonials or performance claims. Mark missing information [NEED CONFIRMATION].",
   "\nPROJECT BRIEF\nProduct / subject: "+f.name+"\nVerified facts: "+f.facts+"\nTarget audience: "+f.audience+"\nPlatform: "+f.platform+"\nGoal: "+f.goal+"\nTone: "+f.tone+"\nVisual style: "+style+"\nDuration: "+d+" seconds\nNumber of scenes: "+count+"\nAspect ratio: "+ratio,
   "\nPRODUCT IDENTITY LOCK\n"+(f.hasProductRef?"The user will manually attach the saved project product reference image in the external AI service. Preserve exact product silhouette, proportions, materials, color, labels, display and recognizable details. Do not redesign or invent branding.":"No product reference image is saved. Use only the written facts and do not invent product appearance or details."),
   "\nAPPROVED CHARACTER DNA — IDENTITY LOCK\n"+(dna||"No human character selected. Do not invent a specific recurring character."),
   "\nDIRECTOR REQUIREMENTS\n1. Create a strong opening hook suited to the target audience.\n2. Give every scene exact start/end timing; all scene durations must add up to "+d+" seconds.\n3. For each scene specify title, duration_seconds, visual_description, character_action, dialogue_or_voiceover, on_screen_text, camera, lighting, and transition.\n4. Keep product visible where relevant and preserve its exact identity.\n5. Use the selected character(s) consistently; do not blend, duplicate, replace or redesign them. Master Character Sheet is primary; Original Photo is secondary.\n6. Outfit, expression, pose and action are scene variations and must not overwrite permanent DNA.\n7. Dialogue must sound natural and must not imply unsupported personal experience or product claims.\n8. Include minimal readable on-screen text and a clear ethical CTA.\n9. Maintain coherent location, lighting, color grade, screen direction and physical movement between scenes.\n10. If first/last frame images are later approved, treat them as exact endpoints without altering them.",
   "\nOUTPUT FORMAT — RETURN VALID JSON ONLY, NO MARKDOWN FENCES\n{\n  \"scenes\": [\n    { \"title\": \"Opening Hook\", \"duration_seconds\": 5, \"visual_description\": \"...\", \"character_action\": \"...\", \"dialogue_or_voiceover\": \"...\", \"on_screen_text\": \"...\", \"camera\": \"...\", \"lighting\": \"...\", \"transition\": \"...\" }\n  ]\n}"
  ].join("\n");
 }
 function renderScenes(){
  const root=$("director-scenes");
  if(!sceneDraft.length){root.innerHTML='<div class="director-empty">Belum ada adegan. Tekan “Buat draft adegan” atau impor storyboard AI.</div>';return}
  root.innerHTML=sceneDraft.map((s,i)=>'<article class="director-scene" data-scene-index="'+i+'"><div class="director-scene-head"><div><b>SCENE '+String(i+1).padStart(2,"0")+' — '+esc(s.title||"Untitled")+'</b><br><small>Durasi: '+esc(s.duration)+' detik</small></div><button type="button" class="mini-btn" data-director-delete="'+i+'">Hapus</button></div><div class="director-scene-grid"><label>Judul adegan<input data-scene-field="title" value="'+esc(s.title)+'"></label><label>Durasi (detik)<input data-scene-field="duration" type="number" min="1" max="90" value="'+esc(s.duration)+'"></label><label class="director-wide">Visual / komposisi<textarea data-scene-field="visual">'+esc(s.visual)+'</textarea></label><label class="director-wide">Aksi karakter<textarea data-scene-field="action">'+esc(s.action)+'</textarea></label><label class="director-wide">Dialog / voice-over<textarea data-scene-field="dialogue">'+esc(s.dialogue)+'</textarea></label><label class="director-wide">Teks di layar<textarea data-scene-field="onScreenText">'+esc(s.onScreenText)+'</textarea></label><label>Gerakan kamera<input data-scene-field="camera" value="'+esc(s.camera)+'"></label><label>Pencahayaan<input data-scene-field="lighting" value="'+esc(s.lighting)+'"></label><label class="director-wide">Transisi ke adegan berikutnya<input data-scene-field="transition" value="'+esc(s.transition)+'"></label></div></article>').join("");
 }
 function readSceneInputs(){
  document.querySelectorAll(".director-scene").forEach(card=>{
   const i=Number(card.dataset.sceneIndex);if(!sceneDraft[i])return;
   card.querySelectorAll("[data-scene-field]").forEach(el=>{const key=el.dataset.sceneField;sceneDraft[i][key]=key==="duration"?Math.max(1,Number(el.value)||1):el.value});
  });
 }
 function savePlan(showToast=true){
  const p=getProject();if(!p){toast("Pilih proyek terlebih dahulu");return null}
  readSceneInputs();if(!sceneDraft.length){toast("Buat atau impor storyboard terlebih dahulu");return null}
  const ids=getSelectedIds(),previous=p.characterIds||[];
  const changed=ids.length!==previous.length||ids.some(id=>!previous.includes(id));
  p.characterIds=ids;
  p.directorPlan={version:1,duration:Number($("director-duration").value),style:$("director-style").value,ratio:$("director-ratio").value,sceneCount:sceneDraft.length,characterIds:ids,scenes:sceneDraft.map(s=>({...s})),updatedAt:new Date().toISOString()};
  if(changed&&p.framePlan){p.framePlan.firstApproved=false;p.framePlan.lastApproved=false;p.pipeline=p.pipeline||{};p.pipeline.image=false;p.pipeline.video=false}
  saveProjects();
  if(showToast)toast("Storyboard dan pengaturan Director disimpan ke proyek");
  return p;
 }
 function loadProject(){
  const p=getProject();
  if(!p){$("director-project-summary").innerHTML='<span>ⓘ</span><div><b>Belum ada proyek</b><small>Pilih proyek untuk memuat brief, produk, dan referensinya.</small></div>';sceneDraft=[];renderScenes();renderCharacters(null);$("director-ai-prompt").value="";$("director-ai-result").value="";return}
  const f=projectFacts(p);
  $("director-project-summary").innerHTML='<span>✦</span><div><b>'+esc(p.title)+'</b><small>'+esc(f.platform)+' · '+esc(f.style)+' · '+(f.hasProductRef?"Referensi produk tersimpan":"Tidak ada foto referensi produk")+'</small></div>';
  if(p.directorPlan){
   $("director-duration").value=String(p.directorPlan.duration||30);$("director-style").value=p.directorPlan.style||$("director-style").value;$("director-ratio").value=p.directorPlan.ratio||"Vertical 9:16";
   $("director-scene-count").value=String(p.directorPlan.sceneCount||p.directorPlan.scenes?.length||4);
   sceneDraft=(p.directorPlan.scenes||[]).map(s=>({...s}));
  }else{sceneDraft=[]}
  renderCharacters(p);renderScenes();
  $("director-ai-prompt").value=buildDirectorPrompt(p);
 }
 function importStoryboard(){
  const raw=$("director-ai-result").value.trim();if(!raw){toast("Tempel hasil storyboard AI terlebih dahulu");return}
  let data;try{data=JSON.parse(raw.replace(/^\s*```(?:json)?\s*/i,"").replace(/\s*```\s*$/,""))}catch{toast("JSON belum valid. Salin hasil AI tanpa teks tambahan atau markdown fence.");return}
  const scenes=Array.isArray(data)?data:data.scenes;
  if(!Array.isArray(scenes)||!scenes.length){toast('Format harus berupa objek JSON dengan array "scenes".');return}
  sceneDraft=scenes.map((s,i)=>({id:"import-"+Date.now()+"-"+i,title:s.title||"Scene "+(i+1),duration:Number(s.duration_seconds??s.duration??5),visual:s.visual_description||s.visual||"",action:s.character_action||s.action||"",dialogue:s.dialogue_or_voiceover||s.dialogue||s.voiceover||"",onScreenText:s.on_screen_text||s.onScreenText||"",camera:s.camera||"",lighting:s.lighting||"",transition:s.transition||"Cut"}));
  $("director-scene-count").value=String(sceneDraft.length);renderScenes();toast(scenes.length+" adegan berhasil diimpor. Periksa dan edit sebelum menyimpan.");
 }
 function makeVideoPrompt(p){
  readSceneInputs();
  const f=projectFacts(p),ids=getSelectedIds(),dna=dnaFor(ids);
  const total=sceneDraft.reduce((n,s)=>n+(Number(s.duration)||0),0);
  const lines=sceneDraft.map((s,i)=>[
   "SCENE "+(i+1)+" — "+s.title+" ("+s.duration+" seconds)",
   "Visual: "+s.visual,"Character action: "+s.action,"Dialogue / voice-over: "+s.dialogue,"On-screen text: "+s.onScreenText,"Camera: "+s.camera,"Lighting: "+s.lighting,"Transition: "+s.transition
  ].join("\n")).join("\n\n");
  const frame=p.framePlan?.firstApproved&&p.framePlan?.lastApproved&&p.framePlan?.firstImage&&p.framePlan?.lastImage
   ?"FIRST/LAST FRAME CONTINUITY LOCK: The user will attach both approved images manually. Use the approved FIRST FRAME as the exact opening image and approved LAST FRAME as the exact final image. Animate a coherent, physically plausible transition. Do not alter either endpoint."
   :"FIRST/LAST FRAME: No pair of manually approved endpoint images is currently confirmed for this project. Do not claim endpoint references are attached.";
  return "Create a "+f.platform+" short-form advertisement for "+f.name+".\nDuration: "+total+" seconds. Format: "+$("director-ratio").value+". Visual direction: "+$("director-style").value+". Tone: "+f.tone+".\nVERIFIED FACTS ONLY: "+f.facts+". Target audience: "+f.audience+". Never fabricate performance claims, specifications, prices, testimonials or results.\n\nPRODUCT IDENTITY LOCK\n"+(f.hasProductRef?"Use the attached project product reference as the exact product identity source. Preserve shape, proportions, materials, color, labels, display and recognizable details. Do not redesign or invent branding.":"No product reference image is saved; do not invent unseen product details.")+"\n\nAPPROVED CHARACTER DNA — VIDEO CONTINUITY LOCK\n"+(dna||"No assigned human character. Do not introduce a recurring presenter unless specified in a scene.")+"\n\nSCENE-BY-SCENE DIRECTION\n"+lines+"\n\n"+frame+"\n\nGLOBAL CONTINUITY: Preserve character identity, wardrobe continuity where specified, product identity, location, lighting direction, color grade, screen direction and physically plausible actions. No identity blending, duplicate characters, product redesign, invented props or unsupported claims. Minimal readable on-screen text. Natural voice delivery and lip-sync where dialogue is spoken. End on a clear, ethical CTA. The user will manually attach all product and character references to the external video service.";
 }
 projectOptions();
 projectSelect.addEventListener("change",loadProject);
 $("director-draft-scenes").addEventListener("click",makeDraft);
 $("director-build-prompt").addEventListener("click",()=>{const p=getProject();if(!p){toast("Pilih proyek terlebih dahulu");return}$("director-ai-prompt").value=buildDirectorPrompt(p);copyText($("director-ai-prompt").value);toast("Prompt AI Director disusun dan disalin. Buka layanan AI untuk membuat storyboard.")});
 $("director-copy-prompt").addEventListener("click",()=>{const v=$("director-ai-prompt").value.trim();if(!v){toast("Susun prompt AI Director terlebih dahulu");return}copyText(v)});
 $("director-open-ai").addEventListener("click",()=>{if(!$("director-ai-prompt").value.trim()){toast("Susun prompt AI Director terlebih dahulu");return}window.open("https://gemini.google.com/app","_blank","noopener,noreferrer");toast("Google Gemini dibuka. Tempel prompt dan minta output JSON.")});
 $("director-import-ai").addEventListener("click",importStoryboard);
 $("director-scenes").addEventListener("input",e=>{const card=e.target.closest(".director-scene");if(!card)return;const i=Number(card.dataset.sceneIndex),key=e.target.dataset.sceneField;if(sceneDraft[i]&&key){sceneDraft[i][key]=key==="duration"?Math.max(1,Number(e.target.value)||1):e.target.value;const title=card.querySelector(".director-scene-head b");if(title&&key==="title")title.textContent="SCENE "+String(i+1).padStart(2,"0")+" — "+sceneDraft[i].title}});
 $("director-scenes").addEventListener("click",e=>{const b=e.target.closest("[data-director-delete]");if(!b)return;readSceneInputs();sceneDraft.splice(Number(b.dataset.directorDelete),1);renderScenes()});
 $("director-add-scene").addEventListener("click",()=>{readSceneInputs();sceneDraft.push({id:"scene-"+Date.now(),title:"New Scene",duration:5,visual:"",action:"",dialogue:"",onScreenText:"",camera:"",lighting:"",transition:"Cut"});renderScenes()});
 $("director-save").addEventListener("click",()=>savePlan(true));
 $("director-prepare-video").addEventListener("click",()=>{
  const p=savePlan(false);if(!p)return;
  const prompt=makeVideoPrompt(p);
  if(typeof refreshExternalProjects==="function")refreshExternalProjects();
  $("external-project").value=p.id;$("external-kind").value="video";$("external-category").value="video";
  if(typeof refreshExternalProviders==="function")refreshExternalProviders();
  $("external-prompt").value=prompt;go("external");toast("Prompt video dari Hybrid AI Director siap. Lampirkan referensi secara manual.");
 });
 const oldGo=window.go;
 window.go=function(page){if(page==="director"){projectOptions();if(projectSelect.value)loadProject()}return oldGo(page)};
 loadProject();
})();
