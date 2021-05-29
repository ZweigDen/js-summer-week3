const loginApp = {
    data() {
        return {
            url: "https://vue3-course-api.hexschool.io",
            path: "teach",
            admin: {
                "username": "",
                "password": ""
            }
        }
    },
    methods: {
        login() {
            const api = `${this.url}/admin/signin`;
            axios.post(api, this.admin)
                .then((response) => {
                    if (response.data.success) {
                        const { token, expired } = response.data;
                        // 寫入 cookie token
                        // expires 設置有效時間
                        document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
                        window.location = "index.html";
                    } else{
                        alert(response.data.message);
                    }
                }).catch((response)=>{
                    console.log(response);
                });
        }
    }
}

Vue.createApp(loginApp)
    .mount('#loginApp');