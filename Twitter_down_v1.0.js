/*
*
*以下代码已在Auto.js7中调试
*
*
*
*/
var url="https://twdown.net/download.php";
//一个解析视频的网址,起初用https://twdown.net/，提交表单，一直正则选取失败，抓包后
//得知这是get方法，其中的搜索框会重定向到https://twdown.net/download.php，这里才是
//post提交表单的地方

while(true){
    var lingmiaobi = desc("复制推文链接").findOne();
    //text中无值，选取desc，用findOne()一直找，形成阻塞，不选取findOnce()

    if (lingmiaobi) {

        //点击，睡眠1s
        lingmiaobi.click();
        sleep(1000);
    }
    var data=getClip();
    //获得剪切板内容，应用于Auto.js，若是应用于web，要考虑浏览器，比较复杂

    var res=http.post(url,{"URL":data});
    //用post方法提交要解析的网址

    if(res.statusCode >= 200 && res.statusCode < 300){
        toast("页面获取成功!");
    }else if(res.statusCode == 404){
        toast("页面没找到哦...");
    }else{
        toast("错误: " + res.statusCode + " " + res.statusMessage);
    }
    
    var html=res.body.string();
    //获取响应，对此挑需要的解析链接，可直接下载

    /*
    var file =open("html.txt","a");
    file.writeline(html);
    file.flush();
    file.close();
    */
    
    var num=new Array();
    //创建数组，起先直接在下方for循环中var num，报出许多错，对js不熟悉，找了许多方法解决不了，可能是...也不知原因

    var obj = html.match(/(https:\/\/video.twimg.com[^" ']+)/gm);
    //正则选出下载链接，obj应该是object类型，这里的正则在Auto.js软件中" '会变红，找不到解决办法，
    //但解决了其他问题后，这里就没错了，下面的正则也是
    for(var i=0;i<obj.length;i++){
        num[i]=obj[i].match(/(vid\/[^x]+)/gm);
        var str=JSON.stringify(num[i]);
        //这里要转换类型为string，下面的正则才能继续
        num[i]=str.match(/([^vid/]+)/gm);

    }
    var max=num[0];
    //记录高分辨率的链接
    var maxNum=0;
    //高分辨率的链接的序号，下面根据链接中的信息比较选出高分辨率的链接
    for(var i=0;i<num.length;i++){
        if(max<num[i]){
            max=num[i];
            maxNum=i;
        }
    }
    var file =open("ADM.txt","a");
    file.writeline(obj[maxNum]);
    file.flush();
    file.close();
    var url=JSON.stringify(obj[maxNum]);
    setClip(url);
    //设置剪切板内容，若下载器可自动监测剪切板，，就不再需要txt文件
    //在安卓10中ADM的监测剪切板功能失效，只好用txt文件最后倒入链接下载
    toast("完成！");

}
