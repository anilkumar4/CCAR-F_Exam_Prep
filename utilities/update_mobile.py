import re

filepath = r'c:\Users\ANIL\Downloads\Claude-Code-Architect\docs\js\app.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Inject Mobile Bindings into init()
init_code = """
    // Mobile navigation bindings
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');
    if (mobileBtn && sidebarOverlay) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
      });
      sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      });
    }
"""
text = text.replace("document.querySelectorAll('.nav-item').forEach(item => {", init_code + "\n    document.querySelectorAll('.nav-item').forEach(item => {")

# 2. Auto-close sidebar on navigate in switchModule()
close_code = """
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebar && sidebarOverlay) {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    }
"""
text = text.replace("document.getElementById(`module-${moduleId}`).classList.add('active');", close_code + "\n    document.getElementById(`module-${moduleId}`).classList.add('active');")

# 3. Add GitHub Resource Card to Dashboard
card_code = """
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
            <a href="https://github.com/termidy/ccar-f" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="width:100%; justify-content:center; border-color:var(--accent-cyan); color:var(--accent-cyan);">
              <i data-lucide="external-link"></i> View GitHub Repository
            </a>
          </div>
"""
# Find where the dashboard renders the readiness card, and append this right after it.
# We'll inject it into the return string of renderDashboard()
text = text.replace("</div>\\n        </div>\\n      </div>\\n    `;", "</div>\\n        </div>\\n      </div>\\n" + card_code + "    `;")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully applied mobile bindings and GitHub resource card.')
