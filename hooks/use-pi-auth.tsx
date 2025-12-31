"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"

// Thêm Pi vào window để TypeScript không báo lỗi
declare global {
  interface Window {
    Pi: any;
  }
}

// 1. Định nghĩa kiểu dữ liệu User (phù hợp với dữ liệu từ Pi Network)
interface User {
  username: string
  uid: string
  role?: 'admin' | 'user' // Vai trò tùy chỉnh trong ứng dụng
  accessToken?: string
}

// 2. Định nghĩa Context để chia sẻ dữ liệu và chức năng Pi
interface PiAuthContextType {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
  createPayment: (paymentData: { amount: number; memo: string; metadata?: object }) => void
}

const PiAuthContext = createContext<PiAuthContextType>({
  user: null,
  loading: true, // Bắt đầu với trạng thái loading
  login: () => {},
  logout: () => {},
  createPayment: () => {},
})

// 3. Provider: Tích hợp Pi SDK và cung cấp dữ liệu cho toàn bộ app
export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Callback xử lý các thanh toán chưa hoàn tất
  const onIncompletePaymentFound = useCallback((payment: any) => {
    console.log("Incomplete payment found:", payment);
    // Tại đây, bạn có thể điều hướng người dùng đến trang hoàn tất thanh toán
    // hoặc hiển thị một modal để xử lý.
    // Ví dụ: return createPayment({ ... });
  }, []);

  // Hàm xử lý xác thực với Pi Network
  const handleAuthentication = useCallback(async () => {
    console.log("Attempting Pi Authentication...");
    setLoading(true);
    try {
      const scopes = ['username', 'payments'];
      // Gọi hàm xác thực của Pi SDK
      const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      console.log("Pi authentication successful:", authResult);

      // Lưu thông tin người dùng từ Pi
      const piUser = authResult.user;
      const appUser: User = {
        uid: piUser.uid,
        username: piUser.username,
        accessToken: authResult.accessToken,
        // Logic tùy chỉnh: gán vai trò 'admin' cho một người dùng cụ thể
        role: piUser.username === 'PiMaster_VN' ? 'admin' : 'user',
      };
      setUser(appUser);

    } catch (err) {
      // Xử lý lỗi xác thực
      console.error("Pi authentication failed:", err);
      // Có thể hiển thị thông báo lỗi cho người dùng
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [onIncompletePaymentFound]);

  // useEffect để tải Pi SDK và chạy xác thực khi component được mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.pi-network.net/v2/pi-sdk.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Khởi tạo Pi SDK
      window.Pi.init({ version: "2.0", sandbox: true }); // Dùng sandbox cho môi trường test
      // Bắt đầu quá trình xác thực
      handleAuthentication();
    };

    script.onerror = () => {
      console.error("Failed to load the Pi Network SDK.");
      setLoading(false); // Ngừng loading nếu SDK lỗi
      alert("Không thể tải được Pi SDK. Vui lòng kiểm tra kết nối mạng và thử lại.");
    };

    // Cleanup: gỡ script khi component unmount
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [handleAuthentication]);


  // Hàm login: thực hiện lại quá trình xác thực
  const login = () => {
    handleAuthentication();
  }

  // Hàm logout: xóa trạng thái người dùng trong app
  const logout = () => { 
    // Pi SDK không có hàm "logout" trực tiếp. Việc đăng xuất khỏi tài khoản Pi
    // được thực hiện bởi người dùng trong ứng dụng Pi.
    // Đối với ứng dụng của bạn, "logout" có nghĩa là xóa trạng thái người dùng hiện tại.
    setUser(null);
    console.log("User state cleared. Refresh or call login() to authenticate again.");
  }

  // Hàm tạo một giao dịch thanh toán
  const createPayment = async (paymentData: { amount: number; memo: string; metadata?: object }) => {
    if (!user) {
      console.error("User must be logged in to make a payment.");
      alert("Bạn cần đăng nhập để thực hiện thanh toán.");
      return;
    }
    console.log("Creating payment...", paymentData);
    setLoading(true);
    try {
      await window.Pi.createPayment({
        amount: paymentData.amount,
        memo: paymentData.memo,
        metadata: paymentData.metadata || {},
      }, {
        // Các callback để xử lý luồng thanh toán
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("onReadyForServerApproval", paymentId);
          // GỌI BACKEND CỦA BẠN: Gửi paymentId lên server để xác thực giao dịch
          try {
            const response = await fetch('/api/pi/approve-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId }),
            });
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Server approval failed');
            }
            console.log('Server approval successful for paymentId:', paymentId);
          } catch (error: any) {
            console.error('Error during server approval:', error);
            setLoading(false); // Ngừng loading nếu có lỗi ở bước này
            alert(`Lỗi khi duyệt thanh toán trên server: ${error.message}`);
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("onReadyForServerCompletion", paymentId, txid);
          // Giữ trạng thái loading trong khi chờ server hoàn tất
          // GỌI BACKEND CỦA BẠN: Gửi paymentId và txid lên server để hoàn tất giao dịch
          try {
            const response = await fetch('/api/pi/complete-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid }),
            });
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Server completion failed');
            }
            console.log('Server completion successful for paymentId:', paymentId);
            alert('Thanh toán thành công!');
          } catch (error: any) {
            console.error('Error during server completion:', error);
            alert(`Lỗi khi hoàn tất thanh toán trên server: ${error.message}`);
          } finally {
            setLoading(false); // Kết thúc loading sau khi hoàn tất hoặc lỗi
          }
        },
        onCancel: (paymentId: string) => {
          console.log("onCancel", paymentId);
          alert("Thanh toán đã bị hủy.");
          setLoading(false); // Kết thúc loading khi người dùng hủy
        },
        onError: (error: Error, payment: any) => {
          console.error("onError", error, payment);
          alert(`Đã xảy ra lỗi trong quá trình thanh toán: ${error.message}`);
          setLoading(false); // Kết thúc loading khi có lỗi từ Pi
        },
      });
    } catch (err: any) {
      console.error("createPayment error:", err);
      alert(`Lỗi khi tạo thanh toán: ${err.message}`);
      // Nếu hàm createPayment thất bại ngay từ đầu, cũng cần dừng loading
      setLoading(false);
    }
  };

  return (
    <PiAuthContext.Provider value={{ user, loading, login, logout, createPayment }}>
      {children}
    </PiAuthContext.Provider>
  )
}

// 4. Hook để lấy user ở các trang khác
export const usePiAuth = () => useContext(PiAuthContext)