/*

Nir Kedem 209080928
Maor Hamay 307966978

*/

console.log('start file database');
const mongoose = require('mongoose');

//preventing unintended data retrieval to the mongoDB
mongoose.set('strictQuery', true);
console.log('mongoose module is available');

//module to provides and generates random ID
const crypto = require('crypto');

try{

    const connectionParams={
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

    mongoose.connect('mongodb+srv://maor:D2eXVWUEvIyGGSUz@cluster0.kq68toy.mongodb.net/mongodb?retryWrites=true&w=majority'
        ,connectionParams);
    const db = mongoose.connection;
    db.on('error', () => {console.log('error connect to the server- please check your internet connection')});
    db.once('open', () => {
        console.log('connected to the ATLAS data base!');
    });

    const Schema = mongoose.Schema;

    //USER collection structure
    const userSchema = new Schema({
        id: String,
        firstName: String,
        lastName: String,
        birthday: Date,
    });

    //COST collection structure
    const costSchema = new Schema({
        user_id: {
            type: Number,
            require: true,
        },
        year: {
            type: Number,
            required: false,
            validate: [validateDate, null,null, '1900-2300'],
        },
        month: {
            type: Number,
            required: false,
            validate: [validateDate, null, '1-12',null],
        },
        day: {
            type: Number,
            required: false,
            validate: [validateDate, '1-31',null,null],
        },
        description: String,
        category: {
            type: String,
            enum: [
                'food',
                'health',
                'housing',
                'sport',
                'education',
                'transportation',
                'other',
            ],
        },
        sum: Number,
        id: {
            type: String,
            index: true,
            required: true,
            unique: true,

            //create a random value number to the ID parameter
            default: () => {
                return crypto.randomBytes(16).toString('hex');
            }}
    });

    //check correct valid value Date of calendar year
    function validateDate(day,month,year){
        if(day!=null && month==null && year==null){
            if(day>= 1 && day<= 31){
                return day;
            }
        }
        else if(day==null && month!=null && year==null){
            if(month>= 1 && month <= 12){
                return month;
            }
        }
        else if(day==null && month==null && year!=null){
            if(year >= 1900 && year <= 2300){
                return year;
            }
        }
    }

    userSchema.methods.printDetails=function () {

        const str ='the user is:' +'\nid=' + this.id + '\nfirstName=' + this.firstName+
           '\nlastName='  + this.lastName+  '\nbirthday'  + this.birthday;
        console.log(str);
    };

    costSchema.methods.printDetails=function () {

        const str ='user_id=' + this.user_id +'\nyear='  + this.year+
            '\nmonth='   + this.month+ '\nday=' + this.day+
            '\ndescription='  + this.description+ '\ncategory=' + this.category+
           '\nsum=' +this.sum;
        console.log(str);
    };

    //referance to an object of documents structure in the MongoDB collection
    const User = mongoose.model('user', userSchema);
    const Cost = mongoose.model('cost', costSchema);

// create single document of a user
    const user = new User({
        id: '123123',
        firstName: 'Moshe' ,
        lastName: 'Israeli' ,
        birthday: new Date(1990, 0, 10),
    });

    user.printDetails();

    //save the current DATE if not defined
    costSchema.pre('save', function (next) {
        const timeRightNow = new Date();

        if (this.year == null){
            this.year = timeRightNow.getFullYear();
        }
        if (this.month == null){
            this.month = timeRightNow.getMonth() + 1;
        }
        if (this.day == null){
            this.day = timeRightNow.getDate();
        }

        //using middleware: next() method is used to return the next document in a cursor
        next();
    });

    async function checkUserExistenceAndCreate(user){
        try{
            const findUserInDB = await User.findOne({ id: user.id });
            console.log('findUser: '+findUserInDB);
            if(findUserInDB==null){
                const createNewUser = await User.create(user);
                console.log(`the new user that was created: ${createNewUser}`);
                return createNewUser;
            }

            console.log('User is already exists in the DB, not creating again');
            return findUserInDB;
        } catch(errorMessage) {
            console.error(errorMessage);
            throw errorMessage;
        }
    }

    checkUserExistenceAndCreate(user).then(console.log).catch(console.error);
    module.exports = { Cost, User };

}catch(error){
    console.log('error message is: ' + error);
    throw(error);
}