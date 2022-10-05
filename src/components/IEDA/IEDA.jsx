import React, { useState } from 'react'
import axios from 'axios';
import styles from "./IEDA.module.css"
import {useNavigate} from "react-router-dom"
import { useRef } from 'react';
import { Toast } from 'primereact/toast'; 
import { Messages } from 'primereact/messages';
import { Dropdown } from 'primereact/dropdown';
import {CirclesWithBar} from  'react-loader-spinner'
function IEDA(props) {

    let file = props.file;  
    
    let [ColNames,SetColNames] = useState([])
    let [NumCol,SetNumCol] = useState([])

    let [HistDrop,SetHistDrop] = useState("")
    let [HistLoader,SetHistLoader] = useState(false)
    let [HistImg,SetHistImg] = useState(null) 

    let [DistDrop,SetDistDrop] = useState("")
    let [DistLoader,SetDistLoader] = useState(false)
    let [Distimg,SetDistImg] = useState(null) 

    let [BoxDrop,SetBoxDrop] = useState("")
    let [BoxLoader,SetBoxLoader] = useState(false)
    let [Boximg,SetBoxImg] = useState(null) 

    let [Scat1Drop,SetScat1Drop] = useState("")
    let [Scat2Drop,SetScat2Drop] = useState("")
    let [ScatLoader,SetScatLoader] = useState(false)
    let [Scatimg,SetScatImg] = useState(null) 

    let [DescDrop,SetDescDrop] = useState("")
    let [DescLoader,SetDescLoader] = useState(false)

    let [min,setmin] = useState([])
    let [max,setmax] = useState([]) 
    let [mean,setmean] = useState([]) 
    let [sum,setsum] = useState([]) 
    let [unique,setunique] = useState([])

    let [UniqDrop,SetUniqDrop] = useState("")
    let [UniqLoader,SetUniqLoader] = useState(false)
    let [ColUnique,setColUnique] = useState([])

    
    
    


    
    

    
    
    
    
    const navigate = useNavigate()
    const toast = useRef(null)
    const msgs1 = useRef(null);  
    const token = localStorage.getItem("token")
    React.useEffect(()=>{
        const  tokenAuth = ()=>{
            axios.defaults.baseURL = 'http://localhost:5000';
            axios.defaults.headers.post['Content-Type'] ='multipart/form-data'
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.common = {'Authorization': `bearer ${token}`} 
            axios.post("http://localhost:5000/Authorization",{}).then((response) => {
              console.log(response.data); 
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
        },[token,navigate]) 

        const getColnamesurl = 'http://localhost:5000/getColnames';
        
        
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

    React.useEffect(()=>{
        axios.post(getColnamesurl, formData, config).then((response) => {
            // console.log(response.data); 
            SetColNames(response.data["colnam"])
            SetNumCol(response.data["intcols"])
            
            
            
          }).catch((err)=>{
            console.log(err); 
            toast.current.show({severity: 'error', summary: 'Descriptive Analysis failed', detail: 'Error while getting Data'});
            msgs1.current.show({severity: 'error', summary: 'Descriptive Analysis failed',detail: 'Error while getting data'});  
           
            
           
          });
    },[]) 
  

    function getDescAnal(){
      if(DescDrop === ""){
        msgs1.current.show({severity: 'error', summary: 'Descriptive Analysis failed',detail: 'please select a value'});
        return ;   
             
      }
      console.log(DescDrop); 
      SetDescLoader(true);
      let DescFormData = new FormData() 
      DescFormData.append("dataset",file) 
      DescFormData.append("colname",DescDrop); 
      axios.post("http://localhost:5000/getDescriptiveAnalysis", DescFormData, config).then((response) => { 
        SetDescLoader(false)
       console.log(response.data)
       setmax(response.data["max"])
       setmin(response.data["min"])
       setmean(response.data["mean"])
       setsum(response.data["sum"])
       setunique(response.data["unique_val"])

       
        
        
        
        
        
      }).catch((err)=>{
        console.log(err); 
        SetDescLoader(false)
        toast.current.show({severity: 'error', summary: 'Description Analysis failed', detail: 'Error while getting Data'});
        msgs1.current.show({severity: 'error', summary: 'Description Analysis failed',detail: 'Error while getting data'});  
       
        
       
      });
    } 

  
  function getHistogram(){
    if(HistDrop === ""){
      msgs1.current.show({severity: 'error', summary: 'Histogram Analysis failed',detail: 'please select a value'});
      return ;   
           
    }
    console.log(HistDrop); 
    SetHistLoader(true);
    let HistFormData = new FormData() 
    HistFormData.append("dataset",file) 
    HistFormData.append("colname",HistDrop); 
    axios.post("http://localhost:5000/getHistogram", HistFormData, config).then((response) => { 
      SetHistLoader(false)
      SetHistImg(response.data["Histogram"])
      
      
      
      
      
    }).catch((err)=>{
      console.log(err); 
      SetHistLoader(false)
      toast.current.show({severity: 'error', summary: 'Histogram Analysis failed', detail: 'Error while getting Data'});
      msgs1.current.show({severity: 'error', summary: 'Histogram Analysis failed',detail: 'Error while getting data'});  
     
      
     
    });
  } 
    
  function getDistplot(){
    if(DistDrop === ""){
      msgs1.current.show({severity: 'error', summary: 'Descriptive Analysis failed',detail: 'please select a value'});
      return ;   
           
    }
    console.log(DistDrop); 
    SetDistLoader(true);
    let DistFormData = new FormData() 
    DistFormData.append("dataset",file) 
    DistFormData.append("colname",DistDrop); 
    axios.post("http://localhost:5000/getDistplot", DistFormData, config).then((response) => { 
      SetDistLoader(false)
      SetDistImg(response.data["Distplot"])
      
      
      
      
      
    }).catch((err)=>{
      console.log(err); 
      SetDistLoader(false)
      toast.current.show({severity: 'error', summary: 'Distplot Analysis failed', detail: 'Error while getting Data'});
      msgs1.current.show({severity: 'error', summary: 'Distplot Analysis failed',detail: 'Error while getting data'});  
     
      
     
    });
  }
   

  function getBoxplot(){
    if(BoxDrop === ""){
      msgs1.current.show({severity: 'error', summary: 'Descriptive Analysis failed',detail: 'please select a value'});
      return ;   
           
    }
    console.log(BoxDrop); 
    SetBoxLoader(true);
    let BoxFormData = new FormData() 
    BoxFormData.append("dataset",file) 
    BoxFormData.append("colname",BoxDrop); 
    axios.post("http://localhost:5000/getBoxplot", BoxFormData, config).then((response) => { 
      SetBoxLoader(false)
      SetBoxImg(response.data["Boxplot"])
      
      
      
      
      
    }).catch((err)=>{
      console.log(err); 
      SetBoxLoader(false)
      toast.current.show({severity: 'error', summary: 'Boxplot Analysis failed', detail: 'Error while getting Data'});
      msgs1.current.show({severity: 'error', summary: 'Boxplot Analysis failed',detail: 'Error while getting data'});  
     
      
     
    });
  } 


  function getScatterplot(){
    if(Scat1Drop === "" || Scat2Drop ===""){
      msgs1.current.show({severity: 'error', summary: 'Descriptive Analysis failed',detail: 'please select a value'});
      return ;   
           
    }
    console.log(Scat1Drop+" "+Scat2Drop); 
    SetScatLoader(true);
    let ScatFormData = new FormData() 
    ScatFormData.append("dataset",file) 
    ScatFormData.append("acol",Scat1Drop);
    ScatFormData.append("bcol",Scat2Drop); 
    axios.post("http://localhost:5000/getScatterplot", ScatFormData, config).then((response) => { 
      SetScatLoader(false)
      SetScatImg(response.data["Scatterplot"])
      
      
      
      
      
    }).catch((err)=>{
      console.log(err); 
      SetScatLoader(false)
      toast.current.show({severity: 'error', summary: 'ScatterPlot Analysis failed', detail: 'Error while getting Data'});
      msgs1.current.show({severity: 'error', summary: 'ScatterPlot Analysis failed',detail: 'Error while getting data'});  
     
      
     
    });
  } 
  

  function getUniqueColVal(){
    if(UniqDrop === ""){
      msgs1.current.show({severity: 'error', summary: 'Unique Analysis failed',detail: 'please select a value'});
      return ;   
           
    }
    console.log(UniqDrop); 
    SetUniqLoader(true);
    let UniqFormData = new FormData() 
    UniqFormData.append("dataset",file) 
    UniqFormData.append("colname",UniqDrop); 
    axios.post("http://localhost:5000/getUniqueValues", UniqFormData, config).then((response) => { 
      SetUniqLoader(false)
      console.log(response.data)
      setColUnique(response.data)
      
      
      
      
      
    }).catch((err)=>{
      console.log(err); 
      SetUniqLoader(false)
      toast.current.show({severity: 'error', summary: 'Unique Analysis failed', detail: 'Error while getting Data'});
      msgs1.current.show({severity: 'error', summary: 'Unique Analysis failed',detail: 'Error while getting data'});  
     
      
     
    });
  } 

  



  return (
    <div className={`${styles.IDEA}`}> 
    <h3 className='bg-warning text-black text-center'>Choose the column Name for Interactive Changes</h3>
         <Toast ref={toast}></Toast>
         <Messages ref={msgs1} />  

        <div className={`${styles.histdiv}`}> 
           <h3 className={`text-black text-center ${styles.colheaders}`}>Histogram Univariate Analysis</h3>
           <Dropdown value={HistDrop} options={NumCol} onChange={(e) => SetHistDrop(e.value)} className='bg-light text-black' placeholder="Select a Column"/>  
           <button className='btn btn-dark text-white ' onClick={getHistogram}>Display</button> 

           <div className={`${styles.graphImg}`}>
           <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={HistLoader} outerCircleColor=""/>
             <h6 className='card-header bg-warning text-black fw-bold'>Histogram</h6>
             <img src={`data:image/png;base64,${HistImg}`}alt='Histgraph' className={``}></img>
           </div>
        </div>  


        <div className={`${styles.histdiv}`}> 
        <h3 className={`text-black text-center ${styles.colheaders}`}>Distplot Univariate Analysis</h3>
        <Dropdown value={DistDrop} options={NumCol} onChange={(e) => SetDistDrop(e.value)} className='bg-light text-black' placeholder="Select a Column"/>  
        <button className='btn btn-dark text-white ' onClick={getDistplot}>Display</button> 

        <div className={`${styles.graphImg}`}>
        <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={DistLoader} outerCircleColor=""/>
           <h6 className='card-header bg-warning text-black fw-bold'>Distplot</h6>
          <img src={`data:image/png;base64,${Distimg}`}alt='Distplotgraph' className={``}></img>
        </div>
      </div>


    <div className={`${styles.histdiv}`}> 
      <h3 className={`text-black text-center ${styles.colheaders}`}>Boxplot Univariate Analysis</h3>
      <Dropdown value={BoxDrop} options={NumCol} onChange={(e) => SetBoxDrop(e.value)} className='bg-light text-black' placeholder="Select a Column"/>  
      <button className='btn btn-dark text-white ' onClick={getBoxplot}>Display</button> 

      <div className={`${styles.graphImg}`}>
      <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={BoxLoader} outerCircleColor=""/>
         <h6 className='card-header bg-warning text-black fw-bold'>Boxplot</h6>
        <img src={`data:image/png;base64,${Boximg}`}alt='boxplotgraph' className={``}></img>
      </div>
    </div> 




    <div className={`${styles.histdiv}`}> 
    <h3 className={`text-black text-center ${styles.colheaders}`}>Scatterplot Bivariate Analysis</h3>
    <Dropdown value={Scat1Drop} options={NumCol} onChange={(e) => SetScat1Drop(e.value)} className={`bg-light text-black ${styles.drop}`} placeholder="Select a Column"/> 
    <Dropdown value={Scat2Drop} options={NumCol} onChange={(e) => SetScat2Drop(e.value)} className={`bg-light text-black ${styles.drop}`} placeholder="Select a Column"/>  
    <button className='btn btn-dark text-white ' onClick={getScatterplot}>Display</button> 

    <div className={`${styles.graphImg}`}>
    <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={ScatLoader} outerCircleColor=""/>
       <h6 className='card-header bg-warning text-black fw-bold'>ScatterPlot</h6>
      <img src={`data:image/png;base64,${Scatimg}`}alt='Scatterplotgraph' className={``}></img>
    </div>
  </div> 
  

  <div className={`${styles.histdiv}`}> 
        <h3 className={`text-black text-center ${styles.colheaders}`}>Descriptive Univariate Analysis</h3>
        <Dropdown value={DescDrop} options={NumCol} onChange={(e) => SetDescDrop(e.value)} className='bg-light text-black' placeholder="Select a Column"/>  
        <button className='btn btn-dark text-white ' onClick={getDescAnal}>Display</button> 
        
        <div className={`${styles.statanalysis}`}>
        <h3 className={`card-header text-center ${styles.headings}`}>Descriptive Analysis</h3> 

        <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={DescLoader} outerCircleColor=""/>
       
       <h4 className='bg-dark text-white card-header'>Description Analysis over First Value of the Each Column. The measures are Min,Max,Mean,Sum,Unique_Values</h4>
     <div className={`${styles.tab}`}>
           
       <table className={`table table-bordered table-striped  table-hover table-responsive ${styles.font}`}>
         <thead className={`bg-warning  text-black  text-capitalize border-solid text-md-center border-dark`}> 
           
           <tr>
               {
                 NumCol.map((val,ind)=>{
                   return(
                     <th key={ind+1}>{val}</th>
                   )
                 })
               }
           </tr>
         </thead>   



         {
         min.map((val,ind)=>{
            return(
              <tbody className={`border-solid border-dark`}>
          { 
           
            <tr className={`bg-light card-footer`} key={ind}>
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
       
        {
          max.map((val,ind)=>{
             return(
               <tbody className={`border-solid border-dark`}>
           { 
            
             <tr className={`bg-light card-footer`} key={ind}>
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

         {
          mean.map((val,ind)=>{
             return(
               <tbody className={`border-solid border-dark`}>
           { 
            
             <tr className={`bg-light card-footer`} key={ind}>
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

         {
          sum.map((val,ind)=>{
             return(
               <tbody className={`border-solid border-dark`}>
           { 
            
             <tr className={`bg-light card-footer`} key={ind}>
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

         {
          unique.map((val,ind)=>{
             return(
               <tbody className={`border-solid border-dark`}>
           { 
            
             <tr className={`bg-light card-footer`} key={ind}>
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
    
      </div>
    


      <div className={`${styles.histdiv}`}> 
      <h3 className={`text-black text-center ${styles.colheaders}`}>Column Unique Value Analysis</h3>
      <Dropdown value={UniqDrop} options={ColNames} onChange={(e) => SetUniqDrop(e.value)} className='bg-light text-black' placeholder="Select a Column"/>  
      <button className='btn btn-dark text-white ' onClick={getUniqueColVal}>Display</button> 

      
      <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={UniqLoader} outerCircleColor=""/>
        
      <div className={`${styles.box}`}>
        <h3 className='bg-warning card-header border-dark'>{UniqDrop+" Column Unique Values"}</h3> 
        <div className={`${styles.roler}`}>
         {
          ColUnique.map((val,ind)=>{
            return(
              <div key={ind} className={`${styles.contentdiv}`}>
                 <h3 className={`text-center card card-header text-white  ${styles.headval}`}>{val}</h3> 
              </div>
            )
          })
         }
        </div>
      </div>
   </div>  
    

      <div className='bg-warning'>
        <h2 className='text-center accordion-body '>AUTO EDA Analysis Report has been generated</h2>
      </div>
    </div>
  )
}

export default IEDA