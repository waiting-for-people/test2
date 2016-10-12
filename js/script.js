    //get请求函数
    function getrequest(url,request,callback){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (){
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    callback(xhr.responseText);
                }else{
                    alert("Request was unsuccessful: " + xhr.status);
                }
            }
        }
        xhr.open("get",url + "?" + request,true);
        xhr.send();
    }
    //cookie设置函数
    function setCookie(cname,cvalue,extime){
        var d = new Date();
        d.setTime(d.getTime()+(extime*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";" + expires;
    }
    //cookie获取函数
    function getCookie(key){
        var arr1 = document.cookie.split('; ');
        for (var i = 0; i < arr1.length; i++) {
            var arr2 = arr1[i].split('=');
            if(arr2[0] === key ){
                return decodeURI(arr2[1]);
            }
        }
    }
    //顶部消息提示
    function prompt(){
        var popprompt = document.getElementById("prompt");
        var popalerts = document.getElementById("alerts");
        if(getCookie("calerts")){
            popprompt.style.display = "none";
        }else{
            popalerts.onclick = function(){
                setCookie("calerts",true,3600);
                popprompt.style.display = "none";
            }
        }
    }
    prompt();
    //关注点击登陆
    function login(){
        var loginbt = document.getElementById("loginbt");
        var poplog = document.getElementById("poplog");
        var popclose = document.getElementById("popclose");
        var popinputs = poplog.getElementsByTagName('input');
        var poplabels = poplog.getElementsByTagName('label');
        var popsubmit = document.getElementById("popsubmit");       
        var cancel = document.getElementById("cancel");
        function focus(i){
            popinputs[i].onfocus = function(){poplabels[i].style.display = 'none';};
            popinputs[i].onblur = function(){
                if(this.value ===''){
                    poplabels[i].style.display = 'block';
                }
            };
        }
        focus(0);
        focus(1);
        
        popclose.onclick = function(){ poplog.style.display = 'none'; };
        if( !getCookie ('loginSuc') ){
            loginbt.onclick = function(){ 
                poplog.style.display = 'block';
            };
        }else{
            loginbt.value = '已关注';
            loginbt.disabled = false;
            loginbt.className = 'active';
            cancel.style.display = 'block';
        }
            
        popsubmit.onclick = function(){
            var userName1 = hex_md5(popinputs[0].value);
            var password1 = hex_md5(popinputs[1].value);
            getrequest('https://study.163.com/webDev/login.htm',"userName=" + userName1 + "&password=" + password1,function(logindata){
                if(logindata === '1' ){
                    poplog.style.display = 'none';
                    setCookie ('loginSuc', '1', 1);
                    getrequest('https://study.163.com/webDev/attention.htm',"",function(focusdata){
                        if(focusdata === '1' ){
                            setCookie ('followSuc', '1', 1);
                            loginbt.value = '已关注';
                            loginbt.disabled = true;
                            loginbt.className = 'active';
                            cancel.style.display = 'inline-block';
                        }                        
                    });
                }else{alert("账号密码不正确");}                
            });
        }
        cancel.onclick = function(){
            setCookie('followSuc','',-1);
            setCookie('loginSuc','',-1);
            loginbt.value = '关注';
            loginbt.disabled = false;
            loginbt.className = 'attention';
            this.style.display = 'none';
        }
    }
    login();

    // 轮播图
    function lbtfunction(){
        var lbtcontainer = document.getElementById("lbtcontainer");
        var lbtdiv = document.getElementById("lbtcontainer").getElementsByTagName('div');
        var lbti = document.getElementById("lbt-pointer").getElementsByTagName('i');
        var index = 0;
        var nowindex = index;
        function change(){
            for(var j=0; j<lbti.length; j++){
                lbti[j].className="";
                lbtdiv[j].className = "";
            }
            lbtdiv[nowindex].className = "lbtactive1";
            index = (index+1)%3;
            lbtdiv[index].style.opacity = "0";
            // lbtdiv[index].style.display = "block";
            lbti[index].className="lbt-current";
            var t = 1;
            var t1 = setInterval(b,10);
            function b(){
              var k = t/50 +'';
              lbtdiv[index].style.opacity = k;
              t++;
              if(t>50)
                clearInterval(t1);
            }
            lbtdiv[index].className = "lbtactive2";
            nowindex = index;
        }
        //设定定时器每隔5秒钟切换一张图片
        var t3=setInterval(change,5000);
        //鼠标hover暂停图片切换
        lbtcontainer.onmouseover=function(){
          clearInterval(t3);//停止轮播   
        }
        lbtcontainer.onmouseout=function(){
          t3=setInterval(change,5000);
        }
        //点击跳转功能
        for(var i=0; i<lbti.length; i++){
            lbti[i].onclick = function(){
                index = parseInt(this.getAttribute('value'));
                change();
                //停止轮播
                clearInterval(t3);
            }
        }
    }
    lbtfunction();
    
    //tap课程数据
    function tabfunction(){
        var contow1 = document.getElementById('cont_tow_1');
        var contow2 = document.getElementById('cont_tow_2');
        //参数pageNo当前页码 ;psize每页返回数据个数 ;type筛选类型（10：产品设计；20：编程语言） ;
        function get(pageNo,psize,type,element){
            var str ="pageNo=" + pageNo + "&psize=" + psize + "&type=" + type;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (){
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        var data = JSON.parse(xhr.responseText);
                        //根据返回数据生成页面Tab区内容
                        for( var i=0; i<data.list.length; i++){
                            var oTeam = document.createElement('div');
                            oTeam.className = 'm-team'
                            element.appendChild(oTeam);
                            var oImg = document.createElement('img');
                            var oP = document.createElement('p');
                            var oDiv = document.createElement('div');
                            var oSpan = document.createElement('span');
                            var oStrong = document.createElement('strong');
                            var oA = document.createElement('a');
                            oImg.src = data.list[i].middlePhotoUrl;
                            oP.className = 'coursename f-toe';
                            oP.innerHTML = data.list[i].name;
                            oDiv.className = 'provider';
                            oDiv.innerHTML = data.list[i].provider;
                            oSpan.innerHTML = data.list[i].learnerCount;
                            if(!data.list[i].categoryName){
                                  data.list[i].categoryName = '无';
                            }
                            oA.innerHTML = '<img src="' + data.list[i].middlePhotoUrl +'" /><h3>' + data.list[i].name
                             + '</h3><span>' + data.list[i].learnerCount + '人在学</span><p class="categoryname">发布者：' + data.list[i].provider
                              + '</br>分类：' + data.list[i].categoryName + '</p><div class="description1"><p class="description">' +  data.list[i].description + '</p></div>';
                            if( data.list[i].price == 0){
                                oStrong.innerHTML = '免费';
                            }else{
                            oStrong.innerHTML = '￥' + data.list[i].price;
                            }
                            oTeam.appendChild(oImg);
                            oTeam.appendChild(oP);
                            oTeam.appendChild(oDiv);
                            oTeam.appendChild(oSpan);
                            oTeam.appendChild(oStrong);
                            oTeam.appendChild(oA);                        
                        }
                    }
                }
            }
            xhr.open("get",'https://study.163.com/webDev/couresByCategory.htm?' + str,true);
            xhr.send();
        }
        var nowwidth;
        document.body.offsetWidth < 1205 ? nowwidth = 15 : nowwidth = 20;
        /* 打开网页默认的请求 */
        get(1,nowwidth,10,contow1);
        //检测屏幕大小调整请求数据数量
        var mincss = document.getElementById("mincss");
        var minif = false;
        //函数自关闭重调用需要 全局变量
        xsize = function(){
            window.onresize = function() {
                window.onresize = null;
                setTimeout("xsize();",1000);
                if(document.body.offsetWidth <= 1205) {
                    if(minif){
                        return;
                    }else{
                        mincss.href = "min.css";
                        nowwidth = 15;
                        settappage();
                        minif=true; 
                    }
                }else{
                    if(minif){
                        mincss.href = "";
                        nowwidth = 20;
                        settappage();
                        minif=false;              
                    }else{
                       return;
                    }           

                }
            }
        }
        xsize();
        /*TAP页面数据请求设置的函数*/
        var nowpage = 1;
        var page = document.getElementById("page");
        var pageup = document.getElementById("pageup");
        var pagedown = document.getElementById("pagedown");
        var tap1 = document.getElementById("tow1");
        var tap2 = document.getElementById("tow2");
        var pageli = page.getElementsByTagName('li');
        function settappage(){
            for(var j=0; j<pageli.length; j++){
                pageli[j].className = '';
            }
            pageli[nowpage-1].className = 'active-page';
            if(tap1.className=="on"){
                contow1.innerHTML = "";
                get(nowpage,nowwidth,10,contow1);
            }else{
                contow2.innerHTML = "";
                get(nowpage,nowwidth,20,contow2);
            }   
        }
        //tabpage 翻页器
        function tappage(){
            pageli[nowpage-1].className = 'active-page';
            for(var i=0; i<pageli.length; i++){
                pageli[i].index = i;
                pageli[i].onclick = function(){
                    nowpage = this.index+1;
                    settappage();
                }
            }
            pageup.onclick = function(){
                nowpage = nowpage>1 ? --nowpage : 1;
                settappage();
            }
            pagedown.onclick = function(){
                nowpage = nowpage>7 ? 8 : ++nowpage;
                settappage();
            }
            /* tap切换控制 */
            tap1.onclick = function(){
                setTab("tow",1,2);
            }
            tap2.onclick = function(){
                setTab("tow",2,2);
            }
            function setTab(name, m, n) {
                nowpage = 1;
                for (var i = 1; i <= n; i++) {
                    var menu = document.getElementById(name + i);
                    var showDiv = document.getElementById("cont_" + name + "_" + i);
                    if(i==m){
                        menu.className = "on";
                        showDiv.style.display = "block";
                    }else{
                        menu.className = "";
                        showDiv.style.display = "none";
                    }
                }
                settappage();
            }
        }
        tappage();
    }
    tabfunction();

    //右侧热门排行
    function rankingfunction(){
        var mwrap2 = document.getElementById("mwrap2");
        getrequest("https://study.163.com/webDev/hotcouresByCategory.htm","",function(a){
            var data = JSON.parse(a);
            for( var i=0; i<20; i++){
                mwrap2.innerHTML += '<a href="' + data[i].providerLink + '">\
                <div><img src="' + data[i].smallPhotoUrl + '" /></div><p>' + data[i].name + '</p><span>' + data[i].learnerCount + '</span></a>';
            }
        });
        //热门排行推荐变换
        function rankingchange(){
            function move(){
                if( mwrap2.style.top == '-700px'){
                    mwrap2.style.top = 0;
                }
                else{
                    mwrap2.style.top = parseInt(mwrap2.style.top) - 70 + 'px';
                    }
            }
            var t5 = setInterval(move,5000);
            mwrap2.onmouseover = function(){
                clearInterval(t5);
                };
            mwrap2.onmouseout = function(){
                t5 = setInterval(move,5000);
                };
        }
        rankingchange();
    }
    rankingfunction();
    //视频弹窗
    function videofunction(){
        var videoimg = document.getElementById("videoimg");
        var popbox = document.getElementById("popbox");
        var videoclose = document.getElementById("videoclose");
        var video = document.getElementById("video");
        videoimg.onclick = function(){
            popbox.style.display = "block";
            videoclose.onclick = function(){
                popbox.style.display = "none";
                video.pause();
            }
        }
    }
    videofunction();