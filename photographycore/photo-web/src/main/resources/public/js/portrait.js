
<!--页面初始化入口-->
$(document).ready(function () {

    <!--初始化调用-->
    portraitInfos();

    <!--点击事件查询调用-->
    $("#search").on("click", function () {
        portraitInfos();
    });


});



    <!--首页条件查询入口-->
    function portraitInfos(){
        var params = $("#chineseName").val();<!--获取搜索关键词-->
        var param = "chineseName="+params;
        $.ajax({
            type: "post",
            url: "/famous/portrait/getPortraitInfos",
            data: param,
            cache: false,
            sync:false,
            success: function (result) {
                var path = "";
                var firstUrl = "/famous/portrait/downLoad?fileName=";
                var finalUrl = "";
                var a = 1;
                var b = 10;
                var c = 100;
                if (null != result) {
                    for (var i = 0; i < result.length; i++) {
                        var x = "portrait" + (i + a);
                        var y = "porImg" + (i + b);
                        var z = "chname" + (i + c);
                        path = result[i].portraitName;
                        finalUrl = firstUrl + path;
                        var famousId = result[i].famousId;
                        var chineseName = result[i].chineseName;

                        <!--头像div设置-->
                        var portrait = document.createElement("div");
                        portrait.setAttribute("class", x);
                        portrait.setAttribute("style", "float:left;width:250px;height:250px;margin:20px 0;margin:0 20px;text-align: center");

                        <!--图片标签设置-->
                        var proImg = document.createElement("img");
                        proImg.setAttribute("class", y);
                        proImg.setAttribute("src", finalUrl);
                        proImg.setAttribute("style", "width:150px;height:150px;border:solid 20px #666666");
                        portrait.appendChild(proImg);

                        <!--a标签设置-->
                        var a = document.createElement("a")
                        a.setAttribute("href", 'production.html?famousId=' + famousId + '&portraitName=' + path);
                        a.innerText = chineseName;

                        <!--p标签设置-->
                        var p = document.createElement("p");
                        p.setAttribute("class", z);
                        p.appendChild(a);<!--将a放入p中-->
                        portrait.appendChild(p); <!--将p放入div中-->

                        <!--添加到父级标签-->
                        var portraits = document.getElementById("portraits");
                        portraits.appendChild(portrait);

                    }

                }

            }

        });




    };






