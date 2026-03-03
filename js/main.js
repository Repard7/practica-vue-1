let eventBus = new Vue()

Vue.component('product', {
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">

            <div class="product-image">
                <img :src="image" :alt="altText">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{ description }}</p>
                <a :href="link">More products like this</a>

                <p v-if="inStock">In stock</p>
                <p v-else style="text-decoration: line-through;">Out of Stock</p>

                <span v-show="onSale">On Sale</span>
                <p>{{sale}}</p>
                <div
                    class="color-box" 
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)"
                    >
                </div>
                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>
                <button
                    @click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
                >
                    Add to cart
                </button>
                <button
                    @click="deleteFromCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
                >
                    Delete from cart
                </button>
                <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>
                
            </div>
        </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            selectedVariant: 0,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 3
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },


        deleteFromCart() {
            this.$emit('delete-from-cart', this.variants[this.selectedVariant].variantId);
        },

        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },

    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },

        image() {
            return this.variants[this.selectedVariant].variantImage;
        },

        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },

        sale() {
            if (this.onSale) {
                return "The sale of " + this.brand + this.product + "is active";
            }
            else {
                return "The sale of " + this.brand + this.product + "is not active";
            }
        },

        shipping() {
            if (this.premium) {
                return "Free";
            }
            else {
                return 2.99
            }
        }

    }

})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>

    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
    </p>

    <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
    </p>

    <p>
        Would you recommend this product?
        <div>
            <label for="option1">yes</label> 
            <input id="option1" type="radio" value="yes" v-model="recommendation">
        </div>
        <div>
            <label for="option2">no</label> 
            <input id="option2" type="radio" value="no" v-model="recommendation">
        </div>
    </p>

    <p>
        <input type="submit" value="Submit"> 
    </p>

    </form>

    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if (this.name && this.review && this.rating && this.recommendation) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommendation = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.recommendation) this.errors.push("Recommendation required.")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: [String, Number],
            required: false
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>   
            <ul>
                <span class="tab"
                    v-for="(tab, index) in tabs"
                    @click="selectedTab = tab"
                    :class="{ activeTab: selectedTab === tab }"
                >{{ tab }}</span>
            </ul>
            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        <p>Recomended? {{ review.recommendation }}</p>
                    </li>
                </ul>
            </div>
            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>
            <div v-show="selectedTab === 'Shipping'">
                <p>Shipping: {{ shipping }}</p>
            </div>
            <div v-show="selectedTab === 'Details'">
                <product-details :details="details"></product-details>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteFromCart(id) {
            if (this.cart.length != 0 && this.cart.includes(id)) {
                this.cart.splice(this.cart.indexOf(id), 1);
            }
        },
    }
})

