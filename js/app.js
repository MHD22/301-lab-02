'use strict';
let imagesArray = [];
function Image(url,title,description,keyword,horns){
  this.url=url;
  this.title=title;
  this.description=description;
  this.keyword=keyword;
  this.horns=horns;
  imagesArray.push(this);
}

$.ajax('./data/page-1.json')
  .then(data=>{
    // console.log(data);
    data.forEach((val)=>{
      let image= new Image(val.image_url,val.title,val.description,val.keyword,val.horns);
      //   console.log(image);
      image.render();
      
    });
    $('#photo-template').first().remove();
    renderSelect();
  });


Image.prototype.render = function(){
  let imageTemplate= $('#photo-template').first().clone();
  imageTemplate.attr('id',null);
  imageTemplate.find('h2').text(this.title);

  imageTemplate.find('img').attr('src',this.url);

  imageTemplate.find('p').text(this.description);
  $('main').append(imageTemplate);

  console.log(imageTemplate.html());
};

let select = $('select');


const renderSelect =()=>{
    let arr=[];
    imagesArray.forEach(element => {
        if( ! arr.includes(element.keyword) ){  
            arr.push(element.keyword);
            select.append(`<option> ${element.keyword} </option> `);

        }
    });
    console.log(imagesArray, " \n after filtering \n " , arr);
}

select.on('change', function(){
    let keyword = this.value;

    $('main').html('');
    imagesArray.forEach(element => {
        
        if(element.keyword === keyword){
           let image = $(`
           <section>
           <h2>${element.title}</h2>
           <img src=${element.url} alt="">
           <p>${element.description}</p>
         </section>`) ;
         $('main').append(image);
         
        }
    });
    

})
