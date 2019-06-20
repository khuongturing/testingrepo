import networkRequest from 'src/services/networkRequest';
import httpException from 'src/http/httpException';
import {
  ERROR_CODES
} from 'src/config/constants';

export default {
  async login(accessToken) {
    try {
      const response = await networkRequest.get(
        `https://graph.facebook.com/me?fields=email,name,id&access_token=${accessToken}`
      );
      return response.data;
    } catch (error) {
      throw httpException.handle(ERROR_CODES.AUT_02);
    }
  }
};
