const createMessage= (text)=>{
    return {
        text,
        createdAt: new Date()
    }
}

const createLocMessage= (loc)=>{
    return {
        url:loc,
        createdAt: new Date().getTime()
    }
}
module.exports= {
    createMessage,
    createLocMessage
}
