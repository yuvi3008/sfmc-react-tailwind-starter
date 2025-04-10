<script runat="server">
Platform.Load("Core", "1.1.1");

var submissionId = "";
var response = {
    status: ""
};

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

function fetchSubscriberDetails(){
    Log("Info","Fetching form submission details")
    var submissionDE = "Form_Submissions";
    var subscriberRows = Platform.Function.LookupRows(submissionDE, "SubmissionID", submissionId);
    Log("Info", "Data fetched: "+ Stringify(subscriberRows[0]));
    return subscriberRows[0];
}  
  
function updateSubscriberData(subscriberKey, data){
        
    var config = {
        dataextension: "SubscriberData",
        filter: {
            Names: [
                "Subscriberkey"
            ],
            Values: [
                subscriberKey
            ]
        },
        attributes: {
            Names: [],
            Values: []
        }
    }
    
    for(var i=0;i<data.length;i++){
       config.attributes.Names.push(data[i].Mapping);
       config.attributes.Values.push(data[i].value);      
    }
    
    Log("Info","Updating subscriber data | Config: "+ Stringify(config));
    
    var result = Platform.Function.UpdateData(
        config.dataextension,
        config.filter.Names,
        config.filter.Values,
        config.attributes.Names,
        config.attributes.Values
    );
    
    
    return result;

}  

function updateFormSubmissionStatus(){
        
    var config = {
        dataextension: "Form_Submissions",
        filter: {
            Names: [
                "SubmissionID"
            ],
            Values: [
                submissionId
            ]
        },
        attributes: {
            Names: ["Submitted"],
            Values: ["true"]
        }
    }
    
    Log("Info","Updating form submission Status data | Config: "+ Stringify(config));
    
    var result = Platform.Function.UpdateData(
        config.dataextension,
        config.filter.Names,
        config.filter.Values,
        config.attributes.Names,
        config.attributes.Values
    );
    
    
    return result;

}  

// Read request body
try {
    var requestBody = Platform.Request.GetPostData();
    var requestData = Platform.Function.ParseJSON(requestBody);
    
     Platform.Response.SetResponseHeader("Access-Control-Allow-Origin","*");
     Platform.Response.SetResponseHeader("Access-Control-Allow-Headers","Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    // fetch submission id
    
    submissionId = requestData.submissionId ;
    
    if(!submissionId){
        response.status = "error";
        Write(Stringify(response));
        return;
    }
    
    Log("Info", "Post data received"+ requestBody);
  
    var data = requestData.formdata;
  
    
    // Check if this submission id is valid, and fetch the relevant subscriberkey
  
    var subscriberData = fetchSubscriberDetails(); 

    if(!subscriberData["SubscriberKey"] || subscriberData["Submitted"] ){
        response.status = "3 error";
        if(!subscriberData.SubscriberKey){
        Log("Error","Invalid Submission ID");
        }else{
        Log("Error","Form already submitted for this ID");      
        }
        Write(Stringify(response));
        return;
    }
    
    Log("Info","Subscriber Key : "+ subscriberData["SubscriberKey"] ); 
    
    var updateData = updateSubscriberData(subscriberData["SubscriberKey"], data);
  
    // Update the form submission status to submitted
  
    var formSubmissionStatusUpdate = updateFormSubmissionStatus();
  
    response.status = "success";
    Write(Stringify(response));
} catch (e) {
    response.status = "error";
    Log("Error","Details: "+ Stringify(e));
    Write(Stringify(response));
}



</script>
