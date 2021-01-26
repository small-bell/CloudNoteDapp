<template>
	<view class="content">
		<view class="inputWrapper">
			<input class="input" type="text" value="" placeholder="请输入标题" @blur="queryNote" auto-blur v-model="title" @input="check"/>
		</view>
		<view class="textareaWrapper">
			<textarea class="textarea" placeholder="请先输入标题,输入完毕会进行查询笔记" maxlength=342 auto-height v-model="content" :disabled="disabled" @input="input"></textarea>
		</view>
		<view class="submitWrapper">
			<button class="btnSubmit" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	var _self ;
	export default {
		data() {
			return {
				title: "",
				content: "",
				disabled: true
			}
		},
		onLoad() {
			_self = this;
		},
		methods: {
			check() {
				if(this.title == "") {
					this.disabled = true;
					return;
				}
				this.disabled = false;
			},
			queryNote() {
				console.log(uni.getStorageSync("username"))
				var _that = this;
				uni.request({
					method:"GET",
					url: _self.baseURL + "query?title=" + this.title,
					header:{
						username: uni.getStorageSync("username"),
						sign: uni.getStorageSync("sign")
					},
					success(res) {
						if (!(res.statusCode === 200 && res.data.code === 0)) {
							uni.showToast({
								title: "查询失败，请检查网络",
								icon: "none"
							});
						}
						console.log(res.data.msg);
						_that.content = res.data.msg.toString();
					}
				})
				console.log(this.title);
			},
			input() {
				// console.log(this.content);
			},
			submit() {
				uni.request({
					method: "POST",
					url: _self.baseURL + "note",
					data:{
						title: this.title,
						content: this.content
					},
					header:{
						username: uni.getStorageSync("username"),
						sign: uni.getStorageSync("sign")
					},
					success(res) {
						console.log(res);
						if (!(res.statusCode === 200 && res.data.code === 0)) {
							uni.showToast({
								title: "发布失败，请检查网络",
								icon: "none"
							});
						}
						uni.showToast({
							title: "发布成功，等待接入以太网",
						});
					},
					fail() {
						uni.showToast({
							title: "发布失败，请检查网络",
							icon: "none"
						});
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.inputWrapper {
		width: 80%;
		height: 15vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.input {
		width: 100%;
		height: 8vh;
		border-radius: 10vh;
		text-align: center;
		background-color: #007AFF;
	}
	
	.textareaWrapper {
		height: 70vh;
		background-color: #007AFF;
	}
	
	.textarea {
		height: 10%;
		background-color: #007AFF;
	}
	
	.submitWrapper {
		width: 80%;
		height: 15vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.btnSubmit{
		text-align: center;
		display: inline-block;
		vertical-align: middle;
		background-color: #F0AD4E;
		width: 100%;
		height: 50%;
		border-radius: 30vh;
	}
</style>
