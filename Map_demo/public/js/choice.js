var HOME_PATH = window.HOME_PATH || '.',
    urlPrefix = 'https://navermaps.github.io/maps.js.ncp/docs/' + '/data/region',
    urlSuffix = '.json',
    regionGeoJson = [],
    loadCount = 0;

for (var i = 1; i < 18; i++) {
    var keyword = i + '';

    if (keyword.length === 1) {
        keyword = '0' + keyword;
    }
    
    $.ajax({
        url: urlPrefix + keyword + urlSuffix,
        success: function (idx) {
            return function (geojson) {
                regionGeoJson[idx] = geojson;
                loadCount++;
                
                if (loadCount === 17) {
                    startDataLayer();
                }
            }
        }(i - 1)
    });
}

var map = new naver.maps.Map(document.getElementById('map'), {
    zoom: 3,
    mapTypeId: 'normal',
    minZoom: 3,
    center: new naver.maps.LatLng(36.4203004, 128.317960)
});

var tooltip = $('<div id="#main_map" style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');

tooltip.appendTo(map.getPanes().floatPane);

function startDataLayer() {
    map.data.setStyle(function (feature) {
        var styleOptions = {
            fillColor: '#D2FFD2',
            fillOpacity: 0.0001,
            strokeColor: '#D2FFD2',
            strokeWeight: 2,
            strokeOpacity: 0.4
        };
        if (feature.getProperty('focus')) {
            styleOptions.fillOpacity = 0.6;
            styleOptions.fillColor = '#FFB4B4';
            styleOptions.strokeColor = '#FFB4B4';
            styleOptions.strokeWeight = 4;
            styleOptions.strokeOpacity = 1;
        }
        return styleOptions;
    });

    regionGeoJson.forEach(function (geojson) {
        map.data.addGeoJson(geojson); 
    });

    map.data.addListener('click', function (e) {
        var feature = e.feature;
            regionName = feature.getProperty('area1');
        if (regionName == "울산광역시" || regionName == "세종특별자치시") {
            alert("데이터 없음."); 
        }
        if (feature.getProperty('focus') !== true) {
            feature.setProperty('focus', true);
            
            $.ajax({
                url: '/regiondata',
                dataType: 'text',
                type: 'GET',
                data: {
                    datax: e.offset.x,
                    datay: e.offset.y,
                    region: regionName
                },
                success: function (result) {
                    if (result) {
                        click_map(result);
                        partycall(result);
                    }
                }
            });
        }
        else {
            feature.setProperty('focus', false);
            location.reload();
        }
    });
    
    map.data.addListener('mouseover', function (e) {
        var feature = e.feature;
        var regionName = feature.getProperty('area1');

        tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
        }).text(regionName);
        
        map.data.overrideStyle(feature, {
            fillOpacity: 0.6,
            strokeWeight: 4,
            strokeOpacity: 1
        });
    });

    map.data.addListener('mouseout', function (e) {
        tooltip.hide().empty();
        map.data.revertStyle();
    });
}
