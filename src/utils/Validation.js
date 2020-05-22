export const emailValidate = email => {
    const eValue = email || ''
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    const result = pattern.test(eValue);
    return result;

}

export const is_url= str =>{
    console.log("str-->",str);
    var regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return str == undefined? undefined :(regexp.test(str) ? undefined : 'Please Enter valid url');
  }

export const required = value => (value ? undefined : 'Please Enter the value')
export const maxLength = max => value =>
    value && value.length > max ? `Must be ${max} characters or less` : undefined

export const minLength = min => value =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined

export const minLength2 = minLength(2)
export const minLength5 = minLength(5)
export const minLength50 = minLength(50)

export const maxLength4 = maxLength(4)
export const maxLength6 = maxLength(6)
export const maxLength15 = maxLength(15)
export const maxLength30 = maxLength(30)
export const maxLength60 = maxLength(60)
export const maxLength160 = maxLength(160)

export const number = value =>
    value && isNaN(Number(value)) ? 'Must be a number' : undefined
export const minValue = min => value =>
    value && value < min ? `Must be at least ${min}` : undefined
export const minValue18 = minValue(18)
export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Invalid email address'
        : undefined
export const tooOld = value =>
    value && value > 65 ? 'You might be too old for this' : undefined
export const aol = value =>
    value && /.+@aol\.com/.test(value)
        ? 'Really? You still use AOL for your email?'
        : undefined
export const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? 'Only alphanumeric characters'
        : undefined
export const phoneNumber = value =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value)
        ? 'Invalid phone number, must be 10 digits'
        : undefined

export const rating = value => {
    var re= /^[0-5]{1}([.][0-9]{1})?$/
    if(parseInt(value)>4) re= /^[0-5]{1}([.][0]{1})?$/
    return value && !re.test(value)
        ? 'Invalid rating number, value must be 0 to 5'
        : undefined
}

export const commission = value => {
    var re= /^[10-90]{1}([.][0-9]{1})?$/
    if(parseInt(value)>90||parseInt(value)<10) re= /^[10-90]{1}([.][0]{1})?$/
    return value && !re.test(value) && (parseInt(value)>90 || parseInt(value)<10)
        ? 'Invalid commission number, value must be 10 to 50'
        : undefined
}

export const passwordValidate = value=>
    value && !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/i.test(value)
        ? 'must lenght 7 to 15 characters which contain at least one numeric digit and a special character'
        : undefined

export const imageIsRequired = value => (!value ? "Required" : undefined);