// import Librarys
const axios = require('axios');
const express = require('express');
const app = express();
const convert = require("xml-js");


// import tcmb data
const url0 = "https://www.tcmb.gov.tr/kurlar/201202/07022012.xml";
const url1 = "https://www.tcmb.gov.tr/kurlar/201302/07022013.xml";
const url2 = "https://www.tcmb.gov.tr/kurlar/201402/07022014.xml";
const url3 = "https://www.tcmb.gov.tr/kurlar/201501/07012015.xml";
const url4 = "https://www.tcmb.gov.tr/kurlar/201601/07012016.xml";
const url5 = "https://www.tcmb.gov.tr/kurlar/201702/07022017.xml";
const url6 = "https://www.tcmb.gov.tr/kurlar/201802/07022018.xml";
const url7 = "https://www.tcmb.gov.tr/kurlar/201902/07022019.xml";
const url8 = "https://www.tcmb.gov.tr/kurlar/202002/07022020.xml";
const url9 = "https://www.tcmb.gov.tr/kurlar/202101/07012021.xml";
const url10 = "https://www.tcmb.gov.tr/kurlar/202202/07022022.xml";

// compare to data function
function compare(param1,param2){
    const maxValue = [];
    for(var i = 0 ; i<= 9; i++){
        if(parseFloat(param1[i][1]) < parseFloat(param2[i][1])){
            let val1 = (param1[i][1]);
            let val2 =(param2[i][1])
            let result = ((val2 - val1) / val1) * 100 ;
            maxValue.push(result);
        }else{
            let val1 = (param1[i][1]);
            let val2 =(param2[i][1])
            let result = ((val1 - val2) / val2) * 100 ;
            maxValue.push(result);
        }
    }
    var indexOfMaxValue = maxValue.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    const ratioValue = maxValue[indexOfMaxValue];
    return [indexOfMaxValue,ratioValue];
}

//Convert JSON and get data 
const getData = async (promp) => {
    return await axios
        .get(promp)
        .then((res) => {
            let json = convert.xml2json(res.data, {
                compact: true,
                spaces: 4
            });
            json = JSON.parse(json);
            const currency = json["Tarih_Date"]["Currency"];
            const arr = [];
            currency.forEach((c) => {
                const name = c["Isim"]["_text"];
                const forexBuying = c["ForexBuying"]["_text"];
                arr.push([name, forexBuying]);
            });
            return arr;
        }).catch((err) =>{
            err;
        })
}


app.get("/", async (req, res) => { 
    const data0 = await getData(url0);
    const data1 = await getData(url1);
    const data2 = await getData(url2);
    const data3 = await getData(url3);
    const data4 = await getData(url4);
    const data5 = await getData(url5);
    const data6 = await getData(url6);
    const data7 = await getData(url7);
    const data8 = await getData(url8);
    const data9 = await getData(url9);
    const data10 = await getData(url10);

    // Write JSON
    function dataWrite(){
        return(
        [`2012: ${data0[compare(data0,data1)[0]][0]} %${compare(data0,data1)[1]}`,
        `2013: ${data1[compare(data1,data2)[0]][0]} %${compare(data1,data2)[1]}`,
        `2014: ${data2[compare(data2,data3)[0]][0]} %${compare(data2,data3)[1]}`,
        `2015: ${data3[compare(data3,data4)[0]][0]} %${compare(data3,data4)[1]}`,
        `2016: ${data4[compare(data4,data5)[0]][0]} %${compare(data4,data5)[1]}`,
        `2017: ${data5[compare(data5,data6)[0]][0]} %${compare(data5,data6)[1]}`,
        `2018: ${data6[compare(data6,data7)[0]][0]} %${compare(data6,data7)[1]}`,
        `2019: ${data7[compare(data7,data8)[0]][0]} %${compare(data7,data8)[1]}`,
        `2020: ${data8[compare(data8,data9)[0]][0]} %${compare(data8,data9)[1]}`,
        `2021: ${data9[compare(data9,data10)[0]][0]} %${compare(data9,data10)[1]}`]);
    }
    
    
    res.send(dataWrite());
});







app.listen(3000);