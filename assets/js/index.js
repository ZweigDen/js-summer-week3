const app = {
    data() {
        return {
            url: "https://vue3-course-api.hexschool.io",
            path: "teach",
            products: [],
            product: {
            },
        }
    },
    mounted() {
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (token === '') {
            alert('您尚未登入請重新登入。');
            window.location = 'login.html';
        }
        axios.defaults.headers.common.Authorization = token;

        this.getData();
    },
    methods: {
        getData() {
            const api = `${this.url}/api/${this.path}/admin/products`
            axios.get(api)
                .then((response) => {
                    if (response.data.success) {
                        this.products = response.data.products;
                    } else {
                        alert(response.data.message);
                    }
                }).catch((error) => {
                    console.log(error)
                });
        },
        // 修改商品 將修改的商品寫入product
        editProduct(e) {
            const id = e.target.parentNode.parentNode.dataset.id;
            this.products.forEach(item => {
                if (item.id == id) {
                    this.product = { ...item };
                }
            });
        },
        // 新增新商品 清除product
        addProduct() {
            this.product = {};
        },
        newProduct(e) {
            // 判斷如果id存在執行修改api否則執行新增api
            let id = e.target.dataset.id;
            if (id) {
                let api = `${this.url}/api/${this.path}/admin/product/${id}`
                axios.put(api, { data: this.product })
                    .then(res => {
                        this.getData();
                        this.product = {};
                    }).catch(err => {
                        console.log(err);
                    });
            } else {
                let api = `${this.url}/api/${this.path}/admin/product`;
                axios.post(api, { data: this.product })
                    .then(res => {
                        if (res.data.success) {
                            this.getData();
                            this.product = {};
                        } else{
                            alert(res.data.message);
                        }
                    }).catch(err => {
                        console.log("err:",err);
                    })
            }
        },
        checkDel(e) {
            const id = e.target.parentNode.parentNode.dataset.id;
            this.products.forEach(item => {
                if (item.id == id) {
                    this.product = item;
                }
            });
        },
        delProduct() {
            const id = this.product.id;
            const api = `${this.url}/api/${this.path}/admin/product/${id}`;
            axios.delete(api)
                .then(response => {
                    if (response.data.success) {
                        this.getData();
                    } else {
                        console.log(response)
                    }
                }).catch(error => {
                    console.log(error);
                });
        },
        logOut() {
            const api = `${this.url}/logout`;
            axios.post(api)
                .then(res => {
                    if (res.data.success) {
                        // 還不知道怎麼清除
                        document.cookie = "123";
                        window.location = 'login.html';
                    } else {
                        console.log(res);
                    }
                }).catch(err => {
                    console.log("err:", err);
                });
        }
    }
}

Vue.createApp(app)
    .mount('#app');