var md5 = require('./md5.js');
module.exports = {
	sign(apiServer){
		if(!uni) {
			return '...';
		}
		uni.request({
			url:apiServer + 'getAccessToken',
			method:'GET',
			success(res) {
				if(res.data.status != 'ok') {
					return;
				}
				var data = res.data.data;
				var accessToken = md5.hex_md5(data.token + data.time);
				var sign = accessToken + '-' + data.token;
				uni.setStorage({
					key:'sign',
					data:sign
				});
			},
			fail(e) {
				console.log(JSON.stringify(e));
			}
		})
	}
}