var eventBus = new Vue();
Vue.component('product', {
	props: {
		premuim: {
			type: Boolean,
			required: false,
		},
	},
	template: `<div class="product">
        <div class="product-image">
            <img :src="image" :alt="imgAlt">
        </div>
        <div class="product-info">
            {{title}}
            <p v-if="inStock">In Stock</p>
            <p v-else>out of Stock</p>
            <p> shipping {{shipping}}</p>
            <product-details :details="details"></product-details>
            <div class="color-box" v-for="(varient , index) in varients" :key="varient.id" :style="{backgroundColor: varient.name}" @click="updateCart(index)">
            </div>
            <button @click="addToCart" :disabled="!inStock" :class="{disabledButton : !inStock}">Add to cart</button>
            <button @click="deleteItem">delete</button>
            </div>
            <product-tabs :review="review"></product-tabs>
    </div>`,
	data() {
		return {
			product: 'socks',
			brand: 'vue mastrey',
			desc: 'this socks amazing',
			selectedVarient: 0,
			imgAlt: 'socks image',
			onSale: true,
			details: ['80% cotton', 'comfortable', '20% polyster'],
			varients: [
				{
					id: 12,
					name: 'green',
					vImgSrc:
						'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
					vQouantity: 10,
				},
				{
					id: 122,
					name: 'blue',
					vImgSrc:
						'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
					vQouantity: 1,
				},
			],
			review: [],
		};
	},
	methods: {
		addToCart() {
			this.$emit('add-to-cart', this.varients[this.selectedVarient].id);
		},
		updateCart(index) {
			this.selectedVarient = index;
		},
		deleteItem() {
			this.$emit('delete-from-cart', this.varients[this.selectedVarient].id);
		},
	},
	computed: {
		title() {
			return `${this.brand} ${this.product}`;
		},
		image() {
			return this.varients[this.selectedVarient].vImgSrc;
		},
		inStock() {
			return this.varients[this.selectedVarient].vQouantity;
		},
		shipping() {
			if (this.premuim) {
				return 'free';
			}
			return 2.99;
		},
	},
	mounted() {
		eventBus.$on('review-submitted', (productReview) => {
			this.review.push(productReview);
		});
	},
});
Vue.component('product-review', {
	template: `
    <form @submit.prevent="onSubmit">
        <div class="form-group">
            <input type="text"
            class="form-control" placeholder="your name" v-model="name">
        </div>
        <div class="form-group">
            <textarea type="text"
            class="form-control" placeholder="your review" v-model="review"></textarea>
        </div>
        <div class="form-group">
        <select class="form-control" v-model.number="rating">
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
        </select>
        </div>
        <button type="submit">submit</button>
    </form>
    `,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			reviews: [],
		};
	},
	methods: {
		onSubmit() {
			if (this.name && this.review && this.rating) {
				let productReview = {
					name: this.name,
					review: this.review,
					rating: this.rating,
				};
				eventBus.$emit('review-submitted', productReview);
				this.name = null;
				this.review = null;
				this.rating = null;
			}
		},
	},
});
Vue.component('product-details', {
	props: {
		details: {
			type: Array,
			required: true,
		},
	},
	template: ` <ul>
                    <li v-for="detail in details">{{detail}}</li>
                </ul>`,
});
Vue.component('product-tabs', {
	props: {
		review: {
			type: Array,
			required: true,
		},
	},
	template: `<div>
            <span class="tab" 
            :class="{activeTab: selectedTab === tab}"
            v-for="tab in tabs" 
            @click="selectedTab = tab">{{tab}}</span>

            <div v-show="selectedTab === 'show the reviews'">
                <p v-if="!review.length">there's no review yet</p>
                <ul v-if="review.length">
                <li v-for="rev in review">
                    <p>name: {{ rev.name }}</p>
                    <p>review Message: {{ rev.review }}</p>
                    <p>product rate: {{ rev.rating }}</p>
                </li>
            </ul>
            </div>
            <div v-show="selectedTab === 'make a review'">
                <product-review></product-review>
            </div>
        </div>`,
	data() {
		return {
			tabs: ['make a review', 'show the reviews'],
			selectedTab: 'make a review',
		};
	},
});
var vm = new Vue({
	el: '#app',
	data: {
		premuim: true,
		cart: [],
	},
	methods: {
		updateCart(id) {
			this.cart.push(id);
		},
		deldeteCart(id) {
			for (var i = this.cart.length - 1; i >= 0; i--) {
				if (this.cart[i] === id) {
					this.cart.splice(i, 1);
				}
			}
		},
	},
});
