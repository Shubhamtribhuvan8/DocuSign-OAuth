import './App.css';
import Form from './Compo/DocumentSign';
import DocusignSuccess from './Compo/Sucess';
import { Route,Routes } from 'react-router-dom'
function App() {
  return (
    <div className="App">
      <Routes>
            <Route path="/" element={ <Form/>} />
            <Route path="/docusign-success" element={<DocusignSuccess/>} />
        </Routes>
    </div>
  );
}

export default App;
