import React, { useState } from 'react'
import axios from 'axios';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast'; 
import { Messages } from 'primereact/messages';
import styles from "./ReportHistory.module.css"
import {CirclesWithBar} from  'react-loader-spinner'
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
function ReportHistory() { 
   
    const toast = useRef(null)
    const msgs1 = useRef(null); 

    const navigate = useNavigate(); 
    let [Loader,setLoader] = useState(false); 
    let [BasicEDA,SetBasicEDA] = useState({}) 
    let [NumColStats,SetNumColStats] = useState({})
    let [ShowDetReport,SetShowDetReport] = useState(false)  

   

    let [StatsCol,SetStatsCol] = useState([])
    let [StatsDesc,SetStatsDesc] = useState([])

    let [History,SetHistory] = useState([])
    const token = localStorage.getItem("token") 

    let [ColumnName,SetColumnName] = useState([])
    let [ColDataTypes,SetColDataTypes] = useState([]) 
    let [ColNullCnt,SetColNullCnt] = useState([])
  
    let [NullGraphImg,SetNullGraphImg] = useState(null)
    let [CorrMapImg,SetCorrMapImg] = useState(null)
    let [FirstNRows,SetFirstNRows] = useState([])  
    let [Filename,SetFilename] = useState("")
    let [ProcessedOn,SetProcessedOn] = useState("")
    let [UniqueId,SetUniqueID] = useState("")
    

    function ExportPDF(){
      var print = document.getElementById('print');
      //var width = document.getElementById('print').offsetWidth;
      html2canvas(print).then(canvas => {
        var imgWidth = 208;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf.jsPDF('p', 'mm', 'a0');
        var position = 5;
        pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth-7, imgHeight)
        pdf.save(Filename+'_EDA_Analysis.pdf');
       })
    } 


  React.useEffect(()=>{
    const  tokenAuth = ()=>{
        axios.defaults.baseURL = 'http://localhost:5000';
        axios.defaults.headers.post['Content-Type'] ='multipart/form-data'
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        axios.defaults.headers.common = {'Authorization': `bearer ${token}`} 
        axios.post("http://localhost:5000/getHistory",{}).then((response) => {
          
          if(response.data.Code === "404"){
            toast.current.show({severity: 'error', summary: 'Authentication Error', detail: 'UnAuthorized User'});
            msgs1.current.show({severity: 'error', summary: 'Authentication Error',detail: 'UnAuthorized User'});  
  
            setInterval(()=>{
              navigate("/login");
            },100); 
        
         
          }
          else{
            console.log("hello this is from history")
            console.log(response.data)
            SetHistory(response.data)
          }
         
        }).catch((err)=>{
          console.log(err); 
          toast.current.show({severity: 'error', summary: 'Error while Authentication', detail: 'Error while Authentication Process'});
          msgs1.current.show({severity: 'error', summary: 'Error while Authentication',detail: 'Error while Authentication'});  
          
          navigate("/login")
         
        })
      }; 
      tokenAuth();
    },[token,navigate]) 
    
  
    function getDetailedReport(val){
      console.log("sel vall is") 
      let SelectedData = History[val] 
      console.log(SelectedData.uniqueid)
      toast.current.show({severity: 'success', summary: 'Report Submitted', detail: 'Checking '});
      msgs1.current.show({severity: 'info', summary: 'Report ',detail: 'Checking'});  

      const url = 'http://localhost:5000/ProcessHistory';
      let token = localStorage.getItem("token");
      
      const  formData = new FormData();
      formData.append("uniqueid",SelectedData.uniqueid) 
      formData.append("filename",SelectedData.filename)
      formData.append("filetype",SelectedData.filetype) 
      formData.append("processedon",SelectedData.processedon)  
      formData.append("username",SelectedData.username)
      console.log(formData)
      
       
      
      
      
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          
        },
      };
      
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.post['Content-Type'] ='multipart/form-data'
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.common = {'Authorization': `bearer ${token}`} 
      axios.post(url,formData, config).then((response) => {
        console.log(response.data);
        let basiceda = JSON.parse(response.data["basiceda"])
        let numcolstats = JSON.parse(response.data["numcolstats"])
        SetBasicEDA(basiceda)
        SetNumColStats(numcolstats) 

        let columnName = BasicEDA.ColNames
        let colDataTypes = BasicEDA.ColDataTypes 
        let colNullCnt = BasicEDA.ColNullCnt 
        let nullGraphImg = BasicEDA.NullGraph 
        let corrMapImg = BasicEDA.CorrHeatMap 
        let firstNRows = BasicEDA.FirstNRows  

        let statsCol = numcolstats["columnName"] 
        let statdesc = numcolstats["statistics"]
        statsCol = ["Statistical Measures"].concat(statsCol)

        
        
       

        SetColumnName(basiceda.ColNames) 
        SetColDataTypes(basiceda.ColDataTypes)
        SetColNullCnt(basiceda.ColNullCnt)
        SetFirstNRows(basiceda.FirstNRows)
        SetNullGraphImg(nullGraphImg)
        SetStatsCol(statsCol)
        SetStatsDesc(statdesc)

        SetCorrMapImg(corrMapImg)
       
        SetFilename(response.data["filename"])
        SetProcessedOn(response.data["processdon"])
        SetUniqueID(response.data["uniqueid"])

        SetShowDetReport(true)
        
        
       
      

       

      

       

      
        
      






      toast.current.show({severity: 'success', summary: 'Report Saved', detail: 'Report has been saved sucessfully'});
      msgs1.current.show({severity: 'suucess', summary: 'Report Saved',detail: 'Report has been saved sucessfully'});  
        
       
        
        
      }).catch((err)=>{
        console.log(err); 
        toast.current.show({severity: 'error', summary: 'Uploading Failed', detail: 'Error while uploading'});
        msgs1.current.show({severity: 'error', summary: 'Uploading Failed',detail: 'Error while getting data'});  
        
       
       
      }); 
     
      

   



    }

    // Home Navigator 

    function HomeNavigator(){
      navigate("/dashboard")
    }

      return ( 
       
      <div className={`${styles.historydiv} container`}>
      <Toast ref={toast}></Toast>
      <Messages ref={msgs1} />  

      {ShowDetReport === false ? 
      
         <div className={`${styles.historytab} m-4 container`}> 
        
           <h3 className={`${styles.headings} text-center card card-header m-1 font-weight-bold`}>Past Analysis Report Details Here. </h3> 
           <button className='btn btn-dark m-2' onClick={HomeNavigator}>Back to Home</button>
          {History.length>0 ? <table className={`table table-bordered table-striped  table-hover table-responsive ${styles.histtab}`}>
             <thead className={`bg-primary text-white text-black  text-capitalize border-solid text-md-center border-dark`}>
               <tr>
                 <th>Serial.No</th>
                 <th>Process ID</th>
                 <th>Processed On</th>
                 <th>Report Name</th>
                 <th>File Type</th>
                
               </tr>
             </thead> 

             <tbody className={`border-solid border-dark`}> 
               {

                  History.map((item,ind)=>{
                    return(
                     <tr className={`bg-light card-header`} key={ind} onClick={() => getDetailedReport(ind)}  >
                       <td className={`${styles.tabrow} `}>{ind+1}</td>
                       <td className={`${styles.tabrow}`}>{item["uniqueid"]}</td>
                       <td className={`${styles.tabrow}`}>{item["processedon"].slice(0,2)+"/"+item["processedon"].slice(2,4)+"/"+item["processedon"].slice(4,8)+" "+item["processedon"].slice(8,10)+":"+item["processedon"].slice(10,12)+":" + item["processedon"].slice(12,14)}</td>
                       <td className={`${styles.tabrow}`}>{item["filename"]}</td>
                       <td className={`${styles.tabrow}`}>{item["filetype"]}</td>
                     </tr>
                    )
                  })
                     
                }
             </tbody>
           </table> : <div><h3>No Past Report History has been saved. Please Save once you perform analysis</h3><button className='btn btn-warning' onClick={()=>{navigate("/history")}}>Back to History</button></div> }
         </div> :
         
         <div id='print'>
         <div className={`${styles.detrep}`} > 
         <button className='btn btn-dark m-2' onClick={()=>{SetShowDetReport(false)}}>Back to History</button>
         <button className='btn btn-dark m-2' onClick={ExportPDF} >Download</button>
         <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={Loader} outerCircleColor=""/>
          <div className={`${styles.detrephead} card card-header bg-light`} > 
           <h3 className={`${styles.detreptxt} card card-header `}>Report Name :{" "+Filename}</h3>
           <h3 className={`${styles.detreptxt} card card-header`}>Processed On :{" "+ProcessedOn}</h3>
           <h3 className={`${styles.detreptxt} card card-header`}>Report No :{" "+UniqueId}</h3>
          </div> 

      <div className={`m-1`}> 
            <h3 className={`card-header text-center bg-warning font ${styles.headings} m-2`}>EDA REPORT SUMMARY</h3>
            <div className={`${styles.tab}`}>
        
            <table className={`table table-bordered table-striped  table-hover table-responsive`}>
            <thead className={`bg-primary text-white text-black  text-capitalize border-solid text-md-center border-dark`}>
                <tr>
                 <th className={``}>Column No</th> 
                 <th className={``}>Column Name</th>
                 <th className={``}>Column DataType</th> 
                 <th className={``}>Column Null Count</th> 
                 
                </tr>
            </thead> 
  
           <tbody className={`border-solid border-dark`}>
             {
               ColDataTypes.map((item,ind)=>{
                 return(
                  <tr className={`bg-light card-header`} key={ind}>
                    <td className={`${styles.tabrow} `}>{ind+1}</td>
                    <td className={`${styles.tabrow}`}>{item[0]}</td>
                    <td className={`${styles.tabrow}`}>{item[1]}</td>
                    <td className={`${styles.tabrow}`}>{ColNullCnt[ind]}</td>
                    
                  </tr>
                 )
               })
                  
             }
              
             
           </tbody>
          </table>
          </div>  
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
          StatsDesc.map((val,ind)=>{
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
          FirstNRows.map((item,ind)=>{
            return (
              <tbody className={`border-solid border-dark`}>
              { 
          
                <tr className={`bg-light card-footer`} key={ind}>
                {
                  item.map((col,colind)=>{
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
      }
     
       
      </div>   
      
      
      
     
      );
}

export default ReportHistory