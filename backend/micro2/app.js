const express = require('express')
const { PrismaClient } = require('@prisma/client')
const Redis = require("ioredis")
const axios = require("axios")

const prisma = new PrismaClient()
const app = express()
const redis = new Redis({
    'port':process.env.redis_port,
    'host':process.env.redis_host
})
function chack_valide(x){
  if (x > 12 ) return true
  else return false
}
app.post("/concours/:concour",async(req,res)=>{

    try {
        const {cin ,cne} = req.body
        const {concour}=req.params
        const etudiant = axios.get(process.env.request_url, { data: { cin:cin,cne:cne } })
         const notes=[etudiant.note_mathematique ,
            etudiant.note_physique ,
            etudiant.note_arabe ,
            etudiant.note_anglais]
        let i = 0
        do {
            i+=1
        } while (chack_valide(notes[i])&&i<=3);
        if(i==3){
            const result = await prisma.user.create({
                data: {
                  cin ,
                  cne ,
                  status:false ,
                  concour
                },
              })
            return res.json(result).status(200)
        }else{
            const result = await prisma.user.create({
                data: {
                  cin ,
                  cne ,
                  status:true ,
                  concour
                },
              })
            return res.json(result).status(200)
        }
       
    } catch (error) {
        return res.json({"message":error}).status(300)
    }
})
app.get("/concours",async(req,res)=>{
    try{
        const concours = await prisma.user.findMany({select:{
            concour:true
         }}) 
         return res.json(concours).status(200)
    }catch{
        return res.json({"message":"erreur"}).status(300)
    }

})
app.get("/concours/accpte/:concour",async(req,res)=>{
    try{
        const {concour} = req.params
         let cacheEntry = await redis.get(`councour:${city}`,`concour:accpte`)

         /* If Redis returns a cache hit, */
       if (cacheEntry) {
           cacheEntry = JSON.parse(cacheEntry)
         /* return the entry */
         return res.json(cacheEntry).status(200)
         }
     
      
       /* If Redis returns a cache miss, fetch and return data from the API */
       const accpte = await prisma.user.findMany({select:{
        concour:true
     },where: {
        status: false}}) 
         
       /* Add the entry to Redis for next time and set an expiry of one hour */
       redis.set(`councour:${concour}`,`concour:accpte`, JSON.stringify(accpte), 'EX', 3600)
         return res.json(concours).status(200)
    }catch{
        return res.json({"message":"erreur"}).status(300)
    }

})
app.get("/concours/rejetee/:concour",async(req,res)=>{
    try{
        const {concour} = req.params
         let cacheEntry = await redis.get(`councour:${city}`,`concour:rejetee`)

         /* If Redis returns a cache hit, */
       if (cacheEntry) {
           cacheEntry = JSON.parse(cacheEntry)
         /* return the entry */
         return res.json(cacheEntry).status(200)
         }
     
      
       /* If Redis returns a cache miss, fetch and return data from the API */
       const rejter = await prisma.user.findMany({select:{
        concour:true,
     },  where: {
        status: false}}) 
         
       /* Add the entry to Redis for next time and set an expiry of one hour */
       redis.set(`councour:${concour}`,`concour:rejetee`, JSON.stringify(rejter), 'EX', 3600)
         return res.json(concours).status(200)
    }catch{
        return res.json({"message":"erreur"}).status(300)
    }
   
})
module.exports = app;