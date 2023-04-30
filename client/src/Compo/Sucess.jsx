import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocusignSuccess = () => {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get('https://docusign-api.onrender.com/docusign-success')
      .then(response => {
        console.log(response.data);
        setSuccess(true);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {success && <span>Successfully Done With DocuSign</span>}
    </div>
  );
}

export default DocusignSuccess;
