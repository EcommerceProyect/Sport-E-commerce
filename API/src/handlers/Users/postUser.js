const { postUserController } = require("../../controllers/Users/postUserController")

const postUser = async (req,res) => {

    const {permissions,custom_email_claim,sub} = req.auth.payload;

    if(!custom_email_claim) return false;

    try {
        
        const response = await postUserController({
            id:sub,
            registration_type: sub.includes("google") ? "google" : "local",
            email:custom_email_claim,
            name:custom_email_claim,
            last_name: null,
            phone: null ,
            password:null,
            role:[permissions].includes("admin") ? "admin" : "user",
            
        });

        return response

    } catch (error) {
        res.status(500).json(error.message)
    }

}

module.exports = {
    postUser,
}