let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads= document.getElementById('ads');
let descount = document.getElementById('descount');
let count = document.getElementById('count');
let category = document.getElementById('category');
let search = document.getElementById('search');
let total = document.getElementById('total');
let submit = document.getElementById('submit'); 
   //get total
   function getTotal(){
    if(price.value != ''){
        let result = (+price.value + +ads.value + +taxes.value) - +descount.value;
        total.innerHTML = result;
        total.style.background = "green"
    }
    else{
        total.innerHTML = '';
        total.style.background = "red"
    }
   };
   //create
   let datePro ;
   if(localStorage.product != null ){
    datePro = JSON.parse(localStorage.product)}
    else{
        datePro = [];
   }
   submit.onclick = function(){
       let newPro = {
        title:title.value,
        price:price.value,
        taxes:taxes.value,
        ads:ads.value,
        descount:descount.value,
        total:total.innerHTML,
        count:count.value,
        category:category.value,
       }
       datePro.push(newPro);
       localStorage.setItem('product' , JSON.stringify(datePro));
       clearDate()
   }
 //clear
 function clearDate(){
   title.value = '';
   price.value = '';
   taxes.value = '';
   ads.value = '';
   descount.value = '';
   total.innerHTML = '';
   count.value = '';
   category.value = '';
 }