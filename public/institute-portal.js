// ── CONFIG ────────────────────────────────────────────────────
const API = "https://campuspp-f7qx.onrender.com"; // ✅ Fixed: was window.location.origin
let token = localStorage.getItem('inst_token') || '';
let instData = null;
let allStudents = [];
let currentFacultyId = '';

// ── UTILS ─────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function toast(msg, type = 'info') {
  const c = $('toastContainer');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${msg}`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'fadeOut .3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

function fmt(val, fallback = 'N/A') { return val ?? fallback; }

function fmtDate(d) {
  if (!d) return 'N/A';
  try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return 'N/A'; }
}

function riskBadge(r) {
  if (!r) return '<span class="badge badge-gray">N/A</span>';
  const m = { Low: 'low', Medium: 'medium', High: 'high' };
  const c = m[r] || 'gray';
  return `<span class="badge badge-${c}">${r}</span>`;
}

function avatar(name) { return (name || '?').charAt(0).toUpperCase(); }

// ── IMPROVED apiFetch ─────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      method: opts.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(opts.headers || {}),
      },
      body: opts.body,
    });

    // ✅ Safe JSON parsing — handles non-JSON responses
    const rawText = await res.text();
    let json = {};
    if (rawText) {
      try { json = JSON.parse(rawText); }
      catch {
        console.error('[apiFetch] Non-JSON response from', path, ':', rawText.substring(0, 200));
        throw new Error('Server returned an invalid response');
      }
    }

    // ✅ Auto-logout on 401
    if (res.status === 401) {
      console.warn('[apiFetch] 401 Unauthorized —', path);
      toast('Session expired. Please log in again.', 'error');
      logout();
      throw new Error('Session expired');
    }

    if (!res.ok) {
      console.error(`[apiFetch] ${res.status} ${path}:`, json);
      throw new Error(json.message || `Request failed (${res.status})`);
    }

    console.debug('[apiFetch] ✓', path, json);
    return json;

  } catch (err) {
    // ✅ Catch network-level errors (no connection / CORS / DNS)
    if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
      console.error('[apiFetch] Network error:', err);
      toast('Network error — server unreachable', 'error');
      throw new Error('Network error — check your connection');
    }
    throw err;
  }
}

// ── AUTH ──────────────────────────────────────────────────────
async function doLogin() {
  const email = $('loginEmail').value.trim();
  const pw    = $('loginPassword').value;
  const err   = $('loginError');
  const btn   = $('loginBtn');

  err.style.display = 'none';
  if (!email || !pw) {
    err.textContent = 'Please enter email and password';
    err.style.display = 'block';
    return;
  }

  btn.innerHTML = '<span class="spinner"></span>Signing in…';
  btn.disabled = true;

  try {
    const r = await apiFetch('/api/auth/insti-login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pw }),
    });

    token = r.token;
    localStorage.setItem('inst_token', token);
    instData = r.user;
    console.log('[Auth] Login successful. Role:', r.user?.role);
    initApp(r.user);

  } catch (e) {
    err.textContent = e.message || 'Login failed';
    err.style.display = 'block';
  } finally {
    btn.innerHTML = 'Sign In to Portal';
    btn.disabled = false;
  }
}

function initApp(u) {
  $('loginPage').classList.add('hidden');
  $('app').classList.remove('hidden');
  $('sidebarInstName').textContent = u.instituteName || '';
  $('sidebarName').textContent     = u.name || u.email;
  $('sidebarRole').textContent     = u.role || 'Admin';
  $('sidebarAvatar').textContent   = avatar(u.name || u.email);

  // ✅ Load all data after login
  loadDashboard();
  loadStudents();
  loadFaculty();
}

function logout() {
  localStorage.removeItem('inst_token');
  token = '';
  instData = null;
  allStudents = [];
  if ($('app')) $('app').classList.add('hidden');
  if ($('loginPage')) $('loginPage').classList.remove('hidden');
}

// ── NAVIGATION ────────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  $(`page-${name}`).classList.add('active');
  $(`nav-${name}`).classList.add('active');
}

// ── DASHBOARD ─────────────────────────────────────────────────
async function loadDashboard() {
  try {
    const r = await apiFetch('/api/faculty/admin/institute-info');
    const d = r?.data || {};
    const stats = d.stats || {};
    const inst  = d.institute || {};

    $('statStudents').textContent = stats.totalStudents     ?? '—';
    $('statFaculty').textContent  = stats.totalFaculty      ?? '—';
    $('statRisk').textContent     = stats.highRiskStudents  ?? '—';
    $('statInst').textContent     = inst.instituteId        ?? '—';

    document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('loading-pulse'));
  } catch (e) {
    toast('Could not load dashboard stats: ' + e.message, 'error');
  }
}

function refreshDashboardTable() {
  const tbody = $('dashStudentTable');
  const slice = allStudents.slice(0, 8);
  if (!slice.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">No students yet.</td></tr>';
    return;
  }
  tbody.innerHTML = slice.map(s => `
    <tr>
      <td><b>${fmt(s.name)}</b></td>
      <td><code style="font-size:12px;color:var(--accent2)">${fmt(s.studentId)}</code></td>
      <td>${fmt(s.Course)}</td>
      <td>${fmt(s.classes)}</td>
      <td>${s.performance ? riskBadge(s.performance.riskLevel) : '<span class="badge badge-gray">N/A</span>'}</td>
    </tr>`).join('');
}

// ── STUDENTS ──────────────────────────────────────────────────
async function loadStudents() {
  try {
    const r = await apiFetch('/api/faculty/students');
    allStudents = Array.isArray(r?.data) ? r.data : [];
    renderStudentsTable(allStudents);
    refreshDashboardTable();
    $('studentCount').textContent = `${allStudents.length} student${allStudents.length !== 1 ? 's' : ''}`;
  } catch (e) {
    $('studentsTable').innerHTML = `<tr><td colspan="8" class="no-data" style="color:var(--red)">Error: ${e.message}</td></tr>`;
    toast('Failed to load students: ' + e.message, 'error');
  }
}

function renderStudentsTable(list) {
  const tbody = $('studentsTable');
  if (!list?.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">No students found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(s => {
    const assignedNodes = (s.assignedFaculty || [])
      .map(f => `<span class="badge badge-purple" style="font-size:10px;margin:2px">${f.facultyName || 'Staff'}</span>`)
      .join('');
    return `
    <tr>
      <td><b>${fmt(s.name)}</b><br><span style="font-size:11px;color:var(--muted)">${fmt(s.email)}</span></td>
      <td><code style="font-size:12px;color:var(--accent2)">${fmt(s.studentId)}</code></td>
      <td>${fmt(s.Course)}</td>
      <td>${fmt(s.classes)}</td>
      <td>${fmtDate(s.dateOfJoin)}</td>
      <td>${s.performance ? riskBadge(s.performance.riskLevel) : '<span class="badge badge-gray">N/A</span>'}</td>
      <td><div style="max-width:150px;display:flex;flex-wrap:wrap">${assignedNodes || '<span style="color:var(--muted);font-size:12px">None</span>'}</div></td>
      <td><button class="btn-sm btn-accent" onclick="quickLookup('${s.studentId}')">View</button></td>
    </tr>`;
  }).join('');
}

function filterStudents() {
  const q = ($('studentSearch').value || '').toLowerCase();
  const filtered = allStudents.filter(s =>
    (s.name || '').toLowerCase().includes(q) ||
    (s.studentId || '').toLowerCase().includes(q) ||
    (s.Course || '').toLowerCase().includes(q)
  );
  renderStudentsTable(filtered);
}

function quickLookup(sid) {
  showPage('lookup');
  $('lookupInput').value = sid;
  lookupStudent();
}

// ── STUDENT LOOKUP ────────────────────────────────────────────
async function lookupStudent() {
  const sid = ($('lookupInput').value || '').trim();
  if (!sid) { toast('Enter a Student ID first', 'error'); return; }

  const btn = $('lookupBtn');
  const res = $('studentResult');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  res.innerHTML = '<div class="no-data loading-pulse" style="padding:40px">Fetching student data…</div>';
  res.classList.remove('hidden');

  try {
    const r = await apiFetch(`/api/faculty/admin/student/${encodeURIComponent(sid)}`);
    const data = r?.data || r;
    if (!data?.profile) throw new Error('Student not found or incomplete data returned');
    renderStudentData(data);
  } catch (e) {
    res.innerHTML = `
      <div class="card" style="padding:30px;text-align:center">
        <div style="font-size:40px;margin-bottom:12px">🔍</div>
        <p style="color:var(--red);font-weight:600">${e.message}</p>
        <p style="color:var(--muted);font-size:13px;margin-top:6px">Check the student ID and try again.</p>
      </div>`;
  } finally {
    btn.innerHTML = 'Lookup';
    btn.disabled = false;
  }
}

function renderStudentData(d) {
  const p    = d.profile || {};
  const perf = d.performance || null;
  const pi   = perf?.predictiveIntelligence || {};
  const rew  = d.rewards || null;
  const lps      = Array.isArray(d.learningPaths)  ? d.learningPaths  : [];
  const quizzes  = Array.isArray(d.quizScores)      ? d.quizScores      : [];
  const interviews = Array.isArray(d.mockInterviews) ? d.mockInterviews : [];

  const riskColor = { Low: 'var(--green)', Medium: 'var(--yellow)', High: 'var(--red)' }[perf?.riskLevel] || 'var(--muted)';
  const score = perf?.score ?? 0;
  const risk  = perf?.riskLevel || 'N/A';

  const html = `
  <div class="student-profile-header">
    <div class="student-avatar">${p.profilePhoto ? `<img src="${p.profilePhoto}" alt="photo"/>` : avatar(p.name)}</div>
    <div class="student-meta">
      <h2>${fmt(p.name)}</h2>
      <div class="sid">🆔 ${fmt(p.studentId)}</div>
      <div class="tags">
        <span class="badge badge-blue">${fmt(p.Course)}</span>
        <span class="badge badge-purple">Class ${fmt(p.classes)}</span>
        <span class="badge badge-gray">${fmt(p.language)}</span>
        ${rew ? `<span class="badge" style="background:rgba(245,158,11,.15);color:var(--yellow)">⭐ Level ${rew.level} — ${rew.levelTitle}</span>` : ''}
      </div>
    </div>
    <div style="margin-left:auto;text-align:right">
      <div class="big-score" style="color:${riskColor}">${score}<span style="font-size:14px;color:var(--muted)">/100</span></div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">AI Score</div>
      ${riskBadge(risk)}
    </div>
  </div>

  <div class="data-grid">
    <div class="data-section">
      <h4>👤 Profile</h4>
      <div class="info-row"><span class="label">Email</span><span class="value" style="font-size:12px">${fmt(p.email)}</span></div>
      <div class="info-row"><span class="label">Phone</span><span class="value">${fmt(p.phoneNo)}</span></div>
      <div class="info-row"><span class="label">Institute</span><span class="value">${fmt(p.instituteName)}</span></div>
      <div class="info-row"><span class="label">Joined</span><span class="value">${fmtDate(p.dateOfJoin)}</span></div>
      <div class="info-row"><span class="label">Resume</span><span class="value">${p.resumeUploadedAt ? '✅ Uploaded' : '❌ Not uploaded'}</span></div>
    </div>
    <div class="data-section">
      <h4>📊 Performance</h4>
      ${perf ? `
      <div class="info-row"><span class="label">Risk Level</span>${riskBadge(perf.riskLevel)}</div>
      <div class="info-row"><span class="label">Trend</span><span class="value">${fmt(perf.trend)}</span></div>
      <div class="info-row"><span class="label">Attendance</span><span class="value">${fmt(perf.metadata?.attendance)}%</span></div>
      <div class="info-row"><span class="label">Marks</span><span class="value">${fmt(perf.metadata?.marks)}%</span></div>
      <div class="info-row"><span class="label">LMS Engagement</span><span class="value">${fmt(perf.metadata?.lmsEngagement)}%</span></div>
      <div class="info-row"><span class="label">Assignments</span><span class="value">${fmt(perf.metadata?.assignmentCompletion)}%</span></div>
      ` : '<div class="no-data">No performance data yet.</div>'}
    </div>
    <div class="data-section">
      <h4>🧠 Predictive Intelligence</h4>
      ${pi?.academicStability ? `
      <div class="info-row"><span class="label">Stability Score</span><span class="value" style="color:var(--blue)">${pi.academicStability.stabilityScore ?? '—'}</span></div>
      <div class="info-row"><span class="label">Failure Risk</span><span class="value" style="color:var(--red)">${pi.academicStability.finalRisk ?? '—'}%</span></div>
      <div class="info-row"><span class="label">Confidence</span><span class="value">${pi.academicStability.predictionConfidence ?? '—'}%</span></div>
      <div class="info-row"><span class="label">Trend</span><span class="value">${pi.trendAnalysis?.trend ?? '—'} ${pi.trendAnalysis?.direction ?? ''}</span></div>
      <div class="info-row"><span class="label">Primary Weakness</span><span class="value" style="color:var(--yellow)">${pi.riskBreakdown?.primaryWeakness ?? '—'}</span></div>
      ` : '<div class="no-data">No predictive data yet.</div>'}
    </div>
    <div class="data-section">
      <h4>🎮 Rewards & Gamification</h4>
      ${rew ? `
      <div class="info-row"><span class="label">Total XP</span><span class="value" style="color:var(--yellow)">⭐ ${rew.totalXP}</span></div>
      <div class="info-row"><span class="label">Level</span><span class="value">${rew.level} — ${rew.levelTitle}</span></div>
      <div class="info-row"><span class="label">Credits</span><span class="value">💰 ${rew.campusCredits}</span></div>
      <div class="info-row"><span class="label">Streak</span><span class="value">🔥 ${rew.currentStreak} days</span></div>
      <div class="info-row"><span class="label">Quizzes Passed</span><span class="value">${rew.stats?.quizzesPassed ?? 0}</span></div>
      <div class="info-row"><span class="label">Mock Interviews</span><span class="value">${rew.stats?.mockInterviewsCompleted ?? 0}</span></div>
      ` : '<div class="no-data">No rewards data yet.</div>'}
    </div>
  </div>

  ${rew?.badges?.length ? `
  <div class="data-section" style="margin-bottom:16px">
    <h4>🏅 Badges Earned (${rew.badges.length})</h4>
    <div class="badge-grid">
      ${rew.badges.slice(0, 12).map(b => `<div class="badge-item ${b.rarity || ''}">${b.icon || '🏅'} <span>${b.name}</span><span style="font-size:10px;opacity:.6">${b.rarity}</span></div>`).join('')}
      ${rew.badges.length > 12 ? `<div class="badge-item">+${rew.badges.length - 12} more</div>` : ''}
    </div>
  </div>` : ''}

  <div class="data-section" style="margin-bottom:16px">
    <h4>📖 Subject-wise Performance</h4>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      ${Object.entries(perf?.subjectMarks || p.marks || {}).map(([sub, val]) => `
        <div class="subject-pill">
          <span class="name">${sub}</span>
          <span class="val" style="color:${parseFloat(val) >= 75 ? 'var(--green)' : parseFloat(val) >= 50 ? 'var(--yellow)' : 'var(--red)'}">${val}</span>
        </div>`).join('') || '<div class="no-data">No subject data available.</div>'}
    </div>
  </div>

  <div class="data-section" style="margin-bottom:16px">
    <h4>🗺️ Learning Paths (${lps.length})</h4>
    ${lps.length ? lps.map(lp => `
    <div class="lp-item">
      <div class="lp-header">
        <span class="lp-title">${lp.topic}</span>
        <span class="badge ${lp.status === 'completed' ? 'badge-low' : lp.status === 'in-progress' ? 'badge-blue' : 'badge-gray'}">${lp.status}</span>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:6px">${lp.completedSteps || 0}/${lp.totalSteps || 0} steps · ${lp.totalEstimatedWeeks || 0} weeks</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${lp.progress || 0}%"></div></div>
      <div style="font-size:11px;color:var(--green);margin-top:4px">${lp.progress || 0}% complete</div>
    </div>`).join('') : '<div class="no-data">No learning paths started yet.</div>'}
  </div>

  <div class="data-section" style="margin-bottom:16px">
    <h4>📝 Recent Quiz Scores (${quizzes.length})</h4>
    ${quizzes.length ? `
    <table style="width:100%;font-size:12px">
      <thead><tr><th>Subject</th><th>Score</th><th>Percentage</th><th>Date</th></tr></thead>
      <tbody>${quizzes.slice(0, 10).map(q => `<tr>
        <td>${q.subject || 'General'}</td>
        <td>${q.score}/${q.totalMarks || 100}</td>
        <td><span style="color:${q.percentage >= 70 ? 'var(--green)' : q.percentage >= 50 ? 'var(--yellow)' : 'var(--red)'}">${(q.percentage || 0).toFixed(1)}%</span></td>
        <td>${fmtDate(q.takenAt)}</td>
      </tr>`).join('')}</tbody>
    </table>` : '<div class="no-data">No quiz data available.</div>'}
  </div>

  <div class="data-section">
    <h4>🎤 Mock Interviews (${interviews.length})</h4>
    ${interviews.length ? interviews.slice(0, 5).map(iv => `
    <div class="interview-item">
      <div class="flex-row" style="justify-content:space-between;align-items:flex-start">
        <div>
          <div class="interview-score" style="color:${iv.score >= 80 ? 'var(--green)' : iv.score >= 60 ? 'var(--yellow)' : 'var(--red)'}">${iv.score}<span style="font-size:12px;color:var(--muted)">/100</span></div>
          <div style="font-size:12px;color:var(--muted)">${iv.questionCount} questions · ${iv.duration ? Math.round(iv.duration / 60000) + 'min' : 'N/A'}</div>
        </div>
        <div style="text-align:right;font-size:12px;color:var(--muted)">${fmtDate(iv.interviewedAt)}</div>
      </div>
      ${iv.feedback?.overall ? `<div style="font-size:12px;color:var(--text);margin-top:8px;padding:8px;background:var(--bg3);border-radius:6px;line-height:1.5">${iv.feedback.overall.substring(0, 200)}${iv.feedback.overall.length > 200 ? '…' : ''}</div>` : ''}
    </div>`).join('') : '<div class="no-data">No mock interview data available.</div>'}
  </div>`;

  $('studentResult').innerHTML = html;
  $('studentResult').classList.remove('hidden');
}

// ── FACULTY (INSTITUTE STAFF) ─────────────────────────────────
async function loadFaculty() {
  const container = $('facultyList');
  try {
    const r = await apiFetch('/api/faculty/admin/faculty');
    const list = Array.isArray(r?.data) ? r.data : [];
    if (!list.length) {
      container.innerHTML = `<div class="empty-state"><div class="icon">🎓</div><p>No institute staff yet. Create the first one!</p></div>`;
      return;
    }
    container.innerHTML = list.map(f => `
    <div class="faculty-card">
      <div class="fa">🎓</div>
      <div class="fi">
        <div class="fn">${fmt(f.name)}</div>
        <div class="fe">${fmt(f.email)} · <span class="badge badge-purple">${fmt(f.role)}</span></div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px">👥 ${f.assignedStudentCount || 0} students assigned</div>
      </div>
      <div class="fc">
        <button class="btn-sm btn-green" onclick="openAssign('${f._id}','${(f.name || '').replace(/'/g, "\\'")}')">Assign Students</button>
        <button class="btn-sm" style="background:var(--bg3);border:1px solid var(--border);color:var(--muted)" onclick="viewFacultyStudents('${f._id}','${(f.name || '').replace(/'/g, "\\'")}')">View Students</button>
      </div>
    </div>`).join('');
  } catch (e) {
    container.innerHTML = `<div class="no-data" style="color:var(--red)">Failed to load institute staff: ${e.message}</div>`;
    toast('Failed to load institute staff: ' + e.message, 'error');
  }
}

function openCreateFaculty() { $('createFacultyModal').classList.remove('hidden'); }
function closeModal(id) { $(id).classList.add('hidden'); }

async function createFaculty() {
  const name  = ($('fName').value  || '').trim();
  const email = ($('fEmail').value || '').trim();
  const pass  = $('fPass').value;
  const role  = $('fRole').value;
  const err   = $('fError');
  const btn   = $('createFacultyBtn');

  err.style.display = 'none';
  if (!name || !email || !pass) { err.textContent = 'All fields required'; err.style.display = 'block'; return; }
  if (pass.length < 6) { err.textContent = 'Password must be ≥6 characters'; err.style.display = 'block'; return; }

  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  try {
    await apiFetch('/api/faculty/admin/faculty/create', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: pass, role }),
    });
    toast(`Staff account created for ${name}!`, 'success');
    closeModal('createFacultyModal');
    $('fName').value = $('fEmail').value = $('fPass').value = '';
    loadFaculty();
  } catch (e) {
    err.textContent = e.message;
    err.style.display = 'block';
  } finally {
    btn.innerHTML = 'Create';
    btn.disabled = false;
  }
}

async function openAssign(facultyId, name) {
  currentFacultyId = facultyId;
  $('assignFacultyName').textContent = name;
  const list = $('assignStudentList');
  list.innerHTML = '<div class="no-data loading-pulse">Loading students…</div>';
  $('assignModal').classList.remove('hidden');

  try {
    const r = await apiFetch('/api/faculty/students');
    const students = Array.isArray(r?.data) ? r.data : [];
    if (!students.length) { list.innerHTML = '<div class="no-data">No students found.</div>'; return; }
    list.innerHTML = students.map(s => `
    <label style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;border:1px solid var(--border);margin-bottom:6px;background:var(--bg3);font-size:13px;transition:.1s" onmouseover="this.style.background='var(--card)'" onmouseout="this.style.background='var(--bg3)'">
      <input type="checkbox" value="${s.studentId}" style="width:16px;height:16px;accent-color:var(--accent)" ${(s.assignedFaculty || []).some(f => f.facultyId === facultyId) ? 'checked' : ''}>
      <div>
        <div style="font-weight:600">${fmt(s.name)}</div>
        <div style="color:var(--muted);font-size:11px">${fmt(s.studentId)} · ${fmt(s.Course)}</div>
      </div>
    </label>`).join('');
  } catch (e) {
    list.innerHTML = `<div class="no-data" style="color:var(--red)">Error: ${e.message}</div>`;
  }
}

async function submitAssign() {
  const checked = Array.from($('assignStudentList').querySelectorAll('input[type=checkbox]:checked')).map(c => c.value);
  const aErr = $('aError');
  if (!checked.length) { aErr.textContent = 'Select at least one student'; aErr.style.display = 'block'; return; }
  aErr.style.display = 'none';

  try {
    const r = await apiFetch(`/api/faculty/admin/faculty/${currentFacultyId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ studentIds: checked }),
    });
    toast(r.message || 'Students assigned successfully!', 'success');
    closeModal('assignModal');
    loadFaculty();
    loadStudents();
  } catch (e) {
    aErr.textContent = e.message;
    aErr.style.display = 'block';
  }
}

async function viewFacultyStudents(facultyId, name) {
  showPage('students');
  $('studentSearch').value = '';
  toast(`Filtering students assigned to ${name}`, 'info');
  try {
    const r = await apiFetch(`/api/faculty/admin/faculty/${facultyId}/students`);
    const students = Array.isArray(r?.data) ? r.data : [];
    if (!students.length) {
      $('studentsTable').innerHTML = '<tr><td colspan="8" class="no-data">No students assigned to this staff member yet.</td></tr>';
      return;
    }
    renderStudentsTable(students);
    $('studentCount').textContent = `${students.length} student(s) assigned to ${name}`;
  } catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ── AUTO-LOGIN if token exists ────────────────────────────────
(async function init() {
  if (!token) return;
  console.log('[Init] Token found — validating session…');
  try {
    const r = await apiFetch('/api/faculty/admin/institute-info');
    const inst = r?.data?.institute || {};
    instData = inst;
    initApp({
      name: inst.adminName || inst.name,
      email: inst.email,
      instituteName: inst.name || inst.instituteName,
      role: inst.role || 'Admin',
      instituteId: inst.instituteId,
    });
    console.log('[Init] Session valid — auto-logged in as', inst.name);
  } catch (e) {
    console.warn('[Init] Token invalid — redirecting to login:', e.message);
    localStorage.removeItem('inst_token');
    token = '';
  }
})();

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
});
