/* ═══ V9 CONFIRM DIALOG ═══ */
function showConfirm(val,onOk){
  if(S.skill!=='pro'){onOk();return;}
  _confirmCb=onOk;
  const ov=$('confirmOverlay');ov.style.display='flex';
  pushModal(ov,()=>{ov.style.display='none';_confirmCb=null;});
  ov.innerHTML='<div class="confirm-modal"><h4>'+t('answerConfirm')+'</h4>'
    +'<div class="cm-val">'+esc(String(val))+'</div>'
    +'<div class="cm-acts">'
    +'<button class="btn btn-g btn-sm" onclick="removeModal($(\'confirmOverlay\'));$(\'confirmOverlay\').style.display=\'none\';_confirmCb=null;">'+t('edit')+'</button>'
    +'<button class="btn btn-p btn-sm" onclick="removeModal($(\'confirmOverlay\'));$(\'confirmOverlay\').style.display=\'none\';if(_confirmCb){_confirmCb();_confirmCb=null;}">'+t('confirm')+'</button>'
    +'</div></div>';
}
