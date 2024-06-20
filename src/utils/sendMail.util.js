import nodemailer from "nodemailer";

const sendMail = async (reciverEmail, subjectToSend, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      service: "gmail",
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Koushik Panda " <panda747767@gmail.com>', // sender address
      to: reciverEmail, // list of receivers
      subject: subjectToSend, // Subject line
      text: `Update your password using this otp ${otp}`, // plain text body
    });

    console.log(info);
  } catch (error) {
    console.log("error>>>> ", error);
  }
};

export default sendMail;
