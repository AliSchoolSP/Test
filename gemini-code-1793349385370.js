// Initiële dataset (Alle taken ingesteld op 'todo')
const initialTasks = [
  // Fase 1
  { id: 1, title: "Conceptontwerp maken", desc: "Taken die nog moeten starten", assignee: "", phase: "Fase 1 – Voorbereiding", dueDate: "", status: "todo" },
  { id: 2, title: "Beheer met drag-and-drop inrichten", desc: "", assignee: "", phase: "Fase 1 – Voorbereiding", dueDate: "", status: "todo" },
  { id: 3, title: "Privacy- en auteursrechtregels vastleggen", desc: "", assignee: "", phase: "Fase 1 – Voorbereiding", dueDate: "", status: "todo" },
  { id: 4, title: "Basisbeveiliging instellen", desc: "", assignee: "", phase: "Fase 1 – Voorbereiding", dueDate: "", status: "todo" },

  // Fase 2
  { id: 5, title: "Ontwerp afronden en laten goedkeuren", desc: "", assignee: "", phase: "Fase 2 – Ontwerp en structuur", dueDate: "", status: "todo" },
  { id: 6, title: "Navigatie en menu's opzetten", desc: "", assignee: "", phase: "Fase 2 – Ontwerp en structuur", dueDate: "", status: "todo" },
  { id: 7, title: "Website geschikt maken voor gsm, tablet en laptop", desc: "", assignee: "", phase: "Fase 2 – Ontwerp en structuur", dueDate: "", status: "todo" },

  // Fase 3
  { id: 8, title: "Rollen en rechten beveiligen", desc: "", assignee: "", phase: "Fase 3 – Beheer en basisinformatie", dueDate: "", status: "todo" },
  { id: 9, title: "Kernwaarden, contactpagina en teampagina maken", desc: "", assignee: "", phase: "Fase 3 – Beheer en basisinformatie", dueDate: "", status: "todo" },

  // Fase 4-6
  { id: 10, title: "Foto's, studierichtingen en formulieren toevoegen", desc: "", assignee: "", phase: "Fase 4–6 – Inhoud en extra functies", dueDate: "", status: "todo" },
  { id: 11, title: "Spoorthema, zoekbalk en sociale media uitwerken", desc: "", assignee: "", phase: "Fase 4–6 – Inhoud en extra functies", dueDate: "", status: "todo" },
  { id: 12, title: "AI-chatbot en studiekeuzepad bouwen", desc: "", assignee: "", phase: "Fase 4–6 – Inhoud en extra functies", dueDate: "", status: "todo" },

  // Fase 7
  { id: 13, title: "Eindtests uitvoeren", desc: "", assignee: "", phase: "Fase 7 – Oplevering", dueDate: "", status: "todo" },
  { id: 14, title: "Beveiliging en privacy controleren", desc: "", assignee: "", phase: "Fase 7 – Oplevering", dueDate: "", status: "todo" },
  { id: 15, title: "Back-ups en onderhoud regelen", desc: "", assignee: "", phase: "Fase 7 – Oplevering", dueDate: "", status: "todo" },
  { id: 16, title: "Website online zetten", desc: "", assignee: "", phase: "Fase 7 – Oplevering", dueDate: "", status: "todo" }
];

let tasks = JSON.parse(localStorage.getItem('ocean_kanban_tasks')) || initialTasks;

// Media Afspeellijst
const mediaFiles = [
  'MEDIA/Along-The-Moutain.mp3',
  'MEDIA/Anime.mp3',
  'MEDIA/Bamboo_Flute.mp3',
  'MEDIA/Chinees_Zen_Meditati...mp3',
  'MEDIA/Kazoom.mp3',
  'MEDIA/Sad-Samurai.mp3',
  'MEDIA/Vivaldi_Autumn.mp3',
  'MEDIA/Vivaldi-spring.mp3',
  'MEDIA/VivaldiSummer.mp3',
  'MEDIA/Vivaldi-Winter.mp3'
];

let currentTrackIndex = 0;
const bgAudio = new Audio(mediaFiles[currentTrackIndex]);
bgAudio.volume = 0.3;

// Zachte foutafhandeling voor GitHub indien MEDIA map niet aanwezig is
bgAudio.addEventListener('error', (e) => {
  console.warn('Audiobestand kon niet geladen worden uit MEDIA/ map:', e);
});

bgAudio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % mediaFiles.length;
  bgAudio.src = mediaFiles[currentTrackIndex];
  bgAudio.play().catch(e => console.log('Autoplay geblokkeerd:', e));
});

function toggleMusic() {
  if (bgAudio.paused) {
    bgAudio.play().catch(e => console.log('Muziek afspelen niet toegestaan door browser:', e));
  } else {
    bgAudio.pause();
  }
}

// Opslaan & Renderen
function saveTasks() {
  localStorage.setItem('ocean_kanban_tasks', JSON.stringify(tasks));
  renderApp();
}

function renderApp() {
  const listTodo = document.getElementById('list-todo');
  const listDoing = document.getElementById('list-doing');
  const listDone = document.getElementById('list-done');

  listTodo.innerHTML = '';
  listDoing.innerHTML = '';
  listDone.innerHTML = '';

  let counts = { todo: 0, doing: 0, done: 0 };

  tasks.forEach(task => {
    counts[task.status]++;
    const card = createTaskCard(task);
    if (task.status === 'todo') listTodo.appendChild(card);
    else if (task.status === 'doing') listDoing.appendChild(card);
    else if (task.status === 'done') listDone.appendChild(card);
  });

  document.getElementById('count-todo').textContent = counts.todo;
  document.getElementById('count-doing').textContent = counts.doing;
  document.getElementById('count-done').textContent = counts.done;

  updateProgress();
}

function createTaskCard(task) {
  const div = document.createElement('div');
  div.className = 'task-card';
  div.draggable = true;
  div.ondragstart = (e) => e.dataTransfer.setData('text/plain', task.id);

  div.innerHTML = `
    <h4>${escapeHtml(task.title)}</h4>
    ${task.desc ? `<p>${escapeHtml(task.desc)}</p>` : ''}
    <div class="task-meta">
      <span class="tag-phase">${escapeHtml(task.phase)}</span>
      ${task.assignee ? `<span class="tag-assignee">👤 ${escapeHtml(task.assignee)}</span>` : ''}
      ${task.dueDate ? `<span class="tag-date">📅 ${task.dueDate}</span>` : ''}
    </div>
  `;
  return div;
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  const progressBar = document.getElementById('total-progress-bar');
  progressBar.style.width = `${percentage}%`;
  progressBar.textContent = `${percentage}%`;

  // Per fase monitor
  const phases = [...new Set(tasks.map(t => t.phase))];
  const monitorContainer = document.getElementById('phase-monitors');
  monitorContainer.innerHTML = '';

  phases.forEach(phase => {
    const phaseTasks = tasks.filter(t => t.phase === phase);
    const phaseDone = phaseTasks.filter(t => t.status === 'done').length;
    const item = document.createElement('div');
    item.className = 'phase-item';
    item.innerHTML = `<strong>${escapeHtml(phase)}</strong>: ${phaseDone}/${phaseTasks.length} voltooid`;
    monitorContainer.appendChild(item);
  });
}

// Drag & Drop
function allowDrop(e) {
  e.preventDefault();
}

function handleDrop(e, newStatus) {
  e.preventDefault();
  const id = parseInt(e.dataTransfer.getData('text/plain'));
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = newStatus;
    saveTasks();
  }
}

// Formulier afhandeling
function handleAddTask(e) {
  e.preventDefault();
  const title = document.getElementById('task-title').value.trim();
  const assignee = document.getElementById('task-assignee').value.trim();
  const phase = document.getElementById('task-phase').value;
  const dueDate = document.getElementById('task-duedate').value;
  const desc = document.getElementById('task-desc').value.trim();

  if (!title) return;

  const newTask = {
    id: Date.now(),
    title,
    assignee,
    phase,
    dueDate,
    desc,
    status: 'todo'
  };

  tasks.push(newTask);
  saveTasks();
  document.getElementById('task-form').reset();
}

// Backup functionaliteiten
function downloadBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `kanban_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function triggerUpload() {
  document.getElementById('file-import').click();
}

function uploadBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedTasks = JSON.parse(e.target.result);
      if (Array.isArray(importedTasks)) {
        tasks = importedTasks;
        saveTasks();
        alert('Backup succesvol ingeladen!');
      } else {
        alert('Ongeldig backupbestand.');
      }
    } catch (err) {
      alert('Fout bij het lezen van het JSON bestand.');
    }
  };
  reader.readAsText(file);
}

function escapeHtml(str) {
  return str ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
}

// Initialiseer app bij laden
document.addEventListener('DOMContentLoaded', renderApp);