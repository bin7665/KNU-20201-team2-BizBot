// document.addEventListener('DOMContentLoaded', function() {
//     var trigger = new ScrollTrigger({
//         offset: {
//             x: 0,
//             y: 200
//         },
//         toggle: {
//             visible: 'visible',
//             hidden: 'invisible'
//         },
//         once: true,
//     });
// });

var chapter = new Array();
    chapter[0] = document.querySelector("#chapter1");
    chapter[1] = document.querySelector("#chapter2");
    chapter[2] = document.querySelector("#chapter3");
    chapter[3] = document.querySelector("#chapter4");
    chapter[4] = document.querySelector("#chapter5");
    chapter[5] = document.querySelector("#chapter6");

console.log()

var chapterTop= new Array();
    chapterTop[0] = 404;
    chapterTop[1] = 775;
    chapterTop[2] = 2924;
    chapterTop[3] = 4514;
    chapterTop[4] = 6019;
    chapterTop[5] = 6814;
    chapterTop[6] = 7480;

var remote = document.querySelector(".remote"),
    docElem = document.documentElement,
    offset,
    scrollPos,
    docHeight;

//docHeight calculate
docHeight = Math.max(docElem.offsetHeight, docElem.scrollHeight);
if(docHeight!='undefined'){
    
}

//scroll event
window.addEventListener('scroll', function(){
    scrollPos = docElem.scrollTop;

    for(var i=0; i<6; i++){
        if( scrollPos >=chapterTop[i] && scrollPos < chapterTop[i+1]){
            chapter[i].classList.add('visible');
            chapter[i].classList.remove('invisible');
        }
        else{
            chapter[i].classList.add('invisible');
            chapter[i].classList.remove('visible');
        }
    }
});

remote.addEventListener('click', function(ev){
    ev.preventDefault();
    scrollToChapter(ev);
});

function scrollToChapter(ev){//var scrollInterval = setInterval(function(){
    if(scrollPos != chapterTop[parseInt(ev.path[0].id)]){
        var scrollOptions = {
            left: 0,
            top: chapterTop[parseInt(ev.path[0].id)] - scrollPos,
            behavior: 'smooth'
        }
        //window.scrollBy(0, chapterTop[parseInt(ev.path[0].id)] - scrollPos)
        window.scrollBy(scrollOptions)
    }else{

    }
}

// chapterTop[0] = 404;
// chapterTop[1] = 725;
// chapterTop[2] = 2924;
// chapterTop[3] = 4304;
// chapterTop[4] = 5704;
// chapterTop[5] = 6464;
// chapterTop[6] = 7240;