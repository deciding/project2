$( function() {
    var vertsOnRow=21;
    //var numOfVertices=0;
    var selectedVert=[];
    var selectedEdge=[];
    //var edgeList=[];
    var twoVertFlag=false;
    var prevVert;
    var shippingPoint=0;
    //var adjMat=[],dist=[];

    function calWeight(v1,v2){
      var v1x=Math.floor(v1/vertsOnRow), v1y=v1%vertsOnRow;
      var v2x=Math.floor(v2/vertsOnRow), v2y=v2%vertsOnRow;

      if(v1===v2) return "point";
      for(i in selectedEdge){
        if(selectedEdge[i].v1===v1&&selectedEdge[i].v2===v2||selectedEdge[i].v1===v2&&selectedEdge[i].v2===v1){
          var res=-selectedEdge[i].w;
          selectedEdge.splice(i,1);
          return res;
        }
      }
      if(v1x===v2x) return Math.abs(v1y-v2y);
      if(v1y===v2y) return Math.abs(v1x-v2x);
      return "lean"; 
    }

    function drawLine(v1,v2){
      var v1x=Math.floor(v1/vertsOnRow), v1y=v1%vertsOnRow;
      var v2x=Math.floor(v2/vertsOnRow), v2y=v2%vertsOnRow;
      var weight=calWeight(v1,v2);
      if(weight<0){
        if(v1x===v2x)
          for(i=1;i<-weight;i++){
            $("#"+(v1x*vertsOnRow+Math.min(v1y,v2y)+i)).css("background","#f6f6f6");
          }
        else if(v1y===v2y)
          for(i=1;i<-weight;i++){
            $("#"+((Math.min(v1x,v2x)+i)*vertsOnRow+v1y)).css("background","#f6f6f6");
          }
        return;
      }

      if(typeof weight ==="string") return;
      selectedEdge.push({v1:v1,v2:v2,w:weight});
      if(DEBUG) console.log(selectedEdge);
      if(v1x===v2x)
        for(i=1;i<weight;i++){
          $("#"+(v1x*vertsOnRow+Math.min(v1y,v2y)+i)).css("background","pink");
        }
      else if(v1y===v2y)
        for(i=1;i<weight;i++){
          $("#"+((Math.min(v1x,v2x)+i)*vertsOnRow+v1y)).css("background","pink");
        }
    }

    function vertClickHandler(){
      $("#"+shippingPoint).css("background","#F39814");
      shippingPoint=parseInt($(this).attr("id"));
      $(this).css("background","#98F314");
    }

    function shippingClickHandler(){
      if(!twoVertFlag) {
        prevVert=parseInt($(this).attr("id"));
        $(this).css("background","#F36014");
        twoVertFlag=!twoVertFlag;
        return;
      }
      if(prevVert===shippingPoint)
        $("#"+prevVert).css("background","#98F314");
      else $("#"+prevVert).css("background","#F39814");
      drawLine(parseInt(prevVert),parseInt($(this).attr("id")));
      twoVertFlag=!twoVertFlag;
    }

    function loadLayout(){
      $("#selectable").empty();
      for(i=0;i<300;i++)
        $("#selectable").append('<li id=\"'+i+'\" class="ui-state-default"></li>');
      var warehouseLayout=JSON.parse(localStorage.getItem("warehouseLayout"),function(key,value){
        if(value===null) return Infinity;
        return value;
      });
      if(!warehouseLayout) return;
      selectedVert=warehouseLayout.selectedVert;
      selectedEdge=warehouseLayout.selectedEdge;
      numOfVertices=warehouseLayout.numOfVertices;
      edgeList=warehouseLayout.edgeList;
      shippingPoint=warehouseLayout.shippingPoint;
      adjMat=warehouseLayout.adjMat;
      dist=warehouseLayout.dist;
      
      for(i in selectedVert)
        $("#"+selectedVert[i]).css("background","#f39814");

      $("#"+shippingPoint).css("background","#98F314");

      for(i in selectedEdge){
        var v1x=Math.floor(selectedEdge[i].v1/vertsOnRow), v1y=selectedEdge[i].v1%vertsOnRow;
        var v2x=Math.floor(selectedEdge[i].v2/vertsOnRow), v2y=selectedEdge[i].v2%vertsOnRow;
        var weight=selectedEdge[i].w;
        if(v1x===v2x)
          for(i=1;i<weight;i++){
            $("#"+(v1x*vertsOnRow+Math.min(v1y,v2y)+i)).css("background","pink");
          }
        else if(v1y===v2y)
          for(i=1;i<weight;i++){
            $("#"+((Math.min(v1x,v2x)+i)*vertsOnRow+v1y)).css("background","pink");
          }
      }

      // for(i in selectedVert){
      //    $("#"+selectedVert[i]).attr("map",i);
      // }
    }

    function drawPointOnPath(id,order){
      $("#"+id).text($("#"+id).text()+"["+order+"]");
    }
    function drawLineOnPath(v1,v2,order){
      var weight=adjMat[v1][v2];
      v1=selectedVert[v1];
      v2=selectedVert[v2];
      if(weight===Infinity){
        alert("inf edge err");
        return;
      }
      var v1x=Math.floor(v1/vertsOnRow), v1y=v1%vertsOnRow;
      var v2x=Math.floor(v2/vertsOnRow), v2y=v2%vertsOnRow;
      if(v1x===v2x){
        for(i=0;i<weight;i++)
          if(v1y<=v2y)
            drawPointOnPath(v1x*vertsOnRow+v1y+i,order++);
          else 
            drawPointOnPath(v1x*vertsOnRow+v1y-i,order++);
      }   
      else if(v1y===v2y)
        for(i=0;i<weight;i++){
          if(v1x<=v2x)
            drawPointOnPath((v1x+i)*vertsOnRow+v1y,order++);
          else
            drawPointOnPath((v1x-i)*vertsOnRow+v1y,order++);
        }
      return order;
    }
    function drawPath(){
      $("#selectable li").text("");
      var endPoint=selectedEdge[shoppingList[0]];
      var order=0;
      for(var i=0;i< finalPath.length;i++){
        if(i<finalPath.length-1)
          order=drawLineOnPath(finalPath[i],finalPath[i+1],order);
      }

      // for(i in finalPath){
      //    $("#"+selectedVert[finalPath[i]]).css("background","#000000");
      // }
    }

    function shuffle(arr){
      var newArr=arr.slice();
      var currI=arr.length, tmp, randI;
      while(0!==currI){
        randI=Math.floor(Math.random()*currI);
        currI--;
        tmp=newArr[currI];newArr[currI]=newArr[randI];newArr[randI]=tmp;
      }
      return newArr;
    }
    function generateShoppingList(){
      var size=Math.floor(Math.random()*10)+1;
      var randSelectedVert=[];
      for(i in selectedVert)
        randSelectedVert.push(parseInt(i));
      randSelectedVert=shuffle(randSelectedVert);

      shoppingList=[];
      shoppingList.push(selectedVert.indexOf(shippingPoint));
      for(i=0;i<size;i++){
        shoppingList.push(randSelectedVert[i]);
      }

      // shoppingList=[30,10,3,13,31,19,22,32,11];
      // //shoppingList=[30,5,16,1];
      // //shoppingList=[30,5];
      $("[index]").removeAttr("index").css("background","#F39814");
      for(i in shoppingList){
        if(i!=="0")
         $("#"+selectedVert[shoppingList[i]]).css("background","#F36014").attr("index",shoppingList[i]);
      }
      //shoppingList.push(selectedVert.indexOf(shippingPoint));
    }

    loadLayout();

    $("#newLayout").click(function(){
      $( "#selectable" ).selectable({
        selected: function( event, ui ) {
          $(ui.selected).css("background","#F39814");
        },
        unselected: function( event, ui ) {
          $(ui.unselected).css("background","#f6f6f6");
        }
      });
      $( "#selectable" ).children().each(function(){
        $(this).css("background","#f6f6f6");
      });
      $("#newLayout").hide();
      $("#confirmVert").show();
    });

    $("#confirmVert").click(function(){
      selectedVert=[];
      selectedEdge=[];
      shippingPoint=-1;
      $("#selectable").children().each(function(){
        if($(this).hasClass("ui-selected"))
          selectedVert.push(parseInt($(this).attr("id")));
      });
      numOfVertices=selectedVert.length;
      if(DEBUG)
        console.log(selectedVert);
      $(this).hide();
      $("#selectable").selectable("disable");
      $("#selectable").on("click",".ui-selected", vertClickHandler);
      $("#confirmVert").hide();
      $("#confirmShipping").show();
    });

    $("#confirmShipping").click(function(){
      $("#selectable").off("click",".ui-selected", vertClickHandler);
      $("#selectable").on("click",".ui-selected", shippingClickHandler);
      $("#confirmShipping").hide();
      $("#drawLine").show();
    });

    $("#drawLine").click(function(){
      edgeList=[];
      for(i in selectedEdge){
        var m=selectedVert.indexOf(selectedEdge[i].v1),n=selectedVert.indexOf(selectedEdge[i].v2);
        edgeList.push({v1:m,v2:n,w:selectedEdge[i].w});
      }
      floydWarshall();

      var warehouseLayout={numOfVertices:numOfVertices,selectedVert:selectedVert,selectedEdge:selectedEdge,edgeList:edgeList,shippingPoint:shippingPoint,adjMat:adjMat,dist:dist};
      localStorage.setItem("warehouseLayout",JSON.stringify(warehouseLayout));
      $("#selectable").off("click",".ui-selected", shippingClickHandler);
      $( "#selectable" ).selectable("destroy");
      $("#drawLine").hide();
      $("#newLayout").show();
    });

    $("#generateShortest").click(function(){
      generateShoppingList();
      if(DEBUG) console.log("shoppingList: "+shoppingList);
      //floydWarshall();
      tspSetup();
      if(DEBUG) console.log("shoppingOrder: "+shoppingOrder);
      dfsSetup();
      drawPath();
    });

});