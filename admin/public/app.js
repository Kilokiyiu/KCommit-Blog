const state = {
  collections: [],
  collectionId: 'posts',
  editingSlug: null,
  isNew: false,
};

/** Page titles aligned with the public site. */
const PAGE_TITLES = {
  posts: '写过的',
  notes: '说说',
  docs: '技术文档',
  shares: '分享',
  projects: '项目',
};

const $ = (id) => document.getElementById(id);

async function api(path, options = {}) {
  const res = await fetch(`/api/${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function setStatus(msg, isError = false) {
  const el = $('status');
  el.textContent = msg || '';
  el.classList.toggle('error', Boolean(isError));
}

function currentMeta() {
  return state.collections.find((c) => c.id === state.collectionId);
}

function showList() {
  $('view-list').classList.remove('hidden');
  $('view-editor').classList.add('hidden');
  state.editingSlug = null;
  state.isNew = false;
}

function showEditor() {
  $('view-list').classList.add('hidden');
  $('view-editor').classList.remove('hidden');
}

function renderNav() {
  const nav = $('collection-nav');
  nav.innerHTML = '';
  for (const c of state.collections) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = c.label;
    btn.classList.toggle('active', c.id === state.collectionId);
    btn.addEventListener('click', () => {
      state.collectionId = c.id;
      renderNav();
      loadList();
      showList();
    });
    nav.appendChild(btn);
  }
}

async function loadList() {
  const meta = currentMeta();
  $('list-kicker').textContent = meta?.label || state.collectionId;
  $('list-title').textContent = PAGE_TITLES[state.collectionId] || meta?.label || state.collectionId;
  $('list-sub').textContent = '点已有条目编辑；或导入本地 .md / 新建';
  const list = $('list');
  list.innerHTML = '<p class="empty">加载中…</p>';
  try {
    const items = await api(state.collectionId);
    if (!items.length) {
      list.innerHTML = '<p class="empty">还没写完。<br />真的，已经在写了。</p>';
      return;
    }
    list.innerHTML = '';
    for (const item of items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      const desc = item.description
        ? `<span class="item-desc">${escapeHtml(item.description)}</span>`
        : '';
      btn.innerHTML = `
        <span class="item-main">
          <strong>${escapeHtml(item.title)}</strong>
          ${desc}
          <span class="item-desc">${escapeHtml(item.slug)}</span>
        </span>
        <span class="item-side">
          <span class="item-date">${escapeHtml(item.date || '')}</span>
          <span class="badge ${item.draft ? 'draft' : ''}">${item.draft ? '草稿' : '已发布'}</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        openEntry(item.slug).catch((err) => {
          alert(`打开失败：${err.message}`);
        });
      });
      list.appendChild(btn);
    }
  } catch (err) {
    list.innerHTML = `<p class="empty">${escapeHtml(err.message)}</p>`;
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function buildFields(frontmatter = {}) {
  const meta = currentMeta();
  const box = $('fields');
  box.innerHTML = '';
  for (const field of meta.fields) {
    const wrap = document.createElement('label');
    wrap.className = 'field';
    if (field.type === 'textarea' || field.type === 'tags') wrap.classList.add('span-2');

    const span = document.createElement('span');
    span.textContent = field.label + (field.required ? ' *' : '');
    wrap.appendChild(span);

    let input;
    const value = frontmatter[field.key];

    if (field.type === 'boolean') {
      wrap.className = 'field check';
      input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = Boolean(value);
    } else if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
      input.value = value ?? '';
    } else if (field.type === 'tags') {
      input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '用逗号分隔，如：本站, 记录';
      input.value = Array.isArray(value) ? value.join(', ') : value ?? '';
    } else if (field.type === 'date') {
      input = document.createElement('input');
      input.type = 'date';
      input.value = value || today();
    } else {
      input = document.createElement('input');
      input.type = field.type === 'url' ? 'url' : 'text';
      input.value = value ?? '';
    }

    input.name = field.key;
    input.dataset.field = field.key;
    if (field.required && field.type !== 'boolean') input.required = true;
    wrap.appendChild(input);
    box.appendChild(wrap);
  }

  const imageBox = $('image-box');
  if (meta.imageField) {
    imageBox.classList.remove('hidden');
    $('image-label').textContent = meta.imageField === 'cover' ? '封面路径' : '图片路径';
    const pathVal = frontmatter[meta.imageField] || '';
    $('field-image-path').value = pathVal;
    updatePreview(pathVal);
  } else {
    imageBox.classList.add('hidden');
    $('field-image-path').value = '';
    $('image-preview').classList.add('hidden');
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function updatePreview(pathVal) {
  const img = $('image-preview');
  if (!pathVal) {
    img.classList.add('hidden');
    img.removeAttribute('src');
    return;
  }
  if (pathVal.startsWith('data:')) {
    img.src = pathVal;
  } else if (pathVal.startsWith('/')) {
    img.src = `/site-img${pathVal}`;
  } else {
    img.classList.add('hidden');
    return;
  }
  img.classList.remove('hidden');
  img.onerror = () => img.classList.add('hidden');
}

function collectFrontmatter() {
  const meta = currentMeta();
  /** @type {Record<string, unknown>} */
  const data = {};
  for (const field of meta.fields) {
    const el = document.querySelector(`[data-field="${field.key}"]`);
    if (!el) continue;
    if (field.type === 'boolean') {
      data[field.key] = el.checked;
    } else if (field.type === 'tags') {
      data[field.key] = el.value
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean);
    } else {
      data[field.key] = el.value;
    }
  }
  if (meta.imageField) {
    const pathVal = $('field-image-path').value.trim();
    if (pathVal) data[meta.imageField] = pathVal;
  }
  return data;
}

async function openEntry(slug) {
  setStatus('读取中…');
  showEditor();
  $('editor-title').textContent = `读取 · ${slug}`;
  $('field-slug').value = slug;
  $('field-body').value = '';
  buildFields({});
  try {
    const entry = await api(`${state.collectionId}/${encodeURIComponent(slug)}`);
    state.editingSlug = slug;
    state.isNew = false;
    $('editor-title').textContent = `编辑 · ${slug}`;
    $('field-slug').value = slug;
    $('field-slug').readOnly = false;
    $('field-body').value = entry.body || '';
    buildFields(entry.frontmatter || {});
    $('btn-delete').classList.remove('hidden');
    setStatus(`已载入 src/content/${state.collectionId}/${slug}.md`);
  } catch (err) {
    setStatus(err.message, true);
    showList();
    throw err;
  }
}

function openNew() {
  setStatus('');
  state.editingSlug = null;
  state.isNew = true;
  const meta = currentMeta();
  const defaults = {
    date: today(),
    draft: true,
    tags: [],
    status: '进行中',
  };
  $('editor-title').textContent = `新建 · ${meta.label}`;
  $('field-slug').value = '';
  $('field-slug').readOnly = false;
  $('field-body').value = '';
  buildFields(defaults);
  $('btn-delete').classList.add('hidden');
  showEditor();
  $('field-slug').focus();
}

/** Import a local .md — body/frontmatter filled; user only tweaks config then saves. */
async function importMarkdown(file) {
  if (!file) return;
  setStatus('解析 Markdown…');
  try {
    const raw = await file.text();
    const parsed = await api('parse-md', {
      method: 'POST',
      body: JSON.stringify({ raw, filename: file.name }),
    });

    const meta = currentMeta();
    const fm = { ...parsed.frontmatter };
    // Fill collection defaults for missing required-ish fields
    if (!fm.date) fm.date = today();
    if (fm.draft === undefined) fm.draft = true;
    if (meta.fields.some((f) => f.key === 'tags') && !Array.isArray(fm.tags)) fm.tags = [];
    if (meta.id === 'projects' && !fm.status) fm.status = '进行中';

    state.editingSlug = null;
    state.isNew = true;
    $('editor-title').textContent = `导入 · ${meta.label}`;
    $('field-slug').value = parsed.slug || '';
    $('field-slug').readOnly = false;
    $('field-body').value = parsed.body || '';
    buildFields(fm);
    $('btn-delete').classList.add('hidden');
    showEditor();

    const tip = parsed.slug
      ? `已导入 ${file.name}，核对配置后点保存`
      : `已导入正文；文件名不能直接当 slug，请手填后再保存`;
    setStatus(tip);
    if (!parsed.slug) $('field-slug').focus();
  } catch (err) {
    setStatus(err.message, true);
  }
}

async function saveEntry() {
  const slugInput = $('field-slug').value.trim();
  if (!slugInput) {
    setStatus('请填写 slug（文件名）', true);
    return;
  }
  const frontmatter = collectFrontmatter();
  const body = $('field-body').value;
  const original = state.isNew ? slugInput : state.editingSlug;
  setStatus('保存中…');
  try {
    const result = await api(`${state.collectionId}/${encodeURIComponent(original)}`, {
      method: 'PUT',
      body: JSON.stringify({
        frontmatter,
        body,
        newSlug: slugInput !== original ? slugInput : undefined,
      }),
    });
    state.editingSlug = result.slug;
    state.isNew = false;
    $('editor-title').textContent = `编辑 · ${result.slug}`;
    $('btn-delete').classList.remove('hidden');
    setStatus(`已写入 src/content/${state.collectionId}/${result.slug}.md`);
  } catch (err) {
    setStatus(err.message, true);
  }
}

async function deleteEntry() {
  if (!state.editingSlug || state.isNew) return;
  if (!confirm(`确定删除 ${state.editingSlug}.md？`)) return;
  setStatus('删除中…');
  try {
    await api(`${state.collectionId}/${encodeURIComponent(state.editingSlug)}`, {
      method: 'DELETE',
    });
    setStatus('已删除');
    showList();
    await loadList();
  } catch (err) {
    setStatus(err.message, true);
  }
}

async function onImageSelected(file) {
  if (!file) return;
  let slug = $('field-slug').value.trim() || state.editingSlug;
  if (!slug) {
    setStatus('请先填写并保存 slug，再上传图片', true);
    return;
  }

  // Ensure md exists before upload patches frontmatter
  if (state.isNew) {
    await saveEntry();
    slug = state.editingSlug;
    if (!slug) return;
  }

  setStatus('上传图片中…');
  try {
    const dataBase64 = await fileToBase64(file);
    const result = await api(`${state.collectionId}/${encodeURIComponent(slug)}/image`, {
      method: 'POST',
      body: JSON.stringify({
        contentType: file.type || 'image/png',
        dataBase64,
      }),
    });
    $('field-image-path').value = result.path;
    const reader = new FileReader();
    reader.onload = () => updatePreview(String(reader.result));
    reader.readAsDataURL(file);
    setStatus(`图片已保存到 public${result.path}`);
  } catch (err) {
    setStatus(err.message, true);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const i = result.indexOf(',');
      resolve(i >= 0 ? result.slice(i + 1) : result);
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsDataURL(file);
  });
}

function setPublishStatus(msg, isError = false) {
  const el = $('publish-status');
  el.textContent = msg || '';
  el.classList.toggle('error', Boolean(isError));
}

async function loadPublishStatus() {
  const box = $('publish-files');
  setPublishStatus('');
  try {
    const data = await api('publish-status');
    const bits = [`分支 ${data.branch}`];
    if (data.ahead) bits.push(`未推送 ${data.ahead} 个提交`);
    if (data.behind) bits.push(`落后远程 ${data.behind}`);
    if (data.otherCount) bits.push(`另有 ${data.otherCount} 个非内容改动未纳入发布`);
    $('publish-lead').textContent = bits.join(' · ') + '。保存后把内容提交并推送，Pages 会自动构建。';

    box.innerHTML = '';
    if (!data.publishable.length) {
      const li = document.createElement('li');
      li.className = 'empty-msg';
      li.textContent = data.ahead
        ? '没有新的内容文件改动；点下方可把已有提交推上去。'
        : '暂无待发布的内容改动（src/content、配图）。';
      box.appendChild(li);
    } else {
      for (const f of data.publishable) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="code">${escapeHtml(f.status || 'M')}</span><span>${escapeHtml(f.path)}</span>`;
        box.appendChild(li);
      }
    }

    $('btn-publish').disabled = !data.canPublish;
  } catch (err) {
    box.innerHTML = '';
    setPublishStatus(err.message, true);
    $('btn-publish').disabled = true;
  }
}

async function publishNow() {
  const message = $('field-commit-msg').value.trim();
  setPublishStatus('发布中…');
  $('btn-publish').disabled = true;
  try {
    const result = await api('publish', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    $('field-commit-msg').value = '';
    setPublishStatus(
      (result.committed ? '已提交并推送。' : '已推送。') + (result.hint || ''),
    );
    await loadPublishStatus();
  } catch (err) {
    setPublishStatus(err.message, true);
    await loadPublishStatus();
  }
}

async function boot() {
  const meta = await api('meta');
  state.collections = meta.collections;
  renderNav();
  await loadList();
  await loadPublishStatus();

  $('btn-new').addEventListener('click', openNew);
  $('field-import-md').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    importMarkdown(file);
    e.target.value = '';
  });
  $('btn-back').addEventListener('click', async () => {
    showList();
    await loadList();
    await loadPublishStatus();
  });
  $('btn-save').addEventListener('click', async (e) => {
    e.preventDefault();
    await saveEntry();
    await loadPublishStatus();
  });
  $('btn-publish-refresh').addEventListener('click', () => loadPublishStatus());
  $('btn-publish').addEventListener('click', () => publishNow());
  $('btn-delete').addEventListener('click', deleteEntry);
  $('field-image-file').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    onImageSelected(file);
    e.target.value = '';
  });
  $('field-image-path').addEventListener('change', (e) => {
    updatePreview(e.target.value.trim());
  });
  $('editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveEntry();
  });
}

boot().catch((err) => {
  document.body.innerHTML = `<p style="padding:2rem;font-family:sans-serif">启动失败：${escapeHtml(err.message)}</p>`;
});
