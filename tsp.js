var numOfVertices=0;
var edgeList=[];//arr of obj:v1,v2,w
var adjMat=[];
var shoppingList=[];//arr of items that are going to be shopped, the start point is shipping area
var tspMemo=[];

function floydWarshall(){
	for(i=0;i<numOfVertices;i++){
		var oneRow=[];
		for(j=0;j<numOfVertices;j++){
			if(i===j) oneRow.push(0);
			else oneRow.push(Infinity);
		}
		adjMat.push(oneRow);
	}

	for(i=0;i<edgeList.length;i++){
		var edge=edgeList[i];
		adjMat[edge.v1][edge.v2]=edge.w;
		adjMat[edge.v2][edge.v1]=edge.w;
	}

	for(k=0;k<numOfVertices;k++)
		for(i=0;i<numOfVertices;i++)
			for(j=0;j<numOfVertices;j++)
				if(adjMat[i][j]>adjMat[i][k]+adjMat[k][j])
					adjMat[i][j]=adjMat[i][k]+adjMat[k][j];
}

function tspStartup(arr){
	for(i=0;i<arr.length;i++){
		var oneRow=[];
		for(j=0;j<(1<<arr.length);j++){
			oneRow.push(-1);
		}
		tspMemo.push(oneRow);
	}
	shoppingList=arr;
	tsp(shoppingList[0],1);
}
function tsp(pos, bitmask) { // bitmask stores the visited coordinates
    if (bitmask == (1 << (shoppingList.length + 1)) - 1)
      return adjMat[shoppingList[pos]][shoppingList[0]]; // return trip to close the loop
    if (memo[pos][bitmask] != -1)
      return memo[pos][bitmask];

    var ans = Infinity;
    for (nxt = 0; nxt <= shoppingList.length; nxt++) // O(n) here
      //no need pos condition?
      if ((bitmask & (1 << nxt)) == 0) // if coordinate nxt is not visited yet
        ans = Math.min(ans, adjMat[shoppingList[pos]][shoppingList[nxt]] + tsp(nxt, bitmask | (1 << nxt)));
    return memo[pos][bitmask] = ans;
  }