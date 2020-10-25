const axios = require('axios')
const fs = require('fs')
const ParserConfig = require('../config/parser')


module.exports = new class {
  async performUploadFileRequest(packet) {
      var url = ParserConfig.host + packet.path;
      var headers = {
        ...packet.data.getHeaders()
      };

      const response = await axios({method: packet.method,
                                    headers: headers,
                                    url:url,
                                    data:packet.data
                                    });
                                    console.log("response is",packet.data)
      try {
          await fs.unlinkSync(packet.file_path);
      }
      catch(err) {
        console.log(err);
      }
      var responseJSON = JSON.parse(JSON.stringify(response.data));
      return responseJSON;
  }

}
