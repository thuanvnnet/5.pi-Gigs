"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// 1. Định nghĩa kiểu dữ liệu User
interface User {
  username: string
  uid: string
  role?: 'admin' | 'user' // Thêm vai trò cho người dùng
  accessToken?: string
}

// 2. Định nghĩa Context để chia sẻ dữ liệu toàn app
interface PiAuthContextType {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
}

const PiAuthContext = createContext<PiAuthContextType>({
  user: null,
  loading: false,
  login: () => {},
  logout: () => {},
})

// 3. Provider: Cung cấp user giả lập cho toàn bộ app
export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // --- MOCK LOGIN (GIẢ LẬP VỚI LOCALSTORAGE) ---
    // Thử lấy user từ localStorage để giữ trạng thái đăng nhập khi refresh
    try {
      const storedUser = localStorage.getItem("pi-user");
      if (storedUser) {
        const userObject = JSON.parse(storedUser);
        // Để giải quyết tình trạng "kẹt" đăng nhập với user không phải admin,
        // chúng ta sẽ kiểm tra. Nếu user trong localStorage không phải là admin,
        // chúng ta sẽ tự động đăng xuất họ và đăng nhập lại với vai trò admin.
        if (userObject.username !== 'PiMaster_VN') {
          localStorage.removeItem("pi-user");
          // Chạy lại logic ở nhánh else
          const mockAdminUser = { username: "PiMaster_VN", uid: "PiMaster_VN", role: 'admin', accessToken: "mock_token" };
          setUser(mockAdminUser);
          localStorage.setItem("pi-user", JSON.stringify(mockAdminUser));
        } else {
          // Nếu đúng là admin, đảm bảo họ có đúng vai trò
          if (userObject.role !== 'admin') {
              userObject.role = 'admin';
              localStorage.setItem("pi-user", JSON.stringify(userObject));
          }
          setUser(userObject);
        }
      } else {
        // Nếu không có, tự động đăng nhập và lưu vào localStorage
        const mockUser = {
          username: "PiMaster_VN",
          uid: "PiMaster_VN",
          role: 'admin', // Gán quyền admin cho người dùng này
          accessToken: "mock_token"
        };
        setUser(mockUser);
        localStorage.setItem("pi-user", JSON.stringify(mockUser));
      }
    } catch (error) {
      // Nếu có lỗi (ví dụ: môi trường server-side), không làm gì cả
      console.error("Failed to access localStorage for auth mock:", error);
    } finally {
      setLoading(false);
    }
  }, [])

  const login = () => {
    // Trong ứng dụng thực tế, đây sẽ là nơi gọi API login
    // Với mock, chúng ta tạo user và lưu vào state/localStorage
    const mockUser = {
        username: "PiMaster_VN", // Tên người mua (Khác với người bán PiMaster_VN PiBuyer_Test)
        uid: "PiMaster_VN",
        role: 'admin',
        accessToken: "mock_token"
    };
    setUser(mockUser);
    localStorage.setItem("pi-user", JSON.stringify(mockUser));
    console.log("Mock login successful.");
  }
  const logout = () => { 
    // Trong môi trường giả lập này, "logout" sẽ reset lại session về trạng thái admin mặc định
    // bằng cách xóa localStorage và tải lại trang.
    // useEffect sau đó sẽ tự động tạo lại người dùng admin.
    localStorage.removeItem("pi-user");
    window.location.reload();
  }

  return (
    <PiAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </PiAuthContext.Provider>
  )
}

// 4. Hook để lấy user ở các trang khác
export const usePiAuth = () => useContext(PiAuthContext)