const firebase = require('../db');
const Record = require('../models/record');
const firestore = firebase.firestore();

const Nexmo = require('nexmo');
const sendSms = require('../twilio');


const comparePhone = (str1, str2) => {
    let phone1 = str1; 
    let phone2 = str2; 
    if(phone1.length > 10){
        phone1 = phone1.substring(phone1.length - 11, phone1.length - 1)
    }
    if(phone2.length > 10){
        phone2 = phone2.substring(phone2.length - 11, phone2.length - 1)
    }
    for(let i = 0; i < phone1.length ; i++){
        if(phone1[i] !== phone2[i]){
            return false;
        }
    }
    return true; 
}


const generateRandom = () => {

    // this function auto generates a randomm 6-digit code 
    let resultString = ""; 
    let randomNum = Math.random(); 
    let count = 1; 
    while(count <= 6){
        let randomNum = Math.floor(Math.random() + 0.5);
         // add a number 
        resultString += String.fromCharCode(48 + Math.floor(Math.random()*10));
        count = count + 1
    }
    return resultString; 
}

const CreateNewAccessCode = async (req, res, next) => {

    // This function receives a phone number 

    // add the record to the firebase database

    // auto generate a key

    // then return the key to the user via SMS 


    try {
        const dataToSave = req.body;
        const generatingKey = generateRandom();
        let flag = false;
        let id = null; 
        dataToSave.accessCode = generatingKey;

        console.log("dataToSave", dataToSave); 
       

        if(dataToSave.phoneNumber.length > 10){
            dataToSave.phoneNumber = dataToSave.phoneNumber.substring(dataToSave.phoneNumber.length - 10, dataToSave.phoneNumber.length); 
        }

        console.log(dataToSave.phoneNumber);



        
        const records = await firestore.collection('record');
        const data = await records.get();

       


        if(data.empty) {
            
           
            await firestore.collection('record').doc(dataToSave.phoneNumber).set(dataToSave);
        }

        else{

           

            data.forEach(doc => {

               

                if(doc.data().phoneNumber == dataToSave.phoneNumber){
                    flag = true; 
                }
            });

            if(!flag){
                await firestore.collection('record').doc(dataToSave.phoneNumber).set(dataToSave);
            }
            else{
                firestore.collection("record").doc(dataToSave.phoneNumber).update({
                    phoneNumber: dataToSave.phoneNumber,
                    accessCode: dataToSave.accessCode, 
                }).then(() => {
                    console.log("update successfully"); 
                });
            }
        }


        const welcomeMessage = `Welcome to Skipli! Your verification code is ${generatingKey}`;

        sendSms(dataToSave.phoneNumber, welcomeMessage);

        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const ValidateAccessCode = async (req, res, next) => {
    const dataToSave = req.body;
    const records = await firestore.collection('record');
    const data = await records.get();

   
    console.log("getting to verify function"); 

    if(dataToSave.phoneNumber.length > 10){

        console.log("length is more than 10"); 
        dataToSave.phoneNumber = dataToSave.phoneNumber.substring(dataToSave.phoneNumber.length - 10, dataToSave.phoneNumber.length); 
    }

    
    

    if(data.empty) {
        console.log("getting to data empty"); 
        return res.send("Phone number not fround"); 
    }
    else{
        console.log("getting to data process"); 
        data.forEach(doc => {
            if(doc.data().phoneNumber == dataToSave.phoneNumber){
                console.log(doc.data().phoneNumber + " " + dataToSave.phoneNumber);
                if(doc.data().accessCode == dataToSave.accessCode){
                    return res.send({success: true}); 
                }
                else{
                    return res.send({success:false}); 
                }
            }
        });
    }
}



const getAllRecords = async (req, res, next) => {

    try {
        const records = await firestore.collection('record');
        const data = await records.get();
        const recordsArray = [];
        if(data.empty) {
           
            res.status(404).send('No record found');
        }else {
          
            data.forEach(doc => {

                console.log(doc.data());
                const record = new Record(
                    doc.data().phoneNumber,
                    doc.data().accessCode,
                );
                recordsArray.push(record);
            });
            res.send(recordsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const deleteRecord = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('record').doc(data.phoneNumber).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}




module.exports = {
    CreateNewAccessCode,
    deleteRecord,
    getAllRecords,
    ValidateAccessCode
}