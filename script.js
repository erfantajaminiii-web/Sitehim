const gate = document.getElementById('gate');
const site = document.getElementById('site');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const gateError = document.getElementById('gateError');

function normalizeName(value){
  return value.trim().replace(/\s+/g,'').toLowerCase();
}

function openSite(){
  gate.classList.add('hide');
  site.setAttribute('aria-hidden','false');
  document.body.style.overflowX='hidden';
  setTimeout(()=>nameInput.blur(),300);
  document.title='قشنگم ♡';
  spawnHearts(16);
}

async function sha256(value){
  const data=new TextEncoder().encode(value);
  const hash=await crypto.subtle.digest('SHA-256',data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

// The accepted name is checked by hash so the name itself is not displayed in the site.
const allowedNameHash='662e3c0e8a7c0ddf2fc5ad3d51a9475d4a87ef89e70cdace00f12d8592e3b3e6';

nameForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const name=normalizeName(nameInput.value);
  const hash=await sha256(name);
  if(hash===allowedNameHash){
    gateError.textContent='';
    openSite();
  }else{
    gateError.textContent='نام واردشده صحیح نیست.';
    nameInput.classList.remove('shake');
    void nameInput.offsetWidth;
    nameInput.classList.add('shake');
  }
});

// subtle input shake without changing the design
const shakeStyle=document.createElement('style');
shakeStyle.textContent='@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(6px)}75%{transform:translateX(-6px)}}.shake{animation:shake .3s ease}';
document.head.appendChild(shakeStyle);

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightboxImg');
document.querySelectorAll('.gallery-card').forEach(card=>{
  card.addEventListener('click',()=>{
    lightboxImg.src=card.dataset.full;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  });
});
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxImg.src='';}
document.getElementById('closeLightbox').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});

const messageModal=document.getElementById('messageModal');
const modalMessage=document.getElementById('modalMessage');
document.querySelectorAll('.surprise').forEach(btn=>{
  btn.addEventListener('click',()=>{
    modalMessage.textContent=btn.dataset.message;
    messageModal.classList.add('open');
    messageModal.setAttribute('aria-hidden','false');
    spawnHearts(8);
  });
});
function closeModal(){messageModal.classList.remove('open');messageModal.setAttribute('aria-hidden','true')}
document.getElementById('modalClose').addEventListener('click',closeModal);
messageModal.addEventListener('click',e=>{if(e.target===messageModal)closeModal()});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeLightbox();closeModal()}
});

function spawnHearts(count=10){
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const heart=document.createElement('span');
      heart.className='floating-heart';
      heart.textContent=Math.random()>.25?'♡':'✦';
      heart.style.left=(8+Math.random()*84)+'vw';
      heart.style.top=(55+Math.random()*35)+'vh';
      heart.style.setProperty('--x',(Math.random()*120-60)+'px');
      heart.style.fontSize=(13+Math.random()*17)+'px';
      document.getElementById('heartsLayer').appendChild(heart);
      setTimeout(()=>heart.remove(),1800);
    },i*75);
  }
}

document.getElementById('navHeart').addEventListener('click',()=>{spawnHearts(18);showToast('یه عالمه قلب برای قشنگم ♡')});
document.getElementById('finalHeart').addEventListener('click',()=>{spawnHearts(35);showToast('خب... حالا رسماً پر از قلب شدی ♡')});

let toastTimer;
function showToast(text){
  const toast=document.getElementById('toast');
  toast.textContent=text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),2200);
}

// Make the page feel alive, but keep it subtle.
setInterval(()=>{
  if(!gate.classList.contains('hide')) return;
  if(Math.random()<.45) spawnHearts(1);
},3200);
