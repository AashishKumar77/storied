import React from "react";

// Components
import Card from '../../components/TailwindCard';
import Translator from '../../components/Translator';

const getTranslator=(type, subtype)=>{

    switch(type){
        case "heading":
            return <Translator tkey={`search.records.heading.${subtype}`}/> 
        case "desc":
            default: 
            return <Translator tkey={`search.records.desc.${subtype}`}/>                                 
    }
    
}

const Arr=[
    {
        desc:getTranslator("desc","d1"),
        heading:getTranslator("heading","ssdi"),
        to:"/ssdi/400638C2-B682-E511-93F7-0025907EB195",
        type:""
    },
    {
        desc:getTranslator("desc","d2"),
        heading:getTranslator("heading","ssdi"),
        to:"/ssdi/410638C2-B682-E511-93F7-0025907EB195?clue=death location clue",
        type:""
    },
    {
        desc:getTranslator("desc","d3"),
        heading:getTranslator("heading","ssdi"),
        to:"/ssdi/430638C2-B682-E511-93F7-0025907EB195?clue=death date clue",
        type:""
    },
    {
        desc:getTranslator("desc","d4"),
        heading:getTranslator("heading","news"),
        to:"/newspaper/bluefield-daily-telegraph/feb-26-1950/p-1/",
        type:""
    },
    {
        desc:getTranslator("desc","d5"),
        heading:getTranslator("heading","news"),
        to:"/newspaper/boston-post/feb-25-1920/p-1/?clue=birth location clue",
        type:""
    },
    {
        desc:getTranslator("desc","d6"),
        heading:getTranslator("heading","news"),
        to:"/newspaper/new-castle-news/feb-26-1930/p-1/?clue=death date clue",
        type:""
    },
    {
        desc:getTranslator("desc","d7"),
        heading:getTranslator("heading","census"),
        to:"/census/household/7b0900e7-32b1-4ce3-af39-6e56a3e161dd/8f5e06e2-e6cb-4444-b95d-3fe79acb6527",
        type:""
    },
    {
        desc:getTranslator("desc","d8"),
        heading:getTranslator("heading","census"),
        to:"/census/household/7b0900e7-32b1-4ce3-af39-6e56a3e161dd/8f5e06e2-e6cb-4444-b95d-3fe79acb6527?clue=Relationship clue",
        type:""
    },
    {
        desc:getTranslator("desc","d9"),
        heading:getTranslator("heading","census"),
        to:"/census/household/7b0900e7-32b1-4ce3-af39-6e56a3e161dd/8f5e06e2-e6cb-4444-b95d-3fe79acb6527?clue=birth date clue",
        type:""
    }
]

const RecordsPage = () => {
    
    return (
        <>
            <div className="justify-center items-center flex-col container-scroll">
                {Arr.map((item,index)=><Card key={index} desc={item.desc} heading={item.heading} to={item.to} type={item.type} />)}
            </div>         
        </>
    )
}

export default RecordsPage;
