/* ═══ INLINE EDITOR ═══ */
function openEditor(path){
  const content=S.files[path];
  if(!content)return;
  const _ja=S.lang==='ja';
  const isEdited=S.editedFiles&&S.editedFiles[path];
  const prevBody=$('prevBody');
  prevBody.innerHTML=`
    <div class="editor-toolbar">
      <div class="title">📝 ${esc(path)}</div>
      <div class="actions">
        <button class="btn btn-s" onclick="saveEdited('${esc(path)}')">💾 ${_ja?'保存':'Save'}</button>
        <button class="btn btn-s" onclick="revertFile('${esc(path)}')"${isEdited?'':'disabled'}>↩️ ${_ja?'元に戻す':'Revert'}</button>
        <button class="btn btn-s" onclick="previewFile('${esc(path)}')">👁 ${_ja?'プレビュー':'Preview'}</button>
      </div>
    </div>
    <textarea id="editorArea" spellcheck="false" class="editor-area">${esc(content)}</textarea>`;
  // Auto-resize
  const ta=$('editorArea');
  if(ta){
    ta.addEventListener('keydown',e=>{
      if(e.key==='Tab'){e.preventDefault();const s=ta.selectionStart,end=ta.selectionEnd;ta.value=ta.value.substring(0,s)+'  '+ta.value.substring(end);ta.selectionStart=ta.selectionEnd=s+2;}
      if(e.ctrlKey&&e.key==='s'){e.preventDefault();saveEdited(path);}
    });
  }
}
function saveEdited(path){
  const _ja=S.lang==='ja';
  const ta=$('editorArea');
  if(!ta)return;
  const newContent=ta.value;
  if(newContent===S.files[path])return toast(_ja?'変更なし':'No changes');
  // Store original if first edit
  if(!S.editedFiles[path])S.editedFiles[path]=S.files[path];
  S.files[path]=newContent;
  save();
  toast(_ja?'✅ 保存しました':'✅ Saved');
  showFileTree();
}
function revertFile(path){
  const _ja=S.lang==='ja';
  if(!S.editedFiles||!S.editedFiles[path])return;
  S.files[path]=S.editedFiles[path];
  delete S.editedFiles[path];
  save();
  toast(_ja?'↩️ 元に戻しました':'↩️ Reverted');
  openEditor(path);
  showFileTree();
}
