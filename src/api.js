import axios from 'axios';

// API 인스턴스 생성
const apiClient = axios.create({
    baseURL: 'http://localhost:3000', // 기본 URL
    withCredentials: true, // 요청에 쿠키 포함
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
    config => {
        // 요청이 서버로 보내지기 전에 실행됨
        const token = getCookie('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await apiClient.post('/refresh-token');
                if (response.status === 200) {
                    console.log('New AccessToken:', response.data.accessToken); // 토큰 로그로 확인
                    document.cookie = `token=${response.data.accessToken}; path=/; secure=${process.env.NODE_ENV === 'production'}`;
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (err) {
                console.error('Token refresh failed:', err);
            }
        }
        return Promise.reject(error);
    }
);

// 쿠키에서 특정 쿠키 값을 가져오는 함수
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export default apiClient;
