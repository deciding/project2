var sellingFreqRank=[{item:"CPU01",vert:20,freq:200}];
var distToShippingRank=[];
var recommendedSwaps=[];
var rateRank=[];
var distRank=[];
function generateRankArray(){
	distToShippingRank=dist[selectedVert.indexOf(shippingPoint)];
	distRank=[];
	for(var i=0;i<distToShippingRank.length;i++){
		distRank.push({vert:i,dist:distToShippingRank[i]});
	}
	distRank.sort(function(a,b){
		return a.dist-b.dist;
	});
	sellingFreqRank.sort(function(a,b){
		return b.freq-a.freq;
	})
	for(var i=0;i<sellingFreqRank.length;i++)
		for(var j=0;j<distRank.length;j++){
			if(distRank[j].vert===sellingFreqRank[i].vert){
				distRank[j].item=sellingFreqRank[i].item;
				distRank[j].freq=sellingFreqRank[i].freq;
				distRank[j].freqRank=i;
			}
		}
	for(var i=0;i<distRank.length;i++){
		distRank[i].rate=Math.abs(distRank[i].freqRank-i)+Math.abs()
	}
}