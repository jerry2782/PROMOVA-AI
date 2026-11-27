// PROMOVA AI — Cinematic Logo Reveal Studio
(()=>{
 const $=id=>document.getElementById(id);
 const logo=$("cr-logo"), preview=$("cr-logo-preview");
 if(!logo||!preview)return;
 let logoUrl="";
 logo.addEventListener("change",()=>{
  const f=logo.files&&logo.files[0];if(!f)return;
  if(!f.type.startsWith("image/")){toast("Pilih file logo berupa gambar");return}
  if(logoUrl)URL.revokeObjectURL(logoUrl);
  logoUrl=URL.createObjectURL(f);
  preview.innerHTML='<img src="'+logoUrl+'" alt="Preview logo SAMS Studio"><span>'+esc(f.name)+'</span>';
 });
 $("cr-generate").addEventListener("click",()=>{
  const brand=$("cr-brand").value.trim()||"SAMS Studio";
  const scene=$("cr-scene").value,reveal=$("cr-reveal").value,duration=$("cr-duration").value,ratio=$("cr-ratio").value;
  const prompt='VIDEO GENERATION PROMPT — '+brand.toUpperCase()+' CINEMATIC WALL LOGO REVEAL\n\nDURATION: EXACTLY '+duration+'. FORMAT: '+ratio+'. ONE CONTINUOUS SHOT.\n\nSCENE: '+scene+'. Create a premium cinematic architectural interior with a luxurious dark room, elegant golden geometric wall frames, a large central rectangular wall panel, glossy black marble flooring, subtle realistic reflections, and controlled warm golden lighting. Match the supplied video reference for the overall room atmosphere and composition.\n\nOPENING: Begin in near darkness. Gradually reveal the room through subtle warm architectural lighting. Use a slow, smooth cinematic dolly-in toward the central wall frame.\n\nLOGO REVEAL: '+reveal+'. The original uploaded '+brand+' logo must emerge precisely in the CENTER of the central wall frame, as if it is a premium illuminated wall emblem physically integrated into the architecture.\n\nSTRICT LOGO IDENTITY: Use the manually attached original logo image as the exact visual reference. Preserve its original artwork, lettering, proportions, colors and details. Do not redraw, regenerate, reinterpret, misspell, recolor, crop, stretch or distort it. The logo must appear exactly ONCE. No duplicate logo, blurred logo silhouette, logo shadow, logo reflection, extra lettering or invented symbols. Keep the logo sharp, readable and unobstructed.\n\nFINAL HERO SHOT: Complete the reveal by '+duration+'. Hold a stable, symmetrical composition with the logo clearly visible for the final 2 seconds. Keep the room elegant and dark; use only subtle golden ambient light around the frame.\n\nCAMERA: Slow controlled dolly-in, centered symmetrical framing, no cuts, no shake, no sudden zoom or reframing.\n\nLIGHTING: Premium warm gold architectural lighting, subtle volumetric rays, deep cinematic shadows, realistic black marble reflections, restrained highlights.\n\nNEGATIVE: No extra logos, no duplicated lettering, no fake text, no watermark, no logo redesign, no floating logo, no excessive lens flare, no flicker, no obstruction, no fast transitions, no camera shake.\n\nREFERENCE INPUTS: Manually attach (1) the exact original '+brand+' logo image and (2) the supplied room video reference. If the video model cannot preserve the logo exactly, generate the same scene with a clean empty central wall panel and add the original logo as a tracked overlay in the video editor. Never substitute an AI-generated logo.';
  const out=$("cr-output");
  out.innerHTML='<h3>Prompt siap digunakan</h3><pre class="cr-output-prompt" id="cr-prompt-text"></pre><div class="cr-output-actions"><button type="button" class="primary-btn" id="cr-copy">Salin prompt</button><button type="button" class="secondary-btn" id="cr-open">Buka AI video ↗</button></div><p class="helper">Lampirkan logo asli dan video referensi secara manual. PROMOVA menyiapkan prompt; rendering video dilakukan di layanan AI eksternal.</p>';
  $("cr-prompt-text").textContent=prompt;
  $("cr-copy").addEventListener("click",()=>copyText(prompt));
  $("cr-open").addEventListener("click",()=>{window.open($("cr-provider").value,"_blank","noopener,noreferrer");toast("AI video dibuka. Lampirkan kedua referensi lalu tempel prompt.")});
  if(typeof saveProject==="function")saveProject(brand+" — Cinematic Logo Reveal","Cinematic Logo Prompt",prompt,{brand,style:scene,ratio});
  toast("Cinematic prompt berhasil dibuat dan disimpan");
 });
})();