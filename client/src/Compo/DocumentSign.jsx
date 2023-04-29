import React from 'react';

function DocumentSignature() {
  return (
    <div>
      <span>Docusign</span>
      <form action="/form" method="post">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name"/>
        <label htmlFor="mail">Mail</label>
        <input type="text" id="mail" name="mail"/>
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company"/>
        <input type="submit"/> 
      </form>
    </div>
  );
}

export default DocumentSignature;
