import nodemailer from "nodemailer";

async function sendMail(receivers, subject, content) {
  try {
    const mailOptions = {
      from: "devjoyti.jgec@gmail.com",
      to: receivers,
      subject: subject,
      //text: "This is the body of the mail",
      html: content,
    };

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "enter gmail",
        pass: "enter the password",
      },
    });

    const info = await transport.sendMail(mailOptions);
    return info;
    //console.log("Message send" + info);
  } catch (error) {
    console.log(error);
  }
}
export default sendMail;
