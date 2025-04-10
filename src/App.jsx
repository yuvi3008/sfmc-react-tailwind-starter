import React from 'react'
import UserForm from './components/Form'
import { FormProvider } from './components/FormContext'


function App() {
  return (
    <FormProvider>
      <UserForm/>
    </FormProvider>
  )
  
}
export default App