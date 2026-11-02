const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const el={innerHTML:'',style:{},dataset:{id:'test',name:'Estudante',email:'test@example.com'},addEventListener(){},querySelectorAll(){return[]},focus(){}};
const ctx=vm.createContext({Date,Math,Set,JSON,String,Number,Array,Object,console,localStorage:{getItem(){return null},setItem(){}},document:{querySelector:()=>el,addEventListener(){},body:{style:{}}},window:{addEventListener(){}},matchMedia:()=>({matches:false}),setTimeout(){}});
for(const file of ['passo-data.js','lesson-content.js','reader-ui.js','passo-app.js']){
 let source=fs.readFileSync('public/'+file,'utf8');if(file==='passo-app.js')source=source.replace(/initCloud\(\);\s*$/,'');vm.runInContext(source,ctx);
}
const run=s=>vm.runInContext(s,ctx);
run('render=()=>{};showLesson=()=>{};save=()=>{};');
assert.equal(run('lessons[0].chapters.length'),8);assert.equal(run('lessons[0].qs.length'),6);
assert.equal(run('lessons.every(l=>l.chapters.length>=4&&l.sources.length&&l.qs.every(q=>q[2]>=0&&q[2]<q[1].length))'),true);
run('start(0);session.selected=1;check()');assert.equal(run('session.wrong'),true);assert.equal(run('person().xp'),0);run('check()');
function finish(review){run(`session={i:0,rev:${review},q:0,selected:null,checked:false,wrong:false,step:'quiz',award:0}`);for(let i=0;i<6;i++)run(`session.selected=lessons[0].qs[${i}][2];check();check()`)}
finish(false);assert.equal(run('person().xp'),30);assert.equal(run('next()'),1);assert.equal(run('person().mistakes.length'),0);
finish(false);assert.equal(run('person().xp'),30);finish(true);assert.equal(run('person().xp'),35);finish(true);assert.equal(run('person().xp'),35);
run('session={i:0};rememberChapter(4)');assert.equal(run('person().reading[0]'),4);
run('db.active=1');assert.equal(run('person().xp'),0);assert.equal(run('next()'),0);
assert.equal(run('validBackup(db)'),true);
console.log('PASS: expanded lesson data, feedback, retries, six-question completion, XP, unlocks, bounded review rewards, bookmarks and separate study profiles.');
