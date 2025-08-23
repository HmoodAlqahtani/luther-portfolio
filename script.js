// ===============================
// Config
// ===============================
const DISCORD_USER_ID = "1073248316458012693"; // ضع هنا ID حسابك
const LANYARD = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

// ===============================
// Helpers
// ===============================
function setText(id, val){ const el = document.getElementById(id); if(el) el.textContent = val; }
function setSrc(id, val){ const el = document.getElementById(id); if(el) el.src = val; }
function statusColor(p){
  switch(p){
    case 'online': return getComputedStyle(document.documentElement).getPropertyValue('--success').trim();
    case 'idle': return getComputedStyle(document.documentElement).getPropertyValue('--idle').trim();
    case 'dnd': return getComputedStyle(document.documentElement).getPropertyValue('--dnd').trim();
    default: return getComputedStyle(document.documentElement).getPropertyValue('--offline').trim();
  }
}

// ===============================
// Discord presence
// ===============================
async function loadDiscord(){
  if(!DISCORD_USER_ID) return;

  try{
    const res = await fetch(LANYARD);
    const json = await res.json();
    if(!json.success) return;
    const d = json.data.discord_user;
    const presence = json.data.discord_status;

    // avatar
    const avatarHash = d.avatar;
    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${d.id}/${avatarHash}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${(Number(d.discriminator)||0)%5}.png`;

    setSrc('dc-avatar', avatarUrl);

    // name & username
    const display = d.global_name || d.display_name || d.username;
    setText('dc-name', display);
    setText('dc-user', d.username);

    // status بالإنجليزي
    const mapText = { online:'Online', idle:'Idle', dnd:'Do Not Disturb', offline:'Offline' };
    const dot = document.getElementById('dc-dot');
    const txt = document.getElementById('dc-text');
    const col = statusColor(presence);

    if(dot){
      dot.style.background = col;
      dot.style.color = col;
      dot.style.boxShadow = `0 0 12px ${col}, inset 0 0 24px ${col}`;
      dot.style.opacity = 0.9;
    }

    if(txt){ txt.textContent = mapText[presence] || 'Unknown'; }

  }catch(err){
    console.error('Discord fetch error:', err);
  }
}

// poll every 30s
loadDiscord();
setInterval(loadDiscord, 30000);

// ===============================
// Links buttons
// ===============================
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.link-btn');
  if(!btn) return;
  const link = btn.dataset.link;
  if(link) window.open(link, '_blank');
});

// ===============================
// Toggle more skills
// ===============================
const toggleBtn = document.getElementById('toggle-skills');
const moreSkills = document.getElementById('more-skills');
if(toggleBtn && moreSkills){
  toggleBtn.addEventListener('click', ()=>{
    const hidden = moreSkills.classList.contains('skills--hidden');
    moreSkills.classList.toggle('skills--hidden');
    toggleBtn.textContent = hidden ? 'Show less (-)' : 'Show more (+)';
  });
}
