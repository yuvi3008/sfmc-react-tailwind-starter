<script runat="server">
Platform.Load("Core", "1.1.1");
  
var api = new Script.Util.WSProxy();
  
var submissionId = generateUUID();  

  
var response = {
    status:"",
    data:""
}

function getQueryParam(param) {
    return Request.GetQueryStringParameter(param);
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

function logRequest(submissionId, subscriberKey,listid,jobid,batchid) {
    var logDE = "Form_Submissions";
    Platform.Function.InsertData(logDE, 
        ["SubmissionID", "SubscriberKey","JobId","Listid","BatchId"], 
        [submissionId, subscriberKey, jobid,listid,batchid]
    );
}

function fetchQuestions() {
    Log("Info", "Fetching Questions");
    var questionDE = "ProfileQuestions";
    var questions = DataExtension.Init(questionDE).Rows.Retrieve();
    Log("Info", "Question Fetched | Response: " + Stringify(questions))
    return questions;
}
  
function fetchSelectOptions(QuestionId) {
    var optionsDE = "SelectOptions";
    var optionRows = Platform.Function.LookupRows(optionsDE, "QId", QuestionId);
    return optionRows;
}

function fetchSubscriberProfile(subscriberKey) {
    Log("Info", "Fetching Subscriber Data");
    var profileDE = "SubscriberData";
    var subscriberRows = Platform.Function.LookupRows(profileDE, "Subscriberkey", subscriberKey);
    Log("Info", "Subscriber Data Fetched | Response: " + Stringify(subscriberRows))
    return subscriberRows[0];
}

function getUnansweredQuestions(questions, subscriberData) {
    Log("Info","Finding relevant questions by priority");
    var unanswered = [];
    
    for (var i = 0; i < questions.length; i++) {
        var questionID = questions[i]["QId"];
        var priority = questions[i]["Priority"];
        var subscriberDataMapping = questions[i]["SubscriberDataMapping"];
        var questionType = questions[i]["Type"];
        var questionLabel = questions[i]["Label"];
        
        
        if (!subscriberData[subscriberDataMapping]) {
          
            var questionDetails = {
                "questionID": questionID,
                "questionLabel":questionLabel,
                "priority": priority,
                "questionType": questionType,
                "Mapping": subscriberDataMapping
            }
            if(questionType == "Select" ){
            // Fetch options 
            
            var options = fetchSelectOptions(questionID);
            
            // Add to question details
            questionDetails["options"] = options
              
            }
            unanswered.push(questionDetails);
        }
    }
    
    Log("Info", "Relevant Questions "+ Stringify(unanswered));
    return unanswered;
}

function sortAndSelectQuestions(unansweredQuestions) {
    unansweredQuestions.sort(function(a, b) {
        return b.priority - a.priority;
    });
    return unansweredQuestions.slice(0, 3);
}

try {
  
    Platform.Response.SetResponseHeader("Access-Control-Allow-Origin","*");

    var subscriberKey = getQueryParam("subscriberKey");
    var listid = getQueryParam("listid");
    var jobid = getQueryParam("jobid");
    var batchid = getQueryParam("batchid");
    var error = ""
    
  
    if ( !subscriberKey || !listid || !batchid || !jobid) { 
        error = "Missing required parameters." 
        Log("Error", error);
        response.status = "error"
        Write(Stringify(response));
        return;
    }
    
    logRequest(submissionId, subscriberKey, listid,jobid, batchid);
    Log("Info", "Form Opened");
    var questions = fetchQuestions();

    var subscriberData = fetchSubscriberProfile(subscriberKey);
    
    if (!subscriberData) {
        error = "Subscriber not found."
        response.status = "error"
        Write(Stringify(response));
        return;
    }
    
    var unansweredQuestions = getUnansweredQuestions(questions, subscriberData);
    var selectedQuestions = sortAndSelectQuestions(unansweredQuestions);
  
    Log("Info", "Priority Questions "+ Stringify(selectedQuestions));
    
    response.status = "success"
    response.data = {
        "preferredCategory": subscriberData["PreferredCategory"],
        "submissionId": submissionId,
        "questions": selectedQuestions
    };
    
    Write(Stringify(response));
} catch (e) {
        Log("Error", Stringify(e))
        response.status = "error"
        Write(Stringify(response));

}
</script>
