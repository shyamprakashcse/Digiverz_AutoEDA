 // eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useState,useRef} from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { Toast } from 'primereact/toast'; 
import { Messages } from 'primereact/messages';
import {CirclesWithBar} from  'react-loader-spinner'
import EDAReport from '../EDAReport/EDAReport';
import IEDA from '../IEDA/IEDA';
import styles from "./Uploader.module.css"
function Uploader() {  
    
   
    const [file,setFile] = useState(null)
    let [Loader,setLoader] = useState(false); 
    let [Report,SetReport] = useState([]) 
    let [ShowReport,setShowReport] = useState(false)
    const navigate = useNavigate()
    const toast = useRef(null)
    const msgs1 = useRef(null);  
    const token = localStorage.getItem("token") 
     let [username,setUsername] = useState("")
    
    React.useEffect(() => { 


      const  tokenAuth = ()=>{
      axios.defaults.baseURL = 'http://localhost:5000';
      axios.defaults.headers.post['Content-Type'] ='multipart/form-data'
      axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      axios.defaults.headers.common = {'Authorization': `bearer ${token}`} 
      axios.post("http://localhost:5000/Authorization",{}).then((response) => {
        console.log(response.data); 
        setUsername(response.data["username"])
        console.log(username)
        if(response.data.Code === "404"){
          toast.current.show({severity: 'error', summary: 'Authentication Error', detail: 'UnAuthorized User'});
          msgs1.current.show({severity: 'error', summary: 'Authentication Error',detail: 'UnAuthorized User'});  

          setInterval(()=>{
            navigate("/login");
          },100); 

       
        }
       
      }).catch((err)=>{
        console.log(err); 
        toast.current.show({severity: 'error', summary: 'Error while Authentication', detail: 'Error while Authentication Process'});
        msgs1.current.show({severity: 'error', summary: 'Error while Authentication',detail: 'Error while Authentication'});  
        
        navigate("/login")
       
      })
    };
    
    tokenAuth();
    },[token,navigate,username]);

    // Navigate to home 

    function NavigateHome(){
      navigate("/dashboard")
    }
  

  
    function handleChange(event) { 
      var files = event.target.files
      if (files.length === 0 || files[0] === undefined || files[0] == null) 
      {
        toast.current.show({severity: 'error', summary: 'Uploading Failed', detail: 'please upload a file'});
          msgs1.current.show({severity: 'error', summary: 'Uploading Failed',detail: 'File is not uploaded'});    
          window.location.reload();
      } 
      
        let fileobj = event.target.files[0] 
        if(fileobj.type === "text/csv"){
            setFile(fileobj)
        }
      }
      
      function handleSubmit(event) {
        event.preventDefault(); 
        document.getElementById("filer").value=""
       
        if (file === null) 
      {
        toast.current.show({severity: 'error', summary: 'Uploading Failed', detail: 'please upload a file'});
          msgs1.current.show({severity: 'error', summary: 'Uploading Failed',detail: 'File is not uploaded'});  
         
         
      } 
      else{
         toast.current.show({severity: 'success', summary: 'Uploading Success', detail: 'you have uploaded a file'});
          msgs1.current.show({severity: 'info', summary: 'Uploading Success',detail: 'File has uploaded'});  
          setLoader(true)
      }
        const url = 'http://localhost:5000/filescanner';
        let token = localStorage.getItem("token");
        
        const formData = new FormData();
        formData.append('dataset', file);
        formData.append('fileName', file.name);
        
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
            
          },
        };
        
      axios.defaults.baseURL = 'http://localhost:5000';
      axios.defaults.headers.post['Content-Type'] ='multipart/form-data'
      axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
        axios.post(url, formData, config).then((response) => {
          console.log(response.data);
          SetReport(response.data)
          setLoader(false); 
          setShowReport(true);
          
          
        }).catch((err)=>{
          console.log(err); 
          toast.current.show({severity: 'error', summary: 'Uploading Failed', detail: 'Error while uploading'});
          msgs1.current.show({severity: 'error', summary: 'Uploading Failed',detail: 'Error while getting data'});  
          setLoader(false); 
          
         
        }); 
       
        
      }

    
    
      return (
      <div > 

      
       { ShowReport === false? <div className="App"> 
        <Toast ref={toast}></Toast>
        <Messages ref={msgs1} /> 
        <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={Loader} outerCircleColor=""/>
        <div className={`card-header ${styles.uploaddiv}`}>
            <h3 className={`card-header text-center ${styles.uploaddivtit}`}>Interactive Exploratory Data Analysis</h3>
            <form onSubmit={handleSubmit} className={`${styles.uploadform} card-header`}>
              <h4 className={`card-footer text-center ${styles.formcarder}`}>Upload Your Dataset below to perform EDA</h4>
              <input type="file" onChange={handleChange} name="dataset" id='filer' className={`form-control mb-3 `}/>
              <button type="submit" className='btn btn-dark'>Upload</button>
              <button className='btn btn-warning m-2' onClick={NavigateHome}>Back to Home</button>
            
            </form>  
        </div>
        </div>  : null 

      }

        { ShowReport === true ?
        <div className='report'>
         <EDAReport report={Report} file={file} username={username} />
        </div>   : null 

        }
       
      { ShowReport === true ?
        <div className='report'>
         <IEDA file={file}></IEDA> 
         
        </div>:null 
      }

      </div>
      );
}


export default Uploader