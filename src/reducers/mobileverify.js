import { MOBILE_OTP_VERIFY, MOBILE_OTP_SEND,MOBILE_OTP_CLEAR} from '../constants/actionTypes';

export default (state = {Otp_id:0,otp_status:false,otp_send_status:true}, action) => {
  switch (action.type) {
    case MOBILE_OTP_VERIFY:
      return {
        ...state,
        otp_status:action.payload.status,
      };
      case MOBILE_OTP_SEND:
      return{
        ...state,
        otp_send_status:action.payload.status,
        Otp_id:action.payload.oid,
      }
      case MOBILE_OTP_CLEAR:
        return{
          ...state,
          otp_status:false,
          Otp_id:0,
          otp_send_status:true,
        }
    default:
      return state;
  }
};
