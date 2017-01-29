var numOfVertices=0;
var edgeList=[]; //lvl2, arr of obj:v1,v2,w
var adjMat=[]; //lvl2
var dist=[]; //lvl2
var paths=[]; //lvl3
var shoppingList=[]; //lvl2, arr of items that are going to be shopped, the start point is shipping area
var DEBUG=true;
var tspMemo=[]; //lvl3
var shoppingOrder=[]; //lvl2
var visited=[]; //lvl3
var onePath=[]; //lvl3
var finalPath=[]; //lvl2

function floydWarshall(){
	adjMat=[];
	dist=[];
	for(i=0;i<numOfVertices;i++){
		var oneRow=[];
		for(j=0;j<numOfVertices;j++){
			if(i===j) oneRow.push(0);
			else oneRow.push(Infinity);
		}
		adjMat.push(oneRow);
		dist.push(oneRow.slice());
	}

	for(i=0;i<edgeList.length;i++){
		var edge=edgeList[i];
		adjMat[edge.v1][edge.v2]=edge.w;
		adjMat[edge.v2][edge.v1]=edge.w;
		dist[edge.v1][edge.v2]=edge.w;
		dist[edge.v2][edge.v1]=edge.w;
	}

	for(k=0;k<numOfVertices;k++)
		for(i=0;i<numOfVertices;i++)
			for(j=0;j<numOfVertices;j++)
				if(dist[i][j]>dist[i][k]+dist[k][j])
					dist[i][j]=dist[i][k]+dist[k][j];
}

function tspSetup(){
	tspMemo=[];
	paths=[];
	for(i=0;i<11;i++){
		var oneRow=[];
		var oneRowOfPaths=[];
		for(j=0;j<(1<<11);j++){
			oneRow.push(-1);
			oneRowOfPaths.push([])
		}
		tspMemo.push(oneRow);
		paths.push(oneRowOfPaths);
	}
	var shortest=tsp(0,1);
	if(DEBUG)
		console.log(shortest);
	shoppingOrder=paths[0][1];
}

function tsp(pos, bitmask) { // bitmask stores the visited coordinates
    if (bitmask == (1 << (shoppingList.length)) - 1)
      return dist[pos][0]; // return trip to close the loop
    if (tspMemo[pos][bitmask] != -1)
      return tspMemo[pos][bitmask];

    var ans = Infinity;
    var bestNxt=Infinity;

    for (var nxt = 0; nxt < shoppingList.length; nxt++) // O(n) here
      //no need pos condition?
      if ((bitmask & (1 << nxt)) == 0){ // if coordinate nxt is not visited yet
      	var newDist=dist[shoppingList[pos]][shoppingList[nxt]] + tsp(nxt, bitmask | (1 << nxt));
      	if(newDist<ans)
      		bestNxt=nxt;
        ans = Math.min(ans, newDist);
      }
    if(bestNxt!==Infinity){
	    var newPath=paths[bestNxt][bitmask|(1<<bestNxt)].slice();
	    newPath.push(bestNxt);
	    paths[pos][bitmask]=newPath;
	}
    return tspMemo[pos][bitmask] = ans;
}

function dfsSetup(){
	finalPath=[];
	shoppingOrder.unshift(0);
	var prevPoint=0;
	for(var i=0;i<shoppingOrder.length;i++){
		//onePath=[];
		visited=[];
		for(var j=0;j<numOfVertices;j++)
			visited.push(false);
		dfs(shoppingList[prevPoint],shoppingList[shoppingOrder[shoppingOrder.length-1-i]],dist[shoppingList[prevPoint]][shoppingList[shoppingOrder[shoppingOrder.length-1-i]]]);
		//var kk=0;
		// while(onePath.length!==0)
		// 	finalPath.push(onePath.pop());
		prevPoint=shoppingOrder[shoppingOrder.length-1-i];
	}
	finalPath.push(shoppingList[0]);
	if(DEBUG) console.log("finalPath :"+finalPath);
}
function dfs(st,ed,dist){
	if(dist<0) return false;
	if(st===ed) 
		return true;

	finalPath.push(st);
	visited[st]=true;
	for(var i=0; i<adjMat[st].length;i++)
		if(!visited[i]&&adjMat[st][i]!=Infinity&&dfs(i,ed,dist-adjMat[st][i])){
			return true;
		}
	finalPath.pop();
	visited[st]=false;
	return false;
}