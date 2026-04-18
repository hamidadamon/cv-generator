// ── THÈME ─────────────────────────────────────────────────
let themeActif = 'classique'; // thème par défaut

// Changer le thème quand on clique sur un bouton
function choisirTheme(theme, bouton) {
  themeActif = theme;

  // Retirer la classe "actif" de tous les boutons, l'ajouter au bouton cliqué
  document.querySelectorAll('.theme-btn').forEach(function(btn) {
    btn.classList.remove('actif');
  });
  bouton.classList.add('actif');

  // Si le CV est déjà affiché, changer son thème immédiatement
  const cvEl = document.getElementById('cv');
  if (cvEl.classList.contains('cv-rendu')) {
    cvEl.className = 'cv-rendu theme-' + theme;
  }
}


// ── COMPÉTENCES ──────────────────────────────────────────
const tags = [];

function ajouterTag() {
  const input = document.getElementById('competenceInput');
  const valeur = input.value.trim();
  if (!valeur || tags.includes(valeur)) return;
  tags.push(valeur);
  afficherTags();
  input.value = '';
}

function afficherTags() {
  const liste = document.getElementById('tagsList');
  liste.innerHTML = '';
  tags.forEach(function(tag, index) {
    const el = document.createElement('span');
    el.className = 'tag';
    el.textContent = tag + ' ×';
    el.onclick = function() { tags.splice(index, 1); afficherTags(); };
    liste.appendChild(el);
  });
}

document.getElementById('competenceInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') { e.preventDefault(); ajouterTag(); }
});


// ── EXPÉRIENCES ───────────────────────────────────────────
function ajouterExperience() {
  const carte = document.createElement('div');
  carte.className = 'carte';
  carte.innerHTML = `
    <button class="supprimer" onclick="this.parentElement.remove()">×</button>
    <input class="exp-poste"      placeholder="Poste">
    <input class="exp-entreprise" placeholder="Entreprise">
    <input class="exp-debut"      placeholder="Début (ex : Jan 2022)">
    <input class="exp-fin"        placeholder="Fin (ex : Déc 2023)">
    <textarea class="exp-desc" rows="2" placeholder="Description des missions"></textarea>
  `;
  document.getElementById('experiencesContainer').appendChild(carte);
}


// ── FORMATIONS ────────────────────────────────────────────
function ajouterFormation() {
  const carte = document.createElement('div');
  carte.className = 'carte';
  carte.innerHTML = `
    <button class="supprimer" onclick="this.parentElement.remove()">×</button>
    <input class="form-diplome" placeholder="Diplôme / Formation">
    <input class="form-ecole"   placeholder="École / Université">
    <input class="form-debut"   placeholder="Début (ex : 2019)">
    <input class="form-fin"     placeholder="Fin (ex : 2022)">
  `;
  document.getElementById('formationsContainer').appendChild(carte);
}


// ── VALIDATION ────────────────────────────────────────────
function valider() {
  const champsObligatoires = ['nom', 'metier', 'email', 'desc'];
  let ok = true;

  document.querySelectorAll('.invalide').forEach(function(el) {
    el.classList.remove('invalide');
  });

  champsObligatoires.forEach(function(id) {
    const champ = document.getElementById(id);
    if (!champ.value.trim()) { champ.classList.add('invalide'); ok = false; }
  });

  const email = document.getElementById('email');
  if (email.value.trim() && !email.value.includes('@')) {
    email.classList.add('invalide'); ok = false;
  }

  if (!ok) alert('Remplis les champs obligatoires (*) correctement.');
  return ok;
}


// ── GÉNÉRER LE CV ─────────────────────────────────────────
function genererCv() {
  if (!valider()) return;

  const nom      = document.getElementById('nom').value.trim();
  const metier   = document.getElementById('metier').value.trim();
  const email    = document.getElementById('email').value.trim();
  const tel      = document.getElementById('tel').value.trim();
  const ville    = document.getElementById('ville').value.trim();
  const linkedin = document.getElementById('linkedin').value.trim();
  const photo    = document.getElementById('photo').value.trim();
  const desc     = document.getElementById('desc').value.trim();

  // Photo ou initiales
  let photoHtml = '';
  if (photo) {
    photoHtml = `<img src="${photo}" class="cv-photo" alt="photo">`;
  } else {
    const initiales = nom.split(' ').map(function(mot) { return mot[0]; }).join('').toUpperCase();
    photoHtml = `<div class="cv-initiales">${initiales}</div>`;
  }

  // Contacts
  let contactsHtml = '';
  if (email)    contactsHtml += `<span>✉ ${email}</span>`;
  if (tel)      contactsHtml += `<span>📞 ${tel}</span>`;
  if (ville)    contactsHtml += `<span>📍 ${ville}</span>`;
  if (linkedin) contactsHtml += `<span>🔗 <a href="https://${linkedin}" target="_blank">${linkedin}</a></span>`;

  // Compétences
  let tagsHtml = '';
  if (tags.length > 0) {
    const items = tags.map(function(t) { return `<span class="cv-tag">${t}</span>`; }).join('');
    tagsHtml = `
      <div class="cv-section">
        <div class="cv-titre-section">Compétences</div>
        <div class="cv-tags">${items}</div>
      </div>`;
  }

  // Expériences
  let expHtml = '';
  let expItems = '';
  document.querySelectorAll('#experiencesContainer .carte').forEach(function(carte) {
    const poste      = carte.querySelector('.exp-poste').value.trim();
    const entreprise = carte.querySelector('.exp-entreprise').value.trim();
    const debut      = carte.querySelector('.exp-debut').value.trim();
    const fin        = carte.querySelector('.exp-fin').value.trim();
    const descExp    = carte.querySelector('.exp-desc').value.trim();
    if (!poste) return;
    expItems += `
      <div class="cv-entree">
        <div class="cv-entree-dates">${debut} — ${fin}</div>
        <div class="cv-entree-titre">${poste}</div>
        <div class="cv-entree-sous">${entreprise}</div>
        <div class="cv-entree-desc">${descExp}</div>
      </div>`;
  });
  if (expItems) expHtml = `
    <div class="cv-section">
      <div class="cv-titre-section">Expériences</div>
      ${expItems}
    </div>`;

  // Formations
  let formHtml = '';
  let formItems = '';
  document.querySelectorAll('#formationsContainer .carte').forEach(function(carte) {
    const diplome = carte.querySelector('.form-diplome').value.trim();
    const ecole   = carte.querySelector('.form-ecole').value.trim();
    const debut   = carte.querySelector('.form-debut').value.trim();
    const fin     = carte.querySelector('.form-fin').value.trim();
    if (!diplome) return;
    formItems += `
      <div class="cv-entree">
        <div class="cv-entree-dates">${debut} — ${fin}</div>
        <div class="cv-entree-titre">${diplome}</div>
        <div class="cv-entree-sous">${ecole}</div>
      </div>`;
  });
  if (formItems) formHtml = `
    <div class="cv-section">
      <div class="cv-titre-section">Formations</div>
      ${formItems}
    </div>`;

  // Afficher le CV avec le thème choisi
  const cvEl = document.getElementById('cv');
  cvEl.className = 'cv-rendu theme-' + themeActif;
  cvEl.innerHTML = `
    <div class="cv-entete">
      ${photoHtml}
      <div>
        <h2>${nom}</h2>
        <div class="cv-metier">${metier}</div>
        <div class="cv-contacts">${contactsHtml}</div>
      </div>
    </div>
    <div class="cv-section">
      <div class="cv-titre-section">Profil</div>
      <p>${desc}</p>
    </div>
    ${tagsHtml}
    ${expHtml}
    ${formHtml}
  `;
}


// ── RÉINITIALISER ─────────────────────────────────────────
function reinitialiser() {
  if (!confirm('Veux-tu tout effacer ?')) return;

  document.querySelectorAll('input, textarea').forEach(function(el) {
    el.value = '';
    el.classList.remove('invalide');
  });

  tags.length = 0;
  afficherTags();
  document.getElementById('experiencesContainer').innerHTML = '';
  document.getElementById('formationsContainer').innerHTML  = '';

  const cvEl = document.getElementById('cv');
  cvEl.className = 'cv-vide';
  cvEl.innerHTML = '<p>Remplis le formulaire et clique sur <strong>Générer le CV</strong></p>';
}


// ── TÉLÉCHARGER PDF ───────────────────────────────────────
function telechargerPDF() {
  if (!document.getElementById('cv').classList.contains('cv-rendu')) {
    alert('Génère d\'abord ton CV avant de télécharger.');
    return;
  }
  window.print();
}