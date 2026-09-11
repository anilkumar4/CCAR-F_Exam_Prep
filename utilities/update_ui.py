import re

filepath = r'c:\Users\ANIL\Downloads\Claude-Code-Architect\docs\js\app.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Emojis to lucide icons
replacements = {
    '🧠': '<i data-lucide="brain" style="width:32px;height:32px;margin-bottom:8px;color:var(--accent-purple)"></i>',
    '📚': '<i data-lucide="book-open" style="width:16px;height:16px;margin-right:8px;vertical-align:middle"></i>',
    '📝': '<i data-lucide="check-circle" style="width:24px;height:24px;margin-right:8px;vertical-align:middle;color:var(--accent-cyan)"></i>',
    '🎯': '<i data-lucide="target" style="width:16px;height:16px;margin-right:4px;vertical-align:middle"></i>',
    '⚡': '<i data-lucide="zap" style="width:20px;height:20px;margin-right:8px;vertical-align:middle;color:var(--accent-yellow)"></i>',
    '📋': '<i data-lucide="file-text" style="width:20px;height:20px;margin-right:8px;vertical-align:middle;color:var(--accent-purple)"></i>',
    '🏆 Mock Exam': '<i data-lucide="award" style="width:14px;height:14px;margin-right:4px;vertical-align:middle"></i> Mock Exam',
    '📝 Practice Quiz': '<i data-lucide="check-circle" style="width:14px;height:14px;margin-right:4px;vertical-align:middle"></i> Practice Quiz'
}

for emoji, html in replacements.items():
    text = text.replace(emoji, html)

# Remove the Coming soon block
text = re.sub(r'\$\{COURSE_DATA\.length < 30 \? `.*?` : \'\'\}', '', text, flags=re.DOTALL)

# Inject lucide.createIcons() into render methods. A hacky but reliable way is to add it to switchModule
text = text.replace("modules.forEach(m => m.classList.remove('active'));", 
    "modules.forEach(m => m.classList.remove('active'));\n    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 50);")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated app.js icons and removed coming soon block.')
