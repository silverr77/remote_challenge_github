//function to get data from api
const app = document.getElementById('root');
const Pagination = document.createElement('div')
const container = document.createElement('div');
const waiting = document.getElementById('waiting')
const Statistique = document.getElementById('Statistique')
const trending = document.getElementById('trending')
const chart = document.getElementById('myChart')
container.setAttribute('class', 'container row row-flex');
app.appendChild(container);
var bntPagination 
var btnRepos
app.appendChild(Pagination)
var LanguagesStatistique=[]

//new variables
var currentPage=0 //the current page
var allRepos=[] //array containte all languages (json)
var allReposLanguages=[] //array conatainte all languges (just language :string)
var UniqLanguages=[] //array containte UniqLanguages without repetition
var NmbrReposByLanguages=[] //array conatainte The nombre of repos by language

window.onload = function(){ 

    onLoadAllRepos() //call all Repos

    //this.onLoadPageFisrtTime()
}


async function onLoadAllRepos(){
    container.innerHTML = ''
    Pagination.innerHTML = ''
    var request = new XMLHttpRequest();
    waiting.style.display='flex'
    var res=await request.open('GET', 'https://api.github.com/search/repositories?q=page=0&per_page=100&sort=stars&order=desc', true);
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response);
      this.itemsSize=data.items.length
      var repos=[]
      allRepos=[]
      allReposLanguages=[]
      data.items.forEach(l => {
        allRepos.push(l)
        if(l.language!=null)
        allReposLanguages.push(l.language)
      });
      waiting.style.display='none'
      getReposToHomePage(0)
    }
    request.send();
}

function getUniqueLanguages(allRepos){
    UniqLanguages=[]
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
    UniqLanguages = allRepos.filter( onlyUnique ); 
    //onNmbrReposByLanguage(uniqLanguage)
    console.log("unique languges ===> ",UniqLanguages)
}



function getReposToHomePage(current_page){
    console.log("allReposLanguages====>",allReposLanguages)
    getUniqueLanguages(allReposLanguages)
    //call function setDateHome()
    setDataHomePage()

}

function setDataHomePage(){
    UniqLanguages.forEach(l=>{
        const col = document.createElement('div');
        col.setAttribute('class', 'col-3');
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        const h1 = document.createElement('h3');
        h1.textContent = l;
        const repos = document.createElement('button');
        const icon = document.createElement('i')
        icon.textContent=' list repos'
        icon.setAttribute('class','fa fa-folder-open');
        repos.appendChild(icon)
        repos.setAttribute('class','btn btn-outline-primary');
        repos.name= l
        repos.classList.add("repos")
        col.appendChild(card)
        container.appendChild(col);
        card.appendChild(h1);
        card.appendChild(repos)
    })
    //add listenner event to list repos btn
    btnRepos=document.querySelectorAll('.repos')
    btnRepos.forEach(p => {
      p.addEventListener('click', () => onClickRepos(p))
      })
      
}

function onClickRepos(p){
    LoadRepositorieByLanguage(p);
}

function LoadRepositorieByLanguage(language){
    container.innerHTML = ''
    var repos=[]
    allRepos.forEach(l => {
        //console.log(movie.language);
        if(l.language!=null && (l.language).toUpperCase()==(language.name).toUpperCase()){
            repos.push(l)
        }
 
      });
      showLanguagesRepos(language.name,repos)
}

function showLanguagesRepos(name,repos){

    const CoutRepos = document.createElement('h1');
    CoutRepos.textContent=name+" has "+repos.length+" repos"
    app.appendChild(CoutRepos);
    app.appendChild(container)
    repos.forEach(r=>{
        const col = document.createElement('div');
        col.setAttribute('class', 'content col-6 row row-flex');
        const div = document.createElement('div');
        div.setAttribute("class","repo-card text-left")
        //name of repo
        const a = document.createElement('a');
        a.href=r.html_url
        a.setAttribute('target',"_blank")
        const h4 = document.createElement('h4');
        h4.textContent=r.name
        const p = document.createElement('p');
        //discription of repos
        p.textContent=(r.description).slice(0,100)+"..."

        //stars
        const spanStars = document.createElement('span');
        const iStars = document.createElement('i')
        iStars.setAttribute("class","fa fa-star")
        iStars.textContent=' '+r.watchers_count
        //owner
        const spanOwner = document.createElement('span');
        const imgOwner = document.createElement('img')
        const aOwner=document.createElement('a')
        aOwner.href=r.owner.html_url
        aOwner.setAttribute('target',"_blank")
        imgOwner.setAttribute("class","img-fluid")
        imgOwner.setAttribute("width",'20')
        imgOwner.setAttribute("height",'20')
        imgOwner.src=r.owner.avatar_url
        spanOwner.textContent='owner '
        spanOwner.setAttribute("style","margin-left:20px")
        //appends
        container.setAttribute("style","display:flex;justify-content:center;")
        aOwner.appendChild(imgOwner)
        spanStars.appendChild(iStars)
        spanOwner.appendChild(aOwner)
        a.appendChild(h4)
        div.appendChild(a)
        div.appendChild(p)
        div.appendChild(spanStars)
        div.appendChild(spanOwner)
        col.appendChild(div)
        container.appendChild(col)    
        //console.log(r.html_url+" "+r.name+" "+r.owner.login+" "+r.watchers_count)
        //avatar_url
        //

    })
    

}


Statistique.addEventListener('click', e=>{
    onNmbrReposByLanguage(UniqLanguages)
});

function onNmbrReposByLanguage(p){
    NmbrReposByLanguages=[]
      p.forEach(l=>{
          var nmb=0
          allRepos.forEach(d => {
                if(d.language!=null && (d.language).toUpperCase()==l.toUpperCase()){
                    nmb++
                }
            })
            NmbrReposByLanguages.push(nmb)
      });

      console.log("stati uniq languages ==> ",UniqLanguages)
      console.log("stati uniq languages ==> ",NmbrReposByLanguages)

      onStatistiqueShow()

}

function onStatistiqueShow(){
    trending.classList.remove('active')
    Statistique.classList.add('active')
    app.innerHTML=''
    container.innerHTML=''
    app.appendChild(container);
    bntPagination=document.querySelectorAll('.paginationBtn')
    bntPagination.forEach(p => {
        p.style.display="none"
    })
    const chart1 = document.getElementById('myChart')
    chart1.style.display="block"
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: {
            labels: UniqLanguages,
            datasets: [{
                label: 'Repositories',
                backgroundColor: 'rgb(156,39,176)',
                borderColor: 'rgb(255, 99, 132)',
                data: NmbrReposByLanguages
            }]
        },
    
        // Configuration options go here
        options: {}
    });
}


trending.addEventListener('click',e=>{
    app.innerHTML=''
    container.innerHTML=''
    app.appendChild(container);
    Statistique.classList.remove('active')
    trending.classList.add('active')
    chart.style.display="none"
    onLoadAllRepos()
    

})




/*
function onLoadPageFisrtTime(){
    this.onLoadPage(this.currentPage,this.perPage)
    this.CreationPagination()
}
*/
/*
function getData(l,request){
     
    if (request.status >= 200 && request.status < 400) {
        if(l.language!=null){
            const col = document.createElement('div');
            col.setAttribute('class', 'col-3');
            const card = document.createElement('div');
              card.setAttribute('class', 'card');
              const h1 = document.createElement('h3');
              h1.textContent = l.language;
              const repos = document.createElement('button');
              const icon = document.createElement('i')
              icon.textContent=' list repos'
              icon.setAttribute('class','fa fa-folder-open');
              repos.appendChild(icon)
              repos.setAttribute('class','btn btn-outline-primary');
              repos.name= l.language
              repos.classList.add("repos")
              
              col.appendChild(card)
              container.appendChild(col);
              card.appendChild(h1);
              card.appendChild(repos)
        }
        }else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Gah, it's not working!`;
            app.appendChild(errorMessage);
          } 
}

function onPaginate(p){
    bntPagination.forEach(p => {
        p.classList.remove('activeP')
    })
    p.classList.add('activeP')
    currentPage=p.textContent
    console.log("here ====> ",currentPage)

    this.onLoadPage(currentPage,this.perPage)

}




function CreationPagination(){
    Pagination.innerHTML=''
    for(var i=0;i<5;i++){
        const btn = document.createElement('button');
        btn.textContent=i
        btn.classList.add("paginationBtn")
        Pagination.appendChild(btn)
    }
    bntPagination=document.querySelectorAll('.paginationBtn')

    bntPagination.forEach(p => {
        p.addEventListener('click', () => onPaginate(p))
    })
    app.appendChild(Pagination)

}






async function onLoadRepos(p){
    container.innerHTML = ''
    Pagination.innerHTML = ''
    var request = new XMLHttpRequest();
    waiting.style.display='flex'
    var res=await request.open('GET', 'https://api.github.com/search/repositories?q=page=0&per_page=100&sort=stars&order=desc', true);
    
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response);
      this.itemsSize=data.items.length
      var repos=[]
      data.items.forEach(l => {
        //console.log(movie.language);
        if(l.language!=null && (l.language).toUpperCase()==(p.name).toUpperCase()){
            repos.push(l)
        }
 
      });
      showRepos(p.name,repos,request)
      console.log(repos)
      waiting.style.display='none'
      console.log("heeedfsdfd")
    }
    console.log("here then here")
    request.send();

}

async function onLoadPage(currentPage,perPage){
    var request = new XMLHttpRequest();
    waiting.style.display='flex'
    var response=await request.open('GET', 'https://api.github.com/search/repositories?q=page='+currentPage+'&per_page='+perPage+'&sort=stars&order=desc', true);
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response);
        console.log("items",data.items)
        container.innerHTML = ''
      data.items.forEach(l => {
        //console.log(movie.language);
        getData(l,request)
        
      });
      btnRepos=document.querySelectorAll('.repos')
      btnRepos.forEach(p => {
        p.addEventListener('click', () => onClickRepos(p))
        })
        console.log(data)
        waiting.style.display='none'
    }
    
    request.send();
    
}









async function onLoadLanguages(){
    var request = new XMLHttpRequest();
    waiting.style.display='flex'
    var res=await request.open('GET', 'https://api.github.com/search/repositories?q=page=0&per_page=100&sort=stars&order=desc', true);
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response);
      data.items.forEach(l => {
        if(l.language!=null)
        LanguagesStatistique.push((l.language).toUpperCase())
      });
      console.log("languages ==> ",LanguagesStatistique)
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
    var uniqLanguage=[]
    uniqLanguage = LanguagesStatistique.filter( onlyUnique ); 
    onNmbrReposByLanguage(uniqLanguage)
    }
    request.send();
}
*/


