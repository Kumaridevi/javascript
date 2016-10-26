var fs=require('fs');
var lineReader = require('readline').createInterface({
  input: fs.createReadStream('../csv/FoodFacts.csv') 
});
var currentLine=[],countryArray=[],regionArray=[];
var sugarIndex=0,saltIndex=0,countryIndex=0,fatIndex=0,proteinIndex=0,carboIndex=0;
var country=0,sugar=0,salt=0,i=0,fat=0,protein=0,carbo=0,j=0,country1="",region="";
var stackBar = ['Netherlands', 'Canada', 'United Kingdom' , 'United States' , 'Australia' , 'France' , 'Germany' , 'Spain', 'South Africa'];
var northEurope = ['United Kingdom' , 'Denmark' , 'Sweden' , 'Norway'];
var centralEurope = ['France','Belgium' , 'Germany' , ' Switzerland' , 'Netherlands'];
var southEurope = ['Portugal', 'Greece' , 'Italy' , 'Spain' , 'Croatia' , 'Albania'];
var groupCountry=['NorthernEurope','CentralEurope','SouthernEurope'];
var temp="";
var k=0,k1=0,k2=0,k3=0;
var finalfat=0;
var finalprotein=0;
var finalcarbo=0;
var chartCountry=[];
var chartRegion=[];
var sugar_arr=[];
var salt_arr=[];

//constructor groupChart1
function groupChart1(region1,fat1,protein1,carbohydrate1) { 
  this.region1=region1;  
  this.fat1=fat1;
  this.protein1=protein1;
  this.carbohydrate1=carbohydrate1;
  
};
//constructor groupChart
function groupChart(regions,fats,proteins,carbo){ 
  this.regions=regions;
  this.fats=fats;
  this.proteins=proteins;
  this.carbo=carbo;
  
};
for(var j=0;j<stackBar.length;j++)
{
  sugar_arr[j]=0;   //initializes sugar array to the value zero
  salt_arr[j]=0;    //initializes salt array to the value zero
}
lineReader.on('line', function (line) {           //reading the file line by line
  k=0,k1=0,k2=0,k3=0;
  currentLine=line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);     //splitting a line
  while(i<1) 
  {
    countryIndex=currentLine.indexOf('countries_en');  //get the index of countryIndex
    sugarIndex=currentLine.indexOf('sugars_100g');     //get the index of sugarIndex
    saltIndex=currentLine.indexOf('salt_100g');        //get the index of saltIndex
    fatIndex=currentLine.indexOf('fat_100g');          //get the index of fatIndex
    proteinIndex=currentLine.indexOf('proteins_100g');   //get the index of proteinIndex
    carboIndex=currentLine.indexOf('carbohydrates_100g');  //get the index of carboIndex
    i++;
  }  
  country=currentLine[countryIndex];     //get the data of country
  sugar=currentLine[sugarIndex];         //get the data of sugar
  salt=currentLine[saltIndex];           //get the data of salt
  fat=currentLine[fatIndex];             //get the data of fat
  protein=currentLine[proteinIndex];     //get the data of protein
  carbo=currentLine[carboIndex];         //get the data of carbo
  
   if(sugar=="")
   {
     sugar=0;     //initialize the sugar to zero
   }
   if(salt=="")
   {
     salt=0;     //initialize the salt to zero
   }
   if(country=="")
   {
     country="NULL";  //initialize the country to NULL
   }

   
   if(fat=="")
   {
     fat=0;   //initialize the fat to zero
   }
   if(protein=="")
   {
     protein=0;  //initialize the protein to zero
   }
   if(carbo=="")
   {
     carbo=0;   //initialize the carbo to zero
   }
  
  
     var index=stackBar.indexOf(country);
     if(index!=-1)
     {
      sugar_arr[index]+=parseFloat(sugar); //add zero and sugar value 
      salt_arr[index]+=parseFloat(salt);   //add zero and salt value 
    }

    
    while(k1>=0 && k1<northEurope.length) 
    {
     if((country).includes(northEurope[k1]))
       region="NorthernEurope";        //if the country is present in northEurope,region is assigned to northEurope
     k1++;
   } 

  
   while(k2>=0&&k2<centralEurope.length) 
   {
     if((country).includes(centralEurope[k2]))
       region="CentralEurope";     //if the country is present in centralEurope,region is assigned to centralEurope
     k2++;
   }

   while(k3>=0&&k3<southEurope.length)
   {
     if((country).includes(southEurope[k3]))
       region="SouthernEurope";   //if the country is present in southEurope,region is assigned to southEurope
     k3++;
   }
   if(region){
     regionArray.push(new groupChart1(region,fat,protein,carbo));  //push the values to regionArray
   }
 });

lineReader.on('close', function() {
  for(var m=0;m<stackBar.length;m++)
  {
    var json_obj={};           //declare json_obj
    json_obj["country"]=stackBar[m];  //assigned the stackBar[m] to json_obj[country]
    json_obj["Sugar"]=sugar_arr[m];   //assigned the sugar_arr[m] to json_obj[sugar]
    json_obj["salt"]=salt_arr[m];    //assigned the salt_arr[m] to json_obj[salt]
    chartCountry.push(json_obj);     //push the json_obj to chartCountry
  }
    
  

  for(var m=0;m<groupCountry.length;m++)
  {
    finalfat=0;       //initialize finalfat to zero
    finalprotein=0;   //initialize finalprotein to zero
    finalcarbo=0;     //initialize finalcarbo to zero
    for(var n=0;n<regionArray.length;n++){
      if((regionArray[n].region1).includes(groupCountry[m]))  //check regionArray value is present in groupCountry
      {
        temp=groupCountry[m];     //assign groupCountry[m] to temp
        finalfat=finalfat+parseFloat(regionArray[n].fat1);  //add all fat value and assign to finalfat
        finalprotein=finalprotein+parseFloat(regionArray[n].protein1);   //add all protein value and assign to finalprotein
        finalcarbo=finalcarbo+parseFloat(regionArray[n].carbohydrate1); //add all carbo value and assign to finalcarbo
      }
    }
    chartRegion.push(new groupChart(temp,finalfat.toFixed(2),finalprotein.toFixed(2),finalcarbo.toFixed(2)));  //gruopchart constructor value is pushed into chartRegion

  }
  
fs.writeFile('stackBarChart.json', JSON.stringify(chartCountry) , 'utf-8');  //json file writing for stackBarChart
fs.writeFile('MultiLineChart.json', JSON.stringify(chartRegion) , 'utf-8');  //json file writing for MultiLineChart
});
