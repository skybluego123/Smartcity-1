
require('cesium/Widgets/widgets.css');
require('./css/main.css');
var Cesium = require('cesium/Cesium');


Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMzYyNDZmZi1lYTdhLTQwMDgtOGRhZC03ZDE5YTlkYmVkMGMiLCJpZCI6NDAxOSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTUzOTYzODc1OX0.Kb7k51vZGYR5F7btrBIAuSan3ZNyKY_AWrFv1cLFUFk';
var numClicks = 0;
var toolbar = document.getElementById('toolbar');
var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain({
       //     requestVertexNormals: true,
            requestWaterMask: true

        }),
    timeline: true,
    animation: true,
    shadows: true,

});



var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
slider.oninput = function() {
  output.innerHTML = this.value;
}


var slider1 = document.getElementById("myRange1");
var output1 = document.getElementById("demo1");
output1.innerHTML = slider1.value;
slider1.oninput = function() {
  output1.innerHTML = this.value;
}

var myPos = { my: "center center", at: "center-370 center", of: window };
var myPos_right = { my: "center center", at: "center+370 center", of: window };
// var tileset = viewer.scene.primitives.add(
//     new Cesium.Cesium3DTileset({
//         url: Cesium.IonResource.fromAssetId(37161)
//     })
// );

// var tileset = viewer.scene.primitives.add(
//     new Cesium.Cesium3DTileset({
//         url: Cesium.IonResource.fromAssetId(36440)
//     })
// );
//viewer.zoomTo(tileset);

var r= 0, g=255, b=0;
var fadeColor = new Cesium.CallbackProperty(function(t, result){
    r=slider.value;
    g=255-slider.value;
    return Cesium.Color.fromBytes(r, g, b, 255, result);
}, false);

// var tf = new Cesium.CallbackProperty(function(){
//     if (slider.value>10)
//       return true;
//     }
//     else
//       return false;
// }, false);



function distance_to_reported(reported_long,reported_lat,inlet_long,inlet_lat)
{
      var R = 6371; // km
      var dLat = toRad(inlet_lat-reported_lat);
      var dLon = toRad(inlet_long-reported_long);
      var lat1 = toRad(reported_lat);
      var lat2 = toRad(inlet_lat);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      if(d > 0.5)
        return false;
      else
        return true;
}

// function getCallbackFunction(reported_long,reported_lat,inlet_long,inlet_lat) {
   

//     return function callbackFunction() {
//         var R = 6371; // km
//       var dLat = toRad(inlet_lat-reported_lat);
//       var dLon = toRad(inlet_long-reported_long);
//       var lat1 = toRad(reported_lat);
//       var lat2 = toRad(inlet_lat);

//       var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
//       var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//       var d = R * c;
//       console.log(d)
//       var show_or_not=false;
//        if(d > 0.5)
//         return false;
//       else
//         return true;
//     };
// }
function getCallback(long,lat) {
   

    return function callbackFunction() {
    var poss_arr=[long-0.00005, lat-0.00005,
              long+0.00005, lat-0.00005,
              long+0.00009, lat+0.00009,
              long-0.00005, lat+0.00005,
              long-0.00007, lat+0.00007
          ];
var poss=Cesium.Cartesian3.fromDegreesArray(poss_arr);
if(slider1.value > 10)
{
 let temp=parseFloat((slider1.value-10)/1000000);
    let poss1=Cesium.Cartesian3.fromDegreesArray([poss_arr[0]-temp,poss_arr[1]-temp,poss_arr[2]+temp,poss_arr[3]-temp
    ,poss_arr[4]+temp,poss_arr[5]+temp,poss_arr[6]-temp,poss_arr[7]+temp,poss_arr[8]-temp,poss_arr[9]+temp]);
 return new Cesium.PolygonHierarchy(poss1);
}
  


    };
}




var water_height = new Cesium.CallbackProperty(function(result){
      water_height=slider.value;
      water_height += 0.1;
    return water_height;
},false);

let API_KEY = '49406c4e8b6ee455d1904676a313aa40';
function getWeather(latitude, longtitude) {
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/forecast',
    data: {
      lat: latitude,
      lon: longtitude,
      units: 'imperial',
      APPID: API_KEY
    },
    success: data => {
      console.log(data['list'][30]['weather'][0]['main']);
      var temperature=data['list'][0]['main']['temp']; //humidity
      var humidity=data['list'][0]['main']['humidity'];
      var windSpeed=data['list'][0]['wind']['speed'];
      var desc=data['list'][30]['weather'][0]['main'];
      var curr_time=data['list'][0]['dt_txt'];
      console.log(curr_time)
      var tempElement = document.getElementById("temperature");
        tempElement.innerHTML = `${temperature}<i id="icon-thermometer" class="wi wi-thermometer"></i>` ;
      var humidityElem = document.getElementById("humidity");
        humidityElem.innerHTML = `${humidity}%`;
      var windElem = document.getElementById("wind");
        windElem.innerHTML = `${windSpeed}m/h`;
      var description = document.getElementById("description");
        description.innerHTML = `<i id="icon-desc" class="wi wi-owm-200"></i><p>${desc}</p>`;
      var time =document.getElementById("time");
        time.innerHTML = `${curr_time}`;
      
    }
  })
}

getWeather(40.863372, -74.113181);


function coordinate_to_address(objects,callback)
{
  objects=objects.slice(0,3);
  var geocode_address=[];
      for(let object of objects)
      {
        var input = object['cluster_latitude']+','+object['cluster_longitude'];
        var latlngStr = input.split(',', 2);
        var latlng = new google.maps.LatLng(parseFloat(latlngStr[0]), parseFloat(latlngStr[1]));
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': latlng}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
              geocode_address.push(results[0]['formatted_address']);
                if(geocode_address.length == (objects.length)){
                  if(typeof callback == 'function'){
                    callback();
                  }
                }
          }
          else {
            alert('Geocoder failed due to: ' + status);
          }
        });
      }  
}

//Generate the dialog box
function map_create(img_id)
{
  console.log("img_id"+img_id)
  var mapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: baltimore,
    zoom: 14
  }
  var cur=img_id;
  var res_obj;
  var res_img;
  res_obj = cur.substring(1, 2);
  res_img = parseInt(cur.substring(3, 4));
  console.log(res_img);
  let object_lat = vulnerable_objects[object_indicator]['cluster_latitude'];
  let object_lon = vulnerable_objects[object_indicator]['cluster_longitude'];
  let observer_lat = vulnerable_objects[object_indicator]['cluster_objects'][res_img]['latitude'];
  let observer_lon = vulnerable_objects[object_indicator]['cluster_objects'][res_img]['longitude'];      
  var baltimore = new google.maps.LatLng(object_lat, object_lon);
  console.log(observer_lat)
  console.log(object_lon)
  var baltimore1 = new google.maps.LatLng(observer_lat, observer_lon);
  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'),
    {
        position: baltimore1,
        pov: {heading: 4, pitch: 10},
        zoom: 2
    });
  var map = new google.maps.Map(
      document.getElementById('canvasMap'),
      {
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: baltimore1,
          zoom: 14
      });
      var cafeMarker2 = new google.maps.Marker({
          position: baltimore,
          map: map,
          icon: 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569',
          title: 'utility pole'
      });
      var cafeMarker1 = new google.maps.Marker({
          position: baltimore,
          map: panorama,
          icon: 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569',
          title: 'utility pole'
      });
      google.maps.event.addListener(panorama, 'position_changed', function(){
          var heading = google.maps.geometry.spherical.computeHeading(panorama.getPosition(), cafeMarker2.getPosition());
          panorama.setPov({
              heading: heading,
              pitch: 0
          }); 
    });
      map.setStreetView(panorama);
}

function img_dialog(img_id)
{ 
    let wWidth = $(window).width();
    let wHeight = $(window).height();
    let dWidth = wWidth *0.5;
    let dHeight = wHeight * 0.5;
    console.log("img_dialog called")
    $("#dialog2").dialog('close');
    $("#dialog2").dialog({
      width: dWidth,
      resizable: false,
      draggable: true,
      height: dHeight,
      position: myPos_right,
      buttons: {
      Close: function() {
          $(this).dialog('close');
        }
      },
      open: function(){
          map_create(img_id);
      }
    }
);
}

viewer.scene.globe.depthTestAgainstTerrain = true;
var initialPosition = Cesium.Cartesian3.fromDegrees(-95.334726705707027, 29.764084676987729, 253);
 var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(21.27879878293835, -21.34390550872461, 0.0716951918898415);
viewer.clock.shouldAnimate = true; 


viewer.scene.camera.setView({
    destination: initialPosition,
    orientation: initialOrientation,
    endTransform: Cesium.Matrix4.IDENTITY
});
// viewer.camera.setView({
//    destination: Cesium.Cartesian3.fromDegrees(-122.19, 46.20, 10000.0)
// });
var CheckFloodI = document.getElementById('x'); 
var CheckPowerI = document.getElementById('y');  //updateobj
var updateP = document.getElementById('updateobj');


var power3 = Cesium.GeoJsonDataSource.load('./geoMappings/power.geojson');
var power4 = Cesium.GeoJsonDataSource.load('./geoMappings/powerSub.geojson');
var power5 = Cesium.GeoJsonDataSource.load('./geoMappings/wire.geojson');
var flood1 = Cesium.GeoJsonDataSource.load('./geoMappings/dStormInlet_L5457_ver3.geojson');

var vulnerable_objects;
var object_indicator;
var url =Cesium.buildModuleUrl("./images/power.png");

var inlet_longs=[]
var inlet_lats=[]
var entity_array=[]
fetch("./geoMappings/dStormInlet_L5457_ver3.json")
  .then(response => response.json())
  .then(function(json){
    let inlets=json['features'];
    for(let inlet of inlets)
    {
      let inlet_long = inlet['geometry']['coordinates'][0];
      let inlet_lat = inlet['geometry']['coordinates'][1];
      inlet_longs.push(inlet_long)
      inlet_lats.push(inlet_lat)

    }
  
let target_long=inlet_longs[40]
let target_lat=inlet_lats[40]

//draw_polygon(inlet_longs,inlet_lats,target_long,target_lat)
for(let i =0;i<inlet_longs.length;i++)
  {
    let poss_arr=[inlet_longs[i]-0.00005,inlet_lats[i]-0.00005,
              inlet_longs[i]+0.00005, inlet_lats[i]-0.00005,
              inlet_longs[i]+0.00009, inlet_lats[i]+0.00009,
              inlet_longs[i]-0.00005, inlet_lats[i]+0.00005,
              inlet_longs[i]-0.00007, inlet_lats[i]+0.00007
          ];

let poss=Cesium.Cartesian3.fromDegreesArray(poss_arr);


    let entity_example=new Cesium.Entity();
    entity_example.polygon={
        hierarchy:new Cesium.CallbackProperty(getCallback(inlet_longs[i],inlet_lats[i]), false),//new Cesium.PolygonHierarchy(poss),//getCallback(inlet_longs[i],inlet_lats[i]),
        material: Cesium.Color.RED.withAlpha(0.5),
        heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
        show: true
    }
    entity_array.push(entity_example);
    viewer.entities.add(entity_example);
  }

  });

  
function draw_polygon(center_long,center_lat,target_long,target_lat)
{
  for(let i =0;i<center_long.length;i++)
  {
    let poss_arr=[center_long[i]-0.00005,center_lat[i]-0.00005,
              center_long[i]+0.00005, center_lat[i]-0.00005,
              center_long[i]+0.00009, center_lat[i]+0.00009,
              center_long[i]-0.00005, center_lat[i]+0.00005,
              center_long[i]-0.00007, center_lat[i]+0.00007
          ];

let poss=Cesium.Cartesian3.fromDegreesArray(poss_arr);
    let entity_example=new Cesium.Entity();
    entity_example.polygon={
        hierarchy: new Cesium.PolygonHierarchy(poss),
        material: Cesium.Color.RED.withAlpha(0.5),
        heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
        show: tf
        // show: new Cesium.CallbackProperty(getCallbackFunction(target_long,target_lat,center_long,center_lat), false)
//         show: new Cesium.CallbackProperty(function(reported_long,reported_lat,inlet_long,inlet_lat){
//       //   var R = 6371; // km
//       // var dLat = toRad(inlet_lat-reported_lat);
//       // var dLon = toRad(inlet_long-reported_long);
//       // var lat1 = toRad(reported_lat);
//       // var lat2 = toRad(inlet_lat);

//       // var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//       // Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
//       // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//       // var d = R * c;
//       let d=0.1;
//       if(d > 0.5)
//         return false;
//       else
//         return true;

// }, false);

    }
    entity_array.push(entity_example);
    viewer.entities.add(entity_example);
  }
 // console.log(entity_array.length)
}

// function polygon_coordinate(center_long,center_lat)
// {
//   let poss_arr=[center_long-0.00005,center_lat-0.00005,
//               center_long+0.00005, center_lat-0.00005,
//               center_long+0.00009, center_lat+0.00009,
//               center_long-0.00005, center_lat+0.00005,
//               center_long-0.00007, center_lat+29.764084676987729+0.00007
//           ];

// let poss=Cesium.Cartesian3.fromDegreesArray(poss_arr);
// var dynamicPositions = new Cesium.CallbackProperty(function() {
//     let temp=parseFloat(slider1.value/1000000);
//     var poss1=Cesium.Cartesian3.fromDegreesArray([poss_arr[0]-temp,poss_arr[1]-temp,poss_arr[2]+temp,poss_arr[3]-temp
//     ,poss_arr[4]+temp,poss_arr[5]+temp,poss_arr[6]-temp,poss_arr[7]+temp,poss_arr[8]-temp,poss_arr[9]+temp]);
//     return new Cesium.PolygonHierarchy(poss1);
// }, false);
// return new Cesium.PolygonHierarchy(poss1);
// }

function toRad(Value) 
{
      return Value * Math.PI / 180;
}

function distance_to_reported(reported_long,reported_lat,inlet_long,inlet_lat)
{
      var R = 6371; // km
      var dLat = toRad(inlet_lat-reported_lat);
      var dLon = toRad(inlet_long-reported_long);
      var lat1 = toRad(reported_lat);
      var lat2 = toRad(inlet_lat);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      if(d > 0.5)
        return false;
      else
        return true;
}

var object_loc;
fetch('https://sk4a447dkf.execute-api.us-east-1.amazonaws.com/default/localize')
  .then(response => response.json())
  .then(function(json){
      let objects = json['objects'];
      vulnerable_objects = objects;

    for(let object of objects){
      let entity = new Cesium.Entity();
      entity.position = Cesium.Cartesian3.fromDegrees(object['cluster_longitude'],object['cluster_latitude'], 0);
      entity.name = object['cluster_id'];
      let lat =object['cluster_latitude'];
      let lon =object['cluster_longitude'];
      let name=object['cluster_id'];
      let cluster_obj=object['cluster_objects'];
      let image_url = cluster_obj[0]['image'];
      let image_date= cluster_obj[0]['createdDate'];
      let object_type=cluster_obj[0]['classification'];
      let cluster_addr=object['cluster_address'];

      entity.description = '\
      <style>\
      .rotate90 {\
        -webkit-transform: rotate(90deg);\
        -moz-transform: rotate(90deg);\
        -o-transform: rotate(90deg);\
        -ms-transform: rotate(90deg);\
        transform: rotate(90deg);\
        float: center;\
        text-align: center;\
        font-style: italic;\
        text-indent: 0;\
        border: thin silver solid;\
        margin: 0.5em;\
        padding: 0.5em;\
        width:100%;\
        min-width: 150px;\
      }\
      .cesium-infoBox-description {\
        font-family: "Times New Roman", Times, serif;\
        font-size: 6px;\
        padding: 4px 10px;\
        margin-right: 4px;\
        color: #edffff;\
      }\
      .cesium-infoBox-defaultTable tr:nth-child(odd) {\
        background-color: rgba(38, 38, 38, 1.0);\
        font-size:small;\
      }\
      .cesium-infoBox-defaultTable tr:nth-child(even) {\
        background-color: rgba(38, 38, 38, 1.0);\
        font-size:small;\
      }\
      .cesium-infoBox-defaultTable th {\
        font-weight: normal;\
        padding: 4px;\
        vertical-align: middle;\
        text-align: center;\
        font-size:small;\
      }\
      .cesium-infoBox-defaultTable td {\
        padding: 4px;\
        vertical-align: middle;\
        text-align: center;\
        font-size:small;\
      }\
      .cesium-infoBox-visible {\
        transform: translate(0, 0);\
        visibility: visible;\
        opacity: 0;\
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;\
      }\
    </style>\
    <br style = "line-height:1;"><br>\
    <table class="cesium-infoBox-defaultTable">\
      <tr>\
        <th>classification</th>\
        <th>'+object_type+'</th>\
      </tr>\
      <tr>\
        <td>Object id</td>\
        <td>'+name+'</td>\
      </tr>\
      <tr>\
        <td>Coordinate</td>\
        <th>'+lat+'   '+lon+'</th>\
      </tr>\
      <tr>\
        <td>Receive Date</td>\
        <th>'+image_date.substring(0,10)+'</th>\
      </tr>\
      <tr>\
        <td>Address</td>\
        <th>'+cluster_addr+'</th>\
      </tr>\
      <tr>\
        <td>Analysis Results</td>\
      </tr>\
    </table>\
    <br style = "line-height:8;"><br>\
    <img data-object-id='+entity.name+' class="rotate90" src='+image_url+' >\
    <br style = "line-height:10;"><br>\
  ';
    entity.point = {
    color : Cesium.Color.BLUE,
    pixelSize : 15,
  };
    var updated=viewer.entities.add(entity);
      }
  });

var current_id="xx";
var current_id1="xx";
var current_c="0";
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(click) {
           // Get current mouth position
            var pick = viewer.scene.pick(click.position);
            //pick current entity
            if(pick && pick.id){
              console.log(pick.id._name)
              object_indicator=pick.id._name;
            }
         }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

viewer.infoBox.frame.addEventListener('load', function() {
  viewer.infoBox.frame.contentDocument.body.addEventListener('click', function(e) {
  console.log("frame clicked")
  console.log(e.target.className)
  console.log(e.target.className == "rotate90")
  if(e.target && e.target.className === 'rotate90')
  {
    let myNode = document.getElementById("dialog1");
    while(myNode.firstChild)
    {
      myNode.removeChild(myNode.firstChild);
    }
    let element = e.target;
    let object_id = element.getAttribute("data-object-id");
    let object_clusters = vulnerable_objects[object_indicator]['cluster_objects'];
    current_c=object_clusters;
    var tmp=1;
    for(let object_image of object_clusters)
    { 
      let ima = new Image();
      ima.src = object_image['image'];
      console.log(ima.src)
      ima.height = 250;
      ima.width = 250;
      ima.id='i'+object_id+'-'+tmp.toString();
      ima.className="test";
      document.getElementById("dialog1").appendChild(ima);
      tmp=tmp+1;
    }
    var track=0
    current_id1='i'+object_id+'-'+track.toString();
    let wWidth = $(window).width();
    let wHeight = $(window).height();
    let dWidth = wWidth * 0.5;
    let dHeight = wHeight * 0.5; 

    $(function(){
      $( "#dialog1" ).dialog({
        width: dWidth,
        height: dHeight,
        position: myPos,
        open: function()
        {
          $(".test").on('click', function () {
            current_id=$(this).attr('id');
            console.log("zzzz")
            img_dialog(current_id);
          });
        }
      });
    });
    $(function(){
      $( "#dialog2" ).dialog({
        width: dWidth,
        height: dHeight,
        position:myPos_right,
        open: function()
        {
          console.log("map id"+current_id1)
          map_create(current_id1);
        }
      });
    });
  }
        // In case need to add button later
        // else if(e.target && e.target.id === 'viewButton'){
        //     current_id="i"+current_c+"-"+"0";
        //     img_dialog(current_id);
        // }
  }, false);
}, false);



// TO DO change variable name
power3.then(function(dataSource) {
    var entities = dataSource.entities.values;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity.billboard = undefined; 
        entity.model=new Cesium.ModelGraphics({
        uri: './geoMappings/Utilitypole_3Dmodel.glb',
        scale: 0.2,
        color: fadeColor,
        heightReference : Cesium.HeightReference.CLAMP_TO_GROUND

        });
     
      }
    });

Cesium.when(power3,function(dataSource){
  CheckPowerI.addEventListener('change', function() {
    if ( CheckPowerI.checked) {    
      var entities = dataSource.entities.values;
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity.show=true;
      }
      viewer.dataSources.add(dataSource);

    }else
     viewer.dataSources.remove(dataSource);    
      
});
    
});

power4.then(function(dataSource) {
  var entities = dataSource.entities.values;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity.polygon.material=Cesium.Color.fromRandom();
        entity.polygon.outline=false;
        entity.polygon.heightReference=Cesium.HeightReference.CLAMP_TO_GROUND;
    }      
});
    
Cesium.when(power4,function(dataSource){
  CheckPowerI.addEventListener('change', function() {
    if (CheckPowerI.checked) {
      viewer.dataSources.add(dataSource);
    }else{
      viewer.dataSources.remove(dataSource);      
    }
  });  
});
    
power5.then(function(dataSource) {
  var entities = dataSource.entities.values;
    for(var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      entity.billboard = undefined; 
      entity.polyline.clampToGround=true;
      entity.polyline.material=Cesium.Color.Red;
    }  
});
    
Cesium.when(power5,function(dataSource){
  CheckPowerI.addEventListener('change', function() {
    if (CheckPowerI.checked) {
      viewer.dataSources.add(dataSource);
    }else{
      viewer.dataSources.remove(dataSource);      
    }
  }); 
});

var inlet_coordinates=[]
flood1.then(function(dataSource) {
  var entities = dataSource.entities.values;
    for(var i = 0; i < entities.length; i++) {
      let entity = entities[i];
      let Coordinate="";
      if(i==40){
        entity.billboard = undefined; 
        entity.point = new Cesium.PointGraphics({
          color: Cesium.Color.WHITE,
          pixelSize: 13,
          heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
        });
      }else{
        entity.billboard = undefined; 
        entity.point = new Cesium.PointGraphics({
            color: Cesium.Color.YELLOW,
            pixelSize: 13,
            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
        });
      }
      }
    });
    
Cesium.when(flood1,function(dataSource){
  CheckFloodI.addEventListener('change', function() {
    if (CheckFloodI.checked) {
      viewer.dataSources.add(dataSource);
      viewer.entities.add(entity_example);
    }else{
      viewer.dataSources.remove(dataSource);
      viewer.entities.remove(entity_example);
    }
  });    
});

function colorByDistance() {
    tileset.style = new Cesium.Cesium3DTileStyle({
        defines : {
            distance : 'distance(vec2(${Longitude}, ${Latitude}), vec2(-1.664242028123,0.5192594629615))'
        },
        color : {
            conditions : [
                ['${distance} > 0.00012',"color('gray')"],
                ['${distance} > 0.00008', "mix(color('yellow'), color('red'), (${distance} - 0.0008) / 0.00004)"],
                ['${distance} > 0.00004', "mix(color('green'), color('yellow'), (${distance} - 0.00004) / 0.00004)"],
                ['${distance} < 0.0000005', "color('white')"],
                ['true', "mix(color('blue'), color('green'), ${distance} / 0.00004)"]
            ]
        }
    });
}

//waterHeight=0
// var primitives = viewer.scene.primitives;
var poss_arr=[-95.334726705707027-0.00005, 29.764084676987729-0.00005,
              -95.334726705707027+0.00005, 29.764084676987729-0.00005,
              -95.334726705707027+0.00009, 29.764084676987729+0.00009,
              -95.334726705707027-0.00005,  29.764084676987729+0.00005,
              -95.334726705707027-0.00007,  29.764084676987729+0.00007
          ];
var poss=Cesium.Cartesian3.fromDegreesArray(poss_arr);
var dynamicPositions = new Cesium.CallbackProperty(function() {
    let temp=parseFloat(slider1.value/1000000);
    let poss1=Cesium.Cartesian3.fromDegreesArray([poss_arr[0]-temp,poss_arr[1]-temp,poss_arr[2]+temp,poss_arr[3]-temp
    ,poss_arr[4]+temp,poss_arr[5]+temp,poss_arr[6]-temp,poss_arr[7]+temp,poss_arr[8]-temp,poss_arr[9]+temp]);

    return new Cesium.PolygonHierarchy(poss1);
}, false);

var dynamicPositions1 = new Cesium.CallbackProperty(function() {
    let temp=parseFloat((slider1.value-10)/1000000);
    let poss1=Cesium.Cartesian3.fromDegreesArray([poss_arr[0]-temp,poss_arr[1]-temp,poss_arr[2]+temp,poss_arr[3]-temp
    ,poss_arr[4]+temp,poss_arr[5]+temp,poss_arr[6]-temp,poss_arr[7]+temp,poss_arr[8]-temp,poss_arr[9]+temp]);

    return new Cesium.PolygonHierarchy(poss1);
}, false);

var entity_example=new Cesium.Entity();
entity_example.polygon={
        height: 0,
        hierarchy: dynamicPositions ,
        material: Cesium.Color.RED.withAlpha(0.5),
        heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
}
// entity_example.hierarchy=dynamicPositions;
// entity_example.material=Cesium.Color.RED.withAlpha(0.5);

//     var entity = viewer.entities.add({
//         polygon: {height: 0,
//         hierarchy: dynamicPositions ,
//         material: Cesium.Color.RED.withAlpha(0.5)
// }
//     });
 // viewer.entities.add(entity_example);
viewer.zoomTo(entity_example);
