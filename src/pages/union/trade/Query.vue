<template>
	<section>
		<el-tabs v-model="active" type="card" style="height:50px" @tab-click="handleClick">
			<el-tab-pane label="收入" name="in"></el-tab-pane>
			<el-tab-pane label="支出" name="out" v-if="showOut"></el-tab-pane>
		</el-tabs>
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
	</section>
</template>
<script>
	export default {
		data() {
			return {
				showOut:true,
				active:'',
				filters: {
					name: ''
				},
				loading: false,
				users: [
				]
			}
		},
		created(){

		},
		mounted(){
			// var cpath=this.$router.currentRoute.fullPath;
			// console.log(cpath)
			// if(cpath=='/query/queryout'){
			// 	this.active='2'
			// }
			// if(cpath=='/query/queryin'){
			// 	this.active='1'
			// }
			var user = sessionStorage.getItem('user');
			user = JSON.parse(user);
			if(user.roleid==3){
				this.showOut=false
			}
		},
		methods: {
			handleClick(ret) {
				if(ret.name=='in'){
					this.$router.push('/query/queryin')
				}else{
					this.$router.push('/query/queryout')
				}
		  	},

		},
		activated(){
			var cpath=this.$router.currentRoute.fullPath;
			console.log('qactive')
			console.log(cpath)
			if(cpath=='/query/queryout'){
				this.active='out'
			}
			if(cpath=='/query/queryin'){
				this.active="in"
			}
		},
		deactivated(){
		}
	};

</script>

<style scoped>

</style>
