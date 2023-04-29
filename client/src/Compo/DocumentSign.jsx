import React, { useState } from "react";
import axios from "axios";
function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

    const handleSubmit = async(event) => {
    event.preventDefault();
    const data = {
      name:name,
      email: email,
      company:company,
    };
    try {
      const response=await axios.post('http://localhost:3000/form', data);   
      console.log("all ok",response.data.url)  
      window.location.href = response.data.url;
     } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <h1>Docusign</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name : </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
         <br />
         <br />
        <label htmlFor="email">Email : </label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <br />
        <br />
        <label htmlFor="company">Company : </label>
        <input
          type="text"
          id="company"
          name="company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
         <br />
         <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Form;
