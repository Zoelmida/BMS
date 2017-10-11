const crypto = require('crypto')

const salt = 'BasicManagementSystem' 

const hexDigits=['A','B','C','D','E','F','G','X','Y','Z','0','1','2','3','4','5']

module.exports.encrypt = function(text){
	var md5 = crypto.createHash('md5')

	text = text + salt
      
	md5.update(text)
    
	var out = md5.digest()
     
	var j = out.length
    
	var str = new Array(j*2)
    
	var k = 0
    
	for (var i = 0; i < j; i++) {
		var byte0 = out[i]
		str[k++] = hexDigits[byte0 >>> 4 & 0xf]//取高四位
		str[k++] = hexDigits[byte0 & 0xf]//取低四位
	}
	return str.join('')
}