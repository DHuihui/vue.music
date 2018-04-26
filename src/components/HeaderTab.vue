<template>
	<div class="head-tab">
		<h1><i class="logo"></i>网易云音乐</h1>
		<div class="nav">
			<router-link to="/index" active-class="active"><span>推荐</span></router-link>
			<router-link to="/singer" active-class="active"><span>歌手</span></router-link>
			<router-link to="/search" active-class="active"><span>搜索</span></router-link>
		</div>
	</div>
</template>
<script>
	export default{
		name:'',
		data(){
			return{

			}
		},
		methods:{

		}
	}
</script>
<style lang="scss" scoped>
	.head-tab{
		padding: 15px 0px 10px;
		text-align: center;
		h1{
			color:#fff;
			font-weight:400;
			font-size:22px;
			i{
				display:inline-block;
				width:30px;
				height:30px;
				background: url(../assets/icon/logo.png) no-repeat;
				background-size: 100% 100%;
				vertical-align: middle;
			}
		}
		.nav{
			display:flex;
			margin-top:10px;
			a{
				flex:1;
				span{
  					padding-bottom: 5px;
				}
				&.active{
					span{
						border-bottom: 2px solid #d3442c;
						color: #d3442c;
					}
				}
			}
		}
	}
</style>