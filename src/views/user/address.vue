<template>
	<div id="address">
		<div id="delivery-address">
			<el-card class="box-card address-card" :body-style="{ padding: '0px' }">
				<div slot="header" class="address-card-head">
					<span>收货地址</span>
				</div>
				<delivery-address :canDelete="true"></delivery-address>
			</el-card>
		</div>
	</div>
</template>

<script>
	import DeliveryAddress from "../../components/DeliveryAddress"

	export default {
		components: { DeliveryAddress },
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	#address {
		width: 61em;
		margin-left: 14em;
		.address-card {
			border-radius: 10px;
		}
		.address-card-head {
			font-size: 1.125em;
		}
	}
</style>
