import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config({path:".env"})

export const sendEmail = (to,subject,text,html)=>{
    try {
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.COMAPANY_EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
  }) ;  

const mailoptions= {
    from :process.env.COMAPANY_EMAIL, 
    to,
    subject ,
    text,
    html
}

transporter.sendMail(mailoptions , (err , info )=>{

    console.log("Email Sent To : ", info.response);
})
    } catch (error) {
        console.log("Email Not Sent To : ", error
            
        );
        
        
    }
}