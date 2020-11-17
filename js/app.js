'use strict';
// let loaded1 = false; // to check te data of page 1 are fetched just at the first time
// let loaded2=false;  // to check te data of page 2 are fetched just at the first time
// let page1Data=[]; // to store the data of page one inside it 
// let page2Data=[]; // to store the data of page two inside it 



let renderedData = []; // for sort the rendered data 

let imagesArray = [];
let imagesArray2 = [] ; // for page 2 
let pageNumber = 1 ; //current page number 
function Image(url,title,description,keyword,horns){
  this.url=url;
  this.title=title;
  this.description=description;
  this.keyword=keyword;
  this.horns=horns;
  if(pageNumber===1 ){
    imagesArray.push(this);
  }
  else if (pageNumber===2){
    imagesArray2.push(this);
  }
}
// this code execute when click on page one :
$('#page1').on('click', function(e){
  $('main').html('');
  $('#sortby').val('default'); //return the data of select for the sort images .. to its default value when we move through the pages
  pageNumber=1;
  imagesArray=[];
  $.ajax('./data/page-1.json')
    .then(data=>{
      
      // loop for each object data 
      data.forEach((val)=>{ 
        let image= new Image(val.image_url,val.title,val.description,val.keyword,val.horns);
        image.render();
        
      });
      renderedData=[...imagesArray];
      
      renderSelect(imagesArray);
    });

});

$('#page2').on('click', function(e){
  $('main').html('');
  $('#sortby').val('default'); //return the data of select for the sort images .. to its default value when we move through the pages
  pageNumber=2;
  imagesArray2=[];
  $.ajax('./data/page-2.json')
    .then(data=>{
  
      // loop for each object data 
      data.forEach((val)=>{ 
        let image= new Image(val.image_url,val.title,val.description,val.keyword,val.horns);
        image.render();
        
      });
      renderedData=[...imagesArray2];
      renderSelect(imagesArray2);
    });

});




Image.prototype.render = function(){
  //jQery way .. cloning way : 
        /* let imageTemplate= $('#photo-template').first().clone();
        // imageTemplate.attr('id',null);
        // imageTemplate.find('h2').text(this.title);
        
        // imageTemplate.find('img').attr('src',this.url);
        
        imageTemplate.find('p').text(this.description);
        */

  // Mustache way .. templating way:
  let imageTemplate = $('#imageTemplate').html(); // get the script (template) as a text (html)
  let html = Mustache.render(imageTemplate,this); // merge the template with the object .
  $('main').append(html); // append this template to the main.

};

let select = $('#filterby');


const renderSelect =(pageItemsArray)=>{ // will received the array of objects for the current page
  select.children().remove(); // empty the select 
  let arr=[];
  let templateSelect = $('#selectTemplate').html(); // get the template for options
    pageItemsArray.forEach(element => {
        if( ! arr.includes(element.keyword) ){  
            arr.push(element.keyword);
            let html= Mustache.render(templateSelect,{keyword:element.keyword});
            select.append(html);
            // select.append(`<option> ${element.keyword} </option> `);

        }
    });
    
}



select.on('change', function(){
    let keyword = this.value;

    // $('main').html('');
    if(keyword !== 'default' ){
      renderedData=[]; 
      $('main').children().remove();
      let currentArrayPage = pageNumber===1 ? imagesArray : imagesArray2; 
      // $(`.${keyword}`).fadeIn(); // show the elements which has the class of 'current keyword's value'

      // update the rendered data array:
      let imageTemplate = $('#imageTemplate').html(); // get the script (template) as a text (html)
      currentArrayPage.forEach(element => {
          if(keyword === element.keyword){
            renderedData.push(element);
            let html = Mustache.render(imageTemplate,element); // merge the template with the object .
            $('main').append(html); // append this template to the main.
          }
      });
      console.log(renderedData);


    }

})
$('#page1').trigger('click');


//helper function

function sortImages  (arrayOfImages, sortBy) {

  arrayOfImages.sort( function(a,b){

    if(sortBy === 'title'){
      if(a.title > b.title){
        return 1;
      }
      else if ( a.title < b.title){
        return -1;
      }
      else {
        return 0;
      }
    }
    else if (sortBy === 'horn'){ // try a -b 
      if(a.horns > b.horns){
        return 1;
      }
      else if ( a.horns < b.horns){
        return -1;
      }
      else {
        return 0;
      }
    }
  } );


}

function renderSortedImages  (){
  $('main').children().remove();
  let imageTemplate = $('#imageTemplate').html(); // get the script (template) as a text (html)

  renderedData.forEach( function(element){

    let html = Mustache.render(imageTemplate,element); // merge the template with the object .
    $('main').append(html); // append this template to the main.
  });



}
$('#sortby').on('change', function() {
  let sortby = this.value; 
  sortImages(renderedData,sortby);
  renderSortedImages();
  

});