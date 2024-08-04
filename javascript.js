
//Free dictionary

let url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let btn = document.querySelector("#btn");
let definitionList = document.querySelector("#definition");
let synonymList = document.querySelector("#synonymList");
let antonymsList = document.querySelector("#antonymsList");
let errorElement = document.querySelector("#error");
let hDef = document.createElement("h5");
let hSyn = document.createElement("h5");
let hAnt = document.createElement("h5");
let noAntData=document.createElement("p");
let noSynData=document.createElement("p");
let prounonce=document.createElement("p")
let text=document.createElement("span");
let div= document.querySelector("#phonetics")
let word="";
let playBtn=document.querySelector("#playBtn")
let icon=document.createElement("i");

noAntData.classList.add("text");
noSynData.classList.add("text")
let audio;

btn.addEventListener("click", async (event) => {
    try {
        event.preventDefault()
        await emptyList();
        let word = document.querySelector("#input").value;
        console.dir(document.querySelector("#input"))
        div.append(word);
        await Dictionary(word);
        
    } catch (e) {
        errorElement.innerText = e;
    }
});

async function emptyList() {
    errorElement.innerText = "";
    clearList(definitionList);
    clearList(synonymList);
    clearList(antonymsList);
    clearList(div);
    if (hDef.parentNode) {
        hDef.parentNode.removeChild(hDef);
    }
    if (hSyn.parentNode) {
        hSyn.parentNode.removeChild(hSyn);
    }
    if (hAnt.parentNode) {
        hAnt.parentNode.removeChild(hAnt);
    }
    noAntData.remove();
    noSynData.remove();
    audio = null;

    
} 

function clearList(list) {
    while (list.childElementCount !== 0) {
        list.removeChild(list.firstChild);
    }
}

async function Dictionary(word) {
    try {
        
        let res = await axios.get(url + word);
        let data = res.data;
        console.log(data[0]);
        await phoneticsText(data[0])
        await phoneticsAudio(data[0])
        if (data && data[0] && data[0].meanings) {
            await RawData(data[0].meanings);
        } 
    } catch (e) {
        
        errorElement.innerText = (e+ "  :Sorry, we couldn't find definitions for the word you were looking for");
      
        
       
    }
}

async function RawData(data) {
    
    phoneticsText(data)
    defination(data);
    synonyms(data);
    antonyms(data);
}

function defination(rawdata) {

    
    hDef.innerText = "DEFINITION";
    definitionList.insertAdjacentElement("beforebegin", hDef);


    for (let j = 0; j < rawdata.length; j++) {
        let definitions = rawdata[j].definitions;
        for (let i = 0; i < definitions.length; i++) {
            if (definitionList.childElementCount<=4){
            let liDefi = document.createElement("li");
            liDefi.innerText = definitions[i].definition;
            definitionList.appendChild(liDefi);
        }
    }
}

}
function synonyms(rawdata) {
    
    hSyn.innerText = "SYNONYMS";
    synonymList.insertAdjacentElement("beforebegin", hSyn);
    let count = 0;
    for (let j = 0; j < rawdata.length; j++) {
        let synonyms = rawdata[j].synonyms;
        if(synonyms.length>0){
            count++;
        for (let i = 0; i < synonyms.length; i++) {
            if (synonymList.childElementCount<=4){
            let lisyn = document.createElement("li");
            lisyn.innerText = synonyms[i];
            synonymList.appendChild(lisyn);
        }
    }
}
}
    if(count===0){
       noSynData.innerText="no data found"   //when their is not data found in Antonyms
       hSyn.insertAdjacentElement("afterend",noSynData)
    }
}
function antonyms(rawdata) {
    
    hAnt.innerText = "ANTONYMS";
    antonymsList.insertAdjacentElement("beforebegin", hAnt);
   let count = 0; 
    for (let j = 0; j < rawdata.length; j++) {
        let antonyms = rawdata[j].antonyms;
        if(antonyms.length>0){
              count++;
        for (let i = 0; i < antonyms.length; i++) {
            if (antonymsList.childElementCount<=4){
            let liant = document.createElement("li");
            liant.innerText = antonyms[i];
            antonymsList.appendChild(liant);  
    }
    }
    }
}
    if(count===0){
        noAntData.innerText="no data found"   //when their is not data found in Antonyms
        hAnt.insertAdjacentElement("beforeend",noAntData)
    }
}

// async function phonetics(data){
//     try{
//         let count=0;
//     let phonetics=data.phonetics;
//     // console.log("phonetics", phonetics);
//      for (i=0;i<phonetics.length;i++){

//          if(phonetics[i].hasOwnProperty("text")==="true"){
//            count++
//             if(count==1 &&(phonetics[i].text!=="")){
//          console.log("check",phonetics[i].hasOwnProperty("text"))
//            text.innerText = phonetics[i].text
//            div.appendChild(text);
//         }
//         }
//         }
     
//     }catch(e) {
//         console.log("error in phonetics", e)
//     } 
// }

async function phoneticsText(data) {
    try {
      if (data && data.phonetics) { // Check if data and data.phonetics exist
        let phonetics = data.phonetics;
        let count = 0;
        for (let i = 0; i < phonetics.length; i++) {
          if (phonetics[i].hasOwnProperty("text")) {
            count++;
            if (count === 1 && phonetics[i].text !== "") {
              text.innerText = phonetics[i].text;
              div.appendChild(text);
            }
          }
        }
      }
    } catch (e) {
      console.log("error in phonetics", e);
    }
  }
  

async function phoneticsAudio(data) {
    try {
        let phonetics = data.phonetics;
        let count = 0;
        icon.classList.add("fa-solid", "fa-volume-high")
        div.insertAdjacentElement("afterbegin", icon);
        for (let i = 0; i < phonetics.length; i++) {
            if (phonetics[i].hasOwnProperty("audio")) {
                count++;
                if (count>=1 && phonetics[i].audio !== "") {
                    console.log(phonetics[i].audio)
                     audio = new Audio (phonetics[i].audio);
                     
                     
                     
                    
                }
            }
        }
    } catch (e) {
        console.log("error in phonetics", e);
    }
}

icon.addEventListener("click", () => {
    if (audio) {
        audio.play();
    }
});
