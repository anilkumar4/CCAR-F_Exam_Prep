// ============================================================
// CCAR-F Exam Prep — Main Application
// Handles routing, state management, and module initialization
// ============================================================

const App = {
  currentModule: 'dashboard',
  state: {},

  init() {
    this.loadState();
    this.setupNavigation();
    this.renderDashboard();
    this.navigate('dashboard');
  },

  loadState() {
    const saved = localStorage.getItem('ccar-f-state');
    this.state = saved ? JSON.parse(saved) : {
      studiedTasks: {},
      flashcardsMastered: {},
      flashcardsReview: {},
      quizHistory: [],
      mockExamHistory: [],
      courseProgress: {},
      userName: null,
      studyTime: {},
      lastVisit: null
    };
    this.state.lastVisit = Date.now();
    this.saveState();
  },

  saveState() {
    localStorage.setItem('ccar-f-state', JSON.stringify(this.state));
  },

  setupNavigation() {
    // Mobile: bottom tab bar navigation
    const moreBtn = document.getElementById('mobile-more-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');

    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        const module = tab.dataset.module;
        if (module === 'more') {
          // Toggle sidebar for less-used modules
          if (sidebar) sidebar.classList.toggle('open');
          if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        } else {
          this.navigate(module);
        }
      });
    });

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      });
    }

    // Desktop: sidebar nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const module = item.dataset.module;
        if (module) this.navigate(module);
      });
    });
  },

  navigate(module) {
    this.currentModule = module;
    // Close mobile sidebar on navigation
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    // Update desktop sidebar nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-module="${module}"]`);
    if (activeNav) activeNav.classList.add('active');
    // Update mobile bottom tab bar
    const tabModules = ['dashboard', 'course', 'flashcards', 'quiz'];
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    const directTab = document.querySelector(`.tab-item[data-module="${module}"]`);
    if (directTab) {
      directTab.classList.add('active');
    } else {
      // Module is accessed via "More" — highlight the More tab
      const moreTab = document.querySelector('.tab-item[data-module="more"]');
      if (moreTab) moreTab.classList.add('active');
    }
    // Update modules
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    const activeModule = document.getElementById(`module-${module}`);
    if (activeModule) activeModule.classList.add('active');
    // Initialize module content
    switch(module) {
      case 'dashboard': this.renderDashboard(); break;
      case 'course': Course.renderSetup(); break;
      case 'study': StudyGuide.render(); break;
      case 'flashcards': Flashcards.init(); break;
      case 'quiz': Quiz.renderSetup(); break;
      case 'scenarios': Scenarios.renderList(); break;
      case 'cheatsheets': Cheatsheets.render(); break;
      case 'mock-exam': MockExam.renderSetup(); break;
    }
    window.scrollTo(0, 0);
    // Re-render Lucide icons for dynamically injected content
    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
  },

  renderDashboard() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    const totalTasks = STUDY_CONTENT.domains.reduce((sum, d) => sum + d.taskStatements.length, 0);
    const studiedCount = Object.keys(this.state.studiedTasks).filter(k => this.state.studiedTasks[k]).length;
    const studyPct = totalTasks > 0 ? Math.round((studiedCount / totalTasks) * 100) : 0;

    const totalFlashcards = FLASHCARDS_DATA.length;
    const masteredCount = Object.keys(this.state.flashcardsMastered).filter(k => this.state.flashcardsMastered[k]).length;
    const flashcardPct = totalFlashcards > 0 ? Math.round((masteredCount / totalFlashcards) * 100) : 0;

    const quizzes = this.state.quizHistory || [];
    const avgScore = quizzes.length > 0 ? Math.round(quizzes.reduce((s,q) => s + q.score, 0) / quizzes.length) : 0;

    const mockExams = this.state.mockExamHistory || [];
    const lastMock = mockExams.length > 0 ? mockExams[mockExams.length - 1] : null;

    // Weighted readiness
    let readiness = 0;
    STUDY_CONTENT.domains.forEach(domain => {
      const domainTasks = domain.taskStatements.length;
      const domainStudied = domain.taskStatements.filter(ts => this.state.studiedTasks[ts.id]).length;
      const domainPct = domainTasks > 0 ? domainStudied / domainTasks : 0;
      readiness += domainPct * domain.weight;
    });
    readiness = Math.round(readiness);

    readiness = Math.round(readiness);

    container.innerHTML = `
      ${!this.state.userName ? `
        <div class="card mb-4" style="background:var(--gradient-primary);color:white;border:none">
          <h2 style="margin-bottom:12px">Welcome to the CCAR-F Course</h2>
          <p style="margin-bottom:16px;opacity:0.9">What should we call you? We'll use this for your completion certificate.</p>
          <div style="display:flex;gap:12px">
            <input type="text" id="user-name-input" placeholder="Your Name" style="padding:10px 16px;border-radius:4px;border:none;flex:1;max-width:300px">
            <button class="btn btn-secondary" onclick="App.saveName()" style="background:white;color:var(--accent-purple);border:none">Save Name</button>
          </div>
        </div>
      ` : `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
          <h2 style="font-weight:700">Welcome back, ${this.state.userName}!</h2>
          ${readiness >= 70 ? `
            <button class="btn" style="background:var(--accent-green);color:white" onclick="App.showCertificate()">🏆 View Certificate</button>
          ` : '<span style="font-size:0.85rem;color:var(--text-muted)">Reach 70% readiness to unlock your certificate</span>'}
        </div>
      `}
      <div class="dashboard-hero">
        <div style="display:flex;align-items:center;gap:40px;flex-wrap:wrap;">
          <div>
            <div class="readiness-score" style="background:${readiness >= 70 ? 'var(--gradient-success)' : readiness >= 40 ? 'var(--gradient-primary)' : 'var(--gradient-warm)'};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${readiness}%</div>
            <div class="readiness-label">Exam Readiness Score (Weighted)</div>
          </div>
          <div class="grid-4" style="flex:1;display:grid;">
            <div class="stat-card card">
              <div class="stat-value" style="color:var(--accent-purple)">${studiedCount}/${totalTasks}</div>
              <div class="stat-label">Topics Studied</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value" style="color:var(--accent-cyan)">${masteredCount}/${totalFlashcards}</div>
              <div class="stat-label">Cards Mastered</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value" style="color:var(--accent-yellow)">${avgScore}%</div>
              <div class="stat-label">Avg Quiz Score</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value" style="color:${lastMock && lastMock.passed ? 'var(--accent-green)' : 'var(--text-muted)'}">${lastMock ? (lastMock.passed ? '✓ PASS' : '✗ FAIL') : '—'}</div>
              <div class="stat-label">Last Mock Exam</div>
            </div>
          </div>
        </div>
      </div>

      <h3 style="font-weight:700;margin-bottom:16px;">Domain Progress</h3>
      <div class="card mb-4">
        ${STUDY_CONTENT.domains.map(domain => {
          const domainTasks = domain.taskStatements.length;
          const domainStudied = domain.taskStatements.filter(ts => this.state.studiedTasks[ts.id]).length;
          const pct = domainTasks > 0 ? Math.round((domainStudied / domainTasks) * 100) : 0;
          const domainQuizzes = quizzes.flatMap(q => q.domainScores ? [q.domainScores[domain.number]] : []).filter(Boolean);
          const domainAvgQuiz = domainQuizzes.length > 0 ? Math.round(domainQuizzes.reduce((a,b)=>a+b,0)/domainQuizzes.length) : 0;
          return `
            <div class="domain-progress-item">
              <div class="domain-progress-icon">${domain.icon}</div>
              <div class="domain-progress-info">
                <div class="domain-progress-name">${domain.title}</div>
                <div class="progress-bar domain-progress-bar">
                  <div class="progress-fill" style="width:${pct}%;background:${domain.gradient}"></div>
                </div>
                <div class="domain-progress-stats">
                  <span>${domainStudied}/${domainTasks} topics</span>
                  <span>Weight: ${domain.weight}%</span>
                  ${domainQuizzes.length > 0 ? `<span>Quiz avg: ${domainAvgQuiz}%</span>` : ''}
                </div>
              </div>
              <div class="domain-progress-pct" style="color:${domain.color}">${pct}%</div>
            </div>
          `;
        }).join('')}
      </div>

      <h3 style="font-weight:700;margin-bottom:16px;">Quick Start</h3>
      <div class="grid grid-3">
        <div class="card" style="cursor:pointer" onclick="App.navigate('study')">
          <div style="font-size:2rem;margin-bottom:8px">📖</div>
          <div style="font-weight:700;margin-bottom:4px">Study Guide</div>
          <div style="font-size:0.85rem;color:var(--text-secondary)">Review all 5 domains and 30 task statements</div>
        </div>
        <div class="card" style="cursor:pointer" onclick="App.navigate('quiz')">
          <div style="font-size:2rem;margin-bottom:8px"><i data-lucide="check-circle" style="width:24px;height:24px;margin-right:8px;vertical-align:middle;color:var(--accent-cyan)"></i></div>
          <div style="font-weight:700;margin-bottom:4px">Practice Quiz</div>
          <div style="font-size:0.85rem;color:var(--text-secondary)">Test your knowledge with 65 exam-style questions</div>
        </div>
        <div class="card" style="cursor:pointer" onclick="App.navigate('mock-exam')">
          <div style="font-size:2rem;margin-bottom:8px">🏆</div>
          <div style="font-weight:700;margin-bottom:4px">Mock Exam</div>
          <div style="font-size:0.85rem;color:var(--text-secondary)">Simulate the real exam: 60 questions, 120 min, 720 pass</div>
        </div>
      </div>
      
      <div class="card" style="margin-top:20px; border-color: rgba(6, 182, 212, 0.4);">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <div style="background: rgba(6, 182, 212, 0.15); padding:8px; border-radius:8px; color:var(--accent-cyan);">
            <i data-lucide="github"></i>
          </div>
          <div>
            <h3 style="font-weight:700;">Recommended Python Jupyter Workbooks</h3>
          </div>
        </div>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:16px;">
          One of the best Python Jupyter workbooks for Claude Certified Architect - Foundations (CCAR-F) from a public repo. Specially created for practicing CCAR-F agentic principles with hands-on AI shop assistant examples.
        </p>
        <a href="https://github.com/termidy/ccar-f" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="width:100%; justify-content:center; border-color:var(--accent-cyan); color:var(--accent-cyan); text-decoration:none;">
          <i data-lucide="external-link" style="width:16px;height:16px;margin-right:8px;"></i> View GitHub Repository
        </a>
      </div>

      ${quizzes.length > 0 ? `
        <h3 style="font-weight:700;margin:32px 0 16px;">Recent Quiz History</h3>
        <div class="card">
          ${quizzes.slice(-5).reverse().map((q, i) => `
            <div style="display:flex;align-items:center;gap:16px;padding:10px 0;${i < Math.min(4, quizzes.length-1) ? 'border-bottom:1px solid var(--border-color)' : ''}">
              <div style="font-weight:700;color:${q.score >= 72 ? 'var(--accent-green)' : 'var(--accent-red)'}">${q.score}%</div>
              <div style="flex:1;font-size:0.85rem;color:var(--text-secondary)">${q.mode === 'mock' ? '<i data-lucide="award" style="width:14px;height:14px;margin-right:4px;vertical-align:middle"></i> Mock Exam' : '<i data-lucide="check-circle" style="width:24px;height:24px;margin-right:8px;vertical-align:middle;color:var(--accent-cyan)"></i> Practice Quiz'} — ${q.totalQuestions} questions</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${new Date(q.date).toLocaleDateString()}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  },

  saveName() {
    const input = document.getElementById('user-name-input');
    if (input && input.value.trim()) {
      this.state.userName = input.value.trim();
      this.saveState();
      this.renderDashboard();
    }
  },

  showCertificate() {
    const certHTML = `
      <div class="certificate-modal" id="cert-modal" onclick="document.getElementById('cert-modal').remove()">
        <div class="certificate-card" onclick="event.stopPropagation()">
          <button style="position:absolute;top:20px;right:20px;background:none;border:none;font-size:1.5rem;cursor:pointer" onclick="document.getElementById('cert-modal').remove()">×</button>
          <div class="cert-seal">CCAR-F</div>
          <div class="cert-title">Certificate of Completion</div>
          <div class="cert-subtitle">This certifies that</div>
          <div class="cert-name">${this.state.userName}</div>
          <div class="cert-details">
            Has successfully completed the interactive preparation course and demonstrated<br>
            foundational knowledge in Agentic Architecture, Model Context Protocol, and Claude Code.
          </div>
          <div class="cert-footer">
            <div>Date: ${new Date().toLocaleDateString()}</div>
            <div>Course: Claude Certified Architect Foundations</div>
          </div>
          <button class="btn btn-primary" style="margin-top:40px" onclick="window.print()">🖨️ Print Certificate</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', certHTML);
  }
};

// ============================================================
// Interactive Course Module
// ============================================================
const Course = {
  currentLessonIndex: 0,
  terminalTimeouts: [],

  renderSetup() {
    this.clearTimeouts();
    const container = document.getElementById('course-content');
    const headerProgress = document.getElementById('course-progress-header');
    if (!container) return;

    const completed = Object.keys(App.state.courseProgress || {}).filter(k => App.state.courseProgress[k]).length;
    const total = COURSE_DATA.length;
    if (headerProgress) headerProgress.innerHTML = `<div class="badge" style="background:var(--accent-purple);color:white;font-size:1rem">${completed}/${total} Completed</div>`;

    container.innerHTML = `
      <div class="grid grid-3">
        ${COURSE_DATA.map((lesson, index) => {
          const isDone = App.state.courseProgress && App.state.courseProgress[lesson.id];
          return `
            <div class="card" style="cursor:pointer;border-left:4px solid ${isDone ? 'var(--accent-green)' : 'var(--border-color)'}" onclick="Course.renderLesson(${index})">
              <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px">Domain ${lesson.domain}</div>
              <div style="font-weight:700;margin-bottom:12px;line-height:1.4">${lesson.title}</div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span class="badge ${isDone ? 'badge-green' : ''}">${isDone ? '✅ Completed' : 'Start Lesson'}</span>
              </div>
            </div>
          `;
        }).join('')}
        
      </div>
    `;
  },

  renderLesson(index) {
    this.clearTimeouts();
    this.currentLessonIndex = index;
    const lesson = COURSE_DATA[index];
    const container = document.getElementById('course-content');
    const headerProgress = document.getElementById('course-progress-header');
    if (!lesson || !container) return;

    if (headerProgress) headerProgress.innerHTML = `<button class="btn btn-secondary btn-sm" onclick="Course.renderSetup()">← Back to Course Hub</button>`;

    const isDone = App.state.courseProgress && App.state.courseProgress[lesson.id];

    container.innerHTML = `
      <div class="card" style="max-width:900px;margin:0 auto;padding:40px">
        <div class="badge mb-3" style="background:var(--accent-purple);color:white">Domain ${lesson.domain}</div>
        <h2 style="font-weight:800;font-size:1.8rem;margin-bottom:24px">${lesson.title}</h2>
        <div style="font-size:1.05rem;line-height:1.7;color:var(--text-secondary);margin-bottom:32px">
          ${lesson.content}
        </div>

        <h3 style="font-weight:700;margin-bottom:16px">Simulated Architecture Terminal</h3>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-size:0.9rem;color:var(--text-muted)">Prompt: "${lesson.terminalDemo.prompt}"</div>
          <button class="btn btn-primary btn-sm" onclick="Course.runDemo()">▶ Run Demo</button>
        </div>
        
        <div class="cli-terminal">
          <div class="cli-header">
            <div class="cli-dot red"></div><div class="cli-dot yellow"></div><div class="cli-dot green"></div>
            <div class="cli-title">antigravity@claude-agent:~</div>
          </div>
          <div class="cli-body" id="cli-output">
            <div style="color:#8b949e">Ready. Click 'Run Demo' to execute agent workflow.</div>
          </div>
        </div>

        <div style="margin-top:40px;padding-top:32px;border-top:1px solid var(--border-color)">
          <h3 style="font-weight:700;margin-bottom:16px">Knowledge Check</h3>
          <div style="font-size:1rem;margin-bottom:20px">${lesson.knowledgeCheck.question}</div>
          <div class="quiz-options" id="course-kc-options">
            ${lesson.knowledgeCheck.options.map(opt => `
              <div class="quiz-option" id="kc-opt-${opt.id}" onclick="Course.checkAnswer('${opt.id}')">
                <div class="quiz-option-letter">${opt.id.toUpperCase()}</div>
                <div class="quiz-option-text">${opt.text}</div>
              </div>
            `).join('')}
          </div>
          <div id="kc-feedback" style="margin-top:20px;display:none"></div>
        </div>

        <div style="display:flex;justify-content:space-between;margin-top:40px">
          <button class="btn btn-secondary" ${index === 0 ? 'disabled style="opacity:0.4"' : ''} onclick="Course.renderLesson(${index - 1})">← Previous Lesson</button>
          ${index < COURSE_DATA.length - 1 ? 
            `<button class="btn btn-primary" onclick="Course.renderLesson(${index + 1})">Next Lesson →</button>` : 
            `<button class="btn btn-success" onclick="Course.renderSetup()">Finish Course 🏆</button>`
          }
        </div>
      </div>
    `;

    // If already done, mark it visually
    if (isDone) {
      const correctOpt = lesson.knowledgeCheck.correctAnswer;
      const optEl = document.getElementById(`kc-opt-${correctOpt}`);
      if (optEl) optEl.classList.add('correct');
      const fb = document.getElementById('kc-feedback');
      if (fb) {
        fb.style.display = 'block';
        fb.innerHTML = `<div style="padding:12px 16px;background:rgba(16,185,129,0.1);border-left:3px solid var(--accent-green);color:var(--accent-green);font-weight:600">✅ Lesson Completed!</div>`;
      }
    }
  },

  runDemo() {
    this.clearTimeouts();
    const output = document.getElementById('cli-output');
    if (!output) return;
    const lesson = COURSE_DATA[this.currentLessonIndex];
    
    output.innerHTML = '';
    let cumulativeDelay = 0;

    lesson.terminalDemo.logs.forEach(log => {
      cumulativeDelay += log.delay;
      const timeout = setTimeout(() => {
        const line = document.createElement('div');
        line.className = `cli-line ${log.type}`;
        line.textContent = log.text;
        
        // Remove old cursor
        const oldCursor = document.querySelector('.cli-cursor');
        if (oldCursor) oldCursor.remove();
        
        output.appendChild(line);
        
        // Add new cursor
        const cursor = document.createElement('span');
        cursor.className = 'cli-cursor';
        output.appendChild(cursor);
        
        // Auto scroll
        output.scrollTop = output.scrollHeight;
      }, cumulativeDelay);
      this.terminalTimeouts.push(timeout);
    });

    // Remove cursor at end
    const finalTimeout = setTimeout(() => {
      const oldCursor = document.querySelector('.cli-cursor');
      if (oldCursor) oldCursor.remove();
    }, cumulativeDelay + 500);
    this.terminalTimeouts.push(finalTimeout);
  },

  clearTimeouts() {
    this.terminalTimeouts.forEach(t => clearTimeout(t));
    this.terminalTimeouts = [];
  },

  checkAnswer(optId) {
    const lesson = COURSE_DATA[this.currentLessonIndex];
    const fb = document.getElementById('kc-feedback');
    
    // Reset classes
    lesson.knowledgeCheck.options.forEach(o => {
      const el = document.getElementById(`kc-opt-${o.id}`);
      if (el) { el.classList.remove('selected', 'correct', 'incorrect'); }
    });

    const selectedEl = document.getElementById(`kc-opt-${optId}`);
    
    if (optId === lesson.knowledgeCheck.correctAnswer) {
      if (selectedEl) selectedEl.classList.add('correct');
      fb.style.display = 'block';
      fb.innerHTML = `<div style="padding:12px 16px;background:rgba(16,185,129,0.1);border-left:3px solid var(--accent-green);color:var(--accent-green);font-weight:600">✅ Correct! Lesson completed.</div>`;
      
      // Save progress
      if (!App.state.courseProgress) App.state.courseProgress = {};
      App.state.courseProgress[lesson.id] = true;
      App.saveState();
      
      // Update dashboard if needed
      App.loadState(); 
    } else {
      if (selectedEl) selectedEl.classList.add('incorrect');
      fb.style.display = 'block';
      fb.innerHTML = `<div style="padding:12px 16px;background:rgba(239,68,68,0.1);border-left:3px solid var(--accent-red);color:var(--accent-red);font-weight:600">❌ Incorrect. Please try again.</div>`;
    }
  }
};

// ============================================================
// Study Guide Module
// ============================================================
const StudyGuide = {
  currentDomain: null,

  render() {
    const container = document.getElementById('study-content');
    if (!container) return;
    if (this.currentDomain) {
      this.renderDomain(this.currentDomain);
      return;
    }
    container.innerHTML = `
      <div class="grid grid-2">
        ${STUDY_CONTENT.domains.map(domain => {
          const total = domain.taskStatements.length;
          const studied = domain.taskStatements.filter(ts => App.state.studiedTasks[ts.id]).length;
          const pct = Math.round((studied / total) * 100);
          return `
            <div class="card domain-card" style="border-left-color:${domain.color}" onclick="StudyGuide.currentDomain=${domain.number};StudyGuide.render()">
              <div class="domain-card-header">
                <div class="domain-card-icon">${domain.icon}</div>
                <div>
                  <div class="domain-card-title">Domain ${domain.number}: ${domain.title}</div>
                </div>
                <div class="domain-card-weight badge" style="background:${domain.color}20;color:${domain.color}">${domain.weight}%</div>
              </div>
              <div class="domain-card-desc">${domain.description}</div>
              <div class="domain-card-meta">
                <span>${total} task statements</span>
                <span style="color:${domain.color}">${studied}/${total} studied (${pct}%)</span>
              </div>
              <div class="progress-bar" style="margin-top:12px">
                <div class="progress-fill" style="width:${pct}%;background:${domain.gradient}"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderDomain(domainNum) {
    const container = document.getElementById('study-content');
    const domain = STUDY_CONTENT.domains.find(d => d.number === domainNum);
    if (!domain || !container) return;

    container.innerHTML = `
      <div style="margin-bottom:24px">
        <button class="btn btn-secondary btn-sm" onclick="StudyGuide.currentDomain=null;StudyGuide.render()">← Back to Domains</button>
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
        <div style="font-size:2.5rem">${domain.icon}</div>
        <div>
          <h2 style="font-weight:800;font-size:1.5rem">Domain ${domain.number}: ${domain.title}</h2>
          <div style="color:var(--text-secondary);font-size:0.9rem;margin-top:4px">${domain.description}</div>
        </div>
        <div class="badge" style="background:${domain.color}20;color:${domain.color};margin-left:auto;font-size:1rem;padding:6px 14px">${domain.weight}%</div>
      </div>
      <div id="task-statements-list">
        ${domain.taskStatements.map(ts => {
          const isStudied = App.state.studiedTasks[ts.id];
          return `
            <div class="task-statement" id="ts-${ts.id}">
              <div class="ts-header" onclick="StudyGuide.toggleTask('${ts.id}')">
                <span class="ts-toggle" id="toggle-${ts.id}">▶</span>
                <span class="ts-title">${ts.title}</span>
                <span class="ts-studied ${isStudied ? 'studied' : 'not-studied'}" onclick="event.stopPropagation();StudyGuide.toggleStudied('${ts.id}')" id="studied-${ts.id}">
                  ${isStudied ? '✓ Studied' : 'Mark Studied'}
                </span>
              </div>
              <div class="ts-content" id="content-${ts.id}">
                <div class="ts-section-title" style="color:${domain.color}"><i data-lucide="book-open" style="width:16px;height:16px;margin-right:8px;vertical-align:middle"></i> Knowledge Of</div>
                <ul class="ts-list">
                  ${ts.knowledge.map(k => `<li>${k}</li>`).join('')}
                </ul>
                <div class="ts-section-title" style="color:${domain.color}">🛠️ Skills In</div>
                <ul class="ts-list">
                  ${ts.skills.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  toggleTask(tsId) {
    const content = document.getElementById(`content-${tsId}`);
    const toggle = document.getElementById(`toggle-${tsId}`);
    if (content && toggle) {
      content.classList.toggle('open');
      toggle.classList.toggle('open');
    }
  },

  toggleStudied(tsId) {
    App.state.studiedTasks[tsId] = !App.state.studiedTasks[tsId];
    App.saveState();
    const el = document.getElementById(`studied-${tsId}`);
    if (el) {
      el.className = `ts-studied ${App.state.studiedTasks[tsId] ? 'studied' : 'not-studied'}`;
      el.textContent = App.state.studiedTasks[tsId] ? '✓ Studied' : 'Mark Studied';
    }
  }
};

// ============================================================
// Flashcards Module
// ============================================================
const Flashcards = {
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  filterDomain: 0,
  sessionStats: { reviewed: 0, gotIt: 0, needReview: 0 },

  init() {
    this.cards = this.getFilteredCards();
    this.shuffleCards();
    this.currentIndex = 0;
    this.isFlipped = false;
    this.sessionStats = { reviewed: 0, gotIt: 0, needReview: 0 };
    this.render();
  },

  getFilteredCards() {
    let cards = [...FLASHCARDS_DATA];
    if (this.filterDomain > 0) cards = cards.filter(c => c.domain === this.filterDomain);
    return cards;
  },

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  },

  render() {
    const container = document.getElementById('flashcards-content');
    if (!container) return;
    const card = this.cards[this.currentIndex];
    const domainInfo = STUDY_CONTENT.domains.find(d => d.number === (card ? card.domain : 1));
    const masteredCount = Object.keys(App.state.flashcardsMastered).filter(k => App.state.flashcardsMastered[k]).length;

    container.innerHTML = `
      <div class="flashcard-controls">
        <div class="filter-pills">
          <div class="filter-pill ${this.filterDomain===0?'active':''}" onclick="Flashcards.filterDomain=0;Flashcards.init()">All Domains</div>
          ${STUDY_CONTENT.domains.map(d => `
            <div class="filter-pill ${this.filterDomain===d.number?'active':''}" onclick="Flashcards.filterDomain=${d.number};Flashcards.init()">${d.icon} D${d.number}</div>
          `).join('')}
        </div>
        <div style="margin-left:auto;font-size:0.85rem;color:var(--text-muted)">${masteredCount}/${FLASHCARDS_DATA.length} mastered</div>
      </div>

      ${this.cards.length === 0 ? '<div class="card text-center" style="padding:60px"><div style="font-size:3rem;margin-bottom:16px">🎉</div><h3>All cards mastered in this set!</h3></div>' : `
        <div class="flashcard-container">
          <div class="flashcard ${this.isFlipped ? 'flipped' : ''}" onclick="Flashcards.flip()">
            <div class="flashcard-face flashcard-front">
              <div class="flashcard-domain-badge badge" style="background:${domainInfo.color}20;color:${domainInfo.color}">${domainInfo.icon} Domain ${card.domain}</div>
              <div class="flashcard-difficulty badge ${card.difficulty === 'easy' ? 'badge-green' : card.difficulty === 'medium' ? 'badge-yellow' : 'badge-red'}">${card.difficulty}</div>
              <div class="flashcard-question">${card.question}</div>
              <div class="flashcard-hint">Click to reveal answer</div>
            </div>
            <div class="flashcard-face flashcard-back">
              <div class="flashcard-domain-badge badge" style="background:${domainInfo.color}20;color:${domainInfo.color}">${domainInfo.icon} Domain ${card.domain}</div>
              <div class="flashcard-answer">${card.answer}</div>
            </div>
          </div>
        </div>

        <div class="flashcard-actions">
          <button class="flashcard-btn flashcard-btn-review" onclick="Flashcards.rate('review')">❌ Need Review</button>
          <button class="flashcard-btn flashcard-btn-got-it" onclick="Flashcards.rate('gotIt')">✅ Got It!</button>
        </div>

        <div class="flashcard-progress">Card ${this.currentIndex + 1} of ${this.cards.length}</div>
        <div class="flashcard-stats">
          <span style="color:var(--accent-green)">✅ ${this.sessionStats.gotIt}</span>
          <span style="color:var(--accent-red)">❌ ${this.sessionStats.needReview}</span>
          <span style="color:var(--text-muted)">📊 ${this.sessionStats.reviewed} reviewed</span>
        </div>
      `}
    `;
  },

  flip() {
    this.isFlipped = !this.isFlipped;
    const cardEl = document.querySelector('.flashcard');
    if (cardEl) cardEl.classList.toggle('flipped', this.isFlipped);
  },

  rate(rating) {
    const card = this.cards[this.currentIndex];
    if (!card) return;
    this.sessionStats.reviewed++;
    if (rating === 'gotIt') {
      this.sessionStats.gotIt++;
      App.state.flashcardsMastered[card.id] = true;
      delete App.state.flashcardsReview[card.id];
    } else {
      this.sessionStats.needReview++;
      App.state.flashcardsReview[card.id] = true;
      delete App.state.flashcardsMastered[card.id];
    }
    App.saveState();
    this.isFlipped = false;
    this.currentIndex++;
    if (this.currentIndex >= this.cards.length) this.currentIndex = 0;
    this.render();
  }
};

// ============================================================
// Quiz Module
// ============================================================
const Quiz = {
  questions: [],
  currentIndex: 0,
  answers: {},
  isReview: false,
  timerInterval: null,
  timeRemaining: 0,
  mode: 'practice',
  filterDomain: 0,
  questionCount: 15,

  renderSetup() {
    const container = document.getElementById('quiz-content');
    if (!container) return;
    container.innerHTML = `
      <div class="quiz-setup">
        <div class="card" style="padding:32px">
          <h3 style="font-weight:700;margin-bottom:24px;text-align:center"><i data-lucide="check-circle" style="width:24px;height:24px;margin-right:8px;vertical-align:middle;color:var(--accent-cyan)"></i> Practice Quiz Setup</h3>
          <div class="quiz-option-group">
            <label>Domain Filter</label>
            <select class="quiz-select" id="quiz-domain-filter">
              <option value="0">All Domains (Mixed)</option>
              ${STUDY_CONTENT.domains.map(d => `<option value="${d.number}">${d.icon} Domain ${d.number}: ${d.title} (${d.weight}%)</option>`).join('')}
            </select>
          </div>
          <div class="quiz-option-group">
            <label>Number of Questions</label>
            <select class="quiz-select" id="quiz-count">
              <option value="10">10 Questions (Quick)</option>
              <option value="15" selected>15 Questions (Standard)</option>
              <option value="25">25 Questions (Thorough)</option>
              <option value="0">All Available</option>
            </select>
          </div>
          <div class="quiz-option-group">
            <label>Mode</label>
            <select class="quiz-select" id="quiz-mode">
              <option value="practice">Practice (Untimed, Show Answers)</option>
              <option value="timed">Timed (2 min/question)</option>
            </select>
          </div>
          <div style="text-align:center;margin-top:24px">
            <button class="btn btn-primary btn-lg" onclick="Quiz.start()">Start Quiz →</button>
          </div>
        </div>
      </div>
    `;
  },

  start() {
    this.filterDomain = parseInt(document.getElementById('quiz-domain-filter').value);
    this.questionCount = parseInt(document.getElementById('quiz-count').value);
    this.mode = document.getElementById('quiz-mode').value;

    let qs = [...QUESTIONS_DATA];
    if (this.filterDomain > 0) qs = qs.filter(q => q.domain === this.filterDomain);
    // Shuffle
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
    this.questions = this.questionCount > 0 ? qs.slice(0, this.questionCount) : qs;
    this.currentIndex = 0;
    this.answers = {};
    this.isReview = false;

    if (this.mode === 'timed') {
      this.timeRemaining = this.questions.length * 120;
      this.startTimer();
    }
    this.renderQuestion();
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.showResults();
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const el = document.getElementById('quiz-timer');
    if (!el) return;
    const m = Math.floor(this.timeRemaining / 60);
    const s = this.timeRemaining % 60;
    el.textContent = `⏱ ${m}:${s.toString().padStart(2, '0')}`;
    el.className = `quiz-timer ${this.timeRemaining < 60 ? 'danger' : this.timeRemaining < 300 ? 'warning' : ''}`;
  },

  renderQuestion() {
    const container = document.getElementById('quiz-content');
    if (!container) return;
    const q = this.questions[this.currentIndex];
    const domainInfo = STUDY_CONTENT.domains.find(d => d.number === q.domain);
    const answered = this.answers[q.id];
    const isAnswered = answered !== undefined;

    container.innerHTML = `
      <div class="quiz-active">
        <div class="quiz-header">
          <div><strong>Question ${this.currentIndex + 1}</strong> of ${this.questions.length}</div>
          <div class="progress-bar" style="flex:1;margin:0 20px"><div class="progress-fill" style="width:${((this.currentIndex + 1) / this.questions.length) * 100}%"></div></div>
          ${this.mode === 'timed' ? '<div class="quiz-timer" id="quiz-timer"></div>' : ''}
          <button class="btn btn-secondary btn-sm" onclick="Quiz.renderSetup()">✕ Exit</button>
        </div>

        <div class="quiz-question-card">
          <div class="quiz-scenario-tag badge" style="background:${domainInfo.color}20;color:${domainInfo.color}">
            <i data-lucide="file-text" style="width:20px;height:20px;margin-right:8px;vertical-align:middle;color:var(--accent-purple)"></i> Scenario ${q.scenario}: ${q.scenarioTitle} · ${domainInfo.icon} Domain ${q.domain} · TS ${q.taskStatement}
          </div>
          <div class="quiz-question-text">${q.question}</div>
          <div class="quiz-options">
            ${q.options.map(opt => {
              let cls = 'quiz-option';
              if (isAnswered && this.mode === 'practice') {
                if (opt.id === q.correctAnswer) cls += ' correct';
                else if (opt.id === answered) cls += ' incorrect';
              } else if (answered === opt.id) {
                cls += ' selected';
              }
              return `
                <div class="${cls}" onclick="Quiz.selectAnswer('${q.id}','${opt.id}')">
                  <div class="quiz-option-letter">${opt.id.toUpperCase()}</div>
                  <div class="quiz-option-text">${opt.text}</div>
                </div>
              `;
            }).join('')}
          </div>

          ${isAnswered && this.mode === 'practice' ? `
            <div class="quiz-explanation">
              <div class="quiz-explanation-title">${answered === q.correctAnswer ? '✅ Correct!' : `❌ Incorrect — Correct answer: ${q.correctAnswer.toUpperCase()}`}</div>
              ${q.explanation}
              <div class="quiz-key-takeaway">💡 Key Takeaway: ${q.keyTakeaway}</div>
            </div>
          ` : ''}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center">
          <button class="btn btn-secondary" ${this.currentIndex === 0 ? 'disabled style="opacity:0.4"' : ''} onclick="Quiz.prev()">← Previous</button>
          ${this.currentIndex < this.questions.length - 1
            ? `<button class="btn btn-primary" onclick="Quiz.next()">Next →</button>`
            : `<button class="btn btn-success" onclick="Quiz.showResults()">Finish & See Results</button>`
          }
        </div>
      </div>
    `;
    if (this.mode === 'timed') this.updateTimerDisplay();
  },

  selectAnswer(qId, optId) {
    if (this.answers[qId] !== undefined && this.mode === 'practice') return;
    this.answers[qId] = optId;
    this.renderQuestion();
  },

  next() { if (this.currentIndex < this.questions.length - 1) { this.currentIndex++; this.renderQuestion(); } },
  prev() { if (this.currentIndex > 0) { this.currentIndex--; this.renderQuestion(); } },

  showResults() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const container = document.getElementById('quiz-content');
    if (!container) return;

    let correct = 0;
    const domainScores = {};
    const domainTotals = {};
    this.questions.forEach(q => {
      if (!domainScores[q.domain]) { domainScores[q.domain] = 0; domainTotals[q.domain] = 0; }
      domainTotals[q.domain]++;
      if (this.answers[q.id] === q.correctAnswer) { correct++; domainScores[q.domain]++; }
    });

    const score = Math.round((correct / this.questions.length) * 100);
    const scaled = Math.round(100 + (score / 100) * 900);
    const passed = scaled >= 720;

    // Save history
    const domScoresPct = {};
    Object.keys(domainScores).forEach(d => { domScoresPct[d] = Math.round((domainScores[d] / domainTotals[d]) * 100); });
    App.state.quizHistory.push({
      date: Date.now(),
      score,
      scaledScore: scaled,
      passed,
      totalQuestions: this.questions.length,
      correct,
      domainScores: domScoresPct,
      mode: this.mode
    });
    App.saveState();

    container.innerHTML = `
      <div class="quiz-results">
        <div class="card quiz-score-display">
          <div class="quiz-score-value ${passed ? 'pass' : 'fail'}">${scaled}</div>
          <div class="quiz-score-label" style="color:${passed ? 'var(--accent-green)' : 'var(--accent-red)'}">
            ${passed ? '🎉 PASSED' : '📈 Keep Studying'} — ${correct}/${this.questions.length} correct (${score}%)
          </div>
          <div style="font-size:0.85rem;color:var(--text-muted);margin-top:8px">Passing: 720/1000 • Your score: ${scaled}/1000</div>
        </div>

        <h3 style="font-weight:700;margin-bottom:16px">Score by Domain</h3>
        <div class="card mb-4">
          ${STUDY_CONTENT.domains.map(d => {
            const dCorrect = domainScores[d.number] || 0;
            const dTotal = domainTotals[d.number] || 0;
            const dPct = dTotal > 0 ? Math.round((dCorrect / dTotal) * 100) : 0;
            return dTotal > 0 ? `
              <div class="domain-progress-item">
                <div class="domain-progress-icon">${d.icon}</div>
                <div class="domain-progress-info">
                  <div class="domain-progress-name">${d.title}</div>
                  <div class="progress-bar domain-progress-bar"><div class="progress-fill" style="width:${dPct}%;background:${d.gradient}"></div></div>
                </div>
                <div class="domain-progress-pct" style="color:${d.color}">${dCorrect}/${dTotal} (${dPct}%)</div>
              </div>
            ` : '';
          }).join('')}
        </div>

        <h3 style="font-weight:700;margin-bottom:16px">Review Incorrect Answers</h3>
        ${this.questions.filter(q => this.answers[q.id] !== q.correctAnswer).map(q => {
          const domainInfo = STUDY_CONTENT.domains.find(d => d.number === q.domain);
          const userAnswer = q.options.find(o => o.id === this.answers[q.id]);
          const correctOpt = q.options.find(o => o.id === q.correctAnswer);
          return `
            <div class="card mb-2" style="border-left:3px solid var(--accent-red)">
              <div class="badge mb-1" style="background:${domainInfo.color}20;color:${domainInfo.color}">${domainInfo.icon} D${q.domain} · TS ${q.taskStatement}</div>
              <div style="font-weight:600;font-size:0.9rem;margin-bottom:12px;line-height:1.6">${q.question}</div>
              ${userAnswer ? `<div style="padding:8px 12px;background:rgba(239,68,68,0.06);border-left:3px solid var(--accent-red);border-radius:0 4px 4px 0;margin-bottom:8px;font-size:0.85rem"><strong>Your answer:</strong> ${userAnswer.text}</div>` : '<div style="padding:8px 12px;background:rgba(239,68,68,0.06);border-left:3px solid var(--accent-red);border-radius:0 4px 4px 0;margin-bottom:8px;font-size:0.85rem"><strong>Not answered</strong></div>'}
              <div style="padding:8px 12px;background:rgba(16,185,129,0.06);border-left:3px solid var(--accent-green);border-radius:0 4px 4px 0;margin-bottom:8px;font-size:0.85rem"><strong>Correct:</strong> ${correctOpt.text}</div>
              <div class="quiz-key-takeaway">💡 ${q.keyTakeaway}</div>
            </div>
          `;
        }).join('') || '<div class="card text-center" style="padding:24px;color:var(--accent-green)">🎉 All answers correct!</div>'}

        <div style="text-align:center;margin-top:24px" class="btn-group" style="justify-content:center">
          <button class="btn btn-primary" onclick="Quiz.renderSetup()">New Quiz</button>
          <button class="btn btn-secondary" onclick="App.navigate('dashboard')">Dashboard</button>
        </div>
      </div>
    `;
    if (passed) this.triggerConfetti();
  },

  triggerConfetti() {
    const colors = ['#8B5CF6','#06B6D4','#10B981','#F59E0B','#EF4444','#EC4899'];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDelay = Math.random() * 2 + 's';
      el.style.animationDuration = (2 + Math.random() * 2) + 's';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  }
};

// ============================================================
// Scenarios Module
// ============================================================
const Scenarios = {
  currentScenario: null,

  renderList() {
    const container = document.getElementById('scenarios-content');
    if (!container) return;
    if (this.currentScenario) { this.renderDetail(this.currentScenario); return; }
    container.innerHTML = `
      <div class="grid grid-2">
        ${SCENARIOS_DATA.map(s => `
          <div class="card scenario-card" style="border-left-color:${s.color}" onclick="Scenarios.currentScenario=${s.id};Scenarios.renderList()">
            <div class="scenario-header">
              <div class="scenario-icon">${s.icon}</div>
              <div>
                <div class="scenario-title">Scenario ${s.id}: ${s.title}</div>
              </div>
            </div>
            <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:12px;line-height:1.6">${s.description.substring(0, 150)}...</div>
            <div class="scenario-domains">
              ${s.domainLabels.map((l, i) => `<span class="badge badge-${['purple','cyan','green','yellow','red'][s.primaryDomains[i]-1]}">${l}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderDetail(scenarioId) {
    const container = document.getElementById('scenarios-content');
    const s = SCENARIOS_DATA.find(sc => sc.id === scenarioId);
    if (!s || !container) return;

    container.innerHTML = `
      <div class="scenario-detail">
        <button class="btn btn-secondary btn-sm mb-3" onclick="Scenarios.currentScenario=null;Scenarios.renderList()">← Back to Scenarios</button>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
          <div style="font-size:3rem">${s.icon}</div>
          <div>
            <h2 style="font-weight:800">Scenario ${s.id}: ${s.title}</h2>
            <div class="scenario-domains" style="margin-top:8px">
              ${s.domainLabels.map((l, i) => `<span class="badge badge-${['purple','cyan','green','yellow','red'][s.primaryDomains[i]-1]}">${l}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="scenario-desc">${s.description}</div>

        <h3 style="font-weight:700;margin-bottom:16px">🧰 Key Tools</h3>
        <div class="flex flex-wrap gap-1 mb-4">
          ${s.keyTools.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>

        <h3 style="font-weight:700;margin-bottom:16px"><i data-lucide="target" style="width:16px;height:16px;margin-right:4px;vertical-align:middle"></i> Interactive Decision Points</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px">Think about each situation, then click "Reveal" to see the correct approach and the underlying principle.</p>
        ${s.decisionPoints.map((dp, i) => `
          <div class="decision-point" id="dp-${s.id}-${i}">
            <div class="dp-situation">💭 ${dp.situation}</div>
            <button class="dp-reveal-btn" onclick="Scenarios.reveal(${s.id},${i})">🔍 Reveal Answer</button>
            <div class="dp-choices" id="dp-choices-${s.id}-${i}">
              <div class="dp-correct"><strong>✅ Correct:</strong> ${dp.correctDecision}</div>
              <div class="dp-wrong"><strong>❌ Common Mistake:</strong> ${dp.wrongApproach}</div>
              <div class="dp-principle"><strong>💡 Principle:</strong> ${dp.principle}</div>
            </div>
          </div>
        `).join('')}

        <h3 style="font-weight:700;margin:32px 0 16px"><i data-lucide="check-circle" style="width:24px;height:24px;margin-right:8px;vertical-align:middle;color:var(--accent-cyan)"></i> Related Practice Questions</h3>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="Scenarios.currentScenario=null;document.getElementById('quiz-domain-filter')||true;App.navigate('quiz')">Practice Quiz for This Scenario →</button>
        </div>
      </div>
    `;
  },

  reveal(scenarioId, dpIndex) {
    const el = document.getElementById(`dp-choices-${scenarioId}-${dpIndex}`);
    if (el) el.classList.add('revealed');
  }
};

// ============================================================
// Cheatsheets Module
// ============================================================
const Cheatsheets = {
  render() {
    const container = document.getElementById('cheatsheets-content');
    if (!container) return;
    container.innerHTML = `
      <div style="margin-bottom:16px;font-size:0.85rem;color:var(--text-secondary)">Printable quick-reference cards for each domain. Press Ctrl+P to print.</div>
      <div class="grid grid-2">
        ${CHEATSHEETS_DATA.map(cs => {
          const domain = STUDY_CONTENT.domains.find(d => d.number === cs.domain);
          return `
            <div class="card cheatsheet-card" style="border-top-color:${cs.color}">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                <span style="font-size:1.5rem">${cs.icon}</span>
                <div>
                  <div style="font-weight:700;font-size:0.95rem">Domain ${cs.domain}: ${cs.title}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted)">${domain.weight}% of exam</div>
                </div>
              </div>
              ${cs.sections.map(sec => `
                <div class="cheatsheet-section">
                  <div class="cheatsheet-section-title" style="color:${cs.color}">${sec.title}</div>
                  <ul class="cheatsheet-items">
                    ${sec.items.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

// ============================================================
// Mock Exam Module
// ============================================================
const MockExam = {
  renderSetup() {
    const container = document.getElementById('mock-exam-content');
    if (!container) return;
    const history = App.state.mockExamHistory || [];

    container.innerHTML = `
      <div class="mock-exam-setup">
        <div class="card" style="padding:40px">
          <div style="font-size:4rem;margin-bottom:16px">🏆</div>
          <h2 style="font-weight:800;margin-bottom:8px">Mock Exam Simulator</h2>
          <p style="color:var(--text-secondary);margin-bottom:24px">Simulates the real CCAR-F exam experience</p>
          <div class="mock-exam-info">
            <div class="mock-info-item">
              <div class="mock-info-value">60</div>
              <div class="mock-info-label">Questions</div>
            </div>
            <div class="mock-info-item">
              <div class="mock-info-value">120</div>
              <div class="mock-info-label">Minutes</div>
            </div>
            <div class="mock-info-item">
              <div class="mock-info-value">720</div>
              <div class="mock-info-label">Pass Score</div>
            </div>
          </div>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:24px">Questions are distributed by domain weight: D1 (27%), D2 (18%), D3 (20%), D4 (20%), D5 (15%)</p>
          <button class="btn btn-primary btn-lg" onclick="MockExam.start()">🚀 Start Mock Exam</button>
        </div>
        ${history.length > 0 ? `
          <div class="card mt-3">
            <h3 style="font-weight:700;margin-bottom:16px">Past Mock Exams</h3>
            ${history.slice(-5).reverse().map(h => `
              <div style="display:flex;align-items:center;gap:16px;padding:10px 0;border-bottom:1px solid var(--border-color)">
                <div style="font-weight:700;font-size:1.1rem;color:${h.passed ? 'var(--accent-green)' : 'var(--accent-red)'}">${h.scaledScore}</div>
                <div style="flex:1;font-size:0.85rem;color:var(--text-secondary)">${h.correct}/${h.totalQuestions} correct (${h.score}%)</div>
                <div style="font-weight:600;color:${h.passed ? 'var(--accent-green)' : 'var(--accent-red)'}">${h.passed ? 'PASS' : 'FAIL'}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${new Date(h.date).toLocaleDateString()}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  },

  start() {
    // Distribute by domain weight
    const allQs = [...QUESTIONS_DATA];
    const targets = { 1: 16, 2: 11, 3: 12, 4: 12, 5: 9 };
    let selected = [];
    Object.entries(targets).forEach(([domain, count]) => {
      let domainQs = allQs.filter(q => q.domain === parseInt(domain));
      for (let i = domainQs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [domainQs[i], domainQs[j]] = [domainQs[j], domainQs[i]];
      }
      selected = selected.concat(domainQs.slice(0, count));
    });
    // Shuffle all selected
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }

    Quiz.questions = selected;
    Quiz.currentIndex = 0;
    Quiz.answers = {};
    Quiz.isReview = false;
    Quiz.mode = 'timed';
    Quiz.timeRemaining = 7200; // 120 minutes
    Quiz.startTimer();

    // Switch to quiz module
    App.navigate('quiz');
    Quiz.renderQuestion();
  }
};

// ============================================================
// Initialize
// ============================================================
document.addEventListener('DOMContentLoaded', () => App.init());
