const CATS=['AI 官网','开发工具','API 服务','常用网站','国际网站','技术社区','影音娱乐','设计资源','教育学习','新闻资讯','金融理财','云服务','自定义'];
const catEl=document.getElementById('cat');
CATS.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;catEl.appendChild(o)});
catEl.value='自定义';

chrome.tabs.query({active:true,currentWindow:true},tabs=>{
  if(!tabs[0])return;
  const tab=tabs[0];
  document.getElementById('url').value=tab.url||'';
  document.getElementById('title').value=tab.title||'';
});

document.getElementById('addBtn').addEventListener('click',()=>{
  const url=document.getElementById('url').value.trim().replace(/^https?:\/\//,'');
  const title=document.getElementById('title').value.trim();
  const desc=document.getElementById('desc').value.trim();
  const cat=catEl.value;
  const msg=document.getElementById('msg');
  if(!url||!title){msg.className='msg err';msg.textContent='请填写网址和标题';return}
  chrome.storage.sync.get('ainav_bm',data=>{
    const bm=JSON.parse(data.ainav_bm||'[]');
    if(bm.some(b=>b.u===url)){msg.className='msg err';msg.textContent='该网址已存在';return}
    bm.push({t:title,u:url,d:desc});
    chrome.storage.sync.set({ainav_bm:JSON.stringify(bm)},()=>{
      msg.className='msg ok';msg.textContent='已添加到 '+cat+'!';
      document.getElementById('addBtn').disabled=true;
      setTimeout(()=>window.close(),1200);
    });
  });
});
