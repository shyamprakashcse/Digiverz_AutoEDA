import React from 'react'
import styles from "./EDAReport.module.css"
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 


import axios from 'axios';
import { Toast } from 'primereact/toast'; 
import { Messages } from 'primereact/messages';
function EDAReport(props) {
   console.log("hi I am props")
    console.log(props); 
    const navigate = useNavigate()
    let BasicEDA = props.report[0]
    const toast = useRef(null)
    const msgs1 = useRef(null); 
    let username = props.username 
   
    let NumColStats = props.report[1] 

    let ColumnName = BasicEDA.ColNames
    let ColDataTypes = BasicEDA.ColDataTypes 
    let ColNullCnt = BasicEDA.ColNullCnt 
    let NullGraphImg = BasicEDA.NullGraph 
    let CorrMapImg = BasicEDA.CorrHeatMap 
    let FirstNRows = BasicEDA.FirstNRows  

    let TableData = [] 
    for (let index = 0; index < ColumnName.length; index++) {
      let temp = [] 
      temp.push(ColumnName[index])
      temp.push(ColDataTypes[index][1])
      temp.push(ColNullCnt[index]) 
      TableData.push(temp)
      
    }

    // Statistical Analysis 

    let StatsCol = NumColStats["columnName"] 
    let Statdesc = NumColStats["statistics"]
    StatsCol = ["Statistical Measures"].concat(StatsCol)

    
   
    
    function upload(){
      console.log("hey hello")
      window.location.reload()
    }

    function save(){
      console.log(props) 
      const url = 'http://localhost:5000/savereport';
        let token = localStorage.getItem("token");
        
        const formData = new FormData();
        formData.append('dataset', props.file);
        formData.append('fileName', props.file.name);
        formData.append('basiceda',JSON.stringify(BasicEDA))
        formData.append('numcolstats',JSON.stringify(NumColStats))
        formData.append('username',username)
        
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
          toast.current.show({severity: 'success', summary: 'Report Saved', detail: 'Report has been saved sucessfully'});
          msgs1.current.show({severity: 'suucess', summary: 'Report Saved',detail: 'Report has been saved sucessfully'});  
          
         
          
          
        }).catch((err)=>{
          console.log(err); 
          toast.current.show({severity: 'error', summary: 'Uploading Failed', detail: 'Error while uploading'});
          msgs1.current.show({severity: 'error', summary: 'Uploading Failed',detail: 'Error while getting data'});  
          
          
         
        }); 
       
        
    }
   

    

    

  
  return (
  <div className='report'> 
        
        <nav className='nav navbar bg-light'>
         <button className='btn btn-dark m-1' onClick={upload}>Uploader</button>
         <button className='btn btn-info m-1' onClick={save}>Save Report</button> 
      
         <button className='btn btn-dark m-1' onClick={()=>{navigate("/history")}}>Analysis Report History</button>
        </nav>
    <div className={`${styles.grider}`} >

    <Toast ref={toast}></Toast>
    <Messages ref={msgs1} /> 

    <h3 className={`card-header text-center bg-warning font ${styles.headings}`}>EDA REPORT SUMMARY</h3>
        <div className={`${styles.tab}`}>
      
        <table className={`table table-bordered table-striped  table-hover table-responsive`}>
         <thead className={`bg-primary text-white text-black  text-capitalize border-solid text-md-center border-dark`}>
           <tr>
           <th className={``}>Column No</th> 
           <th className={``}>Column Name</th>
            <th className={``}>Column DataType</th> 
            <th className={``}>Column Null Values</th>
           </tr>
         </thead> 

         <tbody className={`border-solid border-dark`}>
           {
             TableData.map((item,ind)=>{
               return(
                <tr className={`bg-light card-header`} key={ind}>
                  <td className={`${styles.tabrow} `}>{ind+1}</td>
                  <td className={`${styles.tabrow}`}>{item[0]}</td>
                  <td className={`${styles.tabrow}`}>{item[1]}</td>
                  <td className={`${styles.tabrow}`}>{item[2]}</td>
                </tr>
               )
             })
                
           }
            
           
         </tbody>
        </table>
        </div>
        


      <div className={`${styles.statanalysis}`}>
        <h3 className={`card-header text-center ${styles.headings}`}>Statistical Analysis</h3> 


        <div className={`${styles.tab}`}>
   
       <table className={`table table-bordered table-striped  table-hover table-responsive ${styles.font}`}>
         <thead className={`bg-warning  text-black  text-capitalize border-solid text-md-center border-dark`}>
           <tr>
               {
                 StatsCol.map((val,ind)=>{
                   return(
                     <th key={ind}>{val}</th>
                   )
                 })
               }
           </tr>
         </thead>  

        
       

       {
         Statdesc.map((val,ind)=>{
           return(
             <tbody className={`border-solid border-dark`}>
         { 
          
           <tr className={`bg-light card-footer`}>
           {
             val.map((col,colind)=>{
               return(
                 <td className={`${styles.tabrow}`} key={colind}>{col}</td>
               )
             })
           }
          </tr> 
         
         }
          
         
       </tbody>  
           )
         })
       }

       </table>
         </div>
     </div>
    
    
    
     <div className={`${styles.firstnval}`}>
        <h3 className={`card-header text-center ${styles.headings}`}>First 10 Values</h3> 


        <div className={`${styles.tab}`}>
   
       <table className={`table table-bordered table-striped  table-hover table-responsive ${styles.font}`}>
         <thead className={`bg-warning  text-black  text-capitalize border-solid text-md-center border-dark`}>
           <tr>
               {
                 ColumnName.map((val,ind)=>{
                   return(
                     <th key={ind}>{val}</th>
                   )
                 })
               }
           </tr>
         </thead>  

        
       

       {
         FirstNRows.map((val,ind)=>{
           return(
             <tbody className={`border-solid border-dark`}>
         { 
          
           <tr className={`bg-light card-footer`}>
           {
             val.map((col,colind)=>{
               return(
                 <td className={`${styles.tabrow}`} key={colind}>{col}</td>
               )
             })
           }
          </tr> 
         
         }
          
         
       </tbody>  
           )
         })
       }

       </table>
         </div>
     </div>
    






        <div className={`${styles.nullgraph}`}> 
         <h3 className={`card-header text-center  ${styles.headings}`}>Null Graph Analysis</h3>
         <img src={`data:image/png;base64,${NullGraphImg}`}alt='nullgraph' className={`${styles.nullgraphimg}`}></img>
        </div>

        <div className={`${styles.nullgraph}`} > 
         <h3 className={`card-header text-center ${styles.headings}`}>Correlation Analysis using Heat Map</h3>
         <img src={`data:image/png;base64,${CorrMapImg}`}alt='nullgraph' className={`${styles.nullgraphimg}`}  ></img>
        </div>

       

        

     
       
        

  </div>

        
       


</div>
  )
}

export default EDAReport