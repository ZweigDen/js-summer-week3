const app = {
    data() {
        return {
            url: "https://vue3-course-api.hexschool.io",
            path: "teach",
            token: "",
            expired: "",
            admin: {
                username: "",
                password: ""
            },
            products: [],
            product: {}
        }
    },
    methods: {
        login() {
            axios.post(`${this.url}/admin/signin`, this.admin)
                .then(res => {
                    this.token = res.data.token;
                    this.expired = res.data.expired;
                    document.cookie = `hexToken=${this.token}; expires=${new Date(this.expired)}; path=/`;
                    this.checkLogin();
                })
        },
        checkLogin() {
            const myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = myCookie;

            // 確認是否登入
            axios.post(`${this.url}/api/user/check`)
                .then(res => {
                    if (res.data.success) {
                        $('.adminInput').addClass('d-none');
                        $('.adminOutput').removeClass('d-none');
                    }
                })
        },
        // 修改
        editProduct(e) {
            const id = e.target.parentNode.parentNode.dataset.id;
            this.products.forEach(item => {
                if (item.id == id) {
                    this.product = JSON.parse(JSON.stringify(item));
                }
            });
        },
        // 新增或修改
        addProduct(e) {
            // 判斷如果id存在執行修改api否則執行新增api
            let id = e.target.dataset.id;
            if (id) {
                const data = { data: {} };
                data.data = this.product;
                axios.put(`${this.url}/api/${this.path}/admin/product/${id}`, data)
                    .then(res => {
                        this.getProductList();
                        this.product = {};
                    });
            } else {
                id = (new Date()).getTime();
                this.product.id = id;
                const data = {
                    "data": {
                        "title": this.product.title,
                        "category": this.product.category,
                        "origin_price": this.product.origin_price,
                        "price": this.product.price,
                        "unit": this.product.unit,
                        "description": this.product.description,
                        "content": this.product.content,
                        "is_enabled": 1,
                        "imageUrl": this.product.imageUrl,
                        "imagesUrl": [],
                        id
                    }
                }
                axios.post(`${this.url}/api/${this.path}/admin/product`, data)
                    .then(res => {
                        this.getProductList();
                        this.product = {};
                        console.log(res, this.products);
                    });
            }
        },
        // 刪除單筆
        delProduct(e) {
            const id = e.target.parentNode.parentNode.dataset.id;
            axios.delete(`${this.url}/api/${this.path}/admin/product/${id}`)
                .then(res => {
                    this.getProductList();
                });
        },
        getProductList() {
            axios.get(`${this.url}/api/${this.path}/products`)
                .then(res => {
                    this.products = res.data.products;
                });
        },
        // 登出
        logout() {
            axios.post(`${this.url}/logout`)
                .then(res => {
                    $('.adminOutput').addClass('d-none');
                    $('.adminInput').removeClass('d-none');
                })
        }
    },
    created() {
        axios.get(`${this.url}/api/${this.path}/products`)
            .then(res => {
                this.products = res.data.products;
            });
    }
}
Vue.createApp(app)
    .mount('#app');

