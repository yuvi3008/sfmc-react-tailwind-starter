import React, { useState, useEffect } from 'react';
import Text from "./Text";
import DatePicker from "./DatePicker";
import Select from "./Select";
import Phoneinput from "./PhoneInput";
import { useForm } from './FormContext';
import NumberInput from './NumberInput';
import axios from 'axios';
import Header from './Header';
const InputComponents = {
  text: Text,
  date: DatePicker,
  select: Select,
  phone: Phoneinput,
  number: NumberInput // Assuming Text handles numeric input for now
};

const typeMapper = {
  Text: "text",
  Date: "date",
  Select: "select",
  MobileNumber: "phone",
  Number: "number"
};

function Questions() {
  const { formData, setFormData } = useForm();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // loader state
  const [phoneError, setPhoneError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [heading, setHeading] =  useState("🎁 Don’t Miss Out on Exclusive Rewards!")
  const [content, setContent] = useState("Complete this quick form so we can get to know you better — and unlock exciting offers picked just for you!")
  const [detailsComplete, setDetailsComplete] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const response = await fetch(`http://cloud.mail.conx.digital/getQues?qs=${params.get("qs")}`);
        const json = await response.json();
        const fetchedQuestions = await json?.data?.questions || [];
        const submissionId = await json?.data?.submissionId || [];
        const preferredCat = await json?.data?.preferredCategory || "Select Category";

        if(fetchedQuestions.length <= 0){
          setDetailsComplete(true);
          setLoading(false);
          setHeading("Thanks for being awesome!")
          setContent("We've got everything we need. Now just relax while we line up something special for you. 💝")
        }
        
        const parsedQuestions = fetchedQuestions.map(q => ({
          id: q.questionID,
          label: q.questionLabel,
          type: typeMapper[q.questionType],
          mapping : q.Mapping,
          options: q.options ? q.options.map(opt => opt.Label) : []
        }));
        
        // Set the submission id in the formdata state
        setFormData((prev)=>({ ...prev, ["submissionId"]: submissionId , ["Q001"]: preferredCat }))
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generaterequestBody =  () =>{
    var body = {};
    var submittedData = []
    questions.forEach((question)=>{
        submittedData.push({
          "questionId": question.id,
          "Mapping": question.mapping,
          "value": formData[question.id]
        })
    })
    body.formdata  = submittedData ;
    body.submissionId = formData.submissionId;
    return body;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) return;

    const emptyFields = questions.some(q => !formData[q.id]);
    if (emptyFields) {
      setFormError("All fields are required.");
      return;
    }
    setFormError("");
    var requestBody = generaterequestBody();

    try {
      const response = await axios.post(
        'http://cloud.mail.conx.digital/submitData',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if(response.data.status == "success"){
        setFormSubmitted(true);
        setHeading("✨ Hooray! You've made it!")
        setContent(`Your details are in, and you're now just one step away from something awesome!
Click any ad and claim your reward! 🎁💃`)
      }
      
    } catch (e) {
      console.error('Submit data error:', e);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">Loading questions...</div>
      </div>
    );
  }


  return (
    <div>
      <Header heading= {heading} content={content} />
      {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
      {!formSubmitted && !detailsComplete && 
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question) => {
          const Component = InputComponents[question.type];
          return (
            <div key={question.id}>
              <label className="block text-gray-700 font-medium mb-1">{question.label}</label>
              {Component && (
                <Component
                  options={question.options || []}
                  value={formData[question.id] || ""}
                  onChange={(value) => handleChange(question.id, value)}
                  error={question.id.toLowerCase().includes("whatsapp") ? phoneError : ""}
                  setError={question.id.toLowerCase().includes("whatsapp") ? setPhoneError : () => {}}
                />
              )}
            </div>
          );
        })}
        <button
          type="submit"
          className="w-full bg-black text-white font-bold py-3 rounded-full shadow-lg hover:bg-gray-300 hover:text-black transition duration-300"
        >
          Submit
        </button>
      </form>}
    </div>
  );
}

export default Questions;
