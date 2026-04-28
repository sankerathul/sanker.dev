function tick() {
  const now = new Date();
  const t = now.toLocaleTimeString('en-CA', { hour12: false });
  const clock = document.getElementById('clock');
  if (clock) {
    clock.textContent = t;
  }
}

tick();
setInterval(tick, 1000);

const targetPct = 38;
const pctEl = document.getElementById('pct');
if (pctEl) {
  let pct = 0;
  const iv = setInterval(() => {
    pct += 1;
    pctEl.textContent = pct;
    if (pct >= targetPct) {
      clearInterval(iv);
    }
  }, 80);
}

function formatLabel(value) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return 'Present';
  const date = new Date(`${value}-01`);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
}

function renderSkills(data) {
  const skillsGrid = document.querySelector('.skills-grid');
  if (!skillsGrid || !data.skills) return;
  skillsGrid.innerHTML = '';

  const skillLevels = {
    Python: 95,
    JavaScript: 90,
    Java: 85,
    React: 88,
    NodeJS: 86,
    Express: 84,
    Django: 82,
    Flask: 80,
    Pandas: 85,
    PySpark: 80,
    Swagger: 75,
    Ansible: 70,
    Kubernetes: 82,
    Helm: 76,
    Git: 90,
    Jenkins: 78,
    ArgoCD: 72,
    Kafka: 80,
    Docker: 88,
    Azure: 75,
    AWS: 82,
    MongoDB: 78,
    PostgreSQL: 78,
    MySQL: 76,
    Redis: 72,
    OpenCV: 70,
    TensorFlow: 74
  };

  Object.entries(data.skills).forEach(([group, items]) => {
    const skillGroup = document.createElement('div');
    skillGroup.className = 'skill-group';
    skillGroup.innerHTML = `<h3>${formatLabel(group)}</h3>`;

    items.forEach(skill => {
      const level = skillLevels[skill] || 68;
      const skillEntry = document.createElement('div');
      skillEntry.className = 'skill-entry';
      skillEntry.innerHTML = `
        <div class="skill-label"><span>${skill}</span><span>${level}%</span></div>
        <div class="skill-progress"><span class="skill-progress-fill" style="width: ${level}%"></span></div>
      `;
      skillGroup.appendChild(skillEntry);
    });

    skillsGrid.appendChild(skillGroup);
  });
}

function renderExperience(data) {
  const summaryElement = document.querySelector('.experience-summary');
  if (summaryElement && data.profile?.summary) {
    summaryElement.textContent = data.profile.summary;
  }

  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  timeline.innerHTML = '';

  const entries = Array.isArray(data.experience) ? [...data.experience] : [];
  entries.sort((a, b) => new Date(`${b.startDate}-01`) - new Date(`${a.startDate}-01`));

  entries.forEach(entry => {
    const start = formatDate(entry.startDate);
    const end = entry.isCurrent || !entry.endDate ? 'Present' : formatDate(entry.endDate);
    const range = `${start} — ${end}`;
    const year = new Date(`${entry.startDate}-01`).getFullYear();
    const currentBadge = entry.isCurrent ? '<span class="timeline-badge">Current</span>' : '';

    const clientBlocks = (entry.clients || []).map(client => `
      <div class="client-card">
        <div class="client-card-title">
          <strong>${client.name}</strong>
          ${client.techStack?.length ? '<span class="timeline-badge">Client work</span>' : ''}
        </div>
        ${client.highlights?.length ? `<ul class="experience-highlights">${client.highlights.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
        ${client.techStack?.length ? `<div class="experience-tech">${client.techStack.map(skill => `<span class="tech-pill">${skill}</span>`).join('')}</div>` : ''}
      </div>
    `).join('');

    const experienceHighlights = (entry.highlights || []).length
      ? `
        <div class="experience-card-block">
          <strong>Selected highlights</strong>
          <ul class="experience-highlights">${entry.highlights.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
      `
      : '';

    const companyClients = entry.clients?.length
      ? `<div class="timeline-meta">Clients: ${entry.clients.map(client => client.name).join(', ')}</div>`
      : '';

    const techStack = entry.techStack?.length
      ? `<div class="experience-tech">${entry.techStack.map(skill => `<span class="tech-pill">${skill}</span>`).join('')}</div>`
      : '';

    const detailsContent = `${experienceHighlights}${clientBlocks}${techStack}`;
    const hasDetails = Boolean(detailsContent.trim());
    const toggleButton = hasDetails ? '<button type="button" class="experience-toggle">View details</button>' : '';

    const itemHtml = `
      <div class="timeline-item">
        <div class="timeline-year">${year}</div>
        <div class="timeline-card">
          <header>
            <div>
              <div class="job-title">${entry.role}</div>
              <div class="company-name">${entry.company} · ${entry.location}</div>
            </div>
            <div class="timeline-meta-group">
              <span class="timeline-range">${range}</span>
              ${currentBadge}
            </div>
          </header>
          ${companyClients}
          ${toggleButton}
          <div class="experience-details">
            ${detailsContent}
          </div>
        </div>
      </div>
    `;

    timeline.insertAdjacentHTML('beforeend', itemHtml);
  });
}

function renderContributions(data) {
  const postsList = document.querySelector('.posts-list');
  if (!postsList) return;
  postsList.innerHTML = '';

  data.sort((a, b) => new Date(b.date) - new Date(a.date));

  data.forEach(contrib => {
    const item = document.createElement('div');
    item.className = 'post-item';
    item.innerHTML = `
      <h3>${contrib.codebase} - ${contrib.issue}</h3>
      <p>${contrib.fix}</p>
      <div class="meta">
        <span class="status-badge status-${contrib.status.toLowerCase().replace(/\s+/g, '-')}">${contrib.status}</span>
        <span>Lines: ${contrib.linesOfCode}</span>
        <span>${new Date(contrib.date).toLocaleDateString()}</span>
      </div>
      <div class="links">
        <a href="${contrib.links.pr}">PR →</a>
        <a href="${contrib.links.issue}">Issue →</a>
      </div>
    `;
    postsList.appendChild(item);
  });
}

function renderCertifications(data) {
  const certList = document.querySelector('.certifications-list');
  if (!certList) return;
  certList.innerHTML = '';

  data.forEach(cert => {
    const item = document.createElement('div');
    item.className = 'post-item';
    item.innerHTML = `
      <h3>${cert.title}</h3>
      <p>${cert.issuer} · ${cert.year}</p>
      ${cert.credentialUrl ? `<div class="links"><a href="${cert.credentialUrl}" target="_blank" rel="noreferrer">View credential →</a></div>` : ''}
    `;
    certList.appendChild(item);
  });
}

function renderProjects(data) {
  const projectList = document.querySelector('.projects-list');
  if (!projectList) return;
  projectList.innerHTML = '';

  data.forEach(project => {
    const item = document.createElement('div');
    item.className = 'post-item';
    item.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="experience-tech">${(project.techStack || []).map(tag => `<span class="tech-pill">${tag}</span>`).join('')}</div>
      ${project.link ? `<div class="links"><a href="${project.link}" target="_blank" rel="noreferrer">View project →</a></div>` : ''}
    `;
    projectList.appendChild(item);
  });
}

function renderContact(data) {
  const panel = document.querySelector('.contact-panel');
  if (!panel || !data.profile) return;

  const profile = data.profile;
  panel.innerHTML = `
    <div class="post-item">
      <h3>${profile.name}</h3>
      <p>${profile.summary}</p>
      <div class="timeline-meta-group">
        ${profile.location ? `<span class="timeline-range">${profile.location}</span>` : ''}
        ${profile.email ? `<span class="timeline-range">${profile.email}</span>` : '<span class="timeline-range">Email available on request</span>'}
      </div>
      <div class="experience-tech">${[
        profile.website ? `<a class="tech-pill" href="${profile.website}" target="_blank" rel="noreferrer">Website</a>` : '',
        profile.linkedin ? `<a class="tech-pill" href="${profile.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>` : ''
      ].filter(Boolean).join('')}</div>
    </div>
  `;
}

fetch('data/workexperience.json')
  .then(response => response.json())
  .then(data => {
    renderSkills(data);
    renderExperience(data);
    renderContact(data);
  })
  .catch(error => console.error('Error loading work experience:', error));

fetch('data/contributions.json')
  .then(response => response.json())
  .then(renderContributions)
  .catch(error => console.error('Error loading contributions:', error));

fetch('data/certifications.json')
  .then(response => response.json())
  .then(renderCertifications)
  .catch(error => console.error('Error loading certifications:', error));

fetch('data/projects.json')
  .then(response => response.json())
  .then(renderProjects)
  .catch(error => console.error('Error loading projects:', error));

document.addEventListener('click', event => {
  const button = event.target.closest('.experience-toggle');
  if (!button) return;

  const card = button.closest('.timeline-card');
  const details = card?.querySelector('.experience-details');
  if (!details) return;

  const expanded = details.classList.toggle('expanded');
  button.textContent = expanded ? 'Hide details' : 'View details';
});
