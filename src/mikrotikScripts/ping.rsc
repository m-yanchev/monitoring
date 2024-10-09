:local interfaces ("ether1", "ether2", "ether3");
:local providers ("starlink", "dnipro", "kyivstar");
:local adresses (8.8.8.8, 172.16.1.1, 8.8.8.8)
:local jsonData "";
:local begin true;
:for i from=0 to=2 do={
	:local time ([/tool/ping count=1 address=($adresses->$i) interface=($interfaces->$i) as-value]->"time");
	:local provider ($providers->$i)
	:local item "{\"network\": \"$provider\", \"ping\": \"$time\"}";
	:if ($begin = true) do={
		:set jsonData $item;
	} else={
		:set jsonData "$jsonData, $item";
	};
	:set begin false;
}
log info $jsonData;
/tool fetch url=http://192.168.5.3:3000/api/networkcanalsstates mode=http http-method=post http-data="[$jsonData]" http-header-field="Content-Type:application/json";