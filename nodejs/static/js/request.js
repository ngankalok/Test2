/**
 * Created by MacBook Air on 2017/4/11.
 */

var global = {};
(function(window){
    // login
    $("#login-form .submit").click(function(){
        var param = {
            email:$("#login-form .email").val(),
            password:$("#login-form .password").val()
        };
        if(!param.email || !param.password){
            modal("hintBox","Input box cannot be empty");
            return false;
        }
        $.post("/user/login",param,function(data){
            data = JSON.parse(data);
            if(data.status == 0){
                global.userId = data.body;
                modal("sureBox",data.msg,function(){
                    document.getElementById('id02').style.display='none';
                });
            }else{
                var param = data.body;
                modal("inputBox",data.msg,function(code){
                    param.code = code;
                    console.log(param);
                    $.post("/user/code",param,function(data){
                        data = JSON.parse(data);
                        if(data.status == 0){
                            document.getElementById('id02').style.display='none';
                        }else{

                        }
                    });
                });
            }
        });
    });

    // register
    $("#register .signupbtn").click(function(){
        var param = {
            email:$("#register .email").val(),
            password:$("#register .password").val(),
            againPassword:$("#register .again-password").val()
        };
        if(!param.email || !param.password || !param.againPassword){
            modal("hintBox","Input box cannot be empty");
            return false;
        }
        if(param.password != param.againPassword){
            modal("hintBox","Two passwords are inconsistent");
            return false;
        }
        $.post("/user/register",param,function(data){
            data = JSON.parse(data);
            if(data.status == 0){
                modal("sureBox",data.msg,function(){
                    document.getElementById('id02').style.display='none';
                });
            }else{
                modal("hintBox",data.msg);
            }
        });
    });

    // tools func
    function modal(type,content,callback){
        var typeObj = {
            hintBox:getHintBox,
            sureBox:getSureBox,
            sureSelect:getSureSelect,
            inputBox:getInputBox
        };

        function getHintBox(content,callback){
            $(".modal-body p").html(content);
            $(".modal-body .form-group").hide();
            $(".btn-reset").hide();
            $('#myModal').modal('show');
            $(".btn-sure").unbind("click");
            $(".btn-sure").on("click",function(){
                $('#myModal').modal('hide');
            });
        }
        function getSureBox(content,callback){
            $(".modal-body p").html(content);
            $(".modal-body .form-group").hide();
            $(".btn-reset").hide();
            $('#myModal').modal('show');
            $(".btn-sure").unbind("click");
            $(".btn-sure").on("click",function(){
                if(callback){
                    $('#myModal').modal('hide');
                    callback();
                }
            })
        }
        function getSureSelect(content,callback){
            $(".modal-body p").html(content);
            $(".modal-body .form-group").hide();
            $(".btn-reset").show();
            $('#myModal').modal('show');
            $(".btn-sure").unbind("click");
            $(".btn-sure").on("click",function(){
                if(callback){
                    $('#myModal').modal('hide');
                    callback();
                }
            })
        }
        function getInputBox(content,callback){
            $(".modal-body p").html(content);
            $(".modal-body .form-group").show();
            $(".btn-reset").show();
            $('#myModal').modal('show');
            $(".btn-sure").unbind("click");
            $(".btn-sure").on("click",function(){
                var code = $(".modal-body .form-group input").val();
                console.log(code);
                if(callback && code){
                    callback(code);
                    $('#myModal').modal('hide');
                }
            })
        }

        if(typeObj[type] instanceof Function){
            typeObj[type](content,callback);
        }
    }

    // search
    $("#input-search").keyup(function(){
        var keyword = $(this).val();
        if(!keyword){
            $(".search-results-list").empty();
            $(".search-detail").empty();
            return false;
        }
        $.get("/car/search?keyword="+keyword,function(data){
            $(".search-results-list").empty();
            data = JSON.parse(data);
            if(data.body.length == 0){
                $(".search-detail").empty();
                return false;
            }
            var str = '<ul class="list-group">';
            for(var i = 0; i < data.body.length; i++){
                // high-light
                var index = data.body[i].name.toLowerCase().indexOf(keyword.toLowerCase());
                var content = "";
                if(index > 0){
                    content += data.body[i].name.slice(0,index);
                }
                content += '<sapn class="high-light">' + data.body[i].name.slice(index,index + keyword.length) + '</sapn>';
                content += data.body[i].name.slice(index + keyword.length);
                str += '<li class="list-group-item">'+ content +'</li>';
            }
            str += "</ul>";
            $(".search-results-list").append(str);

            $(".search-results-list li").click(function(){
                var index = $(".search-results-list li").index(this);
                var carData = data.body[index];
                var str = '' +
                    '<p style="font-size: 18px;font-weight: bold;">'+data.body[index].name+'</p>'+
                    '<span class="glyphicon glyphicon-heart"></span>' +
                    '<ul class="select-group-list">' +
                    '</ul>' +
                    '<div>' +
                    '<img src="'+ data.body[index].img +'" />' +
                    '</div><div>' +
                    '<p style="text-align:justify;">'+ data.body[index].desc +'</p>' +
                    '</div>';
                $(".search-detail").html(str);
                $(".glyphicon-heart").click(function(){
                    var userId =  global.userId;
                    var str = "";
                    if(!userId){
                        modal("hintBox","do not login");
                        return false;
                    }
                    $.get("/user/group/list?userId="+ userId,function(data) {
                        data = JSON.parse(data);
                        for(var i = 0; i < data.body.length; i++){
                            str += '<li>'+data.body[i].name+'</li>'
                        }
                        $(".select-group-list").html(str);
                        $(".select-group-list li").click(function(){
                            var name = $(this).html();
                            $.get("/user/group/love?userId="+userId+"&name="+name+"&data="+JSON.stringify(carData),function(returnBack){
                                returnBack = JSON.parse(returnBack);
                                modal("hintBox",returnBack.msg);
                                $(".select-group-list").html("");
                            });
                        });
                    });

                });
            });

        });
    });

    // l
    $(".collection-list .add-item").click(function(){
        modal("inputBox",'add group',function(name){
            var userId =  global.userId;
            $.get("/user/group/add?userId="+userId +"&name="+name,function(data){
                getGroupList();
            });
        })
    });

    $(".collection-btn").click(function(){
        document.getElementById('id09').style.display='block';
        getGroupList();
    });
    function getGroupList(){
        var userId =  global.userId;
        if(!userId){
            document.getElementById('id09').style.display='none';
            modal("hintBox","do not login");
            return false;
        }
        $.get("/user/group/list?userId="+ userId,function(data){
            data = JSON.parse(data);
            $(".sub-group-list").html("");
            if(data.body.length == 0){
                $(".group-list").html("");
                return false;
            }
            var str = '<ul class="list-group">';
            for(var i = 0; i < data.body.length; i++){
                str += '<li class="list-group-item">'+data.body[i].name+'<span class="ion-minus-round delete-item">-</span></li>';
            }
            str += '</ul>';
            $(".group-list").html(str);
            $(".delete-item").click(function(event){
                event.stopPropagation();
                var index = $(".delete-item").index(this);
                var name = data.body[index].name;
                console.log(index,name);
                modal("sureSelect","Are you sure delete this?",function(){
                    $.get("/user/group/delete?name="+name + "&userId=" + userId,function(data){
                        data = JSON.parse(data);
                        if(data.status == 0){
                            getGroupList();
                        }
                    });
                });
            });

            $(".group-list li").click(function(){
                var index = $(".group-list li").index(this);
                var list = data.body[index].list;
                var htmlStr = '<h3>Collection List</h3>' +
                    '<ul class="list-group">';
                for(var i = 0; i < list.length; i++){
                    htmlStr += '<li class="list-group-item">'+list[i].name+'<span class="ion-minus-round delete-sub-item">-</span></li>';
                }
                htmlStr += '</ul>';
                $(".sub-group-list").html(htmlStr);
                $(".delete-sub-item").click(function(event){
                    event.stopPropagation();
                    var subIndex = $(".delete-sub-item").index(this);
                    var name = data.body[index].name;
                    modal("sureSelect","Are you sure delete this?",function(){
                        $.get("/user/group/subDelete?subIndex="+subIndex + "&userId=" + userId + "&name="+name,function(data){
                            data = JSON.parse(data);
                            if(data.status == 0){
                                console.log("a");
                                $(".sub-group-list li").eq(subIndex).empty().remove();
                            }
                        });
                    });
                });
            });
        });
    }
})(window);