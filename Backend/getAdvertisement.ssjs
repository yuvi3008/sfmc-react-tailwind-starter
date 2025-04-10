<script runat="server">
    Platform.Load("Core", "1.1.1");
// Check if we have the preferred category available
// If we have it, we need to find the ADs relative to that category which are not being claimed
// If category is not available, check the parameter from the URL.
    try {

        // Add response header
        Platform.Response.SetResponseHeader("Access-Control-Allow-Origin","*");
        // Function to get query parameter
        function getQueryParam(paramName) {
            var paramValue = Request.GetQueryStringParameter(paramName);
            return paramValue;
        }
        
        function getClaimedADS(subscriberKey, category) {
              var adsDE = "Ad_Claims";
              var AdRows = Platform.Function.LookupRows(adsDE, ["Subscriberkey","Category"], [subscriberKey,category]);
             return AdRows;
        }
        
        // Function to fetch data from Data Extension
        function fetchBrandADs(subscriberkey, category) {
            
            if(!brand){
                brand = 'default'
            }
            
            // Check for the ADS claimed in this category
          
            var claimedAd = getClaimedADS(subscriberkey, category);
         
            var dataExtensionName = "Advertisements";
            var filter = {
                Property: "Category",
                SimpleOperator: "equals",
                Value: category
            };

            var data = DataExtension.Init(dataExtensionName).Rows.Retrieve(filter);
            
            var ads = []
            
            for(var i=0;i<data.length;i++){
              var dupe = false;
              for(var j=0;j<claimedAd.length;j++){
                   if(data[i]["Id"] == claimedAd[j]["AdID"]){
                      dupe = true;
                      break;
                   }
              }
              if(!dupe){
                ads.push(data[i]);
              }
              
            }
            return ads.length > 0
                ? { status: "success", results: ads }
                : { status: "error", message: "No records found for the given brand." };
        }

        function getPreferredCategory(subscriberKey) {
              var profileDE = "SubscriberData";
              var subscriberRows = Platform.Function.LookupRows(profileDE, "Subscriberkey", subscriberKey);
             return subscriberRows[0]["PreferredCategory"];
        }
        // Main Execution
        
        var subscriberKey = getQueryParam("subscriberKey");
        var category = getPreferredCategory(subscriberKey);
      
        // If the preferred category is not available on subscriber data 
        
        if(!category){
           category = getQueryParam("brand"); 
        } 
        
 
        var response = fetchBrandADs(subscriberKey,category);

        // Send JSON response
        Write(Stringify(response));
    } catch (error) {
        Write(Stringify({ status: "error", message: Stringify(error) }));
    }
</script>
