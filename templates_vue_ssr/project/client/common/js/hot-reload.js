(function(doc){
    setTimeout(function(){
        doc.head.querySelector('link[data-hr="hot-reload"]').remove();
        doc.body.querySelector('script[data-hr="hot-reload"]').remove();
    },300);
})(document);