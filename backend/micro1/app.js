const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const app = express()

app.post("/etudiant/ajouter", async(req, res) => {
  try{
    const {cin ,
      cne ,
      note_mathematique ,
      note_physique ,
      note_arabe ,
      note_anglais } = req.body
    const check = await prisma.post.findUnique({
      where: { cin : cin, cne:cne }
    })
    if (check) return res.json({"message":"user alerady existe"}).status(300)

    const result = await prisma.user.create({
      data: {
        cin ,
        cne ,
        note_mathematique ,
        note_physique ,
        note_arabe ,
        note_anglais 
      },
    })
    if(result) return res.json({"message":"sucess"}).status(200)
    return res.json({"message":"erreur"}).status(400)
  }catch{
   return res.json({"message":"erreur"}).status(500)
  }
 
  
})
app.get("/etudiant/info",async (req,res)=>{
    const {cin,cne} = req.body;
    const result = await prisma.post.findUnique({
        where: { cin : cin, cne:cne }
      })
      if(result) return res.json(result).status(200)
      return res.json({"message":"erreur"}).status(400)
})
module.exports = app;