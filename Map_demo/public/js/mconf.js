function click_map(tossregion) {
    $.ajax({
        url: '/markup',
        dataType: 'text',
        type: 'GET', 
        async: false,
        data: {
            tossregion: tossregion
        },
        success: function (result) {
            if (result) {
                var array = new Array();
                var pars = JSON.parse(result);
                
                for (var i = 0; i < pars.length; i++) {
                    array[i] = JSON.stringify(pars[i].Road_Name).replace('"', '').replace('"', '');
                }
                
                for (var x = 0; x < array.length; x++) {
                    var $address = array[x];
                    naver.maps.Service.geocode({ address: $address }, function (status, response) {

                        if (status !== naver.maps.Service.Status.OK) {
                            return alert(myaddress + '의 검색 결과가 없거나 기타 네트워크 에러');
                        }
                        
                        var result = response.result;
                        var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);
                        var marker = new naver.maps.Marker({
                            position: myaddr,
                            map: map
                        });
                        
                        naver.maps.Event.addListener(marker, "click", function (e) {
                            if (infowindow.getMap()) {
                                infowindow.close();
                                $('.detaildata').css('display', 'none');
                                $(".gn-trigger").children("a").removeClass("gn-selected");
                                $(".gn-trigger").children("nav").removeClass("gn-open-all");
                            } 
                            else {
                                infowindow.open(map, marker);
                                $('#detail_info').click(function () {
                                    var address = $(this).prev().text();

                                    $.ajax({
                                        url: '/detail_info',
                                        dataType: 'text',
                                        type: 'GET',
                                        data: {
                                            address: address
                                        },
                                        success: function (result) {
                                            if (result) {
                                                var pars = JSON.parse(result);
                                                $('.detaildata').css('display', '');
                                                $('.detaildata #Permitted_Area').text(pars[0].Permitted_Area);
                                                $('.detaildata #Cost').text(pars[0].Cost);
                                                $('.detaildata #Date').text(pars[0].Start_Date + ' ~ ' + pars[0].End_Date);
                                                $('.detaildata #Closed_Day').text(pars[0].Closed_Day);
                                                $('.detaildata #Time').text('평일 운영 시간 : ' + pars[0].Weekday_start + ' ~ ' + pars[0].Weekday_End +
                                                    '\n주말 운영 시간 : ' + pars[0].Weekend_Start + ' ~ ' + pars[0].Weekend_End).css('white-space', 'pre-line').css('line-height', '20px');
                                                $('.detaildata #Manage').text('관리 기관 : ' + pars[0].Manage_Area +
                                                    '\n관리 기관 전화번호 : ' + pars[0].Manage_Num).css('white-space', 'pre-line').css('line-height', '20px');
                                                $(".gn-trigger").children("a").addClass("gn-selected");
                                                $(".gn-trigger").children("nav").addClass("gn-open-all");
                                            }
                                        }
                                    });
                                });
                            }
                        });
                        var infowindow = new naver.maps.InfoWindow({
                            content: '<center id="infodetail" style="padding:15px;"><h4>' + result.items[0].address + '</h4><br/><a href="https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardList.do?bbsId=BBSMSTR_000000000267" target="_blank" style="text-decoration:none; color:#3C99DC;">푸드트럭 모집공고 행정안전부</a><br>' +
                                '<h4 style="display:none">' + result.userquery + '</h4>' +
                                '<button id="detail_info" style="padding : 5px 12px; border:none; color:black; text-align:center; background-color:#e7e7e7;">상세 정보</button></center>'
                        });
                    });
                }
            }
        }
    });
}

function partycall(tossregion) {
    var where = JSON.stringify(JSON.parse(tossregion).result).replace('"', '').replace('"', '');
    if (where == "01") {
        $.ajax({
            url: '/party',
            dataType: 'text',
            type: 'GET',
            async: true,
            success: function (result) {
                if (result) {
                    var pars = JSON.parse(result);

                    var City_name = new Array();//시도명   
                    var City_Area = new Array(); //시군구명
                    var Party_Name = new Array(); //축제명 
                    var Party_day = new Array();//축제기간
                    for (var i = 0; i < pars.length; i++) {
                        City_name[i] = JSON.stringify(pars[i].City_name).replace('"', '').replace('"', '');
                        City_Area[i] = JSON.stringify(pars[i].City_Area).replace('"', '').replace('"', '');
                        Party_Name[i] = JSON.stringify(pars[i].Party_Name).replace('"', '').replace('"', '');
                        Party_day[i] = JSON.stringify(pars[i].Party_day).replace('"', '').replace('"', '');
                    }

                    var Concat;
                    for (var x = 0; x < result.length; x++) {

                        Concat = City_name[x].concat(" ", City_Area[x]);
                        var $address = Concat;

                        naver.maps.Service.geocode({ address: $address }, function (status, response) {
                            if (status !== naver.maps.Service.Status.OK) { return alert(myaddress + '의 검색 결과가 없거나 기타 네트워크 에러'); }
                            var result = response.result;
                            // 주소 return : result.items[0].address 
                            // 좌표 return: result.items[0].point.y, result.items[0].point.x 
                            var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);
                            var marker = new naver.maps.Marker({
                                position: myaddr,
                                map: map,
                                icon: {
                                    url: '/js/flag.png',
                                    size: new naver.maps.Size(22, 35),
                                    origin: new naver.maps.Point(0, 0),
                                    anchor: new naver.maps.Point(11, 35),
                                    scaledSize: new naver.maps.Size(22, 35)
                                }
                            });

                            naver.maps.Event.addListener(marker, "click", function (e) {
                                if (infowindow.getMap()) {
                                    infowindow.close();
                                } else {
                                    infowindow.open(map, marker);
                                }
                            });
                            var infowindow = new naver.maps.InfoWindow({
                                content: '<h4>' + result.items[0].address + '</h4>' + '<h4>' + "행사 및 축제" + '</h4>'
                            });
                        });
                    }

                }
            }
        });
    }
}