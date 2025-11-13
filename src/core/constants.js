// 应用常量定义模块 - 包含API默认配置和正则表达式

// API默认配置常量
export const API_DEFAULTS = {
  baseUrl: 'https://cors.sh/http://183.131.51.178:7878',  // 后端API基础URL（使用CORS代理）
  port: undefined,                                         // 默认端口（未设置）
  apiKey: 'temp_c92b19faf3cd3d6da1a958e1603d1ab0',       // API访问密钥
  tokenStorageKey: 'userToken',                          // 本地存储中token的键名
};

// 邮箱格式验证正则表达式
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 密码强度验证正则表达式
// 要求：至少8位，包含字母和数字，可包含特殊字符
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

// 验证码格式验证正则表达式（纯数字）
export const CODE_REGEX = /^\d+$/;