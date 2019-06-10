
//初始化时加载
$(document).ready(function () {

     var url = document.URL;
     var famousId = "";
     var portraitName = "";
     var paraString = [];
     var paraString1 =[];
     var paraString2 = [];
     var subStart = 0;
     var subEnd = 0;
     var params = "";
     var productionId = "";
     var param = "";


    //获取名人ID函数
    if( url.indexOf("&") > 0)
    {
        //进入多个作品详情页
        function getFamousId(url){
            subStart = url.indexOf("?") + 1;
            subEnd = url.length;
            params = url.substring(subStart,subEnd);
            paraString = params.split("&");
            var sfamousId = paraString[0];
            var sportraitName = paraString[1];
            paraString1 = sfamousId.split("=");
            paraString2= sportraitName.split("=");
            famousId = paraString1[1];
            portraitName = paraString2[1];
        }
        getFamousId(url);//函数调用
        param = 'famousId='+famousId;
        console.log("===param参数：====================="+param);

    }else{
        //进入单个作品详情页
        function getFunctionId(url){
            subStart = url.indexOf("?") + 1;
            subEnd = url.length;
            params = url.substring(subStart,subEnd);
            paraString = params.split("=");
            productionId = paraString[1];
        }
        getFunctionId(url);
        param =  'productionId='+productionId;
        console.log("===param参数：====================="+param);
    }


        //发送ajax请求，查询作品详情
        $.ajax({
         type: "post",
         url:"/famous/production/getFamousProductionById",
         data:param,
         dataType:"json",
         success:function(result){

                 var s = "pImg";
                 var u = "titleDiv" ;
                 var v = "pName" ;
                 var w = "fChineseName" ;
                 var x = "fEnglishName" ;
                 var y = "pYear";
                 var z = "pContent" ;
                 var firstUrl = "/famous/portrait/downLoad?fileName=";
                 var finalUrl = "";
                 if(portraitName!=""){
                     finalUrl = firstUrl + portraitName;
                 }else{
                     finalUrl = firstUrl + result.portraitName;
                 }

                 var proDiv = document.getElementById("proDiv");//总div
                 var titleDiv = document.createElement("div");//标题div
                 titleDiv.setAttribute("class",u);
                 titleDiv.setAttribute("style","width: 300px;height: auto; margin: auto;margin-top:40px;text-align: center;align: center;")
                 proDiv.appendChild(titleDiv); //标题div加入总div
                 <!--头像-->
                 var proImg = document.createElement("img");
                 proImg.setAttribute("class",s);
                 proImg.setAttribute("src", finalUrl);
                 proImg.setAttribute("style", "width:55px;height:55px;border-radius:50%;");
                 titleDiv.appendChild(proImg);
                 //作品名
                 var pName = document.createElement("p");
                 pName.setAttribute("class",v);
                 pName.setAttribute("style","font-family: \"黑体\";font-size: 16px;font-weight:bold;");
                 pName.innerText = result.productionName;
                 titleDiv.appendChild(pName);
                 //作者中文名
                var fChineseName = document.createElement("p");
                fChineseName.setAttribute("class",w);
                fChineseName.setAttribute("style","font-family: \"微软雅黑\";font-size: 14px;");
                fChineseName.innerText = result.chineseName;
                titleDiv.appendChild(fChineseName);
                //作者英文名
                var fEnglishName = document.createElement("p");
                fEnglishName.setAttribute("class",x);
                fEnglishName.setAttribute("style","font-family: \"Microsoft YaHei\";font-size: 14px;");
                fEnglishName.innerText = result.englishName;
                titleDiv.appendChild(fEnglishName);
                //发表年份
                var pYear = document.createElement("p");
                pYear.setAttribute("class",y);
                pYear.setAttribute("style","font-family:\"楷体\";font-style: oblique;font-size: 14px;");
                pYear.innerText = result.publishedYear;
                titleDiv.appendChild(pYear);

                var pContent = document.createElement("div");
                 pContent.setAttribute("class",z);
                 pContent.setAttribute("style","width: 800px;height: auto;margin: auto;font-family: \"微软雅黑\";font-size:14px;");
                 pContent.innerText = result.productionContent;
                 proDiv.appendChild(pContent);//内容div加入总div
         }
     });
});




