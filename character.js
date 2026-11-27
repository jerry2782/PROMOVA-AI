/* PROMOVA AI V1.9 — Character DNA Studio
   Local-first character library; external image generation; multi-character project assignment. */
const CHARACTER_KEY="promova_ai_characters_v1";
let characters=loadCharacters();
let characterPhotoData="";
let characterPhotoName="";
let editingCharacterId="";
function loadCharacters(){try{return JSON.parse(localStorage.getItem(CHARACTER_KEY)||"[]")}catch{return []}}
function saveCharacters(){localStorage.setItem(CHARACTER_KEY,JSON.stringify(characters));renderCharacterLibrary();refreshCharacterProjectOptions()}
function getProjectCharacters(project){return (project?.characterIds||[]).map(id=>characters.find(c=>c.id===id)).filter(Boolean)}
function characterDNAText(c){return [
"CHARACTER ID: "+c.id,
"Character name: "+c.name,
"Role: "+(c.role||"Not specified"),
"Age: "+(c.age||"Not specified"),
"Permanent physical identity: "+(c.appearance||"Use the attached approved character reference as the primary identity source."),
"Personality and demeanor: "+(c.personality||"Not specified"),
"Voice: "+(c.voice||"Not specified"),
"Visual style: "+(c.visualStyle||"Photorealistic"),
"IDENTITY LOCK: Preserve the same facial identity, face shape, skin tone, eye shape, nose, lips, hairstyle, hairline, body proportions and distinctive features. Do not reinterpret, beautify, age-shift or redesign the character.",
"VARIATION RULE: Outfit, expression, pose, action and scene condition are separate scene variations. They must never overwrite the permanent identity above."
].join("\n")}
function buildCharacterPrompt(c){
 const ref=c.photoData?"Use the attached character reference photo as the primary identity reference. Reproduce the same person faithfully; do not infer or add unsupported biographical details.":"Create a new fictional human character using only the supplied physical description. Keep the identity stable and do not add distinctive traits that conflict with the description.";
 return "You are a professional character identity designer for commercial image and video production. Create a reusable CHARACTER DNA reference for the following character.\n\n"+characterDNAText(c)+"\n\nREFERENCE METHOD: "+ref+"\n\nOUTPUT: Generate a clean character reference sheet with (1) front-facing head-and-shoulders portrait, (2) three-quarter face view, (3) side profile, and (4) full-body front view. Keep the same face, hair, skin tone and body proportions in every view. Neutral simple background, even studio lighting, natural relaxed pose, no text, no watermark, no collage borders. Visual style: "+(c.visualStyle||"Photorealistic")+". This is a fictional/authorized character design. Do not change the permanent identity between views."}
function renderCharacterLibrary(){
 const root=document.getElementById("character-library");if(!root)return;
 root.innerHTML=characters.map(c=>'<article class="character-card">'+(c.photoData?'<img src="'+c.photoData+'" alt="Character reference">':'<div class="character-avatar-placeholder">♙</div>')+'<div><b>'+esc(c.name)+'</b><small>'+esc(c.role||"Karakter")+' · '+esc(c.age||"Usia belum diisi")+'<br>'+esc(c.visualStyle||"Photorealistic")+' · '+(c.photoData?"Foto referensi tersedia":"Deskripsi teks")+'</small><div class="character-card-actions"><button type="button" class="mini-btn" data-character-prompt="'+esc(c.id)+'">Prompt</button><button type="button" class="mini-btn" data-character-delete="'+esc(c.id)+'">Hapus</button></div></div></article>').join("")||'<div class="character-empty">Belum ada Character DNA.<br>Buat karakter pertama melalui formulir ini.</div>';
}
function refreshCharacterProjectOptions(){
 const sel=document.getElementById("character-project");if(!sel)return;
 const old=sel.value;sel.innerHTML='<option value="">Pilih proyek tersimpan...</option>'+projects.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.title)+' — '+esc(p.type)+'</option>').join("");
 if(projects.some(p=>p.id===old))sel.value=old;
 renderCharacterAssignments();
}
function renderCharacterAssignments(){
 const root=document.getElementById("character-project-assignments");if(!root)return;
 const p=projects.find(x=>x.id===document.getElementById("character-project").value);
 if(!p){root.innerHTML='<p class="helper">Pilih proyek untuk mengatur karakter.</p>';return}
 const ids=p.characterIds||[];
 root.innerHTML=characters.map(c=>'<label class="character-assignment">'+(c.photoData?'<img src="'+c.photoData+'" alt="">':'<div class="character-avatar-placeholder">♙</div>')+'<input type="checkbox" value="'+esc(c.id)+'" '+(ids.includes(c.id)?"checked":"")+'><span><b>'+esc(c.name)+'</b><small>'+esc(c.role||"Karakter")+' · '+esc(c.age||"")+'</small></span></label>').join("")||'<div class="character-empty">Belum ada karakter. Buat Character DNA terlebih dahulu.</div>';
}
function selectedCharacterSummary(project){
 const list=getProjectCharacters(project);
 if(!list.length)return "No saved human character is assigned to this project.";
 return list.map(c=>characterDNAText(c)+"\nCharacter reference image: "+(c.photoData?"The user must manually attach the saved character reference image in the external AI service.":"No character photo; use the text DNA only.")).join("\n\n--- NEXT CHARACTER ---\n\n");
}
function ensureFrameCharacterBox(){
 const ref=document.getElementById("frame-product-reference");
 if(!ref||document.getElementById("frame-character-reference"))return;
 const box=document.createElement("div");box.id="frame-character-reference";box.className="frame-character-reference";
 ref.insertAdjacentElement("afterend",box);
}
function renderFrameCharacterAssignments(){
 ensureFrameCharacterBox();
 const box=document.getElementById("frame-character-reference");
 const p=projects.find(x=>x.id===document.getElementById("frame-project").value);
 if(!box)return;
 const list=getProjectCharacters(p);
 box.innerHTML='<b>Character DNA proyek</b>'+(list.length?'<div class="frame-character-chips">'+list.map(c=>'<span>'+esc(c.name)+'</span>').join("")+'</div><p>Karakter akan dimasukkan ke prompt First Frame, Last Frame, dan Video. Saat memakai AI eksternal, lampirkan foto referensi karakter secara manual bersama foto referensi produk.</p>':'<p>Belum ada karakter yang ditetapkan. Tambahkan karakter melalui menu More → Character DNA Studio, lalu tetapkan ke proyek ini. Prompt tetap dapat digunakan tanpa karakter manusia.</p>')+'<button type="button" class="text-btn" id="frame-manage-characters">Kelola karakter proyek →</button>';
 document.getElementById("frame-manage-characters").addEventListener("click",()=>{document.getElementById("character-project").value=p?.id||"";renderCharacterAssignments();go("characters")});
}
const characterPhotoInput=document.getElementById("character-photo");
characterPhotoInput.addEventListener("change",async e=>{
 const file=e.target.files[0];if(!file)return;
 if(!file.type.startsWith("image/")){toast("Pilih file gambar");return}
 try{characterPhotoData=await compressImage(file);characterPhotoName=file.name;document.getElementById("character-photo-preview").src=characterPhotoData;document.getElementById("character-photo-name").textContent=file.name;document.getElementById("character-photo-size").textContent="Foto terkompresi · "+Math.round(characterPhotoData.length/1024)+" KB";document.getElementById("character-upload-placeholder").classList.add("hidden");document.getElementById("character-photo-wrap").classList.remove("hidden");toast("Referensi karakter siap digunakan")}catch{toast("Gagal memproses foto karakter")}
});
document.getElementById("character-photo-remove").addEventListener("click",()=>{characterPhotoData="";characterPhotoName="";characterPhotoInput.value="";document.getElementById("character-upload-placeholder").classList.remove("hidden");document.getElementById("character-photo-wrap").classList.add("hidden")});
function readCharacterForm(){
 return {name:document.getElementById("character-name").value.trim(),role:document.getElementById("character-role").value.trim(),age:document.getElementById("character-age").value.trim(),appearance:document.getElementById("character-appearance").value.trim(),personality:document.getElementById("character-personality").value.trim(),voice:document.getElementById("character-voice").value.trim(),visualStyle:document.getElementById("character-visual-style").value,photoData:characterPhotoData,photoName:characterPhotoName};
}
document.getElementById("character-build-prompt").addEventListener("click",()=>{
 const c=readCharacterForm();if(!c.name){toast("Isi nama karakter terlebih dahulu");return}
 if(!c.appearance&&!c.photoData){toast("Isi deskripsi fisik atau upload foto referensi");return}
 document.getElementById("character-prompt").value=buildCharacterPrompt(c);toast("Prompt Character DNA berhasil disusun");
});
document.getElementById("character-form").addEventListener("submit",e=>{
 e.preventDefault();const c=readCharacterForm();
 if(!c.name){toast("Nama karakter wajib diisi");return}
 if(!c.appearance&&!c.photoData){toast("Isi deskripsi fisik atau upload foto referensi");return}
 const existing=editingCharacterId?characters.find(x=>x.id===editingCharacterId):null;
 const item={...(existing||{}),id:existing?.id||(crypto.randomUUID?crypto.randomUUID():"char-"+Date.now()),...c,createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
 try{if(existing)characters=characters.map(x=>x.id===existing.id?item:x);else characters.unshift(item);saveCharacters();document.getElementById("character-prompt").value=buildCharacterPrompt(item);editingCharacterId="";document.querySelector("#character-form button[type=submit]").textContent="Simpan Character DNA";toast(existing?"Character DNA diperbarui":"Character DNA tersimpan di perangkat ini")}
 catch(err){if(!existing)characters=characters.filter(x=>x.id!==item.id);toast("Penyimpanan penuh. Kurangi ukuran atau jumlah foto karakter.")}
});
document.getElementById("character-copy-prompt").addEventListener("click",()=>{const v=document.getElementById("character-prompt").value.trim();if(!v){toast("Susun prompt karakter terlebih dahulu");return}copyText(v)});
document.getElementById("character-open-ai").addEventListener("click",()=>{const v=document.getElementById("character-prompt").value.trim();if(!v){toast("Susun prompt karakter terlebih dahulu");return}const providers={gemini:["Google Gemini","https://gemini.google.com/app"],chatgpt:["ChatGPT Images","https://chatgpt.com/"],canva:["Canva","https://www.canva.com/"]};const provider=providers[document.getElementById("character-image-provider").value]||providers.gemini;window.open(provider[1],"_blank","noopener,noreferrer");toast(provider[0]+" dibuka. Tempel prompt dan lampirkan foto karakter jika tersedia.")});
document.getElementById("character-project").addEventListener("change",renderCharacterAssignments);
document.getElementById("character-save-assignments").addEventListener("click",()=>{
 const p=projects.find(x=>x.id===document.getElementById("character-project").value);if(!p){toast("Pilih proyek terlebih dahulu");return}
 const nextIds=[...document.querySelectorAll("#character-project-assignments input[type=checkbox]:checked")].map(x=>x.value);
 const previousIds=p.characterIds||[];
 const changed=nextIds.length!==previousIds.length||nextIds.some(id=>!previousIds.includes(id));
 p.characterIds=nextIds;
 if(changed&&p.framePlan){p.framePlan.firstApproved=false;p.framePlan.lastApproved=false;p.framePlan.firstPrompt="";p.framePlan.lastPrompt="";p.pipeline=p.pipeline||{};p.pipeline.image=false;p.pipeline.video=false;}
 p.characterAssignmentsUpdatedAt=new Date().toISOString();saveProjects();renderCharacterAssignments();renderFrameCharacterAssignments();toast(p.characterIds.length+" karakter disimpan ke proyek");
});
document.getElementById("character-library").addEventListener("click",e=>{
 const editBtn=e.target.closest("[data-character-edit]");if(editBtn){const c=characters.find(x=>x.id===editBtn.dataset.characterEdit);if(c){editingCharacterId=c.id;document.getElementById("character-name").value=c.name;document.getElementById("character-role").value=c.role||"";document.getElementById("character-age").value=c.age||"";document.getElementById("character-appearance").value=c.appearance||"";document.getElementById("character-personality").value=c.personality||"";document.getElementById("character-voice").value=c.voice||"";document.getElementById("character-visual-style").value=c.visualStyle||"Photorealistic";characterPhotoData=c.photoData||"";characterPhotoName=c.photoName||"";characterPhotoInput.value="";document.getElementById("character-photo-preview").src=characterPhotoData;document.getElementById("character-photo-name").textContent=characterPhotoName||"Foto karakter";document.getElementById("character-photo-size").textContent=characterPhotoData?"Referensi tersimpan":"Belum ada foto";document.getElementById("character-upload-placeholder").classList.toggle("hidden",!!characterPhotoData);document.getElementById("character-photo-wrap").classList.toggle("hidden",!characterPhotoData);document.querySelector("#character-form button[type=submit]").textContent="Perbarui Character DNA";document.getElementById("character-prompt").value=buildCharacterPrompt(c);document.getElementById("character-name").scrollIntoView({behavior:"smooth",block:"center"});toast("DNA dimuat. Perbarui deskripsi atau foto referensi lalu simpan.")}return}
 const promptBtn=e.target.closest("[data-character-prompt]");if(promptBtn){const c=characters.find(x=>x.id===promptBtn.dataset.characterPrompt);if(c){document.getElementById("character-name").value=c.name;document.getElementById("character-role").value=c.role||"";document.getElementById("character-age").value=c.age||"";document.getElementById("character-appearance").value=c.appearance||"";document.getElementById("character-personality").value=c.personality||"";document.getElementById("character-voice").value=c.voice||"";document.getElementById("character-visual-style").value=c.visualStyle||"Photorealistic";characterPhotoData=c.photoData||"";characterPhotoName=c.photoName||"";document.getElementById("character-prompt").value=buildCharacterPrompt(c);toast("DNA karakter dimuat ke editor")}}
 const del=e.target.closest("[data-character-delete]");if(del&&confirm("Hapus karakter ini dari Character Library? Karakter juga akan dilepas dari proyek yang menggunakannya.")){const id=del.dataset.characterDelete;characters=characters.filter(c=>c.id!==id);projects.forEach(p=>{p.characterIds=(p.characterIds||[]).filter(x=>x!==id)});saveCharacters();saveProjects();renderCharacterAssignments();renderFrameCharacterAssignments();toast("Karakter dihapus")}
});
/* Add a multi-character assignment panel to the existing First & Last Frame workflow. */
const originalFramePromptsFor=framePromptsFor;
framePromptsFor=function(p){
 const result=originalFramePromptsFor(p),list=getProjectCharacters(p);
 if(!list.length)return result;
 const identity=selectedCharacterSummary(p);
 const continuity="\n\nAPPROVED CHARACTER DNA — IDENTITY LOCK\n"+identity+"\nUse every assigned character only as specified. If a character reference photo is attached, match that exact identity. Do not merge identities or substitute faces. Keep each character's permanent DNA unchanged. Outfit, expression, pose and action are scene-specific variations. The user will attach character reference images manually in the external image service.";
 result.first=result.first+continuity+"\nOpening composition: show the assigned character(s) naturally interacting with or presenting the product. Keep the product clearly visible.";
 result.last=result.last+continuity+"\nClosing composition: use the same assigned character(s), same identity and compatible wardrobe/location continuity. Keep the product clearly visible.";
 return result;
};
const originalExtractExternalPrompt=extractExternalPrompt;
extractExternalPrompt=function(project,kind){
 const base=originalExtractExternalPrompt(project,kind);
 if(kind!=="video"||!getProjectCharacters(project).length)return base;
 return base+"\n\n"+ "APPROVED CHARACTER DNA — VIDEO CONTINUITY LOCK\n"+selectedCharacterSummary(project)+"\nCHARACTER CONTINUITY: Keep every assigned character's face, hair, skin tone, body proportions and recognizable identity consistent in every shot. Do not blend, duplicate, replace or redesign characters. Preserve scene-specific outfit and action instructions. Character reference images must be attached manually by the user in the external video service.";
};
const originalLoadFrameProject=loadFrameProject;
loadFrameProject=function(){originalLoadFrameProject();renderFrameCharacterAssignments()};
document.getElementById("frame-project").addEventListener("change",renderFrameCharacterAssignments);
renderCharacterLibrary();refreshCharacterProjectOptions();ensureFrameCharacterBox();renderFrameCharacterAssignments();
