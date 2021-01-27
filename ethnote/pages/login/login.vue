<template>
	<view class="content">
		<view class="avatorWrapper">
			<view class="avator">
				<image class="img" src="../../static/hero.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="welcome">
			<text>欢迎来到以太坊</text>
		</view>
		<view class="form">
			<view class="inputWrapper">
				<input class="input" type="text" value="" placeholder="请输入用户名" v-model="username"/>
			</view>
			<view class="inputWrapper">
				<input class="input" type="password" value="" placeholder="请输入密码" v-model="password"/>
			</view>
			<view class="loginBtn" @click="login">
				<text class="btnValue">登录</text>
			</view>
			<view class="forgotBtn" @click="toRegister">
				<text>注册</text>
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				username: "",
				password: ""
			}
		},
		onLoad() {
			_self = this;
			var sign = uni.getStorageSync("sign");
			this.username = uni.getStorageSync("username");
			if (sign && this.username) {
				// TODO 验证匹配
				uni.redirectTo({
					"url": "../index/index"
				});
			}
		},
		methods: {
			toRegister() {
				uni.navigateTo({
					"url": "../register/register"
				});
			},
			login() {
				if(!(this.username&&this.password)) {
					uni.showToast({
						title: "请输入账号和密码",
						icon: "none"
					});
					return;
				}
				uni.setStorageSync("username", this.username);
				uni.request({
					method: "POST",
					url: _self.baseURL + "users/login",
					data: {
						username: this.username,
						password: this.password
					},
					success(res) {
						if (!(res.statusCode === 200 && res.data.code === 0)) {
						uni.showToast({
							title: "登录失败，请检查网络",
							icon: "none"
						});
						return;
						}
						var body = res.data.data;
						uni.setStorageSync("username", body.username);
						uni.setStorageSync("sign", body.login);
						uni.redirectTo({
							"url": "../index/index"
						});
					},
					fail() {
						uni.showToast({
							title: "登录失败，请检查网络",
							icon: "none"
						});
					}
				})
				// uni.navigateTo({
				// 	"url": "../index/index"
				// })
			}
		}
	}
</script>

<style>
	.content {
		background: #377EB4;
		width: 100vw;
		height: 100vh;
	}
	.avatorWrapper{
		height: 50vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.avator{
		width: 500upx;
		height: 500upx;
		overflow: hidden;
	}
	.avator .img{
		width: 100%
	}
	.welcome {
		color: #ffffff;
		width: 100%;
		margin-top: -160upx;
		margin-bottom: 160upx;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.form{
		padding: 0 100upx;
		margin-top: -50upx;
	}
	.inputWrapper{
		width: 100%;
		height: 80upx;
		background: white;
		border-radius: 20px;
		box-sizing: border-box;
		padding: 0 20px;
		margin-top: 25px;
	}
	.inputWrapper .input{
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 15px;
	}
	.loginBtn{
		width: 100%;
		height: 80upx;
		background: #77B307;
		border-radius: 50upx;
		margin-top: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loginBtn .btnValue{
		color: white;
	}
	.forgotBtn{
		width: 100%;
		height: 80upx;
		background: #77B307;
		border-radius: 50upx;
		margin-top: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
	}
</style>