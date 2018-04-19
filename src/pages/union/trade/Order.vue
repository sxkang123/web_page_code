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
			
			// if(cpath=='/order/orderout'){
			// 	this.active='out'
			// }
			// if(cpath=='/order/orderin'){
			// 	this.active='in'
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
					this.$router.push('/order/orderin')
				}else{
					this.$router.push('/order/orderout')
				}
		  },
		},
		activated(){
			var cpath=this.$router.currentRoute.fullPath;
			console.log(cpath)
			if(cpath=='/order/orderout'){
				this.active='out'
			}
			if(cpath=='/order/orderin'){
				this.active='in'
			}
		}
	};

</script>

<style scoped>

</style>
