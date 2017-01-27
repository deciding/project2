var numOfVertices=0;
var edgeList=[]; //lvl2, arr of obj:v1,v2,w
var adjMat=[]; //lvl2
var dist=[]; //lvl2
var paths=[]; //lvl3
var shoppingList=[]; //lvl2, arr of items that are going to be shopped, the start point is shipping area
var tspMemo=[]; //lvl3
var shoppingOrder=[]; //lvl2
var visited=[]; //lvl3
var onePath=[]; //lvl3
var finalPath=[]; //lvl2

function floydWarshall(){
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
	for(i=0;i<=shoppingList.length;i++){
		var oneRow=[];
		var oneRowOfPaths=[];
		for(j=0;j<=(1<<shoppingList.length);j++){
			oneRow.push(-1);
			oneRowOfPaths.push([])
		}
		tspMemo.push(oneRow);
		paths.push(oneRowOfPaths);
	}
	tsp(0,1);
	shoppingOrder=paths[0][1];
}

function tsp(pos, bitmask) { // bitmask stores the visited coordinates
    if (bitmask == (1 << (shoppingList.length + 1)) - 1)
      return dist[pos][0]; // return trip to close the loop
    if (tspMemo[pos][bitmask] != -1)
      return tspMemo[pos][bitmask];

    var ans = Infinity;
    var bestNxt=Infinity;

    for (nxt = 0; nxt <= shoppingList.length; nxt++) // O(n) here
      //no need pos condition?
      if ((bitmask & (1 << nxt)) == 0){ // if coordinate nxt is not visited yet
      	if(dist[pos][nxt] + tsp(nxt, bitmask | (1 << nxt))<ans)
      		bestNxt=nxt;
        ans = Math.min(ans, dist[pos][nxt] + tsp(nxt, bitmask | (1 << nxt)));
      }
    var newPath=paths[bestNxt][bitmask|(1<<bestNxt)].slice();
    newPath.push(nxt);
    paths[pos][bitmask]=newPath;
    return tspMemo[pos][bitmask] = ans;
}

function dfsSetup(){
	for(i=0;i<numOfVertices;i++)
		visited.push(false);
	shoppingOrder.unshift(0);
	var prevPoint=0;
	for(i in shoppingOrder){
		onePath=[];
		dfs(prevPoint,shoppingOrder[shoppingOrder.length-1-i],dist[shoppingList[prevPoint]][shoppingList[shoppingOrder[shoppingOrder.length-1-i]]]);
		for(i in onePath)
			finalPath.push(shoppingList[onePath.pop()]);
	}
	finalPath.push(shoppingList[0]);
}
function dfs(st,ed,dist){
	if(dist<0) return false;
	if(st===ed) return true;

	onePath.push(st);
	visited[st]=true;
	for(i in adjMat[shoppingList[st]])
		if(!visited[i]&&adjMat[shoppingList[st]][shoppingList[i]]!=Infinity&&dfs(i,ed,dist-adjMat[shoppingList[st]][shoppingList[i]])){
			return true;
		}
	onePath.pop();
	visited[st]=false;
	return false;
}