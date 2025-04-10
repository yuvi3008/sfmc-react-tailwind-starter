<script runat=server>
Platform.Load("core", "1.1.1");

var response = {
    status : ""
}

function generateUUID() {
    return Platform.Function.GUID();
}

function Log(Type, Description) {
    var logDE = "Form_Logs";
    Platform.Function.InsertData(logDE, 
        ["LogID", "SubmissionId","Description","Type"], 
        [generateUUID(), submissionId, Description,Type]
    );
}

// Check the submission status of the form.
function checkSubmissionIdStatus(submissionId){
    Log("Info","Fetching submission Id details")
    var submissionDE = "Form_Submissions";
    var subscriberRows = Platform.Function.LookupRows(submissionDE, "SubmissionID", submissionId);
    Log("Info", "Data fetched: "+ Stringify(subscriberRows[0]));

    if(subscriberRows[0]["Submitted"]){
       return subscriberRows[0]["SubscriberKey"];;
    }
    return null;
}

// Check if the Ad is already claimed or not
function checkClaimedAds(AdId, subscriberkey){
    Log("Info","Checking for Claimed Ads")
    var AdsDE = "Ad_Claims";
    var AdRows = Platform.Function.LookupRows(AdsDE, ["SubscriberKey","AdID"], [subscriberkey,AdId]);
    Log("Info", "Data fetched: "+ Stringify(AdRows[0]));
    if(AdRows[0]["SubscriberKey"]){
        return false;
    }
    return true;
}

// Update the Ad claims DE
function claimAd(submissionId,AdId, subscriberKey,category){
    var config = {
        dataextension: "Ad_Claims",
        attributes: {
            Names: [
                "SubmissionID", 
                "SubscriberKey", 
                "AdID", 
                "Category"
            ],
            Values: [
                submissionId, 
                subscriberKey,
                AdId, 
                category
            ]
        }
    }

    var result = Platform.Function.InsertData(
        config.dataextension,
        config.attributes.Names,
        config.attributes.Values
    );

    return true;
}


try{

    var requestBody = Platform.Request.GetPostData();
    var requestData = Platform.Function.ParseJSON(requestBody);
  
     Platform.Response.SetResponseHeader("Access-Control-Allow-Origin","*");
     Platform.Response.SetResponseHeader("Access-Control-Allow-Headers","Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");  
 
    var submissionId = requestData.submissionId;
    var AdId =  requestData.AdId;
    var category =  requestData.Category;


    if(!submissionId || !AdId){
        // Log the error
        response.status = "error"
        Write(Stringify(response));
    }

    Log("Info", "Ad claim request received | request : "+ Stringify(requestData));
    // Check the submission ID status

    var subscriberKey = checkSubmissionIdStatus(submissionId);

    if(!subscriberKey){
        // Log the error
        error = "Form not submitted"
        response.status = error
        Log("Error", error);
        Write(Stringify(response));
        return;
    }

    // Check if this AD is already claimed by the subscriber
    
    var claimed = checkClaimedAds(AdId, subscriberKey);

    if(!claimed){
        // Log error -> Ad already claimed
        error = "Ad already claimed before"
        response.status = error
        Log("Error", error);
        Write(Stringify(response));
        return;
    }

    // Claim the Ad for the user and trigger the email

    claimAd(submissionId,AdId, subscriberKey,category);
    response.status = "success";
    Log("Info", "Ad successfully claimed for "+ AdId +" for subcriberkey "+ subscriberKey);
    Write(Stringify(response));
    return;

}catch(e){
        response.status = "error"
        Log("Error", Stringify(e));
        Write(Stringify(response));
        return;
}
</script>