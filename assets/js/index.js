$(function () {
    $.ajax({
        type: "GET",
        url: "http://r1fi717rb.hn-bkt.clouddn.com/json/webnav.json",
        dataType: "json",
        success: function (result) {
            init(result);
        }
    });
});

function init(result) {
    initSidebar(result);
    initMain(result);

    function linkId(item){
        var id = "";
        if (item.en_name) {
            id = item.en_name
        } else {
            id = item.name;
        }
        return id;
    }

    function initSidebar(result) {
        var arr = [];
        var liContent = [];

        $.each(result, function (index, item) {
            var navId = linkId(item);
            $(".sidebar").append("<ul class='sidenav'><a href='#" + navId + "'>" + item.name + "</a></ul>");
        });

        $.each(result, function (index, item) {
            if (item.children) {
                var str = "";
                for (var subnav of item.children) {
                    var sudnavId = linkId(subnav);
                    str += "<li class='subnav'><a href='#" + sudnavId + "'>" + subnav.name + "</a></li>";
                }
                liContent.push(str);
                $(".sidenav").each(function () {
                    if ($(this).text() == item.name) {
                        var index = $(this).index();
                        arr.push(index);
                    }
                });
            }
        });
        for (let i = 0; i < arr.length; i++) {
            $(".sidenav").eq(arr[i] - 1).append(liContent[i])
        }

        $(".sidenav").each(function () {
            $(this).on("click", function () {
                $(this).addClass("active");
                $(this).siblings().removeClass("active");
                if ($(this).find("li").length > 0) {
                    $(this).find("li").slideToggle();
                    $(this).siblings().find("li").slideUp();
                    $(this).siblings().find("li").removeClass("active");
                } else {
                    $(this).siblings().find("li").slideUp();
                    $(this).siblings().find("li").removeClass("active");
                }
            })
        });

        $(".subnav").on("click", function (event) {
            $(this).addClass("active");
            $(this).siblings().removeClass("active");
            event.stopPropagation();
        });
    }

    function initMain(result) {
        $.each(result, function (index, item) {
            if (item.children.length == 0) {
                var typeid = linkId(item);
                $(".main").append("<div id='" + typeid + "' class='type'><h4>" + item.name + "</h4><div class='item-wrap'></div></div>");
            } else {
                for (var key of item.children) {
                    var keyid = linkId(key);
                    $(".main").append("<div id='" + keyid + "' class='type'><h4>" + key.name + "</h4><div class='item-wrap'></div></div>");
                }
            }
        });

        var itemContent = [];
        $.each(result, function (index, item) {
            if (item.children.length == 0) {
                var str = "";
                for (let site of item.web) {
                    str += "<div class='item'><a href='" + site.url + "'><img class='logo' src='" + site.logo + "' alt='logo'><span class='title'>" +
                        site.title + "</span><span class='desc'>" + site.desc + "</span></a></div>"
                }
                itemContent.push(str);
            } else {
                for (let subtype of item.children) {
                    var str = "";
                    for (let site of subtype.web) {
                        str += "<div class='item'><a href='" + site.url + "'><img class='logo' src='" + site.logo + "' alt='logo'><span class='title'>" +
                            site.title + "</span><span class='desc'>" + site.desc + "</span></a></div>"
                    }
                    itemContent.push(str);
                }
            }
        });
        for (let i = 0; i < itemContent.length; i++) {
            $(".item-wrap").eq(i).append(itemContent[i]);
        };
    }

    $(".mobile-btn").on("click", function () {
        $(".sidebar").toggle();
    })
}