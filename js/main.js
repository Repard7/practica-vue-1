Vue.component('product', {
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
                <p>Shipping: {{ shipping }}</p>
                <a :href="link">More products like this</a>

                <product-details :details="details"></product-details>

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
        }
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

