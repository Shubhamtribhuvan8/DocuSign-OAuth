import React, { useState } from "react";
import axios from "axios";
import { Button, Input } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
//npm i react-toastify
function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
    const handleSubmit = async(event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      name:name,
      email: email,
      company:company,
    };
    try {
      const response=await axios.post('https://docusign-api.onrender.com/form', data);   
      console.log("all ok",response.data.url) 
      window.location.href = response.data.url;
      toast.success("Redirecting...!") 
      setLoading(false); 
     } catch (error) {
      console.log(error)
    }
  };
  const commonStyles = {
    bgcolor: 'background.paper',
    margin: "auto",
    top:1,
    borderColor: 'text.primary',
    width: '29rem',
    height: '28rem',
  };
  return (
      <div>
      <ToastContainer/>
     <h1>Docusign</h1>
      <Box sx={{ ...commonStyles, border: 1 }}>
      <h3>Please Login Your Account/Google</h3>
        <br/>
      <form onSubmit={handleSubmit}>
        <TextField required type="text" 
        id="name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
         placeholder="Name" />
      <br /> <br /> 

        <TextField required  type="text"
        id="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
           placeholder="Email" />
      <br /> <br />  

      <TextField required  type="text"
          id="company"
          name="company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
           placeholder="Company Name" />
      <br /> <br />  

      <Button variant="outlined" type="submit"> Contineue With DocuSign</Button>
      <br /> <br /> 
      {loading && <CircularProgress />}
     </form>
       </Box>
    </div>
  );
}

export default Form;
